import Post from "./posts/Post";

const Feed = require('feed').Feed;
  const markdown = require('markdown').markdown;
const fs = require('fs');

async function generateRssFeed(posts: Post[]) {
  if (process.env.NODE_ENV === 'development') {
    return;
  }

  const baseUrl = process.env.BASE_URL;
  const date = new Date();
  const author = {
    name: 'Dimitris Kapanidis',
    link: 'https://twitter.com/dkapanidis'
  };

  const feed = new Feed({
    title: `Coding Holy Grail`,
    description: 'Content about containers, cloud native, CI/CD, devops and microservices',
    id: baseUrl,
    link: baseUrl,
    language: 'en',
    image: `${baseUrl}/images/grail.png`,
    favicon: `${baseUrl}/favicon.ico`,
    copyright: `All rights reserved ${date.getFullYear()}, Dimitris Kapanidis`,
    updated: date,
    generator: 'Next.js using Feed for Node.js',
    feedLinks: {
      rss2: `${baseUrl}/rss/feed.xml`,
      json: `${baseUrl}/rss/feed.json`,
      atom: `${baseUrl}/rss/atom.xml`
    },
    author
  });

  posts.forEach((post:Post) => {
    const url = `${baseUrl}/${post.link}`;
    feed.addItem({
      title: post.meta.title,
      id: url,
      link: url,
      // description: post.meta.description,
      // content: markdown.toHTML(post.content),
      author: [author],
      contributor: [author],
      date: new Date(post.meta.date)
    });
  });

  fs.mkdirSync('./public/rss', { recursive: true });
  fs.writeFileSync('./public/rss/feed.xml', feed.rss2());
  fs.writeFileSync('./public/rss/atom.xml', feed.atom1());
  fs.writeFileSync('./public/rss/feed.json', feed.json1());
}

export default generateRssFeed;
