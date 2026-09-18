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

# Step 2 — Inspect Figma

Use the configured Figma MCP to inspect the relevant Figma design.

If the user provides a Figma URL, use that URL.

If the user identifies a specific:

- page
- frame
- section
- component
- screen
- variant

inspect that area first.

Determine the relevant:

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
