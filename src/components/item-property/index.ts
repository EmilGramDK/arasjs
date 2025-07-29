import { tryCatch } from "@emilgramdk/web/core";
import { applyAML, convertItemToXML, showSearchDialog } from "../../utils";
import type { ItemPropertyListOption } from "./types";

/**
 * Extends the Aras FilterList component
 *
 */
customElements.whenDefined("aras-filter-list").then(async () => {
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

  globalThis.ItemProperty.prototype.onSelectValue = function (
    callback: (item: ItemPropertyListOption | undefined) => void,
  ) {
    this.addEventListener("change", () => {
      const { label, list } = this.state;
      const item = list.find((i: ItemPropertyListOption) => i.label === label);
      callback(item);
    });
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
});

export type { ItemProperty, ItemPropertyListOption, ItemPropertyState } from "./types";
export { newItemProperty } from "./utils";
