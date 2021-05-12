import Link from 'next/link'
import React from 'react'
import { ImYoutube } from 'react-icons/im'
import Video from 'types/video'
import videos from 'data/videos'

function VideosList() {
  return (
    <div className="pt-4 relative">
      <div className="flex items-center pb-4 gap-4">
        <h1 className="flex flex-grow whitespace-nowrap text-lg font-semibold items-center">Videos  📹</h1>
        <a rel="noopener nofollow" target="_blank" className="flex yt-subscribe-button items-center" href="https://www.youtube.com/c/dimitriskapanidis?sub_confirmation=1">
          <span className="flex items-center gap-2 rounded-sm py-1 p-1.5 text-white text-xs hover:bg-red-400 bg-red-youtube">
            <ImYoutube fill="white" />Subscribe!
        </span>
        </a>
      </div>
      <div className="flex flex-col gap-4">
        {videos.map(video => <VideoRow key={video.content} video={video} />)}
      </div>
    </div>
  )
}

interface VideoRowProps { video: Video }
function VideoRow({ video }: VideoRowProps) {
  return (
    <Link href={video.content}>
      <a className="flex p-2 hover:bg-gray-100 items-center cursor-pointer relative gap-2">
        <img src={video.thumbnail} className="w-28 rounded-lg bg-red-500" />
        <h2 className="text-sm font-normal tracking-wider text-gray-600">{video.title}</h2>
      </a>
    </Link>
  )
}


export default VideosList
