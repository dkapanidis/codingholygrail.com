import Layout from "@components/layouts/Layout";
import Sidebar from "@components/Sidebar";
import Title from "@components/Title";
import ErrorPage from "next/error";
import { useRouter } from "next/router";
import { ImTwitter } from "react-icons/im";
import { useInView } from "react-intersection-observer";
import PostBody from "../components/post-body";
import { getAllPosts, getPostBySlug } from "../lib/api";
import markdownToHtml from "../lib/markdownToHtml";
import PostType from "../types/post";

type Props = {
  post: PostType;
  morePosts: PostType[];
  preview?: boolean;
};

const Post = ({ post, morePosts, preview }: Props) => {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <Layout title="Blog">
      <div className="flex flex-col lg:flex-row gap-20">
        <div className="flex-grow">
          <Title meta={post}/>
          <PostBody content={post.content} />
        </div>
        <Sidebar />
      </div>
      <ShareLinks />
    </Layout>
  );
};

function Blog({ children }: { children: any }) {
  return (
    <div className="flex">
      <article className="flex-1 prose pb-10 max-w-3xl">{children}</article>
    </div>
  );
}

function ShareLinks() {
  const { ref, inView } = useInView();

  return (
    <div ref={ref}>
      <ShareOnTwitter hidden={inView} />
    </div>
  );
}

interface ShareOnTwitterProps {
  hidden: boolean;
}
function ShareOnTwitter({ hidden }: ShareOnTwitterProps) {
  const router = useRouter();
  const url = `https://codingholygrail.com${router.pathname}`;
  return (
    <a
      rel="nofollow noopener"
      target="_blank"
      href={`https://twitter.com/intent/tweet?url=${url}`}
      className={`fixed bottom-5 left-1/2 
        border border-gray-100 shadow-lg
        bg-white text-gray-800 p-2
        rounded-full hover:border-blue-100 hover:bg-blue-100
        flex items-center gap-2 text-sm transform -translate-x-1/2
        ${hidden ? "hidden" : ""}`}
    >
      <span>Share on Twitter</span>
      <ImTwitter fill="#1da1f2" />
    </a>
  );
}

export default Post;

type Params = {
  params: {
    slug: string;
  };
};

export async function getStaticProps({ params }: Params) {
  const post = getPostBySlug(params.slug, [
    "title",
    "date",
    "slug",
    "author",
    "content",
    "ogImage",
    "coverImage",
  ]);
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
  const posts = getAllPosts(["slug"]);

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
