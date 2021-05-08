import Layout from '@components/layouts/Layout'
import VideosList from '@components/videos/VideosList'
import React from 'react'

interface BlogLayoutProps { children: any }
function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <Layout title="Blog">
      <div className="flex gap-20">
        <div className="flex-grow">
          <Blog>{children}</Blog>
        </div>
        <VideosList />
      </div>
    </Layout>)
}

function Blog({ children }: { children: any }) {
  return (
    <div className="flex">
      <div className="flex-1" />
      <h1 className="text-xl font-bold"></h1>
      <article className="flex-shrink prose pt-12 pb-10 max-w-2xl">
        {children}
      </article>
      <div className="flex-1" />
    </div>
  )
}

export default BlogLayout