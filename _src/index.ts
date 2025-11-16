import type { TopWindowHelper } from "./types/aras";
import type { ExcelConverterAPI } from "./types/excel-converter";
import type { XmlDocument } from "./types/xml-node";
import { extendFilterList } from "./components/filter-list/extend";
import { extendItemProperty } from "./components/item-property/extend";
import { initAras, setArasReady } from "./utils/providerUtils";
import { toggleSpinner } from "./utils/toggleSpinner";
import "./assets/arasjs.css";

window.isArasReady = false;

/**
 * @description Initializes the Aras environment, injecting necessary styles and scripts.
 * @param keepSpinner If true, the spinner will not be removed after initialization.
 * @returns {Promise<void>} A promise that resolves when the initialization is complete.
 */
export const useArasJS = async (keepSpinner = false): Promise<void> => {
  await initAras()
    .then(() => {
      extendFilterList();
      extendItemProperty();
      setArasReady();
    })
    .finally(() => {
      if (keepSpinner) return;
      toggleSpinner(false);
    });
};
export const useArasProvider = useArasJS;

export * from "./components/grid";
export * from "./components/filter-list";
export * from "./components/item-property";
export * from "./types/aras";
export * from "./types/item";
export * from "./types/itemtype";
export * from "./types/grid";
export * from "./types/toolbar";
export * from "./types/dialog";
export * from "./types/innovator";
export * from "./types/xml-node";
export * from "./types/excel-converter";
export * from "./types/aras-tabs";
export * from "./types/aras-user";
export * from "./types/grid-plugin";

declare global {
  var isArasReady: boolean;
  var TopWindowHelper: TopWindowHelper;
  var excelConverterApi: ExcelConverterAPI;
  var XmlDocument: () => XmlDocument;
  interface Window {
    isArasReady: boolean;
    topWindowHelper: TopWindowHelper;
    excelConverterApi: ExcelConverterAPI;
    XmlDocument: () => XmlDocument;
  }
}
