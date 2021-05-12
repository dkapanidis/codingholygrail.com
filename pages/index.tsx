import Layout from "@components/layouts/Layout";
import Post from "types/post";
import PostsList from "@components/posts/PostsList";
import generateRssFeed from "lib/rss";
import Sidebar from "@components/sidebar/Sidebar";
import TopicsList from "@components/topics/TopicsList";
import { getAllPosts } from "lib/api";

interface Props {
  posts: Post[];
}

const Blog = ({ posts }: Props) => (
  <Layout title="Blog">
    <div className="flex flex-col lg:flex-row gap-20">
      <div className="flex-grow">
        <PostsList posts={posts} />
        <TopicsList />
      </div>
      <Sidebar />
    </div>
  </Layout>
);

export const getStaticProps = async () => {
  const posts = getAllPosts();
  await generateRssFeed(posts);
  return { props: { posts } };
};

export default Blog;
