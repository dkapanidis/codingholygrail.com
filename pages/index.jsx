import { HeaderSolid } from '@components/Header';
import Layout from '@components/layouts/Layout';
import Link from 'next/link';
import tinytime from 'tinytime';

const posts = getAllPostPreviews()
const postDateTemplate = tinytime('{MMMM} {DD}, {YYYY}')

const Blog = () => <Layout title="Blog">
  <HeaderSolid />
  <div className="max-w-3xl mx-auto px-4 sm:px-6 xl:max-w-5xl xl:px-0 divide-y divide-gray-200">
    <ul className="pt-4 divide-y divide-gray-200">
      {posts.map(({ link, module: { default: Component, meta } }) => {
        return (
          <li key={link} className="py-12">
            <article className="space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0 xl:items-baseline">
              <dl>
                <dt className="sr-only">Published on</dt>
                <dd className="text-base leading-6 font-medium text-gray-500">
                  <time dateTime={meta.date}>{postDateTemplate.render(new Date(meta.date))}</time>
                </dd>
              </dl>
              <div className="space-y-5 xl:col-span-3">
                <div className="space-y-6">
                  <h2 className="text-2xl leading-8 font-bold tracking-tight">
                    <Link href={link}>
                      <a className="text-gray-900">{meta.title}</a>
                    </Link>
                  </h2>
                  <div className="prose max-w-none text-gray-500">
                    <Component />
                  </div>
                </div>
                <div className="text-base leading-6 font-medium">
                  <Link href={link}>
                    <a
                      className="text-teal-500 hover:text-teal-600"
                      aria-label={`Read "${meta.title}"`}
                    >
                      Read more &rarr;
                      </a>
                  </Link>
                </div>
              </div>
            </article>
          </li>
        )
      })}
    </ul>
  </div>
</Layout>

function importAll(r) {
  return r
    .keys()
    .map((fileName) => ({
      link: fileName.replace(/\/preview\.mdx$/, ''),
      module: r(fileName),
    }))
}

function dateSortDesc(a, b) {
  if (a > b) return -1
  if (a < b) return 1
  return 0
}

function getAllPostPreviews() {
  return importAll(require.context('./', true, /preview\.mdx$/)).sort((a, b) =>
    dateSortDesc(a.module.meta.date, b.module.meta.date)
  )
}

export default Blog