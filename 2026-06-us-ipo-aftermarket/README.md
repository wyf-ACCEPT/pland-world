# 2026-06-us-ipo-aftermarket

⚠️ **`index.html` here is GENERATED — do not hand-edit it.**

It is a copy of `dist/index.html` built in a **separate source repo**:

> **github.com/wyf-ACCEPT/us-ipo-research** (private)

That repo is the source of truth — the data pipeline and dashboard UI live
there, not here. Editing `index.html` in this hub repo will be overwritten on
the next deploy.

To change anything (UI, data, window) or to re-enable a password gate, clone
the source repo and run its deploy script:

```bash
git clone git@github.com:wyf-ACCEPT/us-ipo-research.git
cd us-ipo-research
./deploy.sh            # rebuild + copy into this hub repo + push (Cloudflare auto-redeploys)
```

`deploy.sh` assumes the two repos are sibling directories; if they're not, point
it at this hub with `PLAND_WORLD=/path/to/pland-world ./deploy.sh`. See
`MAINTAINING.md` in the source repo for the full guide.
