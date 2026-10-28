# Tools home

`build-index.js` scans the immediate child folders of `tools/` for
`site-tool.json` and generates the site homepage in `_site/index.html`.
Each entry provides a tool's display `name` and `description`; its folder name
becomes the `/tools/<folder>/` URL.

To publish another tool independently:

1. Add its self-contained project folder under `tools/`, including its own
   `package.json`, lockfile, build configuration, and `site-tool.json`.
2. Configure its build output as `_site/tools/<folder>/` and use relative asset
   URLs (Vite: `base: "./"`), so it works under any Pages path or custom domain.
3. Keep the build command as `npm run build`; the Pages workflow installs and
   builds each folder that has a `site-tool.json`.

The home generator uses only Node.js built-ins and does not share dependencies
with the tools.
