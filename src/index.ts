/// <reference types="arasjs-types/globals" />
import { ExcelConverterAPI, TopWindowHelper, XmlDocument } from "arasjs-types";
import ArasProvider from "./provider";
import "./styles.css";
import { SetArasReady } from "./helpers";

window.isArasReady = false;

const useArasProvider = async (): Promise<void> => {
  const instance = await ArasProvider.initializeArasApp();
  SetArasReady();
  instance.toggleSpinner(false);
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
export * from "./types/grid";
export * from "./types/toolbar";