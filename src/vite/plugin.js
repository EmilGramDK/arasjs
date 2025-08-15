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
export default function ArasVitePlugin(options) {
  const { server, port = 3456, openAras = true, useSSL = true, disableProxy = false } = options;

  // TODO: const { serverPath, serverUrl } = formatURL(server, useSSL);

  return {
    name: "vite-plugin-arasjs",
    config: (config, { command }) => {
      if (command === "serve" && !disableProxy) {
        const serverUrl = formatServerUrl(server, useSSL);

        const viteServerConfig = {
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
          base: "",
          server: {
            ...config.server,
            ...viteServerConfig,
          },
        };
      }
    },
  };
}

function formatServerUrl(url, useSSL = false) {
  const normalizedUrl = url.toLowerCase().replace(/\/+$/, "");
  if (useSSL && !/^https:\/\//.test(normalizedUrl)) {
    return normalizedUrl.replace(/^http:/, "https:");
  }
  return normalizedUrl;
}

// TODO: Make it work for Innovator servers with custom paths
// function formatURL(url, useSSL) {

//   url = url.toLowerCase().replace(/\/+$/, "");

//   if (useSSL && !/^https:\/\//.test(url)) {
//     url = url.replace(/^http:/, "https:");
//   }

//   // remove all after /Client
//   const clientIndex = url.indexOf("/client");
//   if (clientIndex !== -1) {
//     url = url.substring(0, clientIndex);
//   }

// }
