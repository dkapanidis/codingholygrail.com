import React, { useRef, useState } from 'react';
import { BiMailSend } from "react-icons/bi";

function Subscribe() {
  // 1. Create a reference to the input so we can fetch/clear it's value.
  const inputEl = useRef<any>(null);
  // 2. Hold a message in state to handle the response from our API.
  const [message, setMessage] = useState('');

  const subscribe = async (e:any) => {
    e.preventDefault();

    // 3. Send a request to our API with the user's email address.
    const res = await fetch('/.netlify/functions/subscribe', {
      body: JSON.stringify({
        email: inputEl.current.value
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    });

    const { error } = await res.json();

    if (error) {
      // 4. If there was an error, update the message in state.
      setMessage(error);

      return;
    }

    // 5. Clear the input value and show a success message.
    inputEl.current.value = '';
    setMessage('Success! 🎉 You are now subscribed to the newsletter.');
  };

  return (
    <form className="flex flex-col border-blue-500 border-3 rounded-md text-center p-4 py-8 w-80 relative gap-4" onSubmit={subscribe}>
      <BiMailSend className="text-blue-500 text-5xl absolute left-1/2 top-0 bg-white px-1 border-white transform -translate-x-1/2 -translate-y-1/2 "/>
      <h1 className="font-semibold text-lg">Subscribe to the Newsletter!</h1>
      <div className="text-sm font-light">
        {message ? message : <span>You will receive high-quality articles about cloud native and all things I'm working on. <b>No spam 🙅‍♂️ ! </b></span>}
      </div>
      <input className="outline-none focus:ring-4 focus:border-blue-500 ring-blue-200 rounded-md text-sm border w-full px-2 p-1" id="email-input" name="email" placeholder="you@awesome.com" ref={inputEl} required type="email"/>
      <button className="bg-blue-500 rounded p-1 text-white hover:bg-blue-600 outline-none focus:ring-4 focus:border-blue-500 ring-blue-200" type="submit">{'✨ Sign me up! ✨'}</button>
    </form>
  );
}

export default Subscribe