import { useRouter } from 'next/router';
import React from 'react';
import { ImTwitter } from 'react-icons/im';

function ShareOnTwitter() {
  const router = useRouter();
  const url = `https://codingholygrail.com${router.pathname}`;
  return (
    <a
      rel="nofollow noopener"
      target="_blank"
      href={`https://twitter.com/intent/tweet?url=${url}`}
      className="fixed bottom-5 left-1/2 
        border border-gray-100 shadow-lg
        bg-white text-gray-800 p-2
        rounded-full hover:border-blue-100 hover:bg-blue-100
        flex items-center gap-2 text-sm transform -translate-x-1/2">
      <span>Share on Twitter</span>
      <ImTwitter fill="#1da1f2" />
    </a>
  );
}
export default ShareOnTwitter
