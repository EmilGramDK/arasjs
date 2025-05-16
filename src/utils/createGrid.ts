import { BaseGridPlugin } from "../components/ArasGrid/plugin";
import { GridControl, GridOptions } from "../types/grid";
import { CuiGridOptions } from "../types/grid-plugin";

export const createGrid = function (
  container: string | HTMLElement,
  options: GridOptions = {},
  cuiOptions: CuiGridOptions
): GridControl {
  const gridContainer = typeof container === "string" ? document.getElementById(container) : container;
  if (!gridContainer) throw new Error(`Grid Container with ID: ${container} not found`);

  const gridControl = new Grid(gridContainer, options) as GridControl;

  cuiGrid(gridControl, {
    ...cuiOptions,
    plugins: [BaseGridPlugin, ...cuiOptions.plugins],
  });

  return gridControl;
};
