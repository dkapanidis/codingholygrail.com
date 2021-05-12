import React from 'react';
import { useInView } from 'react-intersection-observer';
import Post from 'types/post';
import ShareOnTwitter from './ShareOnTwitter';

type Props= {post: Post}
function ShareLinks({post}: Props) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref}>
      {!inView &&
        <ShareOnTwitter post={post} />
      }
    </div>
  );
}

export default ShareLinks
