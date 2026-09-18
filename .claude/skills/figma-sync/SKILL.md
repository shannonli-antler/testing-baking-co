---
name: figma-sync
description: >
  Synchronize the website implementation with the current Figma design.
  Use when a Figma design has changed and the corresponding website code
  needs to be updated. Reads Figma through Figma MCP, identifies relevant
  changes, updates the existing implementation, validates the changes,
  commits them to a feature branch, pushes the branch to GitHub, and
  allows Vercel to create a preview deployment.
---

# Figma Sync

Synchronize the existing website implementation with the current Figma
design.

The goal is:

Figma → Code → Validate → GitHub → Vercel Preview

## Core Principles

Figma is the source of truth for visual design.

The existing codebase is the source of truth for:

- application behavior
- business logic
- data flow
- routing
- functionality
- technical architecture

When synchronizing:

- Match the current Figma design.
- Preserve existing functionality.
- Do not rewrite unrelated code.
- Do not introduce unnecessary dependencies.
- Reuse existing components whenever possible.
- Follow the project's existing coding conventions.
- Preserve accessibility.
- Preserve responsive behavior.
- Do not deploy directly to production.
- Do not merge into the production branch automatically.

---

# Step 1 — Understand the Project

Before making changes:

1. Inspect the repository structure.
2. Read `package.json`.
3. Identify the framework.
4. Identify the styling system.
5. Identify the component architecture.
6. Identify the existing design system or design tokens.
7. Identify the application's development and validation commands.
8. Identify the production branch.
9. Identify how the repository is connected to GitHub.

Do not assume the project uses Next.js, React, Tailwind, npm, or any
other specific technology.

Use the project's existing architecture.

---

# Step 2 — Resolve the Target, Then Inspect Figma

## Invocation forms

This skill accepts a target in any of these forms:

1. **`<page name>/<frame name>`** — e.g. `/figma-sync Marketing/Hero`.
   Split on the *first* `/`. Everything before it is the page name,
   everything after is the frame (or top-level node) name.
2. **`<frame name>` alone** — e.g. `/figma-sync Hero`. No page given;
   search every page in the file for a matching top-level node.
3. **A full Figma URL** — use its `node-id` and file key directly, no
   name resolution needed.
4. **Nothing** — no page/frame/URL given. Do not guess. Ask the user
   which page/frame or URL to sync, listing the file's top-level pages
   (from the lookup below) as options.

A full URL (form 3) always wins if one is given, even alongside a
page/frame string.

## Which Figma file

Read `.claude/figma-sync.config.json` for `defaultFileKey` (and
`defaultFileUrl`, for reference/links back to the user). Use that file
key for all lookups unless the user's invocation includes a full URL
pointing at a different file, in which case use that file's key
instead. If neither the config nor the invocation supplies a file key,
ask the user for the Figma file URL before doing anything else.

## Resolution order

Resolve a `<page name>/<frame name>` or `<frame name>` target in this
order — do not skip straight to live discovery if an earlier step can
answer it, and do not re-ask the user for a URL once it's cached:

1. **Full URL given?** Use its file key and `node-id` directly. Skip
   name resolution entirely, but still do the cache write-back below
   so future invocations of this same target don't need the URL again.
2. **Check `.claude/figma-map.json` first.** This file is a cache of
   every page/frame name this skill has previously resolved, keyed
   exactly like the invocation syntax (`pages.<page>.id`,
   `pages.<page>.frames.<frame>`). Match the given name(s) against it
   case-insensitively before making any Figma API call. If found, use
   that node ID directly — this is the common case after the first
   sync of any given page, and it is immune to the staleness problem
   in step 3.
3. **Not in the cache — live discovery.** Only now call the Figma
   MCP's metadata lookup with no node ID to list the file's top-level
   pages, then (for the matching page or all pages if none was named)
   list that page's top-level children, matching names case-
   insensitively (exact match preferred, then substring) exactly as
   before. If zero or more than one candidate matches at either step,
   stop and ask the user to disambiguate — never guess.

   **Known caveat:** the "list pages" and "list top-level children"
   lookups can return stale/cached results that lag behind a page or
   frame *just* added in Figma — a node can already be fetchable
   directly by ID while it's still missing from these listing calls.
   So a zero-match result here is *not* proof the page/frame doesn't
   exist, only that it isn't in the cache and isn't in the (possibly
   stale) live listing. Say exactly that to the user, rather than
   asserting the page/frame doesn't exist, and ask for the URL as a
   one-time fallback (step 4) instead of giving up.
4. **Still not found — ask for the URL once.** Tell the user what you
   searched (cache + live listing) and ask them to paste the Figma URL
   for that page/frame. This should only ever be needed the first time
   a given page/frame is referenced.

This order is required specifically because it avoids hardcoding or
memorizing node IDs up front (names are what the user actually knows
and typed), while avoiding repeated live lookups and repeated URL
requests for anything already seen once.

## Keep the cache fresh

Whenever a target is resolved via step 1 (URL) or step 3 (live
discovery) — i.e. anything *not* already served from the cache in step
2 — update `.claude/figma-map.json` before moving on:

- Add or update the page's entry (`pages.<page name>.id`) using the
  page's actual Figma name as the key.
- Add or update the frame's entry under that page's `frames` map, keyed
  by the frame's actual Figma name.
- If the resolved URL/discovery is for a file other than the cache's
  `fileKey`, do not merge it into this cache — a cache keyed by name
  only makes sense for a single file. Tell the user their invocation
  targeted a different Figma file than the one this project is
  configured for (`.claude/figma-sync.config.json`), and ask whether
  the config should be updated to point at the new file instead.
- If a cached ID turns out to be stale (a lookup on it 404s or returns
  "node not found" — e.g. the frame was deleted or moved to a
  different file), remove that entry from the cache, re-resolve via
  live discovery or by asking the user, and write the corrected entry
  back.

This write-back is what makes "paste the Figma link" a one-time cost
per page/frame rather than a per-invocation one.

## Inspecting the resolved node

Once a single node is resolved (by name or by URL), determine the
relevant:

- layout
- dimensions
- spacing
- typography
- colors
- borders
- corner radius
- shadows
- images
- icons
- components
- component variants
- states
- responsive behavior
- design variables/tokens

Prefer structured Figma information over screenshots whenever
possible.

Do not guess a design value when the value can be obtained from Figma.

If the Figma file defines prototype interactions (click, hover, scroll,
overlays, transitions) that are relevant to the area being synced,
inspect them explicitly rather than assuming behavior from the static
layout alone — reactions are not visible in a plain layout export and
must be read separately (e.g. via the Figma MCP's programmatic/plugin
access to node `reactions`, not just design-context or screenshots).

---

# Step 3 — Find the Existing Implementation

Determine which code currently implements the Figma design.

Search the repository for:

- page components
- reusable components
- CSS
- Tailwind classes
- CSS variables
- design tokens
- images
- icons
- related routes

Prefer modifying the existing implementation.

Do not create duplicate components if an appropriate existing component
already exists.

If the relationship between the Figma design and the existing code is
unclear, investigate before editing.

---

# Step 4 — Identify Changes

Compare the current implementation with the Figma design.

Create an internal list of relevant differences involving:

- layout
- spacing
- typography
- colors
- sizing
- components
- imagery
- icons
- responsive behavior
- states
- variants

Only make changes necessary to synchronize the implementation with
Figma.

Do not make unrelated refactors.

Do not "improve" unrelated code while performing the synchronization.

---

# Step 5 — Implement the Design

Update the relevant source files.

Prioritize:

1. Existing design tokens
2. Existing reusable components
3. Existing styling utilities
4. Existing project conventions
5. New code only when necessary

If an appropriate design token already exists, reuse it.

Do not hardcode values when the project already provides an appropriate
variable or token.

Preserve:

- accessibility
- semantic HTML
- responsive behavior
- existing interactions
- existing data flow
- existing routing
- existing APIs
- existing business logic

Do not change functionality unless the Figma design explicitly requires
a functional change and the user has requested it.

---

# Step 6 — Assets

When the Figma design uses an image, icon, illustration, or other asset:

1. Check whether the asset already exists in the repository.
2. Reuse the existing asset when appropriate.
3. Check the project's existing asset conventions.
4. Only add a new asset when necessary.

Do not replace real assets with placeholders.

Do not invent assets when the appropriate asset is already available.

---

# Step 7 — Responsive Design

Inspect available Figma designs for different screen sizes.

If desktop and mobile designs exist:

- implement both
- preserve responsive behavior
- implement intentional layout changes
- do not simply scale the desktop design down

If only one viewport is available:

- preserve the existing responsive implementation
- avoid breaking other viewport sizes
- make the smallest reasonable responsive changes

---

# Step 8 — Validate

Inspect `package.json` and determine the project's available validation
commands.

Run appropriate commands such as:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Use whichever of these the project actually defines — do not assume all
of them exist, and do not add new ones just to have something to run.

If a dev server is available, start it and visually verify the changed
area in a browser (desktop and, if relevant, mobile widths) rather than
relying on the build succeeding alone. A clean build proves the code
compiles, not that it matches the design.

If validation fails:

1. Fix the failure before proceeding.
2. Do not silence, skip, or disable a check to force it to pass.
3. Do not proceed to committing broken code.

If validation succeeds, summarize what was checked before moving on.

---

# Step 9 — Commit

Once the implementation is validated:

1. Confirm the current branch is not the production branch identified
   in Step 1. If it is, create a new feature branch first (e.g.
   `figma-sync/<short-description>`) — never commit sync changes
   directly to production.
2. Stage only the files relevant to this sync. Do not stage unrelated
   in-progress work.
3. Review the staged diff before committing — confirm it only touches
   what Step 4 identified as necessary.
4. Write a commit message describing what changed and which Figma
   frame/node it was synced from.

Never commit secrets, credentials, or `.env` files, even if a broad
staging command would have picked them up.

---

# Step 10 — Push

Push the feature branch to the GitHub remote identified in Step 1.

- Push the feature branch only — never force-push, and never push
  directly to the production branch.
- If the branch has no upstream yet, set it on this push
  (`git push -u origin <branch>`), so subsequent pushes are plain
  `git push`.
- Confirm the push succeeded and report the branch name and remote URL.

If the repository has an open pull-request convention, offer to open
one against the production branch — but do not open, merge, or approve
a pull request without the user's explicit go-ahead.

---

# Step 11 — Vercel Preview

Do not trigger or configure a deployment directly.

If the repository is already connected to Vercel via its GitHub
integration, pushing the feature branch (Step 10) is sufficient —
Vercel creates the preview deployment automatically on its own. Report
back that the push happened and that a preview should appear on the
branch/PR shortly; do not fabricate or guess a preview URL.

If the repository is not connected to Vercel, say so plainly rather
than attempting to connect it yourself — connecting a project to a new
deployment target is a decision for the user to make explicitly.

Never promote a preview to production. Never merge into the production
branch as part of this skill.
