import type { GridColumns } from "../../types/grid";
import type { Item } from "../../types/item";
import { generateColumnsMap, generateRowsMap } from "./utils";

customElements.whenDefined("aras-grid").then(() => {
  window.Grid.prototype.setColumns = function (columns: GridColumns, merge?: boolean) {
    const columnsMap = generateColumnsMap(this, columns, merge);
    this.head = columnsMap;
  };

  window.Grid.prototype.setRows = function (
    rows: Item | Array<Record<string, unknown>>,
    merge?: boolean,
  ) {
    if (!this.head) throw new Error("Columns must be set before rows");
    const rowsMap = generateRowsMap(this, rows, merge);
    this.rows = rowsMap;
  };

  window.Grid.prototype.deleteSelectedRows = function () {
    if (!this.rows) return;
    const rows = this.rows.store!;
    this.settings.selectedRows.forEach((id: string) => {
      rows.delete(id);
    });
    this.settings.selectedRows = [];
    this.rows = rows;
  };

  window.Grid.prototype.getSelectedRows = function () {
    return this.settings.selectedRows;
  };
});

export * from "./utils";
export { BaseGridPlugin } from "./plugin";
