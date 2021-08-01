---
title: 'Building an ETL Workflow from scratch'
excerpt: "Use scrapy, AWS S3, AWS SQS, and plain python to build a complete ETL workflow."
date: '2021-07-31'
coverImage: '/posts/building-an-etl-workflow/banner.png'
author:
  name: Dimitris Kapanidis
  picture: '/images/dkapanidis.jpg'
ogImage:
  url: '/posts/building-an-etl-workflow/banner.png'
topic: 'python'
---

I've been working lately with ETL workflows, so I'd like to take some time to explain how to build a simple one from scratch. Note that you will need an AWS account for this tutorial.

## What is an ETL

ETL is acronym for Extract, Tranform, Load and it is used as a procedure to copy data from a source to a destination with potentially different data structure, often used if data warehousing.

There are a lot of different use cases for ETL:
* You might have data in a database and want to do a migration to a differnt one, for example because an adquisition was made by a bigger company and the data needs to be transformed to a new format.
* You might have historical data that you want to do BI queries on them, so a data warehouse is the best storage format.

## Architecture

> `Quotes Website` -> **Quotes Scrapy** -> `S3` -> `SQS` -> **Quotes ETL** -> `S3`

**Quotes Scrapy**: For our quick ETL example we need some sort of data flowing our way. We'll be doing some scrapping of https://quotes.toscrape.com/ and retrieving some quotes in JSON format and store them in an S3 bucket `quotes-scrapy`.

**SQS**: In order to be able to trigger actions when a file is uploaded to the S3 bucket, we'll create an Amazon SQS (Simple Queue Service) and configure the S3 bucket to send a notification to the queue whenever a new file is stored.

**Quotes ETL**: Now that we have the files in the bucket and the messages in the queue, we'll create an ETL using Python that reads the messages from the SQS and for each message it reads the input file, transforms it and writes the output to a separate S3 bucket `quotes-scrapy-warehouse`.

## Step 1: Quotes Scrapy

For the first step we'll use [scrapy](https://scrapy.org/) which is a framework for extracting data from websites.

We'll be using the same example they are documenting in their [Scrapy Tutorial](https://docs.scrapy.org/en/latest/intro/tutorial.html) with simple adjustment so that we get JSON files written directly to our S3 bucket on each execution.

Create project

```sh
scrapy startproject quotes_scrapy
```

create a spider `quotes_scrapy/quotes_scrapy/spiders/quotes_spider.py`:

```python
import scrapy


class QuotesSpider(scrapy.Spider):
    name = "quotes"
    start_urls = [
        'http://quotes.toscrape.com/page/1/',
    ]

    def parse(self, response):
        for quote in response.css('div.quote'):
            yield {
                'text': quote.css('span.text::text').get(),
                'author': quote.css('span small::text').get(),
                'tags': quote.css('div.tags a.tag::text').getall(),
            }

        next_page = response.css('li.next a::attr(href)').get()
        if next_page is not None:
            yield response.follow(next_page, callback=self.parse)
```

Run our spider:

```sh
scrapy crawl quotes
```

Configure output in `tutorial/settings.py`:

```python
# append at the end of file

FEEDS={
    'items.json': {
        'format': 'json',
        'encoding': 'utf8',
        'store_empty': False,
        'fields': None,
        'indent': 4,
        'item_export_kwargs': {
           'export_empty_fields': True,
        },
    },
    's3://quotes-scrapy/items-%(time)s.json': {
        'format': 'json',
        'encoding': 'utf8',
        'store_empty': False,
        'fields': None,
        'indent': 4,
        'item_export_kwargs': {
           'export_empty_fields': True,
        },
    },
}
```

Now run the crawl again and it will generate an `items.json` locally and a file with timestamp as suffix on the S3 bucket. This way for each execution we'll get a different JSON file written to the S3 bucket.

Here is an example of the JSON entries so far:

```json
{
    "text": "“The world as we have created it is a process of our thinking. It cannot be changed without changing our thinking.”",
    "author": "Albert Einstein",
    "tags": [
        "change",
        "deep-thoughts",
        "thinking",
        "world"
    ]
},
```

And the S3 bucket should look like that after a few executions:

```sh
$ aws s3 ls quotes-scrapy
2021-07-31 10:03:33      24402 items-2021-07-31T07-03-23.json
2021-07-31 10:05:04      24402 items-2021-07-31T07-04-57.json
2021-07-31 11:04:27      24402 items-2021-07-31T08-04-18.json
2021-07-31 11:05:37      24402 items-2021-07-31T08-05-13.json
2021-07-31 12:07:22      24402 items-2021-07-31T09-07-12.json
```

Next step, let's create a message queue to get notified when new files are stored in the bucket.

## Step 2. Quotes SQS

Go to Amazon SQS [Create Queue](https://us-west-2.console.aws.amazon.com/sqs/v2/home#/create-queue). You can leave everything on default option. An important detail is the type of queue we want to create. Standard queue means that the message ordering is not guarranteed and the messages may be delivered more than once. Both are fine for our case, so we'll use standard type.

For Access Policy we need to specifically grant the S3 bucket access to write messages to the SQS so use the advanced tab and configure it with (as documented [here](https://docs.aws.amazon.com/AmazonS3/latest/userguide/ways-to-add-notification-config-to-bucket.html#notification-walkthrough-summary):

```json
{
 "Version": "2012-10-17",
 "Id": "example-ID",
 "Statement": [
  {
   "Sid": "example-statement-ID",
   "Effect": "Allow",
   "Principal": {
    "Service": "s3.amazonaws.com"  
   },
   "Action": [
    "SQS:SendMessage"
   ],
   "Resource": "SQS-queue-ARN",
   "Condition": {
      "ArnLike": { "aws:SourceArn": "arn:aws:s3:*:*:awsexamplebucket1" },
      "StringEquals": { "aws:SourceAccount": "bucket-owner-account-id" }
   }
  }
 ]
}
```

and replace `SQS-queue-ARN`, `awsexamplebucket1` and `bucket-owner-account-id` with the actual values.

Once finished, go to the S3 bucket > Properties and Create an event notification with destination the freshly created SQS.

Now run the crawl again and the new uploaded file should create a message on our SQS.

## Step 3. Quotes ETL

Now for the last part we'll need to create a python app that reads each SQS message, downloads the related S3 bucket file, transforms it and uploads it to a separate output bucket.

The good part now is that since the messages are in the queue we can run this process whenever we want, e.g. once every day and consume thoses messages. Once the message is processed ok it is deleted.

Here is the ETL process:

```python
import json
import logging
from s3_client import s3_write
from transform_etl import transform_etl
from s3_client import s3_read
import pandas as pd

from sqs_client import sqs_delete_message, sqs_receive_message

logger = logging.getLogger(__name__)
QUEUE_URL = '***'
DESTINATION_BUCKET = "***"

def run():
    while True:
        parse_message()

def parse_message():
    # get next message from SQS
    logger.info("receiving next message")
    msgs = sqs_receive_message(QUEUE_URL)

    # exit if there are no more messages
    if (len(msgs)==0):
        logger.info("no messages found")
        exit(0)

    for msg in msgs:
        # parse msg body to read filename and bucket
        msg_body = json.loads(msg["Body"])
        for record in msg_body["Records"]:
            bucket = record["s3"]["bucket"]["name"]
            filename = record["s3"]["object"]["key"]

            # read file from origin S3
            logger.info("downloading file s3://%s/%s", bucket, filename)
            file_body = json.loads(s3_read(bucket, filename))

            # do some file transformation using
            transformed_body = transform_etl(file_body)

            # write file to destination S3
            logger.info("uploading file s3://%s/%s", DESTINATION_BUCKET, filename)
            s3_write(DESTINATION_BUCKET, filename, transformed_body)

        # remove message from queue
        sqs_delete_message(QUEUE_URL, msg['ReceiptHandle'])
        logger.info("message deleted")

def transform_etl(data: any) -> any:
    df = pd.DataFrame(data)
   
    # rename "text" column to "message"
    df.rename(columns = {"text": "message"}, inplace = True)
    # drop "author" column
    df.drop(columns =["author"], inplace = True)

    return df.to_json(orient='records')
```

For more details you can check the full source code [here](https://github.com/dkapanidis/etl-tutorial).

Now running the ETL I get the following whenever a new file is uploaded in the S3 bucket:

```sh
❯ python quotes_etl/
2021-08-01 13:46:46,447 - quotes_etl - INFO - receiving next message
2021-08-01 13:46:46,873 - quotes_etl - INFO - downloading file s3://quotes-scrapy/items-2021-08-01T10-46-36.json
2021-08-01 13:46:47,376 - quotes_etl - INFO - uploading file s3://quotes-scrapy-output/items-2021-08-01T10-46-36.json
2021-08-01 13:46:48,233 - quotes_etl - INFO - message deleted
2021-08-01 13:46:48,233 - quotes_etl - INFO - receiving next message
2021-08-01 13:46:48,438 - quotes_etl - INFO - no messages found
```

and let's check the output of the 2nd S3 bucket:

```sh
$ aws s3 ls quotes-scrapy-output
2021-07-31 20:40:02      18222 items-2021-07-31T17-39-49.json
2021-08-01 13:23:00      18222 items-2021-08-01T10-07-29.json
2021-08-01 13:37:09      18222 items-2021-08-01T10-36-19.json
2021-08-01 13:46:48      18222 items-2021-08-01T10-46-36.json
```

The entries on these files are shown below. Note that the `text` field is renamed to `message` and that the `author` is dropped in comparison with the original entry shown above:

```json
{
  "message": "“The world as we have created it is a process of our thinking. It cannot be changed without changing our thinking.”",
  "tags": [
    "change",
    "deep-thoughts",
    "thinking",
    "world"
  ]
},
```

## Summary

This was a simple ETL process, where we took some JSON entries, transformed them and stored them in a separate bucket. By using SQS message queue we decouple the upload of the original files with the transformation process and keep tabs of the pending files using the SQS queue.

In next posts I'll take it a step further using [Redshift](https://aws.amazon.com/redshift/) to store the data after the transformation instead of simple JSON files.
