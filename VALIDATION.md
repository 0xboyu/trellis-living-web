# Verification of the frozen publication package

- **18 core tests passed** with `node source/test.js` against the copied source.
- The exact root `index.html` passed the full adapt → hold → approve → rollback flow in Chromium with the browser set offline. The live price remained $49 while held, became $29 after approval, and returned to $49 in v4. All four ledger events remained present.
- The offline run produced **zero requests** and **zero uncaught JavaScript errors**.
- Root HTML has no external script tags, external stylesheets, or ES modules. Its CSS and classic scripts are inline.
- Root HTML and every original source file are byte-for-byte copies of the completed demo. No features were added.
- The original demo also passed 12 browser checks covering rejection, stale approvals, JSON export, reset, responsive layouts, and zero external requests.
- The prepared package contains only explicitly selected application source and documentation. No environment files, credential files, Git configuration, screenshots, browser profiles, or runtime logs are included. A secret-signature scan found no matches.

The cloud browser blocks direct `file://` navigation administratively. Offline verification used the exact HTML document loaded into Chromium. The app requires no server or asset requests.

The approved public repository is https://github.com/0xboyu/trellis-living-web. The frozen application and its source were successfully pushed to `main`. The builder enabled GitHub Pages from `main` at `/ (root)` using website settings.

Live demo: https://0xboyu.github.io/trellis-living-web/.

The repository and live demo returned HTTP 200. The deployed HTML matched the tested root HTML byte for byte (SHA-256: `e1c4feaee936ed8e0be441d783d3e21387b96a30f850aa36e304e08f15a849e4`). Chromium exercised the actual public URL: Enterprise auto-applied as v2; Discount held with the live price still $49; approval applied $29 as v3; rollback restored $49 as v4 and retained all four events. No uncaught JavaScript errors or external asset/API requests occurred.
