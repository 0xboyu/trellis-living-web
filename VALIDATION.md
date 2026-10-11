# Verification of the frozen publication package

- **18 core tests passed** with `node source/test.js` against the copied source.
- The exact root `index.html` passed the full adapt → hold → approve → rollback flow in Chromium with the browser set offline. The live price remained $49 while held, became $29 after approval, and returned to $49 in v4. All four ledger events remained present.
- The offline run produced **zero requests** and **zero uncaught JavaScript errors**.
- Root HTML has no external script tags, external stylesheets, or ES modules. Its CSS and classic scripts are inline.
- Root HTML and every original source file are byte-for-byte copies of the completed demo. No features were added.
- The original demo also passed 12 browser checks covering rejection, stale approvals, JSON export, reset, responsive layouts, and zero external requests.
- The prepared package contains only explicitly selected application source and documentation. No environment files, credential files, Git configuration, screenshots, browser profiles, or runtime logs are included. A secret-signature scan found no matches.

The cloud browser blocks direct `file://` navigation administratively. Offline verification used the exact HTML document loaded into Chromium. The app requires no server or asset requests.

GitHub's authenticated user endpoint successfully returned `0xboyu`. The builder explicitly approved public repository creation and GitHub Pages. The creation request then returned HTTP 403, `Resource not accessible by integration`: this connection cannot create a repository. No remote repository or Pages deployment has been created. The prepared source can be uploaded through GitHub's website, or pushed after the builder creates an accessible repository.
