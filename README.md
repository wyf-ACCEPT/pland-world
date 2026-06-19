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
```

Each project lives in its own `YYYY-MM-topic/` folder and is fully self-contained. The homepage carries one card per project.

## Synced projects (do not hand-edit)

Some project folders are **published automatically from another repo** and should not be edited here — changes will be overwritten on the next sync. Edit the source repo instead.

| Folder | Source repo | Mechanism |
|---|---|---|
| `2026-06-agentic-payment/` | `wyf-ACCEPT/isometry-product-research` | GitHub Action copies that repo's `site/*.html` here on push to its `main`, via an SSH deploy key with write access to this repo. |

## Adding a project

1. Create a `YYYY-MM-topic/` folder with a self-contained `index.html` (plus any subpages).
2. Add a matching `.card` to `index.html` under the **Projects** section, linking to `/YYYY-MM-topic/`.
3. Push to `master` — Cloudflare deploys it.

For a project authored in a separate repo, wire up a sync Action + deploy key instead of committing its pages here directly.
