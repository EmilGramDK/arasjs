import type { GridControl, GridOptions, CuiGridOptions } from "../types/grid";
import type { FilterList, FilterListState } from "../types/filter-list";
import type { ItemProperty, ItemPropertyState } from "../types/item-property";
import { BaseGridPlugin } from "./grid";

export const newFilterList = function (initialState: Partial<FilterListState>): FilterList {
  const control = new FilterList();
  control.setAttribute("mode", initialState.mode || "input-a");
  control.setState({ ...initialState });
  return control;
};

export const newItemProperty = function (initialState: Partial<ItemPropertyState>): ItemProperty {
  const control = new ItemProperty();
  control.setAttribute("mode", initialState.mode || "input-a");
  control.setState({ ...initialState });
  return control;
};

export const newBaseGrid = function (
  id: string,
  options: GridOptions = {},
  cuiOptions: CuiGridOptions = {},
): GridControl {
  const gridControl = new Grid();
  gridControl.id = id;
  initBaseCuiGrid(gridControl, options, cuiOptions);
  return gridControl;
};

const initBaseCuiGrid = (grid: GridControl, options: GridOptions = {}, cuiOptions: CuiGridOptions = {}) => {
  cuiGrid(grid, {
    ...cuiOptions,
    plugins: [BaseGridPlugin, ...(cuiOptions.plugins || [])],
  }).then(() => {
    grid.view.defaultSettings = {
      ...grid.view.defaultSettings,
      ...options,
    };
  });
};
