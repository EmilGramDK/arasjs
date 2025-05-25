import type { Plugin, UserConfig } from "vite";

export interface ArasViteOptions {
  server: string;
  disableProxy?: boolean;
  port?: number;
  openAras?: boolean;
  useSSL?: boolean;
}

/**
 *
 * @param options - Configuration options for the plugin
 * @param options.server - The URL of the Aras Innovator server
 * @param options.port - The port to run the Vite server on
 * @param options.openAras - Whether to open the Aras Innovator client in the browser
 * @param options.useSSL - Whether to use SSL for the server URL
 * @param options.useProxy - Whether to use a proxy for the server URL
 * @returns
 */
export default function ArasVitePlugin(options: ArasViteOptions): Plugin {
  const {
    server,
    port = 3456,
    openAras = true,
    useSSL = true,
    disableProxy = false,
  } = options;

  return {
    name: "vite-plugin-arasjs",
    config: (config, { command }) => {
      if (command === "serve" && !disableProxy) {
        const serverUrl = formatServerUrl(server, useSSL);

        const viteServerConfig: UserConfig["server"] = {
          port,
          open: openAras ? "/innovatorserver/client" : false,
          proxy: {
            "/innovatorserver": {
              target: serverUrl,
              secure: false,
              changeOrigin: false,
              rewrite: (path) => path.replace(/^\/innovatorserver/, ""),
            },
          },
        };

        return {
          server: {
            ...config.server,
            ...viteServerConfig,
          },
        };
      }
    },
  };
}

function formatServerUrl(url: string, useSSL: boolean = false): string {
  const normalizedUrl = url.toLowerCase().replace(/\/+$/, "");
  if (useSSL && !/^https:\/\//.test(normalizedUrl)) {
    return normalizedUrl.replace(/^http:/, "https:");
  }
  return normalizedUrl;
}
