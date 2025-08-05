import type { Item } from "../types/item";

export function forEach(
  itemResult: Item,
  callback: (item: Item, index: number, itemResult: Item) => void,
) {
  if (!itemResult || typeof itemResult.getItemByIndex !== "function") {
    throw new Error("Invalid Aras Item");
  }

  const isSingleItem = !!itemResult.node && !itemResult.nodeList;

  if (isSingleItem) {
    callback(itemResult, 0, itemResult);
  } else if (itemResult.nodeList && itemResult.nodeList.length > 0) {
    for (let i = 0; i < itemResult.nodeList.length; i++) {
      const item = itemResult.getItemByIndex(i);
      callback(item, i, itemResult);
    }
  }
}
