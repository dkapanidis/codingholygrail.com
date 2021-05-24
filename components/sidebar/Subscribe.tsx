import db from "lib/firebase";
import React, { useRef, useState } from "react";
import { BiMailSend } from "react-icons/bi";
import firebase from "firebase";

function Subscribe() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function subscribe(event: any) {
    event?.preventDefault();
    try {
      db.collection("subs").add({
        email,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      // clear the input value and show a success message
      // we don't await for confirmation, this message is shown optimistically.
      setEmail("");
      setMessage("Success! 🎉 You are now subscribed to the newsletter.");
    } catch (error) {
      // if there was an error, update the message in state.
      setMessage(error);
    }
  }

  return (
    <div className="flex sticky top-10">
      <form
        className="flex bg-white relative flex-col border-blue-500 border-3 rounded-md text-center p-4 py-8 space-y-4"
        onSubmit={subscribe}
      >
        <BiMailSend className="text-blue-500 text-5xl absolute left-1/2 top-0 bg-white px-1 border-white transform -translate-x-1/2 -translate-y-1/2 " />
        <h1 className="font-semibold text-lg">Subscribe to the Newsletter!</h1>
        <div className="text-sm font-light">
          {message ? (
            message
          ) : (
            <span>
              You will receive high-quality articles about cloud native and all
              things I'm working on. <b>No spam 🙅‍♂️ ! </b>
            </span>
          )}
        </div>
        <input
          className="outline-none focus:ring-4 focus:border-blue-500 ring-blue-200 rounded-md text-sm border w-full px-2 p-1"
          id="email-input"
          name="email"
          placeholder="you@awesome.com"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          required
          type="email"
        />
        <button
          className={`bg-blue-500 rounded p-1 text-white hover:bg-blue-600 outline-none focus:ring-4 focus:border-blue-500 ring-blue-200`}
          type="submit"
        >
          {"✨ Sign me up! ✨"}
        </button>
      </form>
    </div>
  );
}

export default Subscribe;
