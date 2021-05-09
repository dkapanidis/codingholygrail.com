import Layout from '@components/layouts/Layout';
import Post from '@components/posts/Post';
import PostsList from '@components/posts/PostsList';
import { getAllPostPreviews } from '@components/posts/utils';
import generateRssFeed from '@components/rss';
import TopicsList from '@components/topics/TopicsList';
import VideosList from '@components/videos/VideosList';
import Subscribe from '@components/Subscribe';

interface Props { posts: Post[] }
const Blog = ({ posts }: Props) => (
  <Layout title="Blog">
    <div className="flex gap-20">
      <div className="flex-grow">
        <PostsList posts={posts} />
        <TopicsList />
      </div>
      <div className="flex flex-col gap-8">
        <VideosList />
        <Subscribe />
      </div>
    </div>
  </Layout>
)

export async function getStaticProps() {
  const posts = getAllPostPreviews(require.context('./', true, /preview\.mdx$/))
  await generateRssFeed(posts);
  return { props: { posts } };
}

export default Blog