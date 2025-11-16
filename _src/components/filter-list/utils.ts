import type { FilterList, FilterListState } from "./types";

export const newFilterList = function (initialState: Partial<FilterListState>): FilterList {
  const control = new FilterList();
  control.setAttribute("mode", "input-a");
  control.setState({ ...initialState });
  return control;
};
