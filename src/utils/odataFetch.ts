/**
 * Makes a request to the odata API.
 * @param requestURL The URL to fetch.
 * @param options The fetch options.
 * @param abortController The AbortController instance.
 * @returns The response from the odata API.
 * @throws If the request fails.
 */
export async function odataFetch(
  requestURL = "",
  options: RequestInit = {},
  signal?: AbortController["signal"],
): Promise<any> {
  try {
    const oAuthClient = aras.OAuthClient;
    const authHeaders = oAuthClient.getAuthorizationHeader();

    const fetchOptions: RequestInit = {
      method: "GET",
      credentials: "include",
      ...options,
      headers: {
        "cache-control": "no-cache",
        "Content-Type": "application/json",
        Accept: "application/json;odata.metadata=none",
        ...authHeaders,
        ...options.headers,
      },
      signal,
    };

    // Ensure URL is properly encoded
    const baseUrl = new URL(window.aras.getServerBaseURL());
    const url = new URL(`odata/${requestURL}`, baseUrl);

    const response = await fetch(url.href, fetchOptions);

    // Handle response errors
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
        if (errorData.error) {
          errorData = errorData.error.message || errorData.error;
        }
      } catch {
        errorData = errorText;
      }
      throw new Error(typeof errorData === "object" ? JSON.stringify(errorData) : errorData);
    }

    // Return JSON safely
    try {
      return await response.json();
    } catch {
      throw new Error("Invalid JSON response received");
    }
  } catch (error) {
    console.error("odataFetch error:", error);
    throw error;
  }
}
