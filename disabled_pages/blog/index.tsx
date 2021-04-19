import PostList from '@components/PostList';
import matter from 'gray-matter';
import React from "react";
import { Divider } from 'semantic-ui-react';

export default function Index({ posts }: any) {
  return (<>
    <div className="Container-Index">
      <h1>Blog</h1>
      <Divider />
      <PostList posts={posts} />
    </div>
  </>
  )
}

export async function getStaticProps() {
  const configData = await import(`../../siteconfig.json`)

  const posts = ((context) => {
    const keys = context.keys()
    const values = keys.map(context)

    const data = keys.map((key: any, index: any) => {
      let slug = key.replace(/^.*[\\\/]/, '').slice(0, -3)
      const value: any = values[index]
      const document = matter(value.default)
      return {
        frontmatter: document.data,
        markdownBody: document.content,
        slug,
      }
    })
    return data
  })(require.context('../../posts', true, /\.md$/))

  return {
    props: {
      posts,
      title: configData.default.title,
      description: configData.default.description,
    },
  }
}
