import { CellValidationResult } from "../../types/grid";
import { GridCellEventPayloadPlugin, GridEventPayloadPlugin, GridPlugin } from "../../types/grid-plugin";

export class BaseGridPlugin extends GridPlugin {
  private readonly dialogTypes = ["text", "color", "image", "formatted text"] as const;

  events = [
    {
      type: "click",
      element: "cell" as const,
      name: "gridLink",
      method(this: GridPlugin, { data: [headId, rowId, event] }: GridCellEventPayloadPlugin<MouseEvent>) {
        this.gridLinkClick(headId, rowId, event);
      },
    },
    {
      type: "applyEdit",
      name: "applyEdit",
      method(this: GridPlugin, { data: [eventData] }: GridEventPayloadPlugin<CustomEvent>) {
        const { headId, rowId, value } = eventData.detail;
        this.applyEdit(headId, rowId, value);
      },
    },
  ];

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
        if (!focusedCell) return;
        this.grid.cancelEdit();
        alert("Not implemented");
        // this.grid.onInputHelperShow_Experimental(focusedCell.rowId, layoutIndex);
      },

      handler: () => {
        alert("Not implemented");
        // this.grid.onInputHelperShow_Experimental(rowId, layoutIndex);
      },
    };
  }

  async gridLinkClick(headId: string, rowId: string, event: MouseEvent) {
    const { rows, head, view } = this.grid;

    if (view.defaultSettings.editable) return;

    const headInfo = head.get(headId);
    const initialRowInfo = rows.get(rowId);
    const metadata = this.grid.getCellMetadata(headId, rowId);

    if (!headInfo || !initialRowInfo || !metadata) return;

    const linkPropertyId = headInfo.linkProperty ? initialRowInfo[headInfo.linkProperty] : null;
    const rowInfo = linkPropertyId ? rows.get(linkPropertyId) || {} : initialRowInfo;

    const propertyName = headInfo.name || headId;
    const currentValue = rowInfo[propertyName];
    const sourceItemTypeName = metadata.sourceItemTypeName || rowInfo[`${propertyName}@aras.type`];

    const target = event.target as HTMLElement;

    if (target.classList?.contains("aras-grid-link")) {
      aras.uiShowItem(sourceItemTypeName, currentValue);
      return;
    }

    const fileIcon = target.closest(".aras-grid-file-icon");
    const isSelectFileIcon = target.closest(".aras-grid-file-icon_select-file");

    if (fileIcon && !isSelectFileIcon) {
      alert("Not implemented");
      // const itemId = rowInfo.id;
      // const fileId = link.replace(/'/g, "").split(",")[1];
      // dialogs.file(headId, rowId, itemId, this.grid, { fileId });
    }
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

  applyEdit(headId: string, rowId: string, value: string) {
    const cellMetadata = this.grid.getCellMetadata(headId, rowId);
    const { dataType, sourceItemTypeName } = cellMetadata;

    if (dataType != "item" || typeof value != "string") return null;

    const itemNode = aras.uiGetItemByKeyedName(sourceItemTypeName, value, true);
    if (!itemNode) return;

    const item = ArasModules.xmlToODataJson(itemNode) as any;

    this.grid.rows.set(rowId, {
      ...this.grid.rows.get(rowId),
      [`${headId}`]: item.id,
      [`${headId}@aras.keyed_name`]: item.keyed_name,
    });
  }
}
