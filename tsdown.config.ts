import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/index.ts", "./src/utils/index.ts"],
  minify: true,
  platform: "browser",
  format: "esm",
  clean: true,
});
