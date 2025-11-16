import { GridPlugin, type GridPluginEvent } from "../../../../types/grid-plugin";
import { type CellValidationResult } from "../../../../types/grid";
import { showSearchDialog } from "../../../dialog";
import { getListsValuesJson, type ListOption } from "../../../lists";
import { pluginEvents } from "./events";

export class BaseGridPlugin extends GridPlugin {
  private readonly dialogTypes = ["text", "color", "image", "formatted text"];
  private listMap: Map<string, Array<ListOption>> = new Map();

  events: Array<GridPluginEvent> = pluginEvents;

  async init(): Promise<void> {
    this.grid.rows = new Map();
    this.grid.head = new Map();
    this.grid.settings.indexRows = [];
    this.grid.settings.selectedRows = [];

    this.options.getState ??= () => ({});
    this.options.getProps ??= () => ({});
  }

  getCellType(result: string, headId: string): string {
    return (this.grid.head.get(headId, "dataType") as string) || result;
  }

  getEditorType(result: string, headId: string): string {
    const dataType = this.grid.head.get(headId, "dataType") as string;
    return this.dialogTypes.includes(dataType) ? "nonEditable" : dataType || result;
  }

  // eslint-disable-next-line complexity
  getCellMetadata(result: Record<string, unknown>, headId: string, rowId: string): Record<string, unknown> {
    const { head, settings } = this.grid;
    const { getProps, getState } = this.options;

    const headInfo = head.get(headId) as Record<string, unknown>;
    if (!headInfo) return result || {};

    const {
      dataType = "string",
      pattern: customPattern,
      list = [],
      lifeCycleStates = [],
      dataSource,
      dataSourceName,
      scale,
      precision,
      maxLength,
      name,
      field,
    } = headInfo;

    const isList = dataType === "list" || dataType === "filter list";
    const defaultPattern = dataType === "date" ? "short_date" : "";
    const pattern = customPattern || defaultPattern;
    const cellName = name || field || headId;
    const focusedCell = settings?.focusedCell;

    let listOptions = list;
    if (isList && dataSource && (!Array.isArray(list) || list.length === 0)) {
      listOptions = this.getListOptions(dataSource as string, dataType === "filter list");
    }

    return {
      list: listOptions,
      lifeCycleStates,
      currentUserId: aras.getCurrentUserID(),
      format: rowId === "searchRow" ? defaultPattern : pattern,
      sourceItemTypeName: dataSourceName,
      itemType: {},
      scale,
      precision,
      maxLength,
      propsOfLayout: getProps?.() ?? {},
      stateOfLayout: getState?.() ?? {},
      languages: [],
      dataType,

      loadFileHandler: async () => {
        const parentRowId = focusedCell?.rowId;
        if (!parentRowId) return;

        const file = await aras.vault.selectFile();
        const validation = this.grid.validateCell(headId, parentRowId, file, this.grid);

        if (!validation.valid) {
          this.grid.settings.focusedCell = { headId, rowId: parentRowId };
          throw new Error(validation.validationMessage);
        }

        const selectedFile = aras.newItem("File", file);
        if (!selectedFile) return;
        throw new Error("loadFileHandler is not implemented");
      },

      editorClickHandler: () => {
        this.grid.cancelEdit();
        if (dataType !== "item") return;
        this.pickItem(cellName as string, dataSourceName as string, rowId);
      },

      handler: () => {
        this.grid.cancelEdit();
        if (dataType !== "item") return;
        this.pickItem(cellName as string, dataSourceName as string, rowId);
      },
    };
  }

  validateCell(result: CellValidationResult, headId: string, rowId: string, value: unknown): CellValidationResult {
    const { dataType, sourceItemTypeName } = this.grid.getCellMetadata(headId, rowId);

    if (dataType !== "item" || typeof value !== "string") return result;

    const itemNode = aras.uiGetItemByKeyedName(sourceItemTypeName as string, value, true);
    if (!itemNode) return { valid: false, value: undefined };

    return {
      valid: true,
      value: {
        id: itemNode.getAttribute("id"),
        keyed_name: value,
        type: sourceItemTypeName,
      },
    };
  }

  async pickItem(headId: string, itemTypeName: string, rowId: string): Promise<void> {
    if (!headId) throw new Error("Field is missing in headInfo");
    if (!itemTypeName) throw new Error("Item type name is missing in headInfo");

    const result = await showSearchDialog({
      title: "Select an Item",
      itemtypeName: itemTypeName,
    });
    if (!result) return;

    const eventData = { headId, rowId, value: result.keyed_name, propName: headId, dataId: rowId };

    this.grid.settings.focusedCell = { headId, rowId };
    this.grid.dispatchEvent(new CustomEvent("applyEdit", { detail: eventData }));
  }

  getListOptions(listId: string, isFilter = false): Array<ListOption> {
    if (this.listMap.has(listId)) return this.listMap.get(listId) || [];
    const listValues = getListsValuesJson(isFilter ? [] : [listId], isFilter ? [listId] : []);
    const listOptions = listValues.get(listId) || [];
    this.listMap.set(listId, listOptions);
    return listOptions;
  }
}
