import Layout from '@components/layouts/Layout'
import Post from '@components/posts/Post'
import { getAllPostPreviews } from '@components/posts/utils'
import generateRssFeed from '@components/rss'
import Sidebar from '@components/Sidebar'
import { useRouter } from 'next/router'
import React from 'react'
import { ImTwitter } from 'react-icons/im'
import { useInView } from 'react-intersection-observer'

interface BlogLayoutProps { children: any, posts: Post[] }
function BlogLayout({ children, posts }: BlogLayoutProps) {
  return (
    <Layout title="Blog">
      <div className="flex flex-col lg:flex-row gap-20">
        <div className="flex-grow">
          <Blog>{children}</Blog>
        </div>
        <Sidebar />
      </div>
      <ShareLinks posts={posts} />
    </Layout>)
}

function Blog({ children }: { children: any }) {
  return (
    <div className="flex">
      <article className="flex-1 prose pb-10 max-w-3xl">
        {children}
      </article>
    </div>
  )
}

interface ShareLinksProps { posts: Post[] }
function ShareLinks({ posts }: ShareLinksProps) {
  const { ref, inView } = useInView();

  return (
    <div ref={ref}>
      <ShareOnTwitter posts={posts} hidden={inView} />
    </div>
  )
}

interface ShareOnTwitterProps { hidden: boolean, posts: Post[]  }
function ShareOnTwitter({ hidden, posts }: ShareOnTwitterProps) {
  const router = useRouter()
  const { id } = router.query
  const url = `https://codingholygrail.com${router.pathname}`
// console.log(posts)
  // const text = "test me"
  return (
    <a rel="nofollow noopener" target="_blank"
      href={`https://twitter.com/intent/tweet?url=${url}`}
      className={`fixed bottom-5 left-1/2 
        border border-gray-100 shadow-lg
        bg-white text-gray-800 p-2
        rounded-full hover:border-blue-100 hover:bg-blue-100
        flex items-center gap-2 text-sm transform -translate-x-1/2
        ${hidden ? 'hidden' : ''}`}>
      <span>Share on Twitter</span>
      <ImTwitter fill="#1da1f2" />
    </a>
  )
}

export async function getStaticProps() {
  const posts = getAllPostPreviews(require.context('./', true, /preview\.mdx$/))
  console.log("Posts: ", posts)
  return { props: { posts } };
}

export default BlogLayout