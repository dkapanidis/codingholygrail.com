// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
const mailchimp = require('@mailchimp/mailchimp_marketing');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

// Mailchimp config.
const AUDIENCE_ID = functions.config().mailchimp.audience
mailchimp.setConfig({
  apiKey: functions.config().mailchimp.key,
  server: functions.config().mailchimp.server
});

exports.updateStats = functions.firestore.document('{collection}/{id}').onWrite((snap, context) => {
  const collection = context.params.collection;

  // ref to the parent document
  const statsRef = admin.firestore().collection(collection).doc("--stats--")
  
  // get all comments and aggregate
  return admin.firestore().collection(collection).get().then(querySnapshot => {
    // get the total comment count (all minus stats document)
    const count = querySnapshot.size-1

    // data to update on the document
    const data = { count }

    // run update
    return statsRef.update(data)
  })
  .catch(err => console.log(err) )
});

exports.addSubscriber = functions.firestore.document('/subs/{id}').onCreate((snap, context) => {
  let data = snap.data();
  console.log('subscribing email to mailchimp: ', data.email)

  return mailchimp.lists.addListMember(AUDIENCE_ID, {
    email_address: data.email,
    status: 'subscribed'
  }).then(function (results) {
    console.log('Successfully added new subscription', data.email, 'to Mailchimp list');
    data.status = "subscribed"
    return snap.ref.update(data)
  }).catch(function (err) {
    console.log('Mailchimp: Error while attempting to add registered subscriber —', err);
    data.error = err.message
    return snap.ref.update(data)
  })
})