import resume from '../../resume.yaml'
import { SPRITES, type SpriteName } from '../pixel/sprites'

export interface Job {
  id: string
  role: string
  company: string
  period: string
  current: boolean
  sprite: SpriteName
  duties: string[]
}

/** The part of a JSON Resume `work` entry the site uses, plus my `x-` keys. */
interface WorkEntry {
  name: string
  position: string
  startDate?: string
  endDate?: string
  highlights?: string[]
  'x-sprite'?: string
  'x-en'?: { position?: string; highlights?: string[] }
}

/**
 * Picks a sprite from what the job is, when resume.yaml does not name one.
 * Matched against the position and company, lowercased and without accents.
 * First match wins, so the more specific patterns come first.
 */
const spriteKeywords: [RegExp, SpriteName][] = [
  [/\bmath/, 'pi'],
  [/\b(secur|guard|gardien|surveill)/, 'shield'],
  [/\b(sauvet|lifeguard|piscine|natation|swim)/, 'lifebuoy'],
  [/\b(develop|program|logiciel|software|informatique|devops)|\b(web|it|ti|data)\b/, 'computer'],
  [/\b(restaura|cafe|coffee|tim hortons|starbucks|cuisin|cook|serveu|waiter|barista|food|plongeu)/, 'coffee'],
  [/\b(tutor|enseign|teach|prof|educat|animat|moniteur)/, 'book'],
  [/\b(caiss|cashier|vente|vendeu|retail|commis|magasin|store|epicerie)/, 'cart'],
  [/\b(techni|maintenance|repar|repair|mecani|entretien)/, 'wrench'],
  [/\b(entrepot|warehouse|livr|deliver|manutention|logisti)/, 'box'],
]

const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()

function isSprite(name: string): name is SpriteName {
  return Object.hasOwn(SPRITES, name)
}

function spriteFor(entry: WorkEntry): SpriteName {
  const requested = entry['x-sprite']
  if (requested) {
    if (isSprite(requested)) return requested
    console.warn(`resume.yaml: unknown x-sprite "${requested}" for ${entry.name}, picking one from the position`)
  }
  const text = normalize(`${entry.position} ${entry['x-en']?.position ?? ''} ${entry.name}`)
  return spriteKeywords.find(([pattern]) => pattern.test(text))?.[1] ?? 'briefcase'
}

const monthYear = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })

/** "2022-10" → "Oct 2022", "2022" → "2022". */
function formatDate(date: string): string {
  const [year, month] = date.split('-').map(Number)
  if (!month) return String(year)
  return monthYear.format(new Date(Date.UTC(year, month - 1)))
}

function periodOf({ startDate, endDate }: WorkEntry): string {
  if (!endDate) return startDate ? `Since ${formatDate(startDate)}` : 'Present'
  if (!startDate || startDate === endDate) return formatDate(endDate)
  return `${formatDate(startDate)} – ${formatDate(endDate)}`
}

const slug = (text: string) =>
  normalize(text)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const isString = (value: unknown): value is string => typeof value === 'string'
const isStrings = (value: unknown): value is string[] => Array.isArray(value) && value.every(isString)
const isOptional = <T>(value: unknown, check: (value: unknown) => value is T) => value === undefined || check(value)
const isDate = (value: unknown) => isString(value) && /^\d{4}(-\d{2})?$/.test(value)

/** Fails the build on a malformed entry rather than publishing a broken page. */
function checkEntry(value: unknown, index: number): WorkEntry {
  const entry = value as Record<string, unknown>
  const english = entry?.['x-en'] as Record<string, unknown> | undefined
  const problems = [
    !isString(entry?.name) && 'name must be text',
    !isString(entry?.position) && 'position must be text',
    !isOptional(entry?.highlights, isStrings) && 'highlights must be a list of text',
    entry?.startDate !== undefined && !isDate(entry.startDate) && 'startDate must be "YYYY-MM" or "YYYY", in quotes',
    entry?.endDate !== undefined && !isDate(entry.endDate) && 'endDate must be "YYYY-MM" or "YYYY", in quotes',
    !isOptional(entry?.['x-sprite'], isString) && 'x-sprite must be a sprite name',
    english !== undefined && (typeof english !== 'object' || english === null) && 'x-en must be a mapping',
    !isOptional(english?.position, isString) && 'x-en.position must be text',
    !isOptional(english?.highlights, isStrings) && 'x-en.highlights must be a list of text',
  ].filter(isString)
  if (problems.length) throw new Error(`resume.yaml: work entry ${index + 1}: ${problems.join('; ')}`)
  return entry as unknown as WorkEntry
}

function readWork(data: unknown): WorkEntry[] {
  const work = (data as { work?: unknown } | null)?.work
  if (!Array.isArray(work)) throw new Error('resume.yaml: `work` must be a list')
  return work.map(checkEntry)
}

/** Paid work, in the order of resume.yaml (most recent first). English text when there is some. */
export const jobs: Job[] = readWork(resume).map((entry) => ({
  id: slug(entry.name),
  role: entry['x-en']?.position ?? entry.position,
  company: entry.name,
  period: periodOf(entry),
  current: !entry.endDate,
  sprite: spriteFor(entry),
  duties: entry['x-en']?.highlights ?? entry.highlights ?? [],
}))
