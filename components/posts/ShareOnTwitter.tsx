import { useRouter } from 'next/router';
import React from 'react';
import { ImTwitter } from 'react-icons/im';
import Post from 'types/post';

type Props = {post: Post}
function ShareOnTwitter({post}: Props) {
  const router = useRouter();
  const url = `https://codingholygrail.com/${post.slug}`;
  const text = `"${post.title}" by @dkapanidis`;
  return (
    <a
      rel="nofollow noopener"
      target="_blank"
      href={`https://twitter.com/intent/tweet?url=${url}&text=${text}`}
      className="fixed bottom-5 left-1/2 
        border border-gray-100 shadow-lg
        bg-white text-gray-800 p-2
        rounded-full hover:border-blue-100 hover:bg-blue-100
        flex items-center space-x-2 text-sm transform -translate-x-1/2">
      <span>Share on Twitter</span>
      <ImTwitter fill="#1da1f2" />
    </a>
  );
}
export default ShareOnTwitter
