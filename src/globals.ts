import { ArasModules, Aras, ArasCore, GlobalStore, ReturnBlockerHelper } from "./types/aras";
import { ArasTabs } from "./types/aras-tabs";
import { Grid } from "./types/grid";
import { Toolbar } from "./types/toolbar";

declare global {
  var aras: Aras;
  var ArasCore: ArasCore;
  var ArasModules: ArasModules;
  var store: GlobalStore;
  var returnBlockerHelper: ReturnBlockerHelper;
  var arasTabs: ArasTabs;
  var Grid: Grid;
  var Toolbar: Toolbar;

  interface Window {
    aras: Aras;
    ArasCore: ArasCore;
    ArasModules: ArasModules;
    store: GlobalStore;
    returnBlockerHelper: ReturnBlockerHelper;
    arasTabs: ArasTabs;
    Grid: Grid;
    Toolbar: Toolbar;
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
export {};
