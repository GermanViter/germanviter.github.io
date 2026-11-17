/**
 * Fetches the repos pinned on my GitHub profile and writes them to
 * src/data/pinned.generated.json, with each repo's social preview image in
 * public/pins/. Runs before `dev` and `build`.
 *
 * Pins are only exposed through the GraphQL API; see scripts/github.ts for the
 * token and for what happens when the fetch fails.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { GithubPin } from '../src/data/github-pin.ts'
import { generate, graphql, LOGIN } from './github.ts'

const OUTPUT = fileURLToPath(new URL('../src/data/pinned.generated.json', import.meta.url))
const PUBLIC = fileURLToPath(new URL('../public/', import.meta.url))

const IMAGE_TYPES: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

const QUERY = `
  query ($login: String!) {
    user(login: $login) {
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
            owner { login }
            url
            description
            primaryLanguage { name }
            repositoryTopics(first: 20) { nodes { topic { name } } }
            createdAt
            stargazerCount
            openGraphImageUrl
          }
        }
      }
    }
  }
`

interface PinNode {
  name: string
  owner: { login: string }
  url: string
  description: string | null
  primaryLanguage: { name: string } | null
  repositoryTopics: { nodes: { topic: { name: string } }[] }
  createdAt: string
  stargazerCount: number
  openGraphImageUrl: string
}

interface Response {
  user: { pinnedItems: { nodes: PinNode[] } } | null
}

/** The pins written by the last run, so previews that have not changed are not downloaded again. */
function readPrevious(): GithubPin[] {
  try {
    return JSON.parse(readFileSync(OUTPUT, 'utf8')) as GithubPin[]
  } catch {
    return []
  }
}

type Preview = Pick<GithubPin, 'image' | 'openGraphImageUrl'>

/**
 * Saves a repo's social preview under public/. The image host rate-limits hard,
 * so a failed download is not fatal: the page keeps the preview it had, or shows
 * a placeholder, and the next run tries again.
 */
async function downloadPreview(name: string, url: string, previous: GithubPin | undefined): Promise<Preview> {
  const kept = previous?.image && existsSync(PUBLIC + previous.image) ? previous : undefined
  if (kept?.openGraphImageUrl === url) return { image: kept.image, openGraphImageUrl: url }
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(15_000) })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const type = response.headers.get('content-type')?.split(';')[0] ?? ''
    const extension = IMAGE_TYPES[type]
    if (!extension) throw new Error(`unexpected content type "${type}"`)

    const image = `pins/${name}.${extension}`
    mkdirSync(dirname(PUBLIC + image), { recursive: true })
    writeFileSync(PUBLIC + image, Buffer.from(await response.arrayBuffer()))
    return { image, openGraphImageUrl: url }
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    console.warn(`fetch-pins: no ${kept ? 'new ' : ''}social preview for ${name} (${reason})`)
    // An older preview stays on record under its old URL, so the next run sees it is out of date.
    return kept ? { image: kept.image, openGraphImageUrl: kept.openGraphImageUrl } : { image: null, openGraphImageUrl: url }
  }
}

async function fetchPins(): Promise<GithubPin[]> {
  const data = await graphql<Response>(QUERY, { login: LOGIN }, 'fetch-pins')
  if (!data.user) throw new Error(`no GitHub user named ${LOGIN}`)

  const previous = readPrevious()
  return Promise.all(
    data.user.pinnedItems.nodes.map(async (node) => ({
      name: node.name,
      owner: node.owner.login,
      url: node.url,
      description: node.description,
      language: node.primaryLanguage?.name ?? null,
      topics: node.repositoryTopics.nodes.map(({ topic }) => topic.name),
      createdAt: node.createdAt,
      stars: node.stargazerCount,
      ...(await downloadPreview(
        node.name,
        node.openGraphImageUrl,
        previous.find((pin) => pin.url === node.url),
      )),
    })),
  )
}

await generate('fetch-pins', OUTPUT, fetchPins, (pins) => `${pins.length} pinned (${pins.map((pin) => pin.name).join(', ')})`)
