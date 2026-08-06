# pland.world

Source for [**pland.world**](https://pland.world) — a personal home for research, studies, experiments, and writing by PlanD. Still under construction; published projects are linked from the homepage as they go live.

## Stack

Plain static HTML/CSS — no build step, no framework. **Cloudflare** serves this repo directly and redeploys automatically on every push to `master`.

## Layout

```
index.html                      # homepage — links out to each project
favicon.svg, og.png             # site icon + link-preview card
2026-06-us-ipo-aftermarket/     # project: US IPO aftermarket study
2026-06-agentic-payment/        # project: Isometry agentic-payment research (synced — see below)
2026-07-compute-capital-markets/# project: GPU-hour index and futures field study
2026-08-gripdata-refinery/      # project: Refinery pipeline console (synced — see below)
```

Each project lives in its own `YYYY-MM-topic/` folder and is fully self-contained. The homepage carries one card per project, newest first.

Pages are plain HTML, but nothing stops a project from shipping a compiled app: `2026-08-gripdata-refinery/` is a React bundle. Static hosting only cares that the files are served as-is — how much the page does once it reaches the browser is not this repo's problem. Such a project needs `base: './'` (relative asset paths, since it lives in a subfolder) and hash routing (no server rewrites available).

## Synced projects (do not hand-edit)

Some project folders are **published automatically from another repo** and should not be edited here — changes will be overwritten on the next sync. Edit the source repo instead.

| Folder | Source repo | Mechanism |
|---|---|---|
| `2026-06-agentic-payment/` | `wyf-ACCEPT/isometry-product-research` | Action copies that repo's `site/*.html` here on push to its `main`. |
| `2026-08-gripdata-refinery/` | `wyf-ACCEPT/gripdata-refinery` | Action runs `pnpm build` there and rsyncs `dist/` here on push to its `main`. |

Both use the same SSH deploy key, `pland.world sync (shared)`, registered on this repo with write access. Its private half lives at `~/.ssh/id_ed25519_pland_world` and is stored as the `PLAND_WORLD_DEPLOY_KEY` secret in each source repo. One shared key rather than one per project: the blast radius of losing it is a page that stops updating, and a key per project is a key nobody keeps track of.

## Adding a project

1. Create a `YYYY-MM-topic/` folder with a self-contained `index.html` (plus any subpages).
2. Add a matching `.card` to `index.html` at the top of the **Projects** section, linking to `/YYYY-MM-topic/`.
3. Push to `master` — Cloudflare deploys it.

For a project authored in a separate repo, wire up a sync Action instead of committing its pages here directly: copy `PLAND_WORLD_DEPLOY_KEY` into that repo's Actions secrets, then adapt one of the workflows above. Have the copy step use `rsync -a --delete` if the build hashes its filenames, or the folder will accumulate every past build.
