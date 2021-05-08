export default interface Post {
  link: string,
  meta: {
    title: string,
    date: string
    authors: string[],
    topic: string,
    description: string,
  }
}