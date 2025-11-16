/* eslint-disable @typescript-eslint/no-misused-new */
import type { FilterList, FilterListOption, FilterListState } from "./filter-list";
import type { XmlNode } from "./xml-node";

export interface ItemPropertyListOption extends FilterListOption {
  itemId: string;
}

export interface ItemPropertyState extends FilterListState {
  itemType: string;
  count: number;
  maxItemsCount: number;
}

export interface ItemProperty extends FilterList {
  new (): ItemProperty;
  state: ItemPropertyState;
  setState: (state: Partial<ItemPropertyState>) => void;
  request: () => Promise<XmlNode | null>;
  showDialogHandler: () => Promise<void>;
  onSelectValue: (callback: (item: ItemPropertyListOption | undefined) => void) => void;
}
