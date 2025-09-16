import type { GridColumn, GridColumns, GridControl, GridOptions } from "../../types/grid";
import type { CuiGridOptions } from "../../types/grid-plugin";
import type { Item } from "../../types/item";
import { getLocalISODate } from "../../utils/formatDate";
import { BaseGridPlugin } from "./plugins/base";

export const deleteSelectedRows = (grid: GridControl) => {
  if (!grid.rows) return;
  const rows = grid.rows.store!;
  grid.settings.selectedRows.forEach((id: string) => {
    rows.delete(id);
  });
  grid.settings.selectedRows = [];
  grid.rows = rows;
};

export const exportToExcel = async (grid: GridControl, name: string): Promise<void> => {
  const worksheets = [];
  const gridWorksheet = excelConverterApi.convertGrid(grid);
  worksheets.push({
    ...gridWorksheet,
    title: name,
  });

  const fileBlob = await excelConverterApi.convertJsonToExcel(worksheets);
  await ArasModules.vault.saveBlob(fileBlob, `${name}.xlsx`);
};

export const setColumns = (grid: GridControl, columns: GridColumns, merge?: boolean) => {
  const columnsMap = generateColumnsMap(grid, columns, merge);
  grid.head = columnsMap;
};

export const setRows = (grid: GridControl, rows: Item | Array<unknown>, merge?: boolean) => {
  if (!grid.head) throw new Error("Columns must be set before rows");
  const rowsMap = generateRowsMap(grid, rows, merge);
  grid.rows = rowsMap;
};

export const newGrid = function (
  id: string,
  options: GridOptions = {},
  cuiOptions: CuiGridOptions = {},
): GridControl {
  const gridControl = new Grid();
  gridControl.id = id;
  initCuiGrid(gridControl, options, cuiOptions);
  return gridControl;
};

export const renderGrid = function (
  container: string | HTMLElement,
  options: GridOptions = {},
  cuiOptions: CuiGridOptions = {},
): GridControl {
  const gridContainer =
    typeof container === "string" ? document.getElementById(container) : container;
  if (!gridContainer) throw new Error(`Grid Container with ID: ${container} not found`);

  const gridControl = new Grid(gridContainer, options) as GridControl;
  initCuiGrid(gridControl, options, cuiOptions);
  return gridControl;
};

const initCuiGrid = (
  grid: GridControl,
  options: GridOptions = {},
  cuiOptions: CuiGridOptions = {},
) => {
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

export const generateRowsMap = (
  gridControl: GridControl,
  rows: Item | Array<unknown>,
  merge?: boolean,
): Map<string, any> => {
  const headStore = gridControl.head?.store || new Map<string, any>();
  const rowsStore = gridControl.rows?.store || new Map<string, any>();
  const rowsMap = merge ? rowsStore : new Map<string, any>();
  if (!rows || (Array.isArray(rows) && rows.length === 0)) return rowsMap;

  const arr = Array.isArray(rows) ? rows : ArasModules.xmlToODataJsonAsCollection(rows.toString());
  const defaultValues = new Map<string, any>();
  const dateFields = new Set<string>();

  headStore.forEach((head: any) => {
    if (head.defaultValue) defaultValues.set(head.name, head.defaultValue);
    if (head.dataType === "date") dateFields.add(head.name);
  });

  arr.forEach((row: any, index) => {
    const id = row?.id || `${index}+${Date.now()}`;

    if (defaultValues.size > 0) {
      defaultValues.forEach((value, key) => {
        if (!row[key]) row[key] = value;
      });
    }

    // We need to check all date fields, because the grid crashes if the date is not a valid date
    dateFields.forEach((field) => {
      if (!row[field]) return;
      row[field] = getLocalISODate(row[field]);
    });

    rowsMap.set(id, row);
  });

  return rowsMap;
};

export const generateColumnsMap = (
  gridControl: GridControl,
  columns: GridColumns,
  merge?: boolean,
): Map<string, GridColumn> => {
  const headStore = gridControl.head?.store || new Map<string, any>();
  const columnsMap = merge ? headStore : new Map<string, any>();
  if (!columns || columns.length === 0) return columnsMap;

  columns.forEach((col, index) => {
    const name = col.field;

    const data = {
      ...col,
      columnCssStyles: {
        "text-align": col.textAlign || "left",
        ...col.columnCssStyles,
      },
      cssClass: col.cssClass || "",
      cssStyle: col.cssStyle || {},
      icon: col.icon || null,
      name: col.field,
      id: col.id || name,
      isReadOnly: col.isReadOnly || false,
      isForeign: col.isForeign || false,
      field: name,
      defaultLabel: col.label,
      label: col.label,
      locale: col.locale || null,
      dataType: col.dataType || col.type || "string",
      dataSource: col.dataSource || null,
      dataSourceName: col.dataSourceName || null,
      editable: col.editable || false,
      searchType: col.searchType || "",
      searchValue: col.searchValue || "",
      width: col.width ? col.width - 1 : 49,
      questionMark: false,
      helpText: col.helpText || null,
      helpTooltip: col.helpTooltip || null,
      layoutIndex: index,
      pattern: col.pattern || "",
      defaultValue: col.defaultValue || null,
    };

    columnsMap.set(name, data);
  });
  return columnsMap;
};
