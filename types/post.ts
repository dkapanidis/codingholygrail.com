import Author from "./author";

type Post = {
  slug: string;
  title: string;
  date: string;
  authors: string[];
  topic: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: Author;
  ogImage: {
    url: string;
  };
};

export default Post;
