import { showSearchDialog } from "../../utils";
import type { ItemPropertyListOption } from "./types";

export const extendItemProperty = () => {
  if (!window.ItemProperty) return;

  window.ItemProperty.prototype.request = function () {
    const { label, itemType, maxItemsCount } = this.state;
    const req = `<Item type="${itemType}" action="get" maxRecords="${maxItemsCount}"><keyed_name condition="like">${label}*</keyed_name></Item>`;
    return ArasModules.soap(req, { async: true });
  };

  window.ItemProperty.prototype.onSelectValue = function (
    callback: (item: ItemPropertyListOption | undefined) => void,
  ) {
    this.addEventListener("change", () => {
      const { label, list } = this.state;
      const item = list.find((i: ItemPropertyListOption) => i.label === label);
      callback(item);
    });
  };

  window.ItemProperty.prototype.showDialogHandler = async function () {
    const { itemType } = this.state;

    const item = await showSearchDialog({
      itemtypeName: itemType,
    });
    if (!item) return;

    this.setState({
      label: item.keyed_name,
      list: [
        {
          label: item.keyed_name,
          value: item.keyed_name,
          itemId: item.itemID,
        },
      ],
    });

    this.state.refs.input.dispatchEvent(new CustomEvent("change", { bubbles: true }));
  };
};
