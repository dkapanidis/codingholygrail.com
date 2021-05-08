import Header from '@components/Header'
import Layout from '@components/layouts/Layout'
import Post from '@components/posts/Post'
import PostsList from '@components/posts/PostsList'
import TopicsList from '@components/topics/TopicsList'
import VideosList from '@components/videos/VideosList'
import { useRouter } from 'next/router'
import React from 'react'

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

function importAll(r: any) {
  return r
    .keys()
    .map((fileName: string) => ({
      link: `/${fileName.replace(/\/preview\.mdx$/, '')}`,
      meta: r(fileName).meta,
    }))
}

function dateSortDesc(a: string, b: string) {
  if (a > b) return -1
  if (a < b) return 1
  return 0
}

function getAllPostPreviews(): Post[] {
  return importAll(require.context('../', true, /preview\.mdx$/)).sort((a: Post, b: Post) =>
    dateSortDesc(a.meta.date, b.meta.date)
  )
}

export async function getStaticPaths() {
  const posts = getAllPostPreviews()

  const paths = posts.map((post) => ({
    params: { topic: post.meta.topic },
  }))

  return { paths, fallback: false }
}

export async function getStaticProps() {
  const posts = getAllPostPreviews()
  return { props: { posts } };
}


export default Topic
