import type { FilterList } from "./components/filter-list";
import type { ItemProperty } from "./components/item-property/types";
import type { ArasModules, Aras, ArasCore, GlobalStore, ReturnBlockerHelper } from "./types/aras";
import type { ArasTabs } from "./types/aras-tabs";
import type { GridControl } from "./types/grid";
import type { CuiGridOptions } from "./types/grid-plugin";
import type { ItemClass } from "./types/item";
import type { Toolbar } from "./types/toolbar";

interface TopWork {
  searchContainer: {
    runSearch: () => void;
  };
}

declare global {
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
    DOMParser: any;
    Item: ItemClass;
    cuiGrid: (control: GridControl, options: CuiGridOptions) => Promise<{ destroy: () => void }>;
  }
  namespace JSX {
    interface IntrinsicElements extends React.JSX.IntrinsicElements {
      [elemName: `aras-${string}`]: any; // Allow all "aras-" prefixed elements
    }
  }
}

// Allow Custom Aras Web Component in React
declare module "react/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements extends React.JSX.IntrinsicElements {
      [elemName: `aras-${string}`]: any; // Allow all "aras-" prefixed elements
    }
  }
}
