import type { GridColumns } from "../../types/grid";
import type { Item } from "../../types/item";
import { exportToExcel, generateColumnsMap, generateRowsMap } from "./utils";

/**
 * Extends the ArasGrid component
 *
 */
customElements.whenDefined("aras-grid").then(() => {
  const gridPrototype = customElements.get("aras-grid")?.prototype;
  if (!gridPrototype) return;

  gridPrototype.setColumns = function (columns: GridColumns, merge?: boolean) {
    const columnsMap = generateColumnsMap(this, columns, merge);
    this.head = columnsMap;

    if (this.options?.orderBy) {
      this.settings.orderBy = [this.options.orderBy];
    }
  };

  gridPrototype.setRows = function (rows: Item | Array<Record<string, unknown>>, merge?: boolean) {
    if (!this.head) throw new Error("Columns must be set before rows");
    const rowsMap = generateRowsMap(this, rows, merge);
    this.rows = rowsMap;
    if (this.settings.orderBy) this.sort();
  };

  gridPrototype.setOnHeadContextMenu = function (callback: (head: string, event: Event) => void) {
    this.on("contextmenu", callback, "head");
  };

  gridPrototype.setOnCellContextMenu = function (
    callback: (head: string, rowId: string, event: Event) => void,
  ) {
    this.on("contextmenu", callback, "cell");
  };

  gridPrototype.setCellOnDoubleClick = function (callback: (head: string, row: string) => void) {
    this.on("dblclick", callback, "cell");
  };

  gridPrototype.setRowOnDoubleClick = function (callback: (row: string) => void) {
    this.on("dblclick", callback, "row");
  };

  gridPrototype.deleteSelectedRows = function () {
    if (!this.rows) return;
    const rows = this.rows.store!;
    this.settings.selectedRows.forEach((id: string) => {
      rows.delete(id);
    });
    this.settings.selectedRows = [];
    this.rows = rows;
    if (this.settings.orderBy) this.sort();
  };

  gridPrototype.getSelectedRows = function () {
    return this.settings.selectedRows;
  };

  gridPrototype.exportToExcel = async function (name: string) {
    exportToExcel(this, name);
  };
});

export { generateRowsMap, generateColumnsMap, renderGrid, newGrid } from "./utils";
export { BaseGridPlugin } from "./plugin";
