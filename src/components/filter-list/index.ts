import type { FilterListOption } from "./types";

/**
 * Extends the Aras FilterList component
 *
 */
customElements.whenDefined("aras-filter-list").then(async () => {
  globalThis.FilterList.prototype.onSelectValue = function (
    callback: (item: FilterListOption | undefined) => void,
  ) {
    this.addEventListener("change", () => {
      const { value, list } = this.state;
      const item = list.find((i: FilterListOption) => i.value === value);
      callback(item);
    });
  };
});

export type { FilterListOption, FilterListState, FilterList } from "./types";
export { newFilterList } from "./utils";
