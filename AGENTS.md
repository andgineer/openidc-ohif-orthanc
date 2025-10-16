# Repository Guidelines

## Project Structure & Module Organization
Source and configuration live under `docker/`. The `docker/ohif/` directory holds the OpenResty + OHIF image (Dockerfile, `nginx.conf`, Lua include snippets, and `ohif.js` SPA config). PACS settings reside in `docker/orthanc/orthanc.json`. Runtime secrets load from `openid-keycloak-secrets.env`, while `nginxenv/ssl/` stores local certificates. Docker-managed volumes (e.g., `volumes/orthanc-db/`) are created at runtime and should stay untracked.

## Build, Test, and Development Commands
Use `docker-compose up --build` to build the OpenResty image and start Keycloak, Orthanc, and the viewer. Stream logs with `docker-compose logs -f viewer` when validating auth flows. After editing nginx or Lua snippets, run `docker-compose exec viewer openresty -t` to lint the config before reloading. `docker-compose restart viewer` reloads the gateway without disturbing Postgres or Orthanc. Tear down the stack with `docker-compose down` and add `-v` only when you intend to drop Orthanc data.

## Coding Style & Naming Conventions
Match existing indentation: two spaces for `ohif.js`, four spaces inside nginx blocks, and compact JSON in `orthanc.json`. Keep environment keys uppercase snake case (`OPENID_CLIENT_SECRET`). Place reusable nginx logic in the include files already referenced by `nginx.conf`. Comment only when the intent is non-obvious, especially for auth rules or proxy rewrites.

## Testing Guidelines
There are no automated unit tests; verification happens through the running stack. After changes, ensure `openresty -t` passes, launch the environment, authenticate via Keycloak, and confirm the OHIF viewer loads studies from `/pacs/series`. For Orthanc changes, upload a sample DICOM via `/pacs-admin/` and confirm it appears in the viewer. Capture screenshots of key UI states when reporting results.

## Commit & Pull Request Guidelines
Existing history favors short, imperative commit subjects (`readme`, `move auth code`). Follow that style and group related config edits together. PRs should summarize the service touched (viewer, Orthanc, Keycloak), list verification steps, link any tracking issue, and attach relevant log excerpts or screenshots for authentication flows.

## Security & Configuration Tips
Store real client secrets only in local `.env` files and never commit them. Replace the development SSL materials under `nginxenv/ssl/` before production testing. When rotating credentials, update both the Keycloak client and `openid-keycloak-secrets.env`, then restart the viewer to propagate changes.
