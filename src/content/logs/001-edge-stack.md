---
title: "Scaffolding Astro into an existing GitHub Pages repo"
description: "Installing Astro into a non-empty repository on WSL without losing the CNAME file or the existing Git history."
pubDate: "2026-06-25"
status: "stable"
slug: "astro-on-github-pages"
---

The repo behind this domain already existed as a single `index.html` served by GitHub Pages, with a `CNAME` file at the root mapping the apex to the site. Replacing that with Astro meant getting a scaffolder to run inside a directory it considers unsafe to touch, and keeping the custom domain working through the switch.

## Stack

| Component | Version | Notes |
| --- | --- | --- |
| Astro | 7.x | Static output, no adapter |
| Node.js | 22.12+ | Installed via NVM inside WSL |
| Workspace | Ubuntu on WSL 2 | Repo on the Linux filesystem, not `/mnt/c` |
| Host | GitHub Pages | Source set to GitHub Actions |
| DNS / TLS | Cloudflare | Full (strict) |

## Procedure

1. **Put the repo on the Linux filesystem.** Working out of `/mnt/c` means every file read crosses the 9P translation layer, and `npm install` on a Windows drive from WSL is roughly an order of magnitude slower. The repo lives under `~`.

2. **Scaffold into a subdirectory.** `create-astro` refuses to run in a non-empty directory and there is no flag to override it. Build it somewhere clean and move the result in:

   ```bash
   npm create astro@latest temp-build -- --template minimal --no-install --no-git
   rm -rf temp-build/node_modules
   cp -r temp-build/. .
   rm -rf temp-build
   npm install
   ```

3. **Move `CNAME` into `public/`.** Anything in `public/` is copied to `dist/` unmodified, which is the only way the file survives a build. At the repo root it gets ignored and the custom domain drops on the next deploy.

   ```bash
   git mv CNAME public/CNAME
   ```

4. **Switch the Pages source to GitHub Actions.** Under Settings → Pages. Left on "Deploy from a branch", Pages runs Jekyll against the repo and publishes that instead of the Astro build, regardless of what the workflow produces.

## Gotchas

- **The branch name has to match the workflow trigger.** The repo defaulted to `master`; the workflow triggers on `main`. Pushing produced `src refspec main does not match any` until the local branch was renamed with `git branch -m master main`.

- **A classic PAT or password won't push a workflow file.** Updating anything under `.github/workflows/` requires a fine-grained token with **Workflows: read and write**. Without it the push is rejected after the objects have already transferred, which makes it look like a network failure rather than a permissions one.

- **Verify `CNAME` in the build output, not in the repo.** `ls dist/CNAME` after every structural change. The failure mode is silent: the deploy succeeds, and the site starts serving on `<username>.github.io` while the apex 404s.
