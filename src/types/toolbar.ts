export interface ToolbarControl extends HTMLElement {
  setItems(items: ToolbarItem[]): void;
  setItemHidden(itemId: string): void;
  setItemEnabled(itemId: string, value: boolean): void;
  setOnClick(callback: (itemId: string) => void): void;

  // all other default methods
  [key: string]: any;
}

export type ToolbarControlOptions = {};

export interface toolbarItemT {
  type: string; // This acts as the discriminator
  id: string;
  disabled?: boolean;
  hidden?: boolean;
  image?: string;
  label?: string;
  aria_label?: string;
  tooltip_template?: string;
  right?: boolean;
  cssClass?: string;
  cssStyle?: string | null;
  attributes?: Record<string, string>;
  additional_data?: Record<string, string>;
}

export interface textItemT extends toolbarItemT {
  type: "textbox"; // Specific type for this interface
  value?: string;
}

export interface checkedItemT extends toolbarItemT {
  type: "checkbox"; // Specific type for this interface
  checked: boolean;
  group_id?: string;
}

export interface buttonItemT extends toolbarItemT {
  type: "button"; // Specific type for this interface
  state?: boolean;
  clickEventType?: string;
}

export interface selectItemT extends toolbarItemT {
  type: "select"; // Specific type for this interface
  options: Array<{ type?: string; value: string; label?: string }>;
  value?: string;
  selectedIndex?: string;
}

export interface menuItemT extends toolbarItemT {
  type: "dropdownMenu"; // Specific type for this interface
  children: Array<toolbarItemT>;
}

export interface separatorItemT extends toolbarItemT {
  type: "separator"; // Specific type for this interface
}

export type ToolbarItem =
  | toolbarItemT
  | selectItemT
  | checkedItemT
  | menuItemT
  | buttonItemT
  | textItemT
  | separatorItemT;

export interface toolbarDataOptionsRender {
  rightContainerOrder: number;
  isOverflowVisible: boolean;
  isOverflowAllowed: boolean;
  isVertical: boolean;
  isExpandButtonHidden: boolean;
  isToolbarRole: boolean;
}
