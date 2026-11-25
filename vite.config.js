import { defineConfig } from "vite";

/* versiotunnus: julkaistu sovellus vertaa omaansa version.json:iin ja ilmoittaa uudesta versiosta (src/app/update.js) */
const BUILD_ID = (process.env.GITHUB_SHA || "").slice(0, 12) || Date.now().toString(36);

export default defineConfig(({ command }) => ({
  // suhteelliset polut, jotta build toimii myös alihakemistossa (esim. GitHub Pages)
  base: "./",
  // kehitystilassa tarkistus on pois päältä (tyhjä tunnus)
  define: { __BUILD_ID__: JSON.stringify(command === "build" ? BUILD_ID : "") },
  plugins: [
    {
      name: "version-json",
      apply: "build",
      generateBundle() {
        this.emitFile({ type: "asset", fileName: "version.json", source: JSON.stringify({ id: BUILD_ID }) + "\n" });
      },
    },
  ],
  build: {
    target: "es2020",
    // tyylit.html = design systemin tyylisivu (julkaistaan sovelluksen rinnalle)
    rollupOptions: { input: { main: "index.html", tyylit: "tyylit.html" } },
  },
}));
