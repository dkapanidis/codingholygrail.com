import DateFormatter from '@components/date/date-formatter';
import topics from 'data/topics';
import Link from 'next/link';
import React from 'react';
import Post from '../../types/post';

interface Props { posts: Post[], topic?: string }
function PostsList({ posts, topic }: Props) {
  return (
    <div className="pt-4">
      {!topic && <h1 className="text-lg pb-2 font-semibold">Latest Posts 📝</h1>}
      {topic && <h1 className="text-lg pb-2 font-semibold">Posts about <i>{topics[topic].text}</i></h1>}
      {topic && <h1 className="text-sm text-gray-600 pb-2"><i>{topics[topic].description}</i></h1>}
      <div className="flex flex-col space-y-4">{posts.map(post => <PostRow key={post.slug} post={post} />)}</div>
    </div>
  )
}

interface PostRowProps { post: Post }
function PostRow({ post }: PostRowProps) {
  const topic = topics[post.topic]

  return (
    <Link href={`/${post.slug}`}>
      <a className="flex py-2 hover:bg-gray-100 rounded translate transform group cursor-pointer">
        <article className="space-x-4 flex ">
          <div className="flex flex-none px-2 transition transform group-hover:scale-110">
            <img src={topic.icon} alt={topic.id} width={40} height={40} />
          </div>
          <div className="flex flex-col">
            <div className="">
              <h2 className="text-lg font-semibold tracking-wider text-gray-600">{post.title}</h2>
            </div>
            <div>
              <dd className="text-xs  leading-tight text-gray-500">
                <DateFormatter dateString={post.date} />
              </dd>
            </div>
          </div>
        </article>
      </a>
    </Link>
  )
}

export default PostsList
