// import type { ToolbarItem } from "../../types/toolbar";
// import { generateItemsMap, onClickItem } from "./utils";

// /**
//  * Extends the Aras Toolbar component
//  *
//  */
// customElements.whenDefined("aras-toolbar").then(() => {
//   const toolbarPrototype = customElements.get("aras-toolbar")?.prototype;
//   if (!toolbarPrototype) return;

//   toolbarPrototype.setItems = function (items: Array<ToolbarItem>) {
//     this.data = generateItemsMap(items);
//   };

//   toolbarPrototype.setItemEnabled = function (itemId: string, value: boolean) {
//     const item = this.data.get(itemId);
//     if (item.disabled === !value) return;
//     this.data.set(itemId, { ...item, disabled: !value });
//     return this.render();
//   };

//   toolbarPrototype.setItemHidden = function (itemId: string, value: boolean = true) {
//     const item = this.data.get(itemId);
//     if (!item) return;
//     item.hidden = value;
//     this.data.set(itemId, item);
//     this.render();
//   };

//   toolbarPrototype.setOnClick = function (callback: (itemId: string) => void) {
//     this.on("click", (itemId: string, event: Event) => {
//       const parentItem = this.data.get(itemId);
//       onClickItem(parentItem, event, callback);
//     });
//   };
// });

// export { createToolbar, generateItemsMap } from "./utils";
