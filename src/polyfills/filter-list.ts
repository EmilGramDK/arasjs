import type { FilterListOption } from "../types/filter-list";

export const filterListPolyfill = (): void => {
  window.FilterList.prototype.onSelectValue = function (callback: (item: FilterListOption | undefined) => void) {
    this.addEventListener("change", () => {
      const { value, label, list } = this.state;
      const prop = label ? "label" : "value";
      const item = list.find((i: FilterListOption) => i[prop] === (label || value));
      callback(item);
    });
  };
};
