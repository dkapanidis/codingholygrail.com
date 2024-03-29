import React from 'react'
import AnchorLink from 'react-anchor-link-smooth-scroll-v2'
import { ImArrowRight2 } from 'react-icons/im'

type Props = { toc: string[] }
function TableOfContents({ toc }: Props) {
  return (
    <div className="pt-4 relative">
      <div className="flex items-center pb-4">
        <h1 className="flex flex-grow whitespace-nowrap text-lg font-semibold items-center">Article Content</h1>
      </div>
      <div className="flex flex-col text-blue-200 space-y-1">
        {toc.map(title => <TitleRow key={title} title={title} />)}
      </div>
    </div>
  )
}

type TitleRowProps = { title: string }
function TitleRow({ title }: TitleRowProps) {
  const link = title.toLowerCase().replace(/ /g, '-').replace(/\./g, '').replace(/\//g, "").replace(/\+/g, "").replace(/\(/g, "").replace(/\)/g, "")
  return (
    <AnchorLink     
      offset={50}
      href={`#${link}`}
      className="flex items-center space-x-2 text-blue-400 font-light rounded px-2 py-1 hover:bg-blue-100"
    >
      <ImArrowRight2 />
      <span className="text-gray-800">{title}</span>
    </AnchorLink>
  )
}
export default TableOfContents
