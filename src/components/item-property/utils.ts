import type { ItemProperty } from "./types";

export const newItemProperty = function (itemTypeName: string): ItemProperty {
  const control = new ItemProperty();
  control.setAttribute("mode", "input-a");
  control.setAttribute("itemtype", itemTypeName);
  return control;
};
