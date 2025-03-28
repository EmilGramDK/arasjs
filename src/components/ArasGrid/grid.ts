import { GridColumns, GridOptions } from "../../types/grid";
import { Item } from "../../types/item";
import { enableDefaultLinkClick, exportToExcel, generateColumnsMap, generateRowsMap } from "./helpers";

/**
 * Extends the ArasGrid component
 *
 */
customElements.whenDefined("aras-grid").then(() => {
  const gridPrototype = customElements.get("aras-grid")?.prototype;
  if (!gridPrototype) return;

  const originalInit = gridPrototype.initialization;
  gridPrototype.initialization = function (options: GridOptions) {
    originalInit.call(this, options);

    this.options = options;
    this.head = new Map();
    this.rows = new Map();

    if (options.enableDefaultLinkClick) enableDefaultLinkClick(this);
  };

  gridPrototype.getCellType = function (headId: string): string {
    return this.head?.get(headId)?.type ?? this.getCellType;
  };

  gridPrototype.getCellMetadata = function (headId: string, itemId: string, type: string) {
    const { head, rows, settings } = this;
    const headInfo = head.get(headId) || {};
    const defaultPattern = type === "date" ? "short_date" : "";
    const pattern = headInfo.pattern || defaultPattern;
    //@ts-ignore
    const layout = window.layout;

    return {
      list: [],
      lifeCycleStates: new Map(),
      currentUserId: aras.getUserID(),
      format: itemId === "searchRow" ? defaultPattern : pattern,
      sourceItemTypeName: headInfo.dataSourceName,
      scale: headInfo.scale,
      precision: headInfo.precision,
      maxLength: headInfo.maxLength,
      propsOfLayout: layout?.props || {},
      stateOfLayout: layout?.state || {},
      itemType: "",
      dataType: head.get(headId, "dataType"),
    };
  };

  gridPrototype.setColumns = function (columns: GridColumns) {
    const columnsMap = generateColumnsMap(columns);
    this.head = columnsMap;

    if (this.options.orderBy) {
      this.settings.orderBy = [this.options.orderBy];
    }
  };

  gridPrototype.setRows = function (rows: Item | object[], merge?: boolean) {
    if (!this.head) throw new Error("Columns must be set before rows");
    const rowsMap = generateRowsMap(this, rows, merge);
    this.rows = rowsMap;
    if (this.settings.orderBy) this.sort();
  };

  gridPrototype.setOnHeadContextMenu = function (callback: (head: string, event: Event) => void) {
    this.on("contextmenu", callback, "head");
  };

  gridPrototype.setOnCellContextMenu = function (callback: (head: string, rowId: string, event: Event) => void) {
    this.on("contextmenu", callback, "cell");
  };

  gridPrototype.setCellOnDoubleClick = function (callback: (head: string, row: string) => void) {
    this.on("dblclick", callback, "cell");
  };

  gridPrototype.setRowOnDoubleClick = function (callback: (row: string) => void) {
    this.on("dblclick", callback, "row");
  };

  gridPrototype.setOnSelectRow = function (callback: () => void) {
    this.on("selectRow", callback);
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
