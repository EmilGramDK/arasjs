import { GridColumn, GridColumns, GridControl } from "../../types/grid";
import { Item } from "../../types/item";
import { getLocalISODate } from "../../utils/formatDate";

export const generateRowsMap = (gridControl: GridControl, rows: Item | object[], merge?: boolean): Map<string, any> => {
  const headStore = gridControl.head?.store || new Map<string, any>();
  const rowsStore = gridControl.rows?.store || new Map<string, any>();
  const rowsMap = merge ? rowsStore : new Map<string, any>();
  if (!rows || (Array.isArray(rows) && !rows.length)) return rowsMap;

  const arr = Array.isArray(rows) ? rows : ArasModules.xmlToODataJsonAsCollection(rows.toString());
  const defaultValues = new Map<string, any>();
  const dateFields = new Set<string>();

  headStore.forEach((head: any, key: string) => {
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
  merge?: boolean
): Map<string, GridColumn> => {
  const headStore = gridControl.head?.store || new Map<string, any>();
  const columnsMap = merge ? headStore : new Map<string, any>();
  if (!columns || !columns.length) return columnsMap;

  columns.forEach((col, index) => {
    const name = col.field;

    const data = {
      ...col,
      columnCssStyles: {
        "text-align": col.textAlign || "left",
        ...(col.columnCssStyles || {}),
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
      type: col.type || "string",
      dataType: col.type || col.dataType || "string",
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

export const exportToExcel = async (grid: GridControl, name: string): Promise<void> => {
  const worksheets = [];
  const gridWorksheet = excelConverterApi.convertGrid(grid);
  worksheets.push({
    ...gridWorksheet,
    title: name,
  });

  const fileBlob = await excelConverterApi.convertJsonToExcel(worksheets);
  ArasModules.vault.saveBlob(fileBlob, `${name}.xlsx`);
};

export const enableDefaultLinkClick = (gridControl: GridControl) => {
  gridControl.on("click", (hId: string, rId: string, e: any) => checkForLinkClick(gridControl, hId, rId, e), "cell");
};

const checkForLinkClick = (gridControl: GridControl, headId: string, rowId: string, event: Event) => {
  const target = event.target;

  if (target instanceof Element && target.classList.contains("aras-grid-link")) {
    const prop = gridControl.head.get(headId, "name");
    const itemId = gridControl.rows.get(rowId, prop);
    const itemType = gridControl.head.get(headId, "dataSourceName");

    if (!itemId || !itemType) return;

    arasProvider.showItem(itemType, itemId);
  }
};
