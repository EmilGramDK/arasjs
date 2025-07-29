import { tryCatch } from "@emilgramdk/web/core";
import { applyAML, convertItemToXML, showSearchDialog } from "../utils";
import { ItemProperty } from "../types/item-property";

export const extendItemProperty = () => {
  if (!window.ItemProperty) return;

  window.ItemProperty.prototype.request = async function () {
    const { label, itemType, maxItemsCount } = this.state;

    const aml = `<AML><Item type="${itemType}" action="get" maxRecords="${maxItemsCount}"><keyed_name condition="like">${label}*</keyed_name></Item></AML>`;
    const { data } = await tryCatch(applyAML(aml, true));
    if (!data) return null;

    for (let i = 0; i < data.getItemCount(); i++) {
      const item = data.getItemByIndex(i).node;
      aras.itemsCache.addItem(item);
    }

    return convertItemToXML(data, true);
  };

  window.ItemProperty.prototype.showDialogHandler = async function () {
    const { itemType } = this.state;

    const item = await showSearchDialog({
      itemtypeName: itemType,
    });
    if (!item) return;

    this.setState({
      label: item.keyed_name,
      items: [
        {
          label: item.keyed_name,
          value: item.keyed_name,
          itemId: item.itemID,
        },
      ],
    });

    this.state.refs.input.dispatchEvent(new CustomEvent("change", { bubbles: true }));
  };

  window.ItemProperty.prototype.onSelectValue = function (
    callback: (item: { label: string; value: string; itemId: string }) => void,
  ) {
    this.addEventListener("change", () => {
      const { label, list } = this.state;
      const item = list.find(
        (i: { label: string; value: string; itemId: string }) => i.label === label,
      );
      if (!item) return;
      callback(item);
    });
  };
};
