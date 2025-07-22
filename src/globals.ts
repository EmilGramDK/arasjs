import type {
  ArasModules,
  Aras,
  ArasCore,
  GlobalStore,
  ReturnBlockerHelper,
} from "./types/aras";
import type { ArasTabs } from "./types/aras-tabs";
import type { GridControl } from "./types/grid";
import type { CuiGridOptions } from "./types/grid-plugin";
import type { ItemClass } from "./types/item";
import type { Toolbar } from "./types/toolbar";

declare global {
  var aras: Aras;
  var ArasCore: ArasCore;
  var ArasModules: ArasModules;
  var store: GlobalStore;
  var returnBlockerHelper: ReturnBlockerHelper;
  var arasTabs: ArasTabs;
  var Grid: GridControl;
  var Toolbar: Toolbar;
  var Item: ItemClass;
  var cuiGrid: (control: GridControl, options: CuiGridOptions) => void;

  interface Window {
    aras: Aras;
    ArasCore: ArasCore;
    ArasModules: ArasModules;
    store: GlobalStore;
    returnBlockerHelper: ReturnBlockerHelper;
    arasTabs: ArasTabs;
    Grid: GridControl;
    Toolbar: Toolbar;
    DOMParser: any;
    Item: ItemClass;
    cuiGrid: (control: GridControl, options: CuiGridOptions) => void;
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
