# Gated

Content locker designer — Nuxt + Whop Frosted UI.

## Live site (GitHub Pages)

**https://airport.github.io/gated/home**

> If that 404s: GitHub → **Settings → Pages → Build and deployment**  
> - Source: **Deploy from a branch**  
> - Branch: `main` → folder **`/docs`** → Save  
> Or Source: **GitHub Actions** (workflow already included).  
> Private repos need GitHub Pro for Pages, or make the repo public.

## Local

```bash
pnpm install
pnpm dev
```

## Deploy Pages manually

```bash
pnpm generate:pages
pnpm pages:sync
git add docs && git commit -m "Update Pages build" && git push
```
