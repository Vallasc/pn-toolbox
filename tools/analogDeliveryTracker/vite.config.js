import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  base: process.env.PAGES_BASE_PATH ?? "./",
  plugins: [tailwindcss()],
  build: {
    outDir: resolve(root, "../../_site/tools/analogDeliveryTracker"),
    emptyOutDir: true,
  },
});
