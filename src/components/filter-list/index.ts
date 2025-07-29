import type { FilterListOption } from "./types";

/**
 * Extends the Aras FilterList component
 *
 */
customElements.whenDefined("aras-filter-list").then(() => {
  const prototype = customElements.get("aras-filter-list")?.prototype;
  if (!prototype) return;

  prototype.onSelectValue = function (callback: (item: { label: string; value: string }) => void) {
    this.addEventListener("change", () => {
      const { label, list } = this.state;
      const item = list.find((i: FilterListOption) => i.label === label);
      if (!item) return;
      callback(item);
    });
  };
});

export type { FilterListOption, FilterListState, FilterList } from "./types";
export { newFilterList } from "./utils";
