import "./styles.css";
import { extendItemProperty } from "./extensions/item-property";
import type { TopWindowHelper } from "./types/aras";
import type { ExcelConverterAPI } from "./types/excel-converter";
import type { XmlDocument } from "./types/xml-node";
import { InitAras, SetArasReady, type ArasOptions } from "./utils/providerUtils";
import { toggleSpinner } from "./utils/toggleSpinner";

window.isArasReady = false;

export const useAras = async (options: ArasOptions): Promise<void> => {
  InitAras(options)
    .then(() => {
      extendItemProperty();
      SetArasReady();
    })
    .finally(() => {
      toggleSpinner(false);
    });
};
export const useArasProvider = useAras;

export * from "./components/grid";
export * from "./components/toolbar";

export * from "./types/aras";
export * from "./types/item";
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
