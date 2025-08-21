import type { ArasConfirmDialogParameters, SearchDialogResult } from "../types/aras";
import type { ArasDialogParameters, SearchDialogOptions } from "../types/dialog";

export function removeAllDialogs() {
  const topDialogs = top?.document.querySelectorAll("dialog");
  if (!topDialogs?.length) return;
  for (const topDialog of topDialogs) {
    topDialog.remove();
  }
}

export async function showConfirmDialog(
  message: string,
  options: ArasConfirmDialogParameters = {},
): Promise<boolean | string> {
  const result = await ArasModules.Dialog.confirm(message, options);
  return result === "cancel" ? false : result;
}

export async function showSearchDialog(
  options: SearchDialogOptions,
): Promise<SearchDialogResult | null> {
  const params: ArasDialogParameters = {
    title: options.title || "Search Dialog",
    type: "SearchDialog",
    itemtypeName: options.itemtypeName,
    sourceItemTypeName: options.sourceItemTypeName,
    sourcePropertyName: options.sourcePropertyName,
    multiselect: false,
    aras: window.aras,
    dialogWidth: options.dialogWidth || 800,
    dialogHeight: options.dialogHeight || 600,
  };

  const dialog = ArasModules.Dialog.show("iframe", params);
  const res = await dialog.promise;
  return res?.item ? (res as SearchDialogResult) : null;
}

export async function showMultiSelectSearchDialog(
  options: SearchDialogOptions & { fullMultiResponse: true },
): Promise<Array<SearchDialogResult>>;

export async function showMultiSelectSearchDialog(
  options: SearchDialogOptions & { fullMultiResponse?: false },
): Promise<Array<string>>;

export async function showMultiSelectSearchDialog(
  options: SearchDialogOptions,
): Promise<Array<string> | Array<SearchDialogResult>> {
  const params: ArasDialogParameters = {
    title: options.title || "Search Dialog",
    type: "SearchDialog",
    itemtypeName: options.itemtypeName,
    sourceItemTypeName: options.sourceItemTypeName,
    sourcePropertyName: options.sourcePropertyName,
    multiselect: true,
    aras: window.aras,
    dialogWidth: options.dialogWidth || 800,
    dialogHeight: options.dialogHeight || 600,
    fullMultiResponse: options.fullMultiResponse || false,
  };

  const dialog = ArasModules.Dialog.show("iframe", params);
  const res = await dialog.promise;
  return res;
}
