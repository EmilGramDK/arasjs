import type {
  menuItemT,
  ToolbarControl,
  ToolbarControlOptions,
  ToolbarItem,
} from "../../types/toolbar";

export const createToolbar = function (
  container: string | HTMLElement,
  options: ToolbarControlOptions = {},
): ToolbarControl {
  const tbContainer =
    typeof container === "string" ? document.getElementById(container) : container;
  if (!tbContainer) throw new Error(`Toolbar Container with ID: ${container} not found`);

  const tbControl = document.createElement("aras-toolbar") as ToolbarControl;
  tbContainer.innerHTML = "";
  tbContainer.appendChild(tbControl);

  return tbControl;
};

export const onClickItem = (parentItem: ToolbarItem, event: Event, callback: any) => {
  const node = event.target;
  if (!(node instanceof Element) || !parentItem) return;

  if (parentItem.type !== "dropdownMenu") return callback(parentItem.id);

  const targetNode = node.closest<HTMLElement>("li[data-index]");
  if (!targetNode?.dataset.index || !("data" in parentItem)) return;

  return callback(targetNode.dataset.index);
};

export const generateItemsMap = (items: ToolbarItem[]): Map<string, ToolbarItem> => {
  const itemsMap = new Map<string, ToolbarItem>();

  items.forEach((item) => {
    item.id = item.id || Math.random().toString(36).slice(2);

    if (item.type === "dropdownMenu") {
      const menuItem = item as menuItemT;
      const data = {
        ...menuItem,
        data: generateItemsMap(menuItem.children),
        roots: menuItem.children.map((child) => child.id),
      };
      itemsMap.set(item.id, data);
      return;
    }

    itemsMap.set(item.id, item);
  });

  return itemsMap;
};
