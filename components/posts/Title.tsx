import DateFormatter from '@components/date-formatter'
import topics from 'data/topics'
import Link from 'next/link'
import React from 'react'
import { ImGithub } from 'react-icons/im'
import Post from 'types/post'

interface Props { post: Post }
function Title({ post }: Props) {
  const topic = topics[post.topic]
  return (
    <div className="flex items-center gap-4">
      <img src={topic.icon} className="px-2 w-24" />
      <div className="space-y-2">
        <div className="text-2xl font-semibold text-gray-900">{post.title}</div>
        <Subtitle post={post} />
      </div>
    </div>
  )
}

interface SubtitleProps { post: Post }
function Subtitle({ post }: SubtitleProps) {
  return (
    <div className="flex items-center text-xs text-gray-400 space-x-4">
      <DateFormatter dateString={post.date}/>
      <Link href={`https://github.com/dkapanidis/codingholygrail.com/edit/main/content/posts/${post.slug}/README.md`}>
      <a className="flex text-gray-800 items-center gap-1">
        <span>Found an error? Edit the article </span>
        <ImGithub />
      </a>
      </Link>
    </div>
  )
}

export default Title
