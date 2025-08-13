import type { GridColumns } from "../../types/grid";
import type { Item } from "../../types/item";
import { deleteSelectedRows, setColumns, setRows } from "./utils";

customElements.whenDefined("aras-grid").then(() => {
  window.Grid.prototype.setColumns = function (columns: GridColumns, merge?: boolean) {
    setColumns(this, columns, merge);
  };

  window.Grid.prototype.setRows = function (
    rows: Item | Array<Record<string, unknown>>,
    merge?: boolean,
  ) {
    setRows(this, rows, merge);
  };

  window.Grid.prototype.deleteSelectedRows = function () {
    deleteSelectedRows(this);
  };
});

export * from "./utils";
export { BaseGridPlugin } from "./plugin";
