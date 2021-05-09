import Layout from '@components/layouts/Layout'
import Sidebar from '@components/Sidebar'
import React from 'react'

interface BlogLayoutProps { children: any }
function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <Layout title="Blog">
      <div className="flex flex-col lg:flex-row gap-20">
        <div className="flex-grow">
          <Blog>{children}</Blog>
        </div>
        <Sidebar />
      </div>
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

export default BlogLayout