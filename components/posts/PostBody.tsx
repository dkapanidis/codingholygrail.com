import Post from "types/post"
import ReadTimeResults from "types/readTimeResults"
import Title from "./Title"

type Props = {
  post: Post,
  stats: ReadTimeResults,
}

const PostBody = ({ post, stats }: Props) => {
  return (
    <div className="max-w-2xl prose mx-auto">
      <Title post={post} stats={stats}/>
      <div
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  )
}

export default PostBody
