import Layout from '@components/layouts/Layout'
import Post from '@components/posts/Post'
import PostsList from '@components/posts/PostsList'
import TopicsList from '@components/topics/TopicsList'
import VideosList from '@components/videos/VideosList'
import { useRouter } from 'next/router'
import React from 'react'
import { getAllPostPreviews } from '@components/posts/utils';

interface Props { posts: Post[] }
function Topic({ posts }: Props) {
  const router = useRouter()
  const { topic } = router.query
  const topicPosts = posts.filter(post => post.meta.topic === topic)
  return (
    <Layout title="Blog">
      <div className="flex gap-20">
        <div className="flex-grow">
          <PostsList posts={topicPosts} topic={topic as string} />
          <TopicsList />
        </div>
        <VideosList />
      </div>
    </Layout>
  )
}


export async function getStaticPaths() {
  const posts = getAllPostPreviews(require.context('../', true, /preview\.mdx$/))

  const paths = posts.map((post) => ({
    params: { topic: post.meta.topic },
  }))

  return { paths, fallback: false }
}

export async function getStaticProps() {
  const posts = getAllPostPreviews(require.context('../', true, /preview\.mdx$/))
  return { props: { posts } };
}


export default Topic
