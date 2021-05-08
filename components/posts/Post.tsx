export default interface Post {
  meta: {
    slug: string,
    title: string,
    date: string
    authors: string[],
    topic: string,
    description: string,
  }
}