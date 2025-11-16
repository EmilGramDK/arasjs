import type { ArasModules, Aras, ArasCore, GlobalStore, ReturnBlockerHelper, TopWindowHelper } from "./aras";
import type { ArasTabs } from "./aras-tabs";
import type { ExcelConverterAPI } from "./excel-converter";
import type { FilterList } from "./filter-list";
import type { GridControl } from "./grid";
import type { ItemClass } from "./item";
import type { ItemProperty } from "./item-property";
import type { Toolbar } from "./toolbar";
import type { TopWork } from "./top-work";
import type { XmlDocument } from "./xml-node";

declare global {
  var arasReady: boolean | undefined;
  var aras: Aras;
  var work: TopWork;
  var ArasCore: ArasCore;
  var ArasModules: ArasModules;
  var store: GlobalStore;
  var returnBlockerHelper: ReturnBlockerHelper;
  var arasTabs: ArasTabs;
  var Grid: GridControl;
  var FilterList: FilterList;
  var ItemProperty: ItemProperty;
  var Toolbar: Toolbar;
  var Item: ItemClass;
  var TopWindowHelper: TopWindowHelper;
  var excelConverterApi: ExcelConverterAPI;
  var XmlDocument: () => XmlDocument;
  var cuiGrid: (control: GridControl, options: CuiGridOptions) => Promise<{ destroy: () => void }>;

  interface Window {
    aras: Aras;
    work: TopWork;
    ArasCore: ArasCore;
    ArasModules: ArasModules;
    store: GlobalStore;
    returnBlockerHelper: ReturnBlockerHelper;
    arasTabs: ArasTabs;
    Grid: GridControl;
    FilterList: FilterList;
    ItemProperty: ItemProperty;
    Toolbar: Toolbar;
    DOMParser: unknown;
    Item: ItemClass;
    topWindowHelper: TopWindowHelper;
    excelConverterApi: ExcelConverterAPI;
    XmlDocument: () => XmlDocument;
    cuiGrid: (control: GridControl, options: CuiGridOptions) => Promise<{ destroy: () => void }>;
  }
}

export * from "./aras";
export * from "./item";
export * from "./itemtype";
export * from "./grid";
export * from "./toolbar";
export * from "./dialog";
export * from "./innovator";
export * from "./xml-node";
export * from "./excel-converter";
export * from "./aras-tabs";
export * from "./aras-user";
export * from "./grid-plugin";
export * from "./item-property";
export * from "./filter-list";
