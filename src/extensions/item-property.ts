import { tryCatch } from "@emilgramdk/utils";
import { applyAML, convertItemToXML } from "../utils";
import type { XmlNode } from "../types/xml-node";

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
};

declare global {
  interface Window {
    ItemProperty: {
      prototype: {
        state: {
          label: string;
          itemType: string;
          maxItemsCount: number;
        };
        request: () => Promise<XmlNode | null>;
      };
    };
  }
}
