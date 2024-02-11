import { defineConfig } from "vite";

export default defineConfig({
 root: "src",
 port: "3000",
 preview: {
  port: "3000",
 },
 build: {
  sourcemap: false,
  outDir: "../dist",
 },
 publicDir: "assets",
});
