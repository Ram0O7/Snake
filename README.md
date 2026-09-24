# Snake Arcade

A dependency-free, responsive Snake game. Vanilla HTML, CSS and JavaScript; no runtime packages, account, tracking, remote fonts or audio downloads. Sound is synthesized only when enabled.

## Run and test

Requires Node.js 20+ for build/tests and Python 3 for this preview command:

```sh
node --test
node scripts/build.mjs
python -m http.server 4173
```

Open http://localhost:4173/ (source) or http://localhost:4173/dist/ (deployment build). Use a web server: JavaScript modules do not reliably load through file:// URLs.

## Gameplay

Arrow keys / WASD / swipe / direction buttons move. Enter starts or retries. Space or Pause pauses/resumes. Switching tabs automatically pauses. Three paces have separate browser-local records. Every apple gives 10 points. Walls and the snake's body end the run; filling the board wins. Two buffered turns allow quick corners without an illegal reversal. Scores tolerate unavailable browser storage.

`engine.js` contains pure rules; `game.js` handles rendering, inputs, sound and persistence. `tests/engine.test.mjs` covers eating, turn buffering, collisions, moving into the departing tail, pausing and winning.

## Deploy

### Recommended: Cloudflare Pages with Git integration

1. Push this repository to GitHub when ready.
2. In Cloudflare, go to Workers & Pages, create a Pages project, and import this repository.
3. Choose your production branch. Framework preset: None. Build command: `npm run build`. Output directory: `dist`. Root directory: repository root (the Snake repository itself).
4. Set environment variable `SITE_URL` to the final public HTTPS address, including any path, for example `https://your-project.pages.dev/` or your custom domain. This is a placeholder example; use your actual address. Redeploy after changing it.
5. Add any custom domain through the project's Custom domains settings before updating DNS. An apex domain requires Cloudflare nameservers; a subdomain can use a CNAME with an external DNS provider.
6. Test gameplay, HTTPS, canonical URL and sitemap on the deployed site.

The build copies only active website files into dist, excluding the old media and unused legacy scripts. `_headers` applies basic security headers on Cloudflare. Git integration provides automatic deployments and pull-request previews. Cloudflare's integration choice has limitations: a Git-integrated project cannot later switch to Direct Upload; choose your workflow at project creation.

Official setup: https://developers.cloudflare.com/pages/framework-guides/deploy-anything/
Git workflow: https://developers.cloudflare.com/pages/get-started/git-integration/
Custom domains: https://developers.cloudflare.com/pages/configuration/custom-domains/

### Keep GitHub Pages

This works as-is with branch deployment from repository root. Relative asset URLs support the `/Snake/` project path, and `.nojekyll` prevents Jekyll processing. The source canonical URL currently assumes `https://ram0o7.github.io/Snake/`, based on the repository origin; confirm it matches your actual Pages settings. If you use a different domain, update the source URLs or deploy the output of the build with `SITE_URL` configured using a GitHub Actions Pages workflow. Do not publish with a canonical URL pointing to an abandoned domain.

GitHub Pages is sufficient for this game; moving hosts alone does not improve search ranking. It supports custom domains and HTTPS, with published service limits: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits

### Cloudflare Direct Upload

For manual publishing, build locally and upload the **contents of dist** using Pages Direct Upload. Set `SITE_URL` before building. This is convenient for occasional releases; Git integration is preferable for ongoing development.

https://developers.cloudflare.com/pages/get-started/direct-upload/

## SEO and migration checklist

- Descriptive title and description, semantic headings, English language declaration, crawlable instructions/FAQs, canonical URL, Open Graph metadata, VideoGame JSON-LD and sitemap are included. Structured data makes no invented rating claims or guarantee of rich results.
- The default production URL is `https://ram0o7.github.io/Snake/`. `SITE_URL` rewrites the canonical, Open Graph URL, JSON-LD URL, sitemap entry and robots sitemap reference together in the build output.
- A robots.txt only applies at the host root. GitHub project Pages serves this file under `/Snake/robots.txt`, which is not the host robots file; submit `/Snake/sitemap.xml` directly in Search Console and check the host-level robots rules. On a Cloudflare root deployment it is served at `/robots.txt` normally.
- Verify the final property in Google Search Console and Bing Webmaster Tools, submit the sitemap, and request indexing for the homepage. Check indexability and HTTPS after launch. Indexing and ranking are not guaranteed, and this version is English-language, not translated.
- Prefer a stable custom domain. If keeping the same domain during a hosting move, preserve paths. If changing addresses, configure permanent redirects where you control the old host. GitHub Pages does not offer arbitrary server-side redirect rules; an HTML forwarding page with the new canonical is a fallback, not equivalent to an HTTP 301.
- Redirect the production pages.dev alias to the custom domain once configured. Retain Cloudflare's default noindex behavior for preview deployments; verify its response headers.
- This app saves records by browser origin. A move to a new domain will not carry over local best scores automatically.

Google developer SEO guidance: https://developers.google.com/search/docs/fundamentals/get-started-developers

## Verification

Seven Node tests cover core game rules. Browser checks cover startup, pause/resume and game-over/retry; responsive layout is checked at desktop and phone widths. Public-host behavior and search indexing must be verified after deployment.
