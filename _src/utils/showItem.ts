import { showToast } from "./notify";

/** Show an item by ID.
 * @param itemTypeName The item type name.
 * @param itemID The item ID.
 */
export function showItem(
  itemTypeName: string,
  itemID: string,
  viewMode: "tab view" | "openFile" = "tab view",
  isUnfocused: boolean = false,
) {
  aras.uiShowItem(itemTypeName, itemID, viewMode, isUnfocused);
}

/** Show an item by criteria.
 * @param itemTypeName The item type name.
 * @param criteriaProperty The property to search by.
 * @param criteriaValue The value to search for.
 */
export function showItemByCriteria(
  itemTypeName: string,
  criteriaProperty: string,
  criteriaValue: string,
  viewMode: "tab view" | "openFile" = "tab view",
  isUnfocused: boolean = false,
) {
  let item = aras.newIOMItem(itemTypeName, "get");
  item.setProperty(criteriaProperty, criteriaValue);
  item = item.apply();

  if (item.isError()) {
    showToast(item.getErrorString(), { type: "error" });
    return;
  }

  const itemID = item.getID();
  showItem(itemTypeName, itemID, viewMode, isUnfocused);
}
