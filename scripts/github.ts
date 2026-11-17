/**
 * What the build-time fetch scripts share: a token, a GraphQL call, and the
 * rule for what to do when GitHub cannot be reached.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

export const LOGIN = 'GermanViter'

/** GITHUB_TOKEN or GH_TOKEN if set (CI), otherwise whatever `gh` is logged in with. */
function findToken(): string {
  const fromEnv = process.env.GITHUB_TOKEN || process.env.GH_TOKEN
  if (fromEnv) return fromEnv
  try {
    return execFileSync('gh', ['auth', 'token'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch {
    throw new Error('no GitHub token: set GITHUB_TOKEN, or log in with `gh auth login`')
  }
}

/** Runs a query against the GraphQL API, which always needs a token, even for public data. */
export async function graphql<T>(query: string, variables: Record<string, unknown>, agent: string): Promise<T> {
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${findToken()}`,
      'Content-Type': 'application/json',
      'User-Agent': agent,
    },
    body: JSON.stringify({ query, variables }),
    signal: AbortSignal.timeout(15_000),
  })
  if (!response.ok) throw new Error(`GitHub answered HTTP ${response.status}`)

  const { data, errors } = (await response.json()) as { data?: T; errors?: { message: string }[] }
  if (errors?.length) throw new Error(errors.map((error) => error.message).join('; '))
  if (!data) throw new Error('GitHub sent no data')
  return data
}

/**
 * Fetches and writes one generated JSON file.
 *
 * If the fetch fails and an earlier copy of the file exists, a local run keeps
 * it and carries on, so working offline still works. CI always fails instead:
 * better to keep the last deploy than to publish stale data.
 */
export async function generate<T>(name: string, output: string, fetchData: () => Promise<T>, summary: (data: T) => string) {
  try {
    const data = await fetchData()
    const json = `${JSON.stringify(data, null, 2)}\n`
    // Leave the file alone when nothing changed, so the dev server does not reload for nothing.
    if (!existsSync(output) || readFileSync(output, 'utf8') !== json) {
      mkdirSync(dirname(output), { recursive: true })
      writeFileSync(output, json)
    }
    console.log(`${name}: ${summary(data)}`)
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    if (process.env.CI || !existsSync(output)) {
      console.error(`${name}: ${reason}`)
      process.exit(1)
    }
    console.warn(`${name}: ${reason}. Keeping the data from the last successful fetch.`)
  }
}
