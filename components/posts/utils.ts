import Post from "./Post"

export function importAll(r: any) {
  return r
    .keys()
    .map((fileName: string) => ({
      meta: r(fileName).meta,
    }))
}

export function dateSortDesc(a: string, b: string) {
  if (a > b) return -1
  if (a < b) return 1
  return 0
}

export function getAllPostPreviews(r: any): Post[] {
  return importAll(r).sort((a: Post, b: Post) =>
    dateSortDesc(a.meta.date, b.meta.date)
  )
}
