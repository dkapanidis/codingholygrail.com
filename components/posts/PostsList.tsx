import topics from '@components/topics/topics';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import tinytime from 'tinytime';
import Post from './Post';

const postDateTemplate = tinytime('{MMMM} {DD}, {YYYY}')

interface Props { posts: Post[], topic?: string }
function PostsList({ posts, topic }: Props) {
  return (
    <div className="pt-4">
      {!topic && <h1 className="text-lg pb-2 font-semibold">Latest Posts 📝</h1>}
      {topic && <h1 className="text-lg pb-2 font-semibold">Posts about <i>{topics[topic].text}</i></h1>}
      {topic && <h1 className="text-sm text-gray-600 pb-2"><i>{topics[topic].description}</i></h1>}
      {posts.map(post => <PostRow key={post.meta.slug} post={post} />)}
    </div>
  )
}

interface PostRowProps { post: Post }
function PostRow({ post }: PostRowProps) {
  const topic = topics[post.meta.topic]

  return (
    <Link href={`/${post.meta.slug}`}>
      <a className="py-2 hover:bg-gray-100 rounded translate transform group cursor-pointer">
        <article className="space-x-4 flex ">
          <img src={topic.icon} className="px-2 h-12 transition transform group-hover:scale-110 w-16" />
          <div className="flex flex-col">
            <div className="">
              <h2 className="text-lg font-semibold tracking-wider text-gray-600 group-hover:text-blue-700">{post.meta.title}</h2>
            </div>
            <div>
              <dd className="text-xs  leading-tight text-gray-500">
                <time dateTime={post.meta.date}>{postDateTemplate.render(new Date(post.meta.date))}</time>
              </dd>
            </div>
          </div>
        </article>
      </a>
    </Link>
  )
}

export default PostsList
