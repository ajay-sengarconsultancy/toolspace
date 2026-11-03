
# Project Instructions

## Product
Build a founder-focused tool discovery platform with three modes:
1. Discover external tools and alternatives.
2. Use tools available directly on our platform.
3. Request missing tools and track their status.

## Stack
- Next.js
- JavaScript for the frontend
- Express.js + TypeScript for the separate backend later
- Mantine UI
- CSS Modules and global CSS
- No Tailwind CSS
- No frontend TypeScript
- No backend implementation during the frontend phases

## Design
Use the provided QUIRE reference as visual inspiration.

- Warm paper background: #F7F6F1
- Main ink: #171713
- Secondary text: #56534C
- Forest green: #1F5132
- Figtree for general typography
- Instrument Serif italic for expressive accents
- Spacious, editorial, minimal UI
- Subtle purposeful animations
- Use Hugeicons where icons are needed
- Avoid generic SaaS dashboard designs

## Development Rules
- Inspect only the files relevant to the current task.
- Reuse existing components and styles.
- Do not rewrite working code unnecessarily.
- Do not install dependencies unless required.
- Keep mock data separate from UI components.
- Do not add features outside the requested phase.
- Do not repeat completed work.
- Make the smallest reasonable implementation.
- Report only the files changed and any issues found.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
