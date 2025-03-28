import { Item } from "./item";

export interface GridControl extends Grid {
  new (container: HTMLElement, options?: GridOptions): GridControl;
  setColumns: (columns: GridColumn[]) => void;
  setRows: (items: Item | object[]) => void;

  // event handlers
  setCellOnDoubleClick: (callback: (head: string, row: string) => void) => void;
  setOnHeadContextMenu: (callback: (head: string, event: Event) => void) => void;
  setOnCellContextMenu: (callback: (head: string, rowId: string, event: Event) => void) => void;
  setRowOnDoubleClick: (callback: (row: string) => void) => void;
  setOnSelectRow: (callback: () => void) => void;

  exportToExcel: (name: string) => void;

  getSelectedRows: () => string[];
  deleteSelectedRows: () => void;
}

export interface Grid extends HTMLElement {
  new (container: HTMLElement, options?: any): Grid;
  eventCallbacks: WeakMap<object, any>;
  settings: GridSettings;
  keyboard: any;
  view: GridView;
  head: HeadWrap;
  rows: RowsWrap;
  getCellType: (headId: string, itemId?: string, value?: any, type?: string) => string;
  getCellSpan: (_headId: string, _itemId: string, _rowId: string) => GridCellSpan | null;
  getCellStyles: () => Record<string, string>;
  getItemId: (headId: string, rowId: string) => string;
  validateCell: (headId: string, rowId: string, value: any, _grid: Grid) => CellValidationResult;
  getEditorType: (headId: any, itemId: any, value: any, type: any) => any;
  checkEditAvailability: (_headId: string, _itemId: string, _grid: Grid) => boolean;
  getCellMetadata: (_headId: string, _itemId: string, _type: string) => Record<string, any> | null;
  clientSort: (sortableArray: string[]) => void;
  sort: () => Promise<void>;
  cancelEdit: () => void;
  resetData: () => void;
  getRowClasses: () => string;
  render: () => Promise<void>;
  on: (type: string, callback: any, element?: "cell" | "head" | "row") => void;
  off: (type: string, callback: any) => void;
  [key: string]: any;
}

export interface GridOptions {
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
  autofill?: boolean | undefined;
  orderBy?: { headId: string; desc?: boolean };
  enableDefaultLinkClick?: boolean;
}

export interface GridSettings {
  frozenColumns: number;
  indexHead: string[];
  indexRows: string[];
  selectedRows: string[];
  copyArea: Pick<GridFocusCell, "headId" | "rowId"> | null;
  focusedCell: GridFocusCell | null;
  selection: GridSelectionRange | null;
  orderBy: Array<{ headId: string; desc?: boolean }>;
}

export interface GridView {
  delayForDragDetection: number;
  defaultSettings: GridSettings;
  scrollableElement: HTMLElement;
  autofill: boolean;
  destroyEventHandlers: () => void;
  initialization: () => void;
  render: () => Promise<void>;
  showMessageActiveCell: () => void;
}

export type GridColumns = GridColumn[];
export interface GridColumn extends GridHeadData {
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
  defaultValue?: any;
}

export interface GridCellViewMode {
  headId: string;
  rowId: string;
  value: any;
  type: string;
  editing: boolean;
}

export interface GridCellApplyEditParameters {
  headId: string;
  rowId: string;
  value: any;
}

export interface GridCellSpan {
  headId: string;
  rowId: string;
  colspan?: number;
  rowspan?: number;
}

export interface GridCellMetadata {
  list?: Array<{
    filter: string;
    inactive: boolean;
    label: string;
    value: string;
  }>;
  scale?: number;
  format?: "short_date" | "short_date_time" | "long_date" | "long_date_time";
  [property: string]: any;
}

export interface CellValidationResult {
  valid: boolean;
  validationMessage?: string;
  value?: any;
}

export interface GridFocusCell {
  headId: string;
  rowId: string;
  editing?: boolean;
  toolTipMessage?: string;
  valid?: boolean;
  isEditInProgress?: boolean;
  isPasted?: boolean;
}

type focus = GridFocusCell | null;

export const SelectionRangeStates = {
  InProgress: "inprogress",
  Default: "default",
} as const;
type RangeStateKeys = keyof typeof SelectionRangeStates;
export interface GridSelectionRange {
  column: string;
  endcolumn: string;
  row: string;
  endrow: string;
  state: (typeof SelectionRangeStates)[RangeStateKeys];
}

type GridCopiedArea = Pick<GridFocusCell, "headId" | "rowId">;

interface EventListenerDescriptor {
  target: HTMLElement;
  event: string;
  listener: EventListenerOrEventListenerObject;
}

interface FilldownSessionData {
  startX: number;
  startY: number;
  bodyBoundary: DOMRect;
  scrollYSpeed: number;
  scrollXSpeed: number;
  pointerId: number;
}

interface FilldownData {
  session: FilldownSessionData | null;
  eventHandlers: EventListenerDescriptor[];
  control: HTMLElement;
}

interface SelectionData {
  range: GridSelectionRange;
  control: HTMLElement;
}

export interface GridHeadData {
  name?: string;
  label?: string;
  searchType?: string;
  linkProperty?: string;
  questionMark?: boolean;
  [key: string]: any;
}

export interface HeadWrap extends Map<string, any> {
  store?: Map<string, any>;
  get: (key: string, prop?: string) => any;
  set: (key: string, value: any, prop?: string) => any;
}

export interface RowsWrap extends Map<string, any> {
  store?: Map<string, any>;
  get: (key: string, prop?: string) => any;
  set: (key: string, value: any, prop?: string) => any;
}

export const DEFAULT_SETTINGS = {
  rowHeight: 32,
  headWidth: 18,
  multiSelect: true,
  resizable: true,
  search: false,
  editable: false,
  autofill: undefined,
  sortable: true,
  freezableColumns: false,
  draggableColumns: true,
  tooltipDelay: 1000,
  copyPaste: true,
  selectable: true,
} as const;
