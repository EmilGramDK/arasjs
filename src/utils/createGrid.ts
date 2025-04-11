import { GridControl, GridOptions } from "../types/grid";

export const createGrid = function (container: string | HTMLElement, options: GridOptions = {}): GridControl {
  const gridContainer = typeof container === "string" ? document.getElementById(container) : container;
  if (!gridContainer) throw new Error(`Grid Container with ID: ${container} not found`);

  const gridControl = new Grid(gridContainer, options) as GridControl;

  return gridControl;
};
