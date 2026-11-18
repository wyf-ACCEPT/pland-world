# pland.world

Source for [**pland.world**](https://pland.world) — a personal home for research, studies, experiments, and writing by PlanD. Still under construction; published projects are linked from the homepage as they go live.

## Stack

Plain static HTML/CSS — no build step, no framework. **Cloudflare** serves this repo directly and redeploys automatically on every push to `master`.

## Layout

```
index.html                      # homepage = Research section — links out to each project
crafts/                         # Crafts section: apps PlanD built, each with a short film (crafts/media/)
assets/site.css, assets/lang.js # shared top nav, tokens and the EN / 中 language switch
favicon.svg, og.png             # site icon + link-preview card
2026-06-us-ipo-aftermarket/     # project: US IPO aftermarket study
2026-06-agentic-payment/        # project: Isometry agentic-payment research (synced — see below)
2026-07-compute-capital-markets/# project: GPU-hour index and futures field study
2026-08-gripdata-refinery/      # project: Refinery pipeline console (synced — see below)
2026-08-agent-data-market/      # project: who buys agent training data, and how it gets redacted
2026-10-token-cost-atlas/       # independent archive snapshot of the token-cost atlas
```

Each project lives in its own `YYYY-MM-topic/` folder and is fully self-contained. The homepage carries one card per project, newest first.

`2026-10-token-cost-atlas/` is a standalone snapshot of the public GPT Site's 2026-10-21 source, restyled for pland.world. It has no sync workflow. Update this archive only when PlanD explicitly requests it.

Pages are plain HTML, but nothing stops a project from shipping a compiled app: `2026-08-gripdata-refinery/` is a React bundle. Static hosting only cares that the files are served as-is — how much the page does once it reaches the browser is not this repo's problem. Such a project needs `base: './'` (relative asset paths, since it lives in a subfolder) and hash routing (no server rewrites available).

## Sections and language

The top nav has two sections: **Research** (`/`, the project cards) and **Crafts** (`/crafts/`). Both pages share `assets/site.css` and `assets/lang.js`. Bilingual strings ship as a pair of spans, `<span class="i-en">…</span><span class="i-zh">…</span>`, and `data-lang` on `<html>` hides one of them. An inline snippet in each page's `<head>` picks the language before first paint (`?lang=en|zh`, then the viewer's saved choice, then the browser language). Project pages under `YYYY-MM-topic/` don't use the switch.

Crafts films are plain MP4 files in `crafts/media/` (one per language, plus a JPG poster), served by Cloudflare Pages like everything else. Pages caps a single file at 25 MiB, so encode each film for the web first (H.264, `-crf 25 -preset slow -movflags +faststart`, AAC 128k; the current ones are 4–6 MB). If films outgrow that, move them to R2 and keep only the links here.

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
