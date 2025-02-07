/// <reference types="arasjs-types/globals" />
import { ExcelConverterAPI, TopWindowHelper, XmlDocument } from "arasjs-types";
import ArasProvider from "./provider";
import "./styles.css";

const useArasProvider = async (): Promise<void> => {
  const instance = await ArasProvider.initializeArasApp();
  instance.toggleSpinner(false);
};

declare global {
  var excelConverterApi: ExcelConverterAPI;
  var arasProvider: ArasProvider;
  var TopWindowHelper: TopWindowHelper;
  var XmlDocument: () => XmlDocument;
  interface Window {
    excelConverterApi: ExcelConverterAPI;
    arasProvider: ArasProvider;
    topWindowHelper: TopWindowHelper;
    XmlDocument: () => XmlDocument;
  }
}

export { useArasProvider, ArasProvider };
export * from "./types/grid";
export * from "./types/toolbar";
