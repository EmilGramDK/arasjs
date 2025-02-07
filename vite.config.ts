import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts", // Only specify TypeScript entry
      name: "ArasLib",
      formats: ["es", "umd"],
      fileName: (format) => `arasjs.${format}.js`,
    },
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
