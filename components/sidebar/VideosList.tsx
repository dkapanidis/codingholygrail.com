import videos from 'data/videos'
import Image from 'next/image'
import React, { useState } from 'react'
import { ImYoutube } from 'react-icons/im'
import Video from 'types/video'
import YoutubePlayer from './YoutubePlayer'

function VideosList() {
  const [videoId, setVideoId] = useState("")
  return (
    <div className="pt-4 relative">
      <div className="flex items-center pb-4">
        <h1 className="flex flex-grow whitespace-nowrap text-lg font-semibold items-center">Videos  📹</h1>
        <a rel="noopener nofollow" target="_blank" className="flex yt-subscribe-button items-center" href="https://www.youtube.com/c/dimitriskapanidis?sub_confirmation=1">
          <div className="flex items-center space-x-2 rounded-sm py-1 p-1.5 text-white text-xs hover:bg-red-400 bg-red-youtube">
            <ImYoutube fill="white" />
            <span>Subscribe!</span>
          </div>
        </a>
      </div>
      <div className="flex flex-col space-y-2">
        {videos.map(video => <VideoRow key={video.content} video={video} onClick={() => setVideoId(video.id)} />)}
      </div>
      {videoId !== "" && <YoutubePlayer videoId={videoId} cancel={() => setVideoId("")} />}
    </div>
  )
}

interface VideoRowProps { video: Video, onClick(): void }
function VideoRow({ video, onClick }: VideoRowProps) {
  return (
    <a className="flex p-2 hover:bg-gray-100 items-center cursor-pointer relative space-x-2" onClick={onClick}>
      <div className="flex">
        <Image src={video.thumbnail} alt="video thumbnail" width={120} height={120} className="rounded-lg" />
      </div>
      <h2 className="w-full text-sm font-normal tracking-wider text-gray-600">{video.title}</h2>
    </a>
  )
}


export default VideosList
