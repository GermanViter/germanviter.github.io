/**
 * Fetches my contribution calendar for the last year and the languages across
 * my repos, and writes them to src/data/activity.generated.json for the top of
 * the Projects page. Runs before `dev` and `build`.
 *
 * Languages only count public repos that are not forks: CI only sees public
 * repos, so counting private ones locally would make the two disagree.
 */
import { fileURLToPath } from 'node:url'
import type { ContributionLevel, GithubActivity, LanguageBytes } from '../src/data/github-activity.ts'
import { generate, graphql, LOGIN } from './github.ts'

const OUTPUT = fileURLToPath(new URL('../src/data/activity.generated.json', import.meta.url))

const QUERY = `
  query ($login: String!, $after: String) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date contributionCount contributionLevel } }
        }
      }
      repositories(first: 100, after: $after, ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC) {
        pageInfo { hasNextPage endCursor }
        nodes {
          languages(first: 20, orderBy: { field: SIZE, direction: DESC }) {
            edges { size node { name } }
          }
        }
      }
    }
  }
`

const LEVELS: Record<string, ContributionLevel> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
}

interface Response {
  user: {
    contributionsCollection: {
      contributionCalendar: {
        totalContributions: number
        weeks: { contributionDays: { date: string; contributionCount: number; contributionLevel: string }[] }[]
      }
    }
    repositories: {
      pageInfo: { hasNextPage: boolean; endCursor: string | null }
      nodes: { languages: { edges: { size: number; node: { name: string } }[] } }[]
    }
  } | null
}

async function fetchActivity(): Promise<GithubActivity> {
  const bytes = new Map<string, number>()
  let calendar: NonNullable<Response['user']>['contributionsCollection']['contributionCalendar'] | undefined
  let repos = 0
  let after: string | null = null

  // The calendar comes back with every page; only the repos need paging through.
  do {
    const data: Response = await graphql<Response>(QUERY, { login: LOGIN, after }, 'fetch-activity')
    if (!data.user) throw new Error(`no GitHub user named ${LOGIN}`)
    calendar ??= data.user.contributionsCollection.contributionCalendar

    const { nodes, pageInfo } = data.user.repositories
    repos += nodes.length
    for (const repo of nodes) {
      for (const { size, node } of repo.languages.edges) bytes.set(node.name, (bytes.get(node.name) ?? 0) + size)
    }
    after = pageInfo.hasNextPage ? pageInfo.endCursor : null
  } while (after)
  if (!calendar) throw new Error('GitHub sent no contribution calendar')

  const languages: LanguageBytes[] = [...bytes]
    .map(([name, size]) => ({ name, bytes: size }))
    .sort((a, b) => b.bytes - a.bytes)

  return {
    total: calendar.totalContributions,
    weeks: calendar.weeks.map((week) =>
      week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
        level: LEVELS[day.contributionLevel] ?? 0,
      })),
    ),
    languages,
    repos,
  }
}

await generate(
  'fetch-activity',
  OUTPUT,
  fetchActivity,
  (activity) =>
    `${activity.total} contributions, ${activity.languages.length} languages across ${activity.repos} repos`,
)
