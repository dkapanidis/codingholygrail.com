import Layout from "@components/layouts/Layout";
import PostsList from "@components/posts/PostsList";
import Sidebar from "@components/sidebar/Sidebar";
import TopicsList from "@components/topics/TopicsList";
import { getAllPosts } from "lib/api";
import { useRouter } from "next/router";
import React from "react";
import Post from "types/post";

interface Props {
  posts: Post[];
}
function Topic({ posts }: Props) {
  const router = useRouter();
  const { topic } = router.query;
  const topicPosts = posts.filter((post) => post.topic === topic);
  return (
    <Layout title="Blog">
      <div className="flex flex-col lg:flex-row lg:space-x-20">
        <div className="flex-grow">
          <PostsList posts={topicPosts} topic={topic as string} />
          <TopicsList />
        </div>
        <Sidebar />
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const posts = getAllPosts();
  const paths = posts.map((post) => ({ params: { topic: post.topic } }));
  return { paths, fallback: false };
}

export const getStaticProps = async () => {
  const posts = getAllPosts();
  return { props: { posts } };
};

export default Topic;
