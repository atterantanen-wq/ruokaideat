import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

/* Yhdeksi HTML-tiedostoksi koottu versio (testiversio Claude-artifactina): npm run build:single */
export default defineConfig({
  base: "./",
  plugins: [viteSingleFile()],
  build: { target: "es2020", outDir: "dist-single", assetsInlineLimit: 100000000 },
});
