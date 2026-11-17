/**
 * My GitHub activity, as written to `activity.generated.json` by
 * `scripts/fetch-activity.ts`. Shared by that script and the site, so the two
 * cannot drift apart.
 */

/** 0 is no contributions; 1 to 4 are GitHub's quartiles, as on the profile page. */
export type ContributionLevel = 0 | 1 | 2 | 3 | 4

export interface ContributionDay {
  /** YYYY-MM-DD, in the profile's own time zone. */
  date: string
  count: number
  level: ContributionLevel
}

export interface LanguageBytes {
  name: string
  /** Lines of code are not exposed; GitHub measures languages in bytes. */
  bytes: number
}

export interface GithubActivity {
  /** Contributions in the last year, as the profile page counts them. */
  total: number
  /** Sunday-first weeks, oldest first. The first and last weeks can be partial. */
  weeks: ContributionDay[][]
  /** Summed across my public repos that are not forks, largest first. */
  languages: LanguageBytes[]
  /** How many repos `languages` was summed across. */
  repos: number
}
