import { tryCatch } from "@emilgramdk/web/core";
import { applyAML, convertItemToXML, showSearchDialog } from "../utils";

export const extendItemProperty = () => {
  if (!globalThis.ItemProperty) return;

  globalThis.ItemProperty.prototype.request = async function () {
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

  globalThis.ItemProperty.prototype.showDialogHandler = async function () {
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

  globalThis.ItemProperty.prototype.onSelectValue = function (
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
