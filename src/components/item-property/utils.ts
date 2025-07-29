import type { ItemProperty } from "./types";

export const newItemProperty = function (id: string, itemTypeName: string): ItemProperty {
  const control = new ItemProperty();
  control.id = id;
  control.setAttribute("mode", "input-a");
  control.setAttribute("itemtype", itemTypeName);
  return control;
};
