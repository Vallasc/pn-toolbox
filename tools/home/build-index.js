import { cp, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const toolsRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = resolve(toolsRoot, "..");
const outputRoot = resolve(repoRoot, "_site");

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

const entries = [];
for (const item of await readdir(toolsRoot, { withFileTypes: true })) {
  if (!item.isDirectory()) continue;

  const toolDirectory = resolve(toolsRoot, item.name);
  const files = await readdir(toolDirectory);
  if (!files.includes("site-tool.json")) continue;

  const metadata = JSON.parse(await readFile(resolve(toolDirectory, "site-tool.json"), "utf8"));
  if (typeof metadata.name !== "string" || typeof metadata.description !== "string") {
    throw new TypeError(`${item.name}/site-tool.json must define string name and description fields`);
  }
  entries.push({ ...metadata, path: item.name });
}

entries.sort((left, right) => left.name.localeCompare(right.name, "it"));

const cards = entries.map(({ name, description, path }) => `
          <a class="tool-card" href="./tools/${encodeURIComponent(path)}/">
            <span>
              <strong>${escapeHtml(name)}</strong>
              <span class="tool-description">${escapeHtml(description)}</span>
            </span>
            <span class="arrow" aria-hidden="true">→</span>
          </a>`).join("");
const template = await readFile(resolve(toolsRoot, "home/index.html"), "utf8");
if (!template.includes("<!-- TOOL_CARDS -->")) {
  throw new Error("The tools/home/index.html template is missing the TOOL_CARDS marker");
}

await mkdir(outputRoot, { recursive: true });
await writeFile(resolve(outputRoot, "index.html"),
  template.replace("<!-- TOOL_CARDS -->", cards));
await cp(resolve(toolsRoot, "home/home.css"), resolve(outputRoot, "home.css"));
