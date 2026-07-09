import Link from 'next/link'
import { documentedMatchers } from '@/lib/discover-matchers'
import { extractMatcherSummary } from '@/lib/matcher-summary'
import { packageSrc, typeGenerator } from '@/lib/type-generator'
import { readFileSync } from 'node:fs'

async function getMatcherSummary(matcher: string, matcherPath: string) {
  const source = readFileSync(packageSrc(matcherPath), 'utf-8')
  const [doc] = await typeGenerator.generateTypeTable({
    path: packageSrc(matcherPath),
    name: matcher,
  })

  if (!doc?.description?.trim()) {
    return ''
  }

  return extractMatcherSummary(doc.description)
}

export async function MatcherIndex() {
  const entries = await Promise.all(
    documentedMatchers.map(async (entry) => ({
      ...entry,
      summary: await getMatcherSummary(entry.matcher, entry.path),
    })),
  )

  return (
    <div className="not-prose grid gap-3">
      {entries.map((entry) => (
        <Link
          key={entry.slug}
          href={`/docs/matchers/${entry.slug}`}
          className="rounded-lg border border-fd-border bg-fd-card p-4 transition-colors hover:bg-fd-accent/40"
        >
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h3 className="font-medium">{entry.title}</h3>
            <code className="rounded bg-fd-muted px-2 py-0.5 text-xs">{entry.matcher}</code>
          </div>
          <p className="text-sm text-fd-muted-foreground">{entry.summary}</p>
        </Link>
      ))}
    </div>
  )
}
