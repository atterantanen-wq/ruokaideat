import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

/* Yhdeksi HTML-tiedostoksi koottu versio (testiversio Claude-artifactina): npm run build:single */
export default defineConfig({
  base: "./",
  // testiversiossa ei ole version.json:ia, joten päivitysilmoitus on pois päältä
  define: { __BUILD_ID__: JSON.stringify("") },
  plugins: [viteSingleFile()],
  build: { target: "es2020", outDir: "dist-single", assetsInlineLimit: 100000000 },
});
