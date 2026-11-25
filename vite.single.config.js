import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

/* Yhdeksi HTML-tiedostoksi koottu versio (testiversio Claude-artifactina): npm run build:single */
export default defineConfig({
  base: "./",
  // testiversiossa ei ole version.json:ia, joten päivitysilmoitus on pois päältä
  define: { __BUILD_ID__: JSON.stringify("") },
  plugins: [
    viteSingleFile(),
    {
      // testiversio ei ole kotinäytölle lisättävä sovellus: pois manifest ja kotinäytön kuvake (eivät olisi tiedostossa mukana)
      name: "no-home-screen",
      transformIndexHtml: (html) => html.replace(/\s*<link rel="(apple-touch-icon|manifest)"[^>]*>/g, ""),
    },
  ],
  build: { target: "es2020", outDir: "dist-single", assetsInlineLimit: 100000000 },
});
