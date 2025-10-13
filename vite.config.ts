import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: "src/index.ts",
        utils: "src/utils.ts",
      },
      name: "ArasJS",
      formats: ["cjs", "es"],
      // formats: ["es", "umd"],
      // fileName: (format) => `arasjs.${format}.js`,
    },
    target: "es2022",
    minify: "esbuild",
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".css")) {
            return "arasjs.css"; // Ensure the CSS file is generated
          }
          return assetInfo.name!;
        },
      },
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
});
