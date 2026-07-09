import { packageSrc, typeGenerator } from '@/lib/type-generator'
import { renderMarkdownToJsx } from '@/lib/render-markdown'

type MatcherDocProps = {
  name: string
  path: string
}

export async function MatcherDoc({ name, path }: MatcherDocProps) {
  const [doc] = await typeGenerator.generateTypeTable({
    path: packageSrc(path),
    name,
  })

  if (!doc?.description?.trim()) {
    throw new Error(`Missing TSDoc description for ${name} in ${path}`)
  }

  const content = await renderMarkdownToJsx(doc.description)

  return <div className="prose">{content}</div>
}
