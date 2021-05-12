import React from 'react'
import Subscribe from './Subscribe'
import VideosList from './VideosList'

function Sidebar() {
  return (
    <div className="flex flex-col flex-shrink w-80 gap-8">
      <VideosList />
      <Subscribe />
    </div>
  )
}

export default Sidebar
