import Layout from "@components/layouts/Layout";
import ShareLinks from "@components/posts/ShareLinks";
import Title from "@components/posts/Title";
import Sidebar from "@components/sidebar/Sidebar";
import PostBody from "components/posts/PostBody";
import topics from "data/topics";
import { getAllPosts } from "lib/api";
import markdownToHtml, { markdownToToc } from "lib/markdownToHtml";
import ErrorPage from "next/error";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ImArrowLeft2, ImArrowRight2 } from "react-icons/im";
import readingTime from 'reading-time';
import PostType from "types/post";
import ReadTimeResults from "types/readTimeResults";

type Props = {
  post: PostType;
  previous?: PostType;
  next?: PostType;
  toc: string[];
  stats: ReadTimeResults;
};

const Post = ({ post, previous, next, toc, stats }: Props) => {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <Layout title="Blog">
      <div className="flex flex-col lg:flex-row">
        <div className="flex-grow pt-4">
          <PostBody post={post} stats={stats} />
          <MorePosts previous={previous} next={next} />
        </div>
        <Sidebar toc={toc} />
      </div>
      <ShareLinks post={post} />
    </Layout>
  );
};

type MorePostsProps = { previous?: PostType, next?: PostType }
function MorePosts({ previous, next }: MorePostsProps) {
  return (
    <div className='flex w-full py-10 px-10'>
      <div className="flex-grow" />
      {previous && <MorePostsLink post={previous} arrow="left" />}
      {next && <MorePostsLink post={next} arrow="right" />}
      <div className="flex-grow" />
    </div>
  )
}

type MorePostsLinkProps = { post: PostType, arrow: "left" | "right" }
function MorePostsLink({ post, arrow }: MorePostsLinkProps) {
  const topic = topics[post.topic]
  return (
    <Link href={`/${post.slug}`}>
      <a className="flex text-sm w-56 text-blue-700 hover:bg-blue-100 p-4 rounded flex-col items-center text-center space-y-4">
        <div className="flex px-2 py-4">
          <Image src={topic.icon} alt={topic.id} width={50} height={50} />
        </div>
        {arrow === "left" && <ImArrowLeft2 className="text-lg text-blue-500" color="inherit" />}
        {arrow === "right" && <ImArrowRight2 className="text-lg text-blue-500" color="inherit" />}
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
  const toc = await markdownToToc(post.content || "");
  const stats = readingTime(post.content);

  return {
    props: {
      post: {
        ...post,
        content,
      },
      next: next || null,
      previous: previous || null,
      toc,
      stats,
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
