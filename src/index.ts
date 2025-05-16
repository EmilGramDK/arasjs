import "./styles.css";
import "./components/ArasGrid/grid";
import ArasProvider from "./provider";
import { SetArasReady } from "./helpers";
import { ExcelConverterAPI } from "./types/excel-converter";
import { TopWindowHelper, XmlDocument } from "./types/aras";

window.isArasReady = false;

const useArasProvider = async (): Promise<void> => {
  await ArasProvider.initializeArasApp().then((instance) => {
    SetArasReady();
    instance.toggleSpinner(false);
  });
};

declare global {
  var isArasReady: boolean;
  var excelConverterApi: ExcelConverterAPI;
  var arasProvider: ArasProvider;
  var TopWindowHelper: TopWindowHelper;
  var XmlDocument: () => XmlDocument;
  interface Window {
    isArasReady: boolean;
    excelConverterApi: ExcelConverterAPI;
    arasProvider: ArasProvider;
    topWindowHelper: TopWindowHelper;
    XmlDocument: () => XmlDocument;
  }
}

export { useArasProvider, ArasProvider };

// types
export * from "./types/grid";
export * from "./types/toolbar";
export * from "./types/aras";
export * from "./types/dialog";
export * from "./types/innovator";
export * from "./types/item";
export * from "./types/excel-converter";
export * from "./types/aras-tabs";
export * from "./utils";
