/* Kotinäytön kuvakkeet: npm run icons
 * Piirtää public/icon.svg:stä PNG-kuvakkeet (iPhonen apple-touch-icon ja manifestin kuvakkeet).
 * Aja uudelleen, jos icon.svg muuttuu. Maskable-versiossa kuva on pienennetty Androidin
 * turva-alueelle (keskiympyrä 80 %) ja tausta jatkuu reunoille. */
import { readFileSync } from "node:fs";
import { chromium } from "playwright";

const svg = readFileSync(new URL("../public/icon.svg", import.meta.url), "utf8");
const bg = svg.match(/<rect[^>]*fill="(#[0-9a-f]{6})"/i)[1];
const out = (f) => new URL("../public/" + f, import.meta.url).pathname;
const sizes = [
  ["apple-touch-icon.png", 180, 1],
  ["icon-192.png", 192, 1],
  ["icon-512.png", 512, 1],
  ["icon-maskable-512.png", 512, 0.8],
];

const browser = await chromium.launch();
for (const [file, size, scale] of sizes) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  await page.setContent(
    `<style>html,body{margin:0;background:${bg}}svg{display:block;width:${size}px;height:${size}px;transform:scale(${scale})}</style>${svg}`,
  );
  await page.screenshot({ path: out(file) });
  await page.close();
  console.log(file, size + "px");
}
await browser.close();
