import Link from 'next/link'
import React from 'react'
import { ImYoutube } from 'react-icons/im'
import Video from './Video'
import videos from './videos'

function VideosList() {
  return (
    <div className="pt-4 w-80 relative">
      <h1 className="pb-4 text-lg font-semibold">Videos  📹</h1>
      <a className="absolute right-4 top-5 yt-subscribe-button items-center flex" rel="noopener nofollow" href="https://www.youtube.com/c/dimitriskapanidis?sub_confirmation=1" target="_blank">
        <span className="flex items-center gap-2 rounded-sm py-1 p-1.5 text-white text-xs" style={{ backgroundColor: 'red' }}>
          <ImYoutube fill="white" />Subscribe!
        </span>
      </a>
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
