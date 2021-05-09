const mailchimp = require("@mailchimp/mailchimp_marketing");
const querystring = require("querystring");

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_API_SERVER // e.g. us1
});

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // When the method is POST, the name will no longer be in the event’s
  // queryStringParameters – it’ll be in the event body encoded as a query string
  const params = querystring.parse(event.body);
  const email = params.email

  if (!email) {
    return {
      statusCode: 200,
      body: JSON.stringify({ error: 'Email is required' }),
    };
  }

  try {
    await mailchimp.lists.addListMember(process.env.MAILCHIMP_AUDIENCE_ID, {
      email_address: email,
      status: 'subscribed'
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ error: '' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || error.toString() }),
    };
  }
};
