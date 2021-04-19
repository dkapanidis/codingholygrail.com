import matter from 'gray-matter';
import Link from 'next/link';
const stripMarkdownPlugin = require('strip-markdown')
const remark = require('remark')

function importAll(r: any) {
  return r.keys().map(r)
}

const previewItems = importAll(
  require.context('../posts', false, /^\.\/(.*)-preview\.md$/)
)


export default function PostList({ posts, title, description, ...props }: any) {
  if (posts === 'undefined') return null

  return (
    <div>
      {!posts && <div>No posts!</div>}
      <ul>
        {posts &&
          posts.map((post: any) => {
            return (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`}><h3><a style={{ color: "#111111" }}>{post.frontmatter.title}</a></h3></Link>
                <div style={{marginBottom: "40px"}}>
                   <p><i>{post.frontmatter.description}</i></p>
                   <Link href={`/blog/${post.slug}`}><a style={{ color: "#573EDE" }}>Read →</a></Link>
                  </div>
              </li>
            )
          })}
      </ul>
    </div>
  )
}

export async function getStaticProps() {
  const configData = await import(`../siteconfig.json`)

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
  })(require.context('../posts', true, /\.md$/))

  return {
    props: {
      posts,
      title: configData.default.title,
      description: configData.default.description,
    },
  }
}
