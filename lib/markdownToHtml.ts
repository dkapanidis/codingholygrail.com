import html from 'rehype-stringify'
import markdown from 'remark-parse'
import prism from 'remark-prism'
import remark2rehype from 'remark-rehype'
import slug from 'remark-slug'
import { unified } from 'unified'
var extractToc = require("remark-extract-toc");


export default async function markdownToHtml(text: string) {
  const result = await unified()
    .use(markdown)
    .use(slug)
    .use(prism)
    .use(remark2rehype)
    .use(html)
    .process(text);

  return result.toString()
}

export async function markdownToToc(text: string): Promise<string[]> {
  var processor = await unified().use(markdown).use(extractToc);

  var node = processor.parse(text);
  var tree: any = processor.runSync(node);

  const toc = tree.map((f: any) => f.value)

  return toc;
}
