import { XmlNode } from "../types/aras";
import { Item } from "../types/item";
import { convertToXML } from "./convertToXML";

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
  returnFormat: "IOM" | "XML" | "string" = "IOM",
  signal?: AbortController["signal"]
): Promise<Item | string | XmlNode> {
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
  const baseUrl = new URL(window.aras.getServerBaseURL());
  const url = new URL("InnovatorServer.aspx", baseUrl);

  const response = await fetch(url.href, fetchOptions);

  if (!response.ok) throw new Error("Failed to apply item");

  const xml = await response.text();
  const resItem = aras.newIOMItem();
  resItem.loadAML(xml);

  if (throwOnError && resItem.isError()) {
    throw new Error(resItem.getErrorString());
  }

  return returnFormat === "IOM" ? resItem : returnFormat === "XML" ? convertToXML(resItem) : resItem.ToString();
}
