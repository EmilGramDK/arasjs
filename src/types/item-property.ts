import type { XmlNode } from "./xml-node";

export interface ItemPropertyState {
  label: string;
  itemType: string;
  maxItemsCount: number;
  count: number;
  invalid: boolean;
  showAll: boolean;
  shown: boolean;
  list: Array<{
    label: string;
    value: string;
    itemId: string;
  }>;
  refs: {
    input: HTMLInputElement;
    dropdown: HTMLDivElement;
    button: HTMLButtonElement;
  };
  dom: ItemProperty;
}

export interface ItemProperty extends HTMLElement {
  new (): ItemProperty;
  state: ItemPropertyState;
  setState: (state: Partial<ItemPropertyState>) => void;
  request: () => Promise<XmlNode | null>;
  showDialogHandler: () => Promise<void>;
  onSelectValue: (
    callback: (item: { label: string; value: string; itemId: string }) => void,
  ) => void;
}
