import Layout from "@components/layouts/Layout";
import ShareLinks from "@components/posts/ShareLinks";
import Title from "@components/posts/Title";
import Sidebar from "@components/sidebar/Sidebar";
import PostBody from "components/posts/PostBody";
import { getAllPosts, getPostBySlug } from "lib/api";
import markdownToHtml from "lib/markdownToHtml";
import ErrorPage from "next/error";
import { useRouter } from "next/router";
import PostType from "types/post";

type Props = {
  post: PostType;
  morePosts: PostType[];
};

const Post = ({ post, morePosts }: Props) => {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <Layout title="Blog">
      <div className="flex flex-col lg:flex-row gap-20">
        <div className="flex-grow">
          <Title post={post}/>
          <PostBody content={post.content} />
        </div>
        <Sidebar />
      </div>
      <ShareLinks />
    </Layout>
  );
};



export default Post;

type Params = {
  params: {
    slug: string;
  };
};

export async function getStaticProps({ params }: Params) {
  const post = getPostBySlug(params.slug);
  const content = await markdownToHtml(post.content || "");

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts();

  return {
    paths: posts.map((posts) => {
      return {
        params: {
          slug: posts.slug,
        },
      };
    }),
    fallback: false,
  };
}
