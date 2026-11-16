/**
 * One repo pinned on my GitHub profile, as written to `pinned.generated.json`
 * by `scripts/fetch-pins.ts`. Shared by that script and the site, so the two
 * cannot drift apart.
 */
export interface GithubPin {
  name: string
  /** Pins can live on someone else's account (a teammate's hackathon repo). */
  owner: string
  url: string
  description: string | null
  language: string | null
  topics: string[]
  /** ISO 8601 */
  createdAt: string
  stars: number
  /** Where `image` was downloaded from. */
  openGraphImageUrl: string
  /**
   * The social preview, downloaded to `public/` so the site does not depend on
   * GitHub's rate-limited image host. A path relative to the site root, or null
   * if the download failed.
   */
  image: string | null
}
