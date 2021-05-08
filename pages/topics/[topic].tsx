import Header from '@components/Header'
import Layout from '@components/layouts/Layout'
import Post from '@components/posts/Post'
import PostsList from '@components/posts/PostsList'
import TopicsList from '@components/topics/TopicsList'
import VideosList from '@components/videos/VideosList'
import { useRouter } from 'next/router'
import React from 'react'
const posts = getAllPostPreviews()

interface Props { posts: Post[] }
function Topic() {
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

// export async function getStaticProps() {
//   return { props: { posts } };
// }


export default Topic
