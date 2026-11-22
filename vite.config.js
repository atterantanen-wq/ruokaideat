import { defineConfig } from "vite";

export default defineConfig({
  // suhteelliset polut, jotta build toimii myös alihakemistossa (esim. GitHub Pages)
  base: "./",
  build: {
    target: "es2020",
  },
});
