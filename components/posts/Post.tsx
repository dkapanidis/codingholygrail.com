export default interface Post {
  link: string,
  module: {
    meta: {
      title: string,
      date: string
      authors: string[],
      topic: string,
    }
  }
}