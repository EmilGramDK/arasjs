import type { CellValidationResult, GridControl } from "./grid";

export interface GridEventPayloadPlugin<T = Event> {
  name: string;
  break: () => void;
  data: [T];
}

export interface GridCellEventPayloadPlugin<T = Event> {
  name: string;
  break: () => void;
  data: [string, string, T];
}

export interface GridPluginEvent {
  type: string;
  element?: Parameters<GridControl["on"]>[2];
  name: string;
  method(payload: GridEventPayloadPlugin | GridCellEventPayloadPlugin): void;
}

export abstract class GridPlugin {
  grid!: GridControl;
  options!: {
    getState: () => any;
    getProps: () => any;
    [key: string]: unknown;
  };

  // Optional methods
  init?(): Promise<void>;

  setupAfterInit?(): void;

  events?: Array<GridPluginEvent>;

  getCellType?(result: string, headId: string, rowId: string, value: unknown): string;

  getCellStyles?(
    result: Record<string, string>,
    headId: string,
    itemId: string,
    rowId: string,
  ): Record<string, string>;

  getEditorType?(
    result: string,
    headId: string,
    itemId: string,
    value: unknown,
    type: string,
    rowId: string,
  ): string;

  getRowClasses?(result: string, rowId: string): string;

  getCellMetadata?(
    cellMetaData: Record<string, unknown>,
    headId: string,
    rowId: string,
    type: string,
  ): Record<string, unknown>;

  checkEditAvailability?(
    result: boolean,
    headId: string,
    itemId: string,
    grid: GridControl,
  ): boolean;

  validateCell?(
    result: CellValidationResult,
    headId: string,
    rowId: string,
    value: unknown,
    grid: GridControl,
  ): CellValidationResult;

  sort?(): Promise<void>;

  // Allow arbitrary additional properties or methods
  [key: string]: any;
}

export interface CuiGridOptions {
  plugins?: Array<Omit<GridPlugin, "grid" | "options">>;
  [key: string]: unknown;
}
