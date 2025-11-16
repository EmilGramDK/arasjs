import type { XmlNode } from "../../types/xml-node";
import type { FilterList, FilterListOption, FilterListState } from "../filter-list";

export interface ItemPropertyListOption extends FilterListOption {
  itemId: string;
}

export interface ItemPropertyState extends FilterListState {
  itemType: string;
  maxItemsCount: number;
  count: number;
}

export interface ItemProperty extends FilterList {
  new (): ItemProperty;
  state: ItemPropertyState;
  setState: (state: Partial<ItemPropertyState>) => void;
  request: () => Promise<XmlNode | null>;
  showDialogHandler: () => Promise<void>;
  onSelectValue: (callback: (item: ItemPropertyListOption | undefined) => void) => void;
}
