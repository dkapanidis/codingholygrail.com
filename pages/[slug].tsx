import Layout from "@components/layouts/Layout";
import ShareLinks from "@components/posts/ShareLinks";
import Title from "@components/posts/Title";
import Sidebar from "@components/sidebar/Sidebar";
import PostBody from "components/posts/PostBody";
import topics from "data/topics";
import { getAllPosts } from "lib/api";
import markdownToHtml from "lib/markdownToHtml";
import ErrorPage from "next/error";
import Link from "next/link";
import { useRouter } from "next/router";
import PostType from "types/post";

type Props = {
  post: PostType;
  previous?: PostType;
  next?: PostType;
};

const Post = ({ post, previous, next }: Props) => {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <Layout title="Blog">
      <div className="flex flex-col lg:flex-row gap-20">
        <div className="flex-grow">
          <Title post={post} />
          <PostBody content={post.content} />
          <MorePosts previous={previous} next={next} />
        </div>
        <Sidebar />
      </div>
      <ShareLinks post={post} />
    </Layout>
  );
};

type MorePostsProps = { previous?: PostType, next?: PostType }
function MorePosts({ previous, next }: MorePostsProps) {
  return (
    <div className='flex w-full py-10 px-20'>
      <div className="flex-grow"/>
      {previous && <MorePostsLink post={previous} />}
      {next && <MorePostsLink post={next} />}
      <div className="flex-grow"/>
    </div>
  )
}

type MorePostsLinkProps = { post: PostType }
function MorePostsLink({ post }: MorePostsLinkProps) {
  return (
    <Link href={post.slug}>
      <a className="flex text-sm w-56 text-blue-700 hover:bg-blue-100 p-4 rounded flex-col items-center text-center">
        <img src={topics[post.topic].icon} className="px-2 w-16 py-4" />
        <span>{post.title}</span>
      </a>
    </Link>
  )
}

export default Post;

type Params = {
  params: {
    slug: string;
  };
};

export async function getStaticProps({ params }: Params) {
  const posts = getAllPosts();
  const index = posts.findIndex(post => post.slug === params.slug)
  const post = posts[index]
  const content = await markdownToHtml(post.content || "");
  const next = index > 0 && posts[index - 1]
  const previous = index < posts.length && posts[index + 1]

  return {
    props: {
      post: {
        ...post,
        content,
      },
      next: next || null,
      previous: previous || null,
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
