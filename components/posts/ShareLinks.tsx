import React from 'react';
import { useInView } from 'react-intersection-observer';
import ShareOnTwitter from './ShareOnTwitter';

function ShareLinks() {
  const { ref, inView } = useInView();
  return (
    <div ref={ref}>
      {!inView &&
        <ShareOnTwitter />
      }
    </div>
  );
}

export default ShareLinks
