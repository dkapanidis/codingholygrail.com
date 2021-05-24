import mailchimp from '@mailchimp/mailchimp_marketing';
import axios from 'axios';

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_API_SERVER // e.g. us1
});

export default async (req, res) => {
  // const { email } = req.body;
  // console.log(req.body)
  // if (!email) {
  //   return res.status(400).json({ error: 'Email is required' });
  // }

  const resp = await axios.post("https://us1.api.mailchimp.com/3.0/lists/174b0c4c1f/members", {
    "email_address": "gaface7752@sc2hub.com",
    "status": "subscribed"
  }, {
    auth: {
      username: "anything",
      password: "a106aec6bd86b6db2b7500655631d9ae-us1"
    }
  })
  console.log('status: ', resp.status)
  // try {
  //   await mailchimp.lists.addListMember(process.env.MAILCHIMP_AUDIENCE_ID, {
  //     email_address: email,
  //     status: 'subscribed'
  //   });

  //   return res.status(201).json({ error: '' });
  // } catch (error) {
  //   return res.status(500).json({ error: error.message || error.toString() });
  // }
};
