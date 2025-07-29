import type { FilterList, FilterListOption } from "./types";

export const newFilterList = function (list: Array<FilterListOption> = []): FilterList {
  const control = new FilterList();
  control.setAttribute("mode", "input-a");
  control.setState({ list });
  return control;
};
