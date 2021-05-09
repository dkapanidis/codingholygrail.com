import Layout from '@components/layouts/Layout'
import Subscribe from '@components/Subscribe'
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
        <div className="flex flex-col gap-8">
        <VideosList />
        <Subscribe />
      </div>
      </div>
    </Layout>)
}

function Blog({ children }: { children: any }) {
  return (
    <div className="flex">
      <article className="flex-1 prose pb-10 max-w-3xl ">
        {children}
      </article>
    </div>
  )
}

export default BlogLayout