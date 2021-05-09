import React from 'react'
import Subscribe from './Subscribe'
import VideosList from './videos/VideosList'

function Sidebar() {
  return (
    <div className="flex flex-col gap-8">
      <VideosList />
      <Subscribe />
    </div>
  )
}

export default Sidebar
