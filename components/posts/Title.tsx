import DateFormatter from '@components/date/date-formatter'
import topics from 'data/topics'
import Link from 'next/link'
import React from 'react'
import { ImGithub } from 'react-icons/im'
import Post from 'types/post'
import ReadTimeResults from 'types/readTimeResults'

interface Props { post: Post, stats: ReadTimeResults }
function Title({ post, stats }: Props) {
  const topic = topics[post.topic]
  return (
    <div className="flex items-center space-x-4">
      <div className="flex">
        <img src={topic.icon} alt={topic.id} width={60} height={60} />
      </div>
      <div className="space-y-2">
        <div className="text-2xl font-semibold text-gray-900">{post.title}</div>
        <Subtitle post={post} stats={stats} />
      </div>
    </div>
  )
}

interface SubtitleProps { post: Post, stats: ReadTimeResults }
function Subtitle({ post, stats }: SubtitleProps) {
  return (
    <div className="flex items-center text-xs text-gray-400 space-x-4">
      <DateFormatter dateString={post.date} />
      <span>{stats.text}</span>
      <Link href={`https://github.com/dkapanidis/codingholygrail.com/edit/main/content/posts/${post.slug}/README.md`}>
        <a className="flex text-gray-800 items-center space-x-1">
          <span>Found an error? Edit the article </span>
          <ImGithub />
        </a>
      </Link>
    </div>
  )
}

export default Title
