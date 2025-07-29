import type { FilterList, FilterListOption } from "./types";

export const newFilterList = function (id: string, list: Array<FilterListOption> = []): FilterList {
  const control = new FilterList();
  control.id = id;
  control.setAttribute("mode", "input-a");
  return control;
};
