import type { Item } from "../types/item";

/**
 *
 * @param aml
 * @param throwOnError
 * @param abortController
 * @returns
 */
export async function applyAML(
  aml: string,
  throwOnError = false,
  signal?: AbortController["signal"],
): Promise<Item> {
  const oAuthClient = aras.OAuthClient;
  const authHeaders = oAuthClient.getAuthorizationHeader();

  const body = `<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" ><SOAP-ENV:Body><ApplyAML>${aml}</ApplyAML></SOAP-ENV:Body></SOAP-ENV:Envelope>`;

  const fetchOptions: RequestInit = {
    method: "POST",
    credentials: "include",
    headers: {
      "cache-control": "no-cache",
      "Content-Type": "text/xml; charset=UTF-8",
      Soapaction: "Applyaml",
      ...authHeaders,
    },
    signal,
    body,
  };

  // Ensure URL is properly encoded
  const baseUrl = new URL(globalThis.aras.getServerBaseURL());
  const url = new URL("InnovatorServer.aspx", baseUrl);

  const response = await fetch(url.href, fetchOptions);

  if (!response.ok) throw new Error("Failed to apply item");

  const xml = await response.text();
  const resItem = aras.newIOMItem();
  resItem.loadAML(xml);

  if (throwOnError && resItem.isError()) {
    throw new Error(resItem.getErrorString());
  }

  return resItem;
}
