import React from 'react'
import Subscribe from './Subscribe'
import TableOfContents from './TableOfContents'
import VideosList from './VideosList'

type Props = {toc?: string[]}
function Sidebar({toc}:Props) {
  return (
    <div className="flex flex-col flex-shrink lg:w-80 space-y-8">
      {toc !== undefined && <TableOfContents toc={toc}/>}
      <VideosList />
      <Subscribe />
    </div>
  )
}

export default Sidebar
