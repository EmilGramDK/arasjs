import type { FilterList, ItemProperty } from "arasjs/types";

export const onSelectValue = (
  element: FilterList | ItemProperty,
  callback: (item: (typeof element.state.list)[number] | undefined) => void,
): void => {
  element.addEventListener("change", () => {
    const { value, label, list } = element.state;
    const prop = label ? "label" : "value";
    const item = list.find((i: (typeof element.state.list)[number]) => i[prop] === (label || value));
    callback(item);
  });
};
