import type {
  ArasConfirmDialogParameters,
  DialogShowResult,
  SearchDialogResult,
} from "../types/aras";
import type {
  ArasDialogParameters,
  SearchDialogFilter,
  SearchDialogOptions,
} from "../types/dialog";

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
    aras: globalThis.aras,
    dialogWidth: options.dialogWidth || 800,
    dialogHeight: options.dialogHeight || 600,
  };

  const dialog = ArasModules.Dialog.show("iframe", params);

  if (options.filters?.length) {
    setSearchFilters(dialog, options);
  }

  const res = (await dialog.promise) as SearchDialogResult;
  return res?.item ? res : null;
}

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
    aras: globalThis.aras,
    dialogWidth: options.dialogWidth || 800,
    dialogHeight: options.dialogHeight || 600,
    fullMultiResponse: options.fullMultiResponse || false,
  };

  const dialog = ArasModules.Dialog.show("iframe", params);

  if (options.filters?.length) {
    setSearchFilters(dialog, options);
  }

  const res = await dialog.promise;

  if (options.fullMultiResponse) return res as Array<SearchDialogResult>;

  return res as Array<string>;
}

async function setSearchFilters(
  dialog: DialogShowResult,
  options: SearchDialogOptions,
  firstTime = true,
): Promise<void> {
  // Wait for the dialog to load on the first call
  if (firstTime) await delay(200);

  const filters = options.filters!;
  const iframe = dialog.dialogNode.querySelector(".aras-dialog__iframe") as any;
  const { searchContainer, currentSearchMode } = iframe?.contentWindow;
  if (!searchContainer || !currentSearchMode) return retrySetSearchFilters(dialog, options);

  const grid = searchContainer.grid?._grid;
  if (!grid?.head?._store) return retrySetSearchFilters(dialog, options);

  // Update grid headers with filters
  updateGridHeader(grid, filters);

  // Construct and apply the search AML
  const searchAML = `<Item type="${options.itemtypeName}" 
    pagesize="${options.maxRecords || 25}" 
    maxRecords="${options.maxRecords || 25}" 
    returnMode="itemsOnly" 
    action="get" />`;

  const newSearch = aras.newIOMItem();
  newSearch.loadAML(searchAML);

  filters.forEach((filter) => {
    newSearch.setProperty(filter.property, filter.value);
    if (filter.condition) {
      newSearch.setPropertyCondition(filter.property, filter.condition);
    }
  });

  await searchContainer._setAml(newSearch.node?.xml);
  currentSearchMode.setMaxRecords(options.maxRecords || 25);
  currentSearchMode.setPageSize(options.maxRecords || 25);
}

function updateGridHeader(grid: any, filters: Array<SearchDialogFilter>): void {
  const headMap: Map<string, any> = grid.head._store;

  filters.forEach((filter) => {
    const headItem = [...headMap.values()].find((item: any) => item.name === filter.property);
    if (!headItem) return;

    headItem.searchValue = filter.value;
    headItem.searchType = filter.fixed ? "disabled" : "";

    headMap.set(headItem.field, headItem);
  });

  grid.head = headMap;
}

function retrySetSearchFilters(dialog: DialogShowResult, options: SearchDialogOptions): void {
  setTimeout(() => setSearchFilters(dialog, options, false), 100);
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
