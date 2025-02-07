import ArasProvider from "../provider";
import { menuItemT, ToolbarControl, ToolbarItem } from "../types/toolbar";

export default class ToolbarService {
  #arasProvider: ArasProvider;

  constructor(arasProvider: ArasProvider) {
    this.#arasProvider = arasProvider;
  }

  public createToolbar(containerID: string): ToolbarControl {
    const toolbarContainer = document.getElementById(containerID);
    if (!toolbarContainer) throw new Error(`Toolbar Container with ID: ${containerID} not found`);

    const tbControl = document.createElement("aras-toolbar") as ToolbarControl;
    toolbarContainer.innerHTML = "";
    toolbarContainer.appendChild(tbControl);

    tbControl.setItems = (items: ToolbarItem[]) => {
      tbControl.data = this.generateItemsMap(items);
    };

    tbControl.setItemEnabled = (itemId: string, value: boolean) => {
      const item = tbControl.data.get(itemId);
      if (item.disabled === !value) return;
      tbControl.data.set(itemId, { ...item, disabled: !value });
      return tbControl.render();
    };

    tbControl.setItemHidden = (itemId: string, value: boolean = true) => {
      const item = tbControl.data.get(itemId);
      if (!item) return;
      item.hidden = value;
      tbControl.data.set(itemId, item);
      tbControl.render();
    };

    tbControl.setOnClick = (callback: (itemId: string) => void) => {
      tbControl.on("click", (itemId: string, event: Event) => {
        const parentItem = tbControl.data.get(itemId);
        this.onClickItem(parentItem, event, callback);
      });
    };

    return tbControl;
  }

  private onClickItem(parentItem: ToolbarItem, event: Event, callback: any) {
    const node = event.target;
    if (!(node instanceof Element) || !parentItem) return;

    if (parentItem.type !== "dropdownMenu") return callback(parentItem.id);

    const targetNode = node.closest<HTMLElement>("li[data-index]");
    if (!targetNode?.dataset.index || !("data" in parentItem)) return;

    return callback(targetNode.dataset.index);
  }

  private generateItemsMap(items: ToolbarItem[]): Map<string, ToolbarItem> {
    const itemsMap = new Map<string, ToolbarItem>();

    items.forEach((item) => {
      item.id = item.id || Math.random().toString(36).slice(2);

      if (item.type === "dropdownMenu") {
        const menuItem = item as menuItemT;
        const data = {
          ...menuItem,
          data: this.generateItemsMap(menuItem.children),
          roots: menuItem.children.map((child) => child.id),
        };
        itemsMap.set(item.id, data);
        return;
      }

      itemsMap.set(item.id, item);
    });

    return itemsMap;
  }
}
