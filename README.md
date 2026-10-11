# Trellis — The Supervision Layer for the Living Web

Every change should be visible, risk-gated, and reversible.

Trellis pairs RelayOps, a fictional SaaS landing page, with a supervision dashboard. Visitor scenarios propose changes to a JSON PageSpec. A real diff and deterministic policy engine auto-apply safe presentation changes, hold protected changes for human review, and maintain reversible versions with a complete session ledger.

## Run

Double-click the root `index.html`. It contains all CSS and classic JavaScript inline. No API keys, server, database, network requests, installation, external dependencies, frameworks, or build process.

The same file runs unchanged on GitHub Pages. Designed for a 1440px laptop; smaller screens can scroll and phones use a stacked layout.

## Demonstrate

1. **Enterprise Buyer:** headline, CTA copy, feature priorities, and section order adapt automatically; v1 becomes v2.
2. **Discount Campaign:** proposes $49 → $29 and campaign copy. The entire proposal is held; live pricing and copy remain unchanged.
3. **Approve proposal:** applies the changes together as v3. **Reject** keeps the page unchanged.
4. **Rollback:** restores the previous approved contents, including $49, as new version v4. All ledger events remain available.

The right panel scrolls to reveal review actions and ledger details. Indie Developer provides a second safe adaptation. Agent View previews and downloads the current structured PageSpec; it is not a live agent API.

Approvals must match the current page version. Repeated no-op proposals do not create new versions. Unknown or invalid modifications are rejected. Protected fields include pricing, billing terms, legal claims, guarantees, CTA destinations, and section deletion. Mixed proposals are held atomically.

Reset explicitly clears demonstration history and restores v1. State is held in memory; refreshing also starts a new session. History survives rollback within the session. The policy protects typed properties rather than semantically classifying arbitrary prose.

## AI disclosure

**AI-authored scenarios · deterministic replay · real policy and versioning logic · no live inference.**

Codex authored the scenarios during development. No LLM is called at runtime. Validation, diffs, policy decisions, approvals, and rollback are actual executable code.

## Source and tests

- `index.html`: self-contained publication artifact.
- `source/index.html`, `source/style.css`, `source/app.js`: original application source.
- `source/trellis-core.js`: shared browser/Node business logic.
- `source/test.js`: dependency-free automated tests.
- `DEMO.md`: 90-second script and submission copy.
- `VALIDATION.md`: actual verification results.

Run the core tests from the repository root:

```sh
node source/test.js
```

The source application also runs directly by opening `source/index.html`. No build step is required for either copy.

## GitHub Pages

Use **Settings → Pages → Deploy from a branch → main → / (root) → Save**. The root `index.html` is ready to serve. `.nojekyll` marks the repository as plain static content.

See `PUBLISH.md` for browser-only upload instructions. No competition entry is submitted automatically.
