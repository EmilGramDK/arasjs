/**
 * Toggles a spinner on the page.
 * @param {boolean} value - If true, shows the spinner; if false, hides it.
 * @returns {Promise<boolean>} - Returns a promise that resolves to the value passed in.
 * @description This function uses the `aras.browserHelper.toggleSpinner` method to show or hide a spinner on the page.
 */
export async function toggleSpinner(value: boolean): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return aras.browserHelper.toggleSpinner(document, value);
}
