import type { ContributionDay, GithubActivity } from './github-activity'
import fetchedActivity from './activity.generated.json'
import { hueOf } from './projects'

const activity = fetchedActivity as GithubActivity

export const contributions = {
  total: activity.total,
  weeks: activity.weeks,
}

/** Calendar dates carry no time zone, so read and format them as UTC to keep the day they name. */
const parse = (date: string) => new Date(`${date}T00:00:00Z`)
const dayFormat = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' })
const monthFormat = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' })

export const formatDay = (date: string) => dayFormat.format(parse(date))

/** A month label for the week where that month starts, as GitHub draws them. */
export interface MonthLabel {
  week: number
  label: string
}

/** A column is labeled when its Sunday falls in a different month than the column before. */
const monthStarts: MonthLabel[] = activity.weeks.flatMap((week, index) => {
  const month = parse(week[0].date).getUTCMonth()
  const previous = index > 0 ? parse(activity.weeks[index - 1][0].date).getUTCMonth() : undefined
  return month === previous ? [] : [{ week: index, label: monthFormat.format(parse(week[0].date)) }]
})

/** A label is three columns wide: one that close to the next would overlap it. */
export const months: MonthLabel[] = monthStarts.filter(
  (month, index) => index === monthStarts.length - 1 || monthStarts[index + 1].week - month.week >= 3,
)

function longestRun(days: ContributionDay[]): number {
  let best = 0
  let run = 0
  for (const day of days) {
    run = day.count > 0 ? run + 1 : 0
    best = Math.max(best, run)
  }
  return best
}

/** Days in a row up to today. A quiet today does not break it yet: the day is not over. */
function currentRun(days: ContributionDay[]): number {
  const end = days.at(-1)?.count === 0 ? days.length - 1 : days.length
  let run = 0
  for (let index = end - 1; index >= 0 && days[index].count > 0; index--) run++
  return run
}

const days = activity.weeks.flat()
const busiest = days.reduce<ContributionDay | undefined>((best, day) => (!best || day.count > best.count ? day : best), undefined)

export const stats = {
  activeDays: days.filter((day) => day.count > 0).length,
  days: days.length,
  longestStreak: longestRun(days),
  currentStreak: currentRun(days),
  busiest,
}

export interface LanguageSlice {
  name: string
  share: number
  /** A palette color name, as in `var(--blue)`. */
  hue: string
}

/** How many languages get a slice of their own; the rest are lumped into "Other". */
const SLICES = 7

const totalBytes = activity.languages.reduce((sum, language) => sum + language.bytes, 0)

/** The pie, largest slice first. Shares add up to 1. */
export const languages: LanguageSlice[] = (() => {
  if (totalBytes === 0) return []
  const top = activity.languages.slice(0, SLICES).map((language) => ({
    name: language.name,
    share: language.bytes / totalBytes,
    hue: hueOf(language.name),
  }))
  const rest = activity.languages.slice(SLICES).reduce((sum, language) => sum + language.bytes, 0)
  return rest > 0 ? [...top, { name: 'Other', share: rest / totalBytes, hue: 'overlay0' }] : top
})()

export const languageRepos = activity.repos
