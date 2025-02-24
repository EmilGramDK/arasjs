import {
  ArasDialogParameters,
  ArasModules,
  DialogShowResult,
  SearchDialogFilter,
  SearchDialogOptions,
  SearchDialogResult,
  ArasConfirmDialogParameters,
} from "arasjs-types";
import ArasProvider from "../provider";

export default class DialogService {
  #arasProvider: ArasProvider;
  #arasModules: ArasModules;

  constructor(arasProvider: ArasProvider) {
    this.#arasProvider = arasProvider;
    this.#arasModules = arasProvider.arasModules;
  }

  public removeAllDialogs() {
    const topDialogs = top?.document.getElementsByTagName("dialog");
    if (!topDialogs?.length) return;
    for (let i = 0; i < topDialogs.length; i++) {
      topDialogs[i].remove();
    }
  }

  public async showConfirmDialog(
    message: string,
    options: ArasConfirmDialogParameters = {}
  ): Promise<boolean> {
    const result = await this.#arasModules.Dialog.confirm(message, options);
    return result === "ok";
  }

  public async showSearchDialog(options: SearchDialogOptions): Promise<SearchDialogResult | null> {
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

    const dialog = this.#arasModules.Dialog.show("iframe", params);

    if (options.filters?.length) {
      this.setSearchFilters(dialog, options);
    }

    const res = (await dialog.promise) as SearchDialogResult;
    return res?.item ? res : null;
  }

  public async showMultiSelectSearchDialog(options: SearchDialogOptions): Promise<string[]> {
    const params: ArasDialogParameters = {
      title: options.title || "Search Dialog",
      type: "SearchDialog",
      itemtypeName: options.itemtypeName,
      sourceItemTypeName: options.sourceItemTypeName,
      sourcePropertyName: options.sourcePropertyName,
      multiselect: true,
      aras: window.aras,
      dialogWidth: 700,
    };

    const dialog = this.#arasModules.Dialog.show("iframe", params);

    if (options.filters?.length) {
      this.setSearchFilters(dialog, options);
    }

    const res = await dialog.promise;

    return res as string[];
  }

  private async setSearchFilters(
    dialog: DialogShowResult,
    options: SearchDialogOptions,
    firstTime = true
  ): Promise<void> {
    // Wait for the dialog to load on the first call
    if (firstTime) await this.delay(200);

    const filters = options.filters!;
    const iframe = dialog.dialogNode.querySelector(".aras-dialog__iframe") as any;
    const { searchContainer, currentSearchMode } = iframe?.contentWindow;
    if (!searchContainer || !currentSearchMode) return this.retrySetSearchFilters(dialog, options);

    const grid = searchContainer.grid?._grid;
    if (!grid?.head?._store) return this.retrySetSearchFilters(dialog, options);

    // Update grid headers with filters
    this.updateGridHeader(grid, filters);

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

    await searchContainer._setAml(newSearch.node.xml);
    currentSearchMode.setMaxRecords(options.maxRecords || 25);
    currentSearchMode.setPageSize(options.maxRecords || 25);
  }

  private updateGridHeader(grid: any, filters: SearchDialogFilter[]): void {
    const headMap: Map<string, any> = grid.head._store;

    filters.forEach((filter) => {
      const headItem = Array.from(headMap.values()).find(
        (item: any) => item.name === filter.property
      );
      if (!headItem) return;

      headItem.searchValue = filter.value;
      headItem.searchType = filter.fixed ? "disabled" : "";

      headMap.set(headItem.field, headItem);
    });

    grid.head = headMap;
  }

  private retrySetSearchFilters(dialog: DialogShowResult, options: SearchDialogOptions): void {
    setTimeout(() => this.setSearchFilters(dialog, options, false), 100);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
