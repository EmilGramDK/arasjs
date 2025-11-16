/**
 * Toggles aras spinner
 * @param value - true to show, false to hide
 * @description This function uses the `aras.browserHelper.toggleSpinner` method to show or hide a spinner on the page.
 */
export const toggleSpinner = (force?: boolean): boolean =>
  document.querySelector("#dimmer_spinner")!.classList.toggle("aras-hide", force);
