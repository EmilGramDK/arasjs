import { Item } from "arasjs-types";

export interface GridControl extends HTMLElement {
  connectId: string;
  setColumns: (columns: GridColumn[]) => void;
  setRows: (items: Item | object[]) => void;
  setCellOnDoubleClick: (callback: (head: string, row: string) => void) => void;
  setRowOnDoubleClick: (callback: (row: string) => void) => void;
  setOnSelectRow: (callback: () => void) => void;

  exportToExcel: (name: string) => void;

  getSelectedRows: () => string[];
  deleteSelectedRows: () => void;

  // all other default methods
  [key: string]: any;
}

export type GridOptions = {
  editable?: boolean;
  copyPaste?: boolean;
  draggableColumns?: boolean;
  freezableColumns?: boolean;
  headWidth?: number;
  multiSelect?: boolean;
  resizable?: boolean;
  rowHeight?: number;
  search?: boolean;
  selectable?: boolean;
  sortable?: boolean;
  tooltipDelay?: number;
};

export type GridColumn = {
  field: string;
  label: string;
  width?: number;
  type?:
    | "text"
    | "string"
    | "date"
    | "boolean"
    | "integer"
    | "float"
    | "item"
    | "list"
    | "calendar"
    | "claim by"
    | "color"
    | "color list"
    | "current_state"
    | "decimal"
    | "extend"
    | "file"
    | "filter list"
    | "image"
    | "img"
    | "link"
    | "md5"
    | "mv_list"
    | "restricted"
    | "select"
    | string;
  dataSource?: string; // ID of itemtype or list
  dataSourceName?: string; // Name of itemtype or list
  searchType?: string;
  searchValue?: string;
  editable?: boolean;
  isReadOnly?: boolean;
  isForeign?: boolean;
  textAlign?: "left" | "right";
  locale?: string;
  helpText?: string;
  helpTooltip?: string;
  pattern?: string;
  columnCssStyles?: {};
  cssStyle?: {};
  cssClass?: string;
  icon?: string;
};
