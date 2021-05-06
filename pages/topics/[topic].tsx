import { HeaderSolid } from '@components/Header'
import Layout from '@components/layouts/Layout'
import Post from '@components/posts/Post'
import PostsList from '@components/posts/PostsList'
import TopicsList from '@components/topics/TopicsList'
import { useRouter } from 'next/router'
import React from 'react'

const posts = getAllPostPreviews()

function Topic() {
  const router = useRouter()
  const { topic } = router.query
  const topicPosts = posts.filter(post => post.module.meta.topic === topic )
  return (
    <Layout title="Blog">
      <HeaderSolid />
      <PostsList posts={topicPosts} topic={topic as string} />
      <TopicsList />
    </Layout>
  )
}

function importAll(r: any) {
  return r
    .keys()
    .map((fileName: string) => ({
      link: `/${fileName.replace(/\/preview\.mdx$/, '')}`,
      module: r(fileName),
    }))
}

function dateSortDesc(a: string, b: string) {
  if (a > b) return -1
  if (a < b) return 1
  return 0
}

function getAllPostPreviews():Post[] {
    return importAll(require.context('../', true, /preview\.mdx$/)).sort((a: Post, b: Post) =>
    dateSortDesc(a.module.meta.date, b.module.meta.date)
  )
}


export default Topic
