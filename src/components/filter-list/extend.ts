import type { FilterListOption } from "./types";

export const extendFilterList = () => {
  if (!window.FilterList) return;
  window.FilterList.prototype.onSelectValue = function (
    callback: (item: FilterListOption | undefined) => void,
  ) {
    this.addEventListener("change", () => {
      const { value, list } = this.state;
      const item = list.find((i: FilterListOption) => i.value === value);
      callback(item);
    });
  };
};
