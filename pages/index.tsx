import Layout from '@components/layouts/Layout';
import Post from '@components/posts/Post';
import PostsList from '@components/posts/PostsList';
import { getAllPostPreviews } from '@components/posts/utils';
import generateRssFeed from '@components/rss';
import Sidebar from '@components/Sidebar';
import TopicsList from '@components/topics/TopicsList';

interface Props { posts: Post[] }
const Blog = ({ posts }: Props) => (
  <Layout title="Blog">
    <div className="flex gap-20">
      <div className="flex-grow">
        <PostsList posts={posts} />
        <TopicsList />
      </div>
      <Sidebar/>
    </div>
  </Layout>
)

export async function getStaticProps() {
  const posts = getAllPostPreviews(require.context('./', true, /preview\.mdx$/))
  await generateRssFeed(posts);
  return { props: { posts } };
}

export default Blog