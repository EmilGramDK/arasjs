import type { ArasConfirmDialogParameters, ArasDialogParameters, SearchDialogResult } from "../types";

export const removeAllDialogs = (): void => {
  const topDialogs = top!.document.querySelectorAll("dialog");
  for (const topDialog of topDialogs) topDialog.remove();
};

export async function showSearchDialog(
  options: ArasDialogParameters & {
    multiselect?: false;
    fullMultiResponse?: never;
  },
): Promise<SearchDialogResult | undefined>;

export async function showSearchDialog(
  options: ArasDialogParameters & {
    multiselect: true;
    fullMultiResponse: true;
  },
): Promise<Array<SearchDialogResult>>;

export async function showSearchDialog(
  options: ArasDialogParameters & {
    multiselect: true;
    fullMultiResponse?: false;
  },
): Promise<Array<string>>;

export async function showSearchDialog(
  options: ArasDialogParameters & {
    multiselect?: boolean;
    fullMultiResponse?: boolean;
  },
): Promise<SearchDialogResult | Array<SearchDialogResult> | Array<string> | undefined> {
  const dialog = ArasModules.Dialog.show("iframe", { ...options, type: "SearchDialog" });
  const res = await dialog.promise;
  return res as SearchDialogResult | undefined;
}

export async function showConfirmDialog(
  message: string,
  options: ArasConfirmDialogParameters = {},
): Promise<boolean | string> {
  const result = await ArasModules.Dialog.confirm(message, options);
  return result === "cancel" ? false : result;
}
