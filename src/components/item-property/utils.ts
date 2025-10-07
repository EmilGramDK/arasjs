import type { ItemProperty, ItemPropertyState } from "./types";

export const newItemProperty = function (initialState: Partial<ItemPropertyState>): ItemProperty {
  const control = new ItemProperty();
  control.setAttribute("mode", "input-a");
  control.setState({ ...initialState });
  return control;
};
