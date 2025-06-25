import type { CellValidationResult } from "../../types/grid";
import { GridPlugin } from "../../types/grid-plugin";
import { showSearchDialog } from "../../utils";
import { basePluginEvents } from "./plugin-events";

export class BaseGridPlugin extends GridPlugin {
  private readonly dialogTypes = ["text", "color", "image", "formatted text"];

  events = basePluginEvents;

  async init() {
    this.grid.rows = new Map();
    this.grid.head = new Map();
    this.grid.settings.indexRows = [];
    this.grid.settings.selectedRows = [];
    this.currentUserId = aras.getCurrentUserID();

    this.options.getState ??= () => ({});
    this.options.getProps ??= () => ({});
  }

  getCellType(result: any, headId: string) {
    return this.grid.head.get(headId, "dataType") || result;
  }

  getEditorType(result: any, headId: string) {
    const dataType = this.grid.head.get(headId, "dataType");
    return this.dialogTypes.includes(dataType) ? "nonEditable" : dataType || result;
  }

  getCellMetadata(result: any, headId: string, rowId: string) {
    const { head, rows, settings } = this.grid;
    const { getProps, getState } = this.options;

    const headInfo = head.get(headId);
    if (!headInfo) return result || {};

    const {
      dataType: rawDataType,
      type,
      pattern: customPattern,
      list = [],
      lifeCycleStates = [],
      dataSourceName,
      scale,
      precision,
      maxLength,
      layoutIndex,
      name: cellName,
    } = headInfo;

    const dataType = rawDataType || type || "string";
    const defaultPattern = dataType === "date" ? "short_date" : "";
    const pattern = customPattern || defaultPattern;

    const itemType = dataSourceName ? aras.getItemTypeNodeForClient(dataSourceName, "name") : {};
    const focusedCell = settings?.focusedCell;

    return {
      list,
      lifeCycleStates,
      currentUserId: this.currentUserId,
      format: rowId === "searchRow" ? defaultPattern : pattern,
      sourceItemTypeName: dataSourceName,
      itemType,
      scale,
      precision,
      maxLength,
      propsOfLayout: getProps?.() ?? {},
      stateOfLayout: getState?.() ?? {},
      languages: this.languages,
      dataType,

      loadFileHandler: async () => {
        const parentRowId = focusedCell?.rowId;
        if (!parentRowId) return;

        const file = await aras.vault.selectFile();
        const validation = this.grid.validateCell(headId, parentRowId, file, this.grid);

        if (!validation.valid) {
          this.grid.settings.focusedCell = { headId, rowId: parentRowId };
          alert(validation.validationMessage);
          return;
        }

        const selectedFile = aras.newItem("File", file);
        if (!selectedFile) return;

        aras.itemsCache.addItem(selectedFile);

        const fileJson = ArasModules.xmlToODataJson(selectedFile) as any;
        const currentRow = rows.store!.get(rowId);

        currentRow[cellName] = fileJson.id;
        currentRow[`${cellName}@action`] = fileJson["@action"];
        currentRow[`${cellName}@aras.keyed_name`] = fileJson.filename;

        rows.store!.set(rowId, currentRow);

        // Optionally trigger an update event here
        // window.onWidgetApplyEdit?.(parentRowId, headId, selectedFile);
      },

      editorClickHandler: () => {
        this.grid.cancelEdit();
        if (type != "item") return;
        this.pickItem(cellName, dataSourceName, rowId);
        // this.grid.onInputHelperShow_Experimental(focusedCell.rowId, layoutIndex);
      },

      handler: () => {
        this.grid.cancelEdit();
        if (type != "item") return;
        this.pickItem(cellName, dataSourceName, rowId);
      },
    };
  }

  validateCell(result: CellValidationResult, headId: string, rowId: string, value: any): CellValidationResult {
    const { dataType, sourceItemTypeName } = this.grid.getCellMetadata(headId, rowId);

    if (dataType !== "item" || typeof value !== "string") return result;

    const itemNode = aras.uiGetItemByKeyedName(sourceItemTypeName, value, true);
    if (!itemNode) return { valid: false, value: null };

    return {
      valid: true,
      value: {
        id: itemNode.getAttribute("id"),
        keyed_name: value,
        type: sourceItemTypeName,
      },
    };
  }

  //pick item in grid via search dialog
  async pickItem(cellName: string, itemTypeName: string, rowId: string) {
    const currentRow = this.grid.rows.store!.get(rowId);
    if (!currentRow) return;

    const result = await showSearchDialog({
      title: "Select an Item",
      itemtypeName: itemTypeName,
    });

    if (!result) return;

    //Update row with selected item
    currentRow[cellName] = result.itemID;
    currentRow[`${cellName}@aras.keyed_name`] = result.keyed_name;
    this.grid.rows!.set(rowId, currentRow);
  }
}
