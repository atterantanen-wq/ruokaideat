import { defineConfig } from "vite";

export default defineConfig({
  // suhteelliset polut, jotta build toimii myös alihakemistossa (esim. GitHub Pages)
  base: "./",
  build: {
    target: "es2020",
    // tyylit.html = design systemin tyylisivu (julkaistaan sovelluksen rinnalle)
    rollupOptions: { input: { main: "index.html", tyylit: "tyylit.html" } },
  },
});
