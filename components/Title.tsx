import Link from 'next/link'
import React from 'react'
import { ImGithub } from 'react-icons/im'
import tinytime from 'tinytime'
import Post from 'types/post'
import topics from 'data/topics'

const postDateTemplate = tinytime('{MMMM} {DD}, {YYYY}')

interface Props { meta: Post }
function Title({ meta }: Props) {
  const topic = topics[meta.topic]
  return (
    <div className="flex items-center gap-4">
      <img src={topic.icon} className="px-2 w-24" />
      <div className="space-y-2">
        <div className="text-2xl font-semibold text-gray-900">{meta.title}</div>
        <Subtitle meta={meta} />
      </div>
    </div>
  )
}

interface SubtitleProps { meta: Post }
function Subtitle({ meta }: SubtitleProps) {
  return (
    <div className="flex items-center text-xs text-gray-400 space-x-4">
      <time dateTime={meta.date}>{postDateTemplate.render(new Date(meta.date))}</time>
      <Link href={`https://github.com/dkapanidis/codingholygrail.com/edit/main/content/posts/${meta.slug}/README.md`}>
      <a className="flex text-gray-800 items-center gap-1">
        <span>Found an error? Edit the article </span>
        <ImGithub />
      </a>
      </Link>
    </div>
  )
}

export default Title
