import { Item } from "arasjs-types";
import ArasProvider from "../provider";
import { GridColumn, GridControl, GridOptions } from "../types/grid";

export default class GridService {
  #arasProvider: ArasProvider;

  constructor(arasProvider: ArasProvider) {
    this.#arasProvider = arasProvider;
  }

  public createGrid(containerID: string, options: GridOptions = {}): GridControl {
    const gridContainer = document.getElementById(containerID);
    if (!gridContainer) throw new Error(`Grid Container with ID: ${containerID} not found`);

    const mergedOptions = this.mergeGridSettings(options);
    gridContainer.style.height = gridContainer.clientHeight + "px";

    //@ts-ignore
    const gridControl: GridControl = new window.Grid(gridContainer, mergedOptions);

    gridControl.getCellType = (headId: string) => {
      return gridControl.head.get(headId, "type") || gridControl.getCellType;
    };
    gridControl.getCellMetadata = (headId: string, itemId: string, type: string) => {
      const { head, rows, settings } = gridControl;
      const headInfo = head._store.get(headId);
      const defaultPattern = type === "date" ? "short_date" : "";
      const pattern = headInfo.pattern || defaultPattern;

      return {
        list: [],
        lifeCycleStates: new Map(),
        currentUserId: aras.getUserID(),
        format: itemId === "searchRow" ? defaultPattern : pattern,
        sourceItemTypeName: headInfo.dataSourceName,
        scale: headInfo.scale,
        precision: headInfo.precision,
        maxLength: headInfo.maxLength,
        propsOfLayout: {},
        stateOfLayout: {},
        itemType: "",
        dataType: head.get(headId, "dataType"),
      };
    };
    gridControl.setRows = (rows: Item | object[]) => {
      const rowsMap = this.generateRowsMap(rows, gridControl.head.store);
      gridControl.rows = rowsMap;
    };
    gridControl.setColumns = (columns: GridColumn[]) => {
      const columnsMap = this.generateColumnsMap(columns);
      gridControl.head = columnsMap;

      if(options.orderBy) {
        const { field, desc } = options.orderBy;
        gridControl.settings.orderBy = [{
          headId: `${field}_D`,
          desc: desc || false,
        }]
      }
    };

    gridControl.setCellOnDoubleClick = (callback: (head: string, row: string) => void) => {
      gridControl.on("dblclick", callback, "cell");
    };

    gridControl.setRowOnDoubleClick = (callback: (row: string) => void) => {
      gridControl.on("dblclick", callback, "row");
    };

    gridControl.on(
      "click",
      (hId: string, rId: string, e: any) => this.cellClick(gridControl, hId, rId, e),
      "cell"
    );

    gridControl.setOnSelectRow = (callback: () => void) => {
      gridControl.on("selectRow", callback);
    };
    gridControl.deleteSelectedRows = () => {
      const rows = gridControl.rows.store;
      gridControl.settings.selectedRows.forEach((id: string) => {
        rows.delete(id);
      });
      gridControl.settings.selectedRows = [];
      gridControl.rows = rows;
    };
    gridControl.getSelectedRows = () => {
      return gridControl.settings.selectedRows;
    };
    gridControl.exportToExcel = async (name: string) => {
      this.exportToExcel(gridControl, name);
    };

    return gridControl;
  }

  private cellClick(gridControl: GridControl, headId: string, rowId: string, event: Event) {
    const target = event.target;

    if (target instanceof Element && target.classList.contains("aras-grid-link")) {
      const prop = gridControl.head.get(headId, "name");
      const dataType = gridControl.rows.get(rowId, "type");
      const itemId = gridControl.rows.get(rowId, prop);
      const itemType = gridControl.head.get(headId, "dataSourceName");

      if (!itemId || !itemType) return;

      this.#arasProvider.showItem(itemType, itemId);
    }
  }

  private mergeGridSettings(options: GridOptions): GridOptions {
    const defaultOptions: GridOptions = {
      rowHeight: 32,
      headWidth: 18,
      multiSelect: true,
      resizable: true,
      search: false,
      editable: false,
      sortable: true,
      freezableColumns: false,
      draggableColumns: true,
      tooltipDelay: 1000,
      copyPaste: true,
      selectable: true,
    };

    return { ...defaultOptions, ...options };
  }

  private async exportToExcel(grid: any, name: string): Promise<void> {
    const worksheets = [];
    const gridWorksheet = excelConverterApi.convertGrid(grid);
    worksheets.push({
      ...gridWorksheet,
      title: name,
    });

    const fileBlob = await excelConverterApi.convertJsonToExcel(worksheets);
    ArasModules.vault.saveBlob(fileBlob, `${name}.xlsx`);
  }

  private generateRowsMap(rows: Item | object[], headStore: Map<string, any>): Map<string, any> {
    const rowsMap = new Map<string, any>();

    const arr = Array.isArray(rows)
      ? rows
      : ArasModules.xmlToODataJsonAsCollection(rows.toString());

    const defaultValues = new Map<string, any>();

    headStore.forEach((head: any, key: string) => {
      if(!head.defaultValue) return;
      defaultValues.set(head.name, head.defaultValue);
    });

    arr.forEach((row: any, index) => {
      const id = row?.id || `${index}+${Date.now()}`;

      if(defaultValues.size > 0) {
        defaultValues.forEach((value, key) => {
          if(!row[key]) row[key] = value;
        });
      }

      rowsMap.set(id, row);
    });

    return rowsMap;
  }

  private generateColumnsMap(columns: GridColumn[]): Map<string, GridColumn> {
    const columnsMap = new Map<string, any>();
    columns.forEach((col, index) => {
      const name = col.field + "_D";

      const data = {
        columnCssStyles: {
          "text-align": col.textAlign || "left",
          ...(col.columnCssStyles || {}),
        },
        cssClass: col.cssClass || "",
        cssStyle: col.cssStyle || {},
        icon: col.icon || null,
        name: col.field,
        id: name,
        isReadOnly: col.isReadOnly || false,
        isForeign: col.isForeign || false,
        field: name,
        defaultLabel: col.label,
        label: col.label,
        locale: col.locale || null,
        type: col.type || "string",
        dataType: col.type || "string",
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
  }
}
