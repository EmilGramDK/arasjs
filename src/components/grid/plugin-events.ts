import type { BaseGridPlugin } from "./plugin";
import {
  type GridCellEventPayloadPlugin,
  type GridEventPayloadPlugin,
  type GridPluginEvent,
} from "../../types/grid-plugin";

export const basePluginEvents: Array<GridPluginEvent> = [
  {
    type: "click",
    element: "cell" as const,
    name: "gridLink",
    method(
      this: BaseGridPlugin,
      { data: [headId, rowId, event] }: GridCellEventPayloadPlugin<MouseEvent>,
    ) {
      gridLinkClick(this, headId, rowId, event);
    },
  },
  {
    type: "applyEdit",
    name: "applyEdit",
    method(
      this: BaseGridPlugin,
      { data: [eventData] }: GridEventPayloadPlugin<CustomEvent>,
    ) {
      const { headId, rowId, value } = eventData.detail;
      applyEdit(this, headId, rowId, value);
    },
  },
];

async function gridLinkClick(
  plugin: BaseGridPlugin,
  headId: string,
  rowId: string,
  event: MouseEvent,
) {
  const { rows, head, view } = plugin.grid;

  if (view.defaultSettings.editable) return;

  const headInfo = head.get(headId);
  const initialRowInfo = rows.get(rowId);
  const metadata = plugin.grid.getCellMetadata(headId, rowId);

  if (!headInfo || !initialRowInfo || !metadata) return;

  const linkPropertyId = headInfo.linkProperty
    ? initialRowInfo[headInfo.linkProperty]
    : null;
  const rowInfo = linkPropertyId
    ? rows.get(linkPropertyId) || {}
    : initialRowInfo;

  const propertyName = headInfo.name || headId;
  const currentValue = rowInfo[propertyName];
  const sourceItemTypeName =
    metadata.sourceItemTypeName || rowInfo[`${propertyName}@aras.type`];

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

function applyEdit(
  plugin: BaseGridPlugin,
  headId: string,
  rowId: string,
  value: string,
) {
  const cellMetadata = plugin.grid.getCellMetadata(headId, rowId);
  const { dataType, sourceItemTypeName } = cellMetadata;

  if (dataType != "item" || typeof value != "string") return null;

  const itemNode = aras.uiGetItemByKeyedName(sourceItemTypeName, value, true);
  if (!itemNode) return;

  const item = ArasModules.xmlToODataJson(itemNode) as any;

  plugin.grid.rows.set(rowId, {
    ...plugin.grid.rows.get(rowId),
    [`${headId}`]: item.id,
    [`${headId}@aras.keyed_name`]: item.keyed_name,
  });
}
