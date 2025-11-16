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
export default function ArasVitePlugin(options: ArasViteOptions): any;
