import Footer from '@components/Footer';
import { HeaderSolid } from '@components/Header';
import Layout from '@components/layouts/Layout';
import Post from '@components/posts/Post';
import PostsList from '@components/posts/PostsList';
import TopicsList from '@components/topics/TopicsList';
import VideosList from '@components/videos/VideosList';

const posts = getAllPostPreviews()

const Blog = () => (
  <Layout title="Blog">
    <HeaderSolid />
    <div className="flex gap-20">
      <div className="flex-grow">
        <PostsList posts={posts} />
        <TopicsList />
        <Footer />
      </div>
      <VideosList />
    </div>
  </Layout>
)

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

function getAllPostPreviews(): Post[] {
  return importAll(require.context('./', true, /preview\.mdx$/)).sort((a: Post, b: Post) =>
    dateSortDesc(a.module.meta.date, b.module.meta.date)
  )
}

export default Blog