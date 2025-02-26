import type { ArasModules, Aras, ArasWindow, ExcelConverterAPI, Innovator, Item, XmlNode } from "arasjs-types";
import { InitAras, throwError } from "./helpers";
import ToolbarService from "./services/toolbar.service";
import GridService from "./services/grid.service";
import DialogService from "./services/dialog.service";
import { ArasUserInfo } from "arasjs-types";

export default class ArasProvider {
  private static instance: ArasProvider | null = null;
  public toolbarService: ToolbarService;
  public gridService: GridService;
  public dialogService: DialogService;

  public innovator: Innovator;
  public arasModules: ArasModules;
  public mainWindow: ArasWindow;
  public baseURL: string;
  public scriptsURL: string;

  /** Get Current UserInfo */
  public getUser(): ArasUserInfo {
    return window.aras.user.userInfo;
  }

  /** Toggle Loading Spinner */
  public async toggleSpinner(value: boolean): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return aras.browserHelper.toggleSpinner(document, value);
  }

  /** Get the Aras object. Throws an error if not initialized. */
  public getAras(): Aras {
    return aras ?? throwError("Aras object not initialized");
  }

  /** Get the Aras modules. Throws an error if not initialized. */
  public getArasModules(): ArasModules {
    return this.arasModules ?? throwError("Aras modules not initialized");
  }

  /** Get the Innovator object. Throws an error if not initialized. */
  public getInnovator(): Innovator {
    return this.innovator ?? throwError("Innovator object not initialized");
  }

  /** Get the ExcelConverterAPI object. Throws an error if not initialized. */
  public getExcelConverterApi(): ExcelConverterAPI {
    return excelConverterApi ?? throwError("ExcelConverterAPI object not initialized");
  }

  /** Convert XML Item to IOMItem object. */
  public convertToIOMItem(item: XmlNode, action?: string): Item {
    const aras = this.getAras();
    const newItem = aras.newIOMItem(item.getAttribute("type"), "get");
    newItem.loadAML(item.xml);
    if (action) newItem.setAction(action);
    return newItem;
  }

  /** Fetch items by ID. */
  public async fetchItemsByIds(
    itemTypeName: string,
    itemIds: string[],
    select?: string,
    levels?: number
  ): Promise<Item> {
    const items = arasProvider.innovator.newItem(itemTypeName, "get");
    items.setAttribute("idlist", itemIds.join(","));
    if (select) items.setAttribute("select", select);
    items.setAttribute("levels", levels ? levels.toString() : "0");
    return items.applyAsync();
  }

  /** Show a toast message. */
  public showToast(
    message: string,
    options: {
      type?: "success" | "error" | "warning" | "info";
      timeout?: number;
      position?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
    } = {}
  ): void {
    this.arasModules.notify(message, {
      type: "info",
      timeout: 5000,
      position: "top-right",
      ...options,
    });
  }

  /** Show an alert message. */
  public showAlert(message: string, type: "success" | "error" | "warning" = "error"): void {
    this.arasModules.Dialog.alert(message, { type });
  }

  /** Updates current tab title and icon. */
  public setTabTitle(title?: string, icon?: string): void {
    top?.window.arasTabs.updateTitleTab(window.name, {
      ...(title ? { label: title } : {}),
      ...(icon ? { image: icon } : {}),
    });
  }

  /** Show an item by ID.
   * @param itemTypeName The item type name.
   * @param itemID The item ID.
   */
  public showItem(
    itemTypeName: string,
    itemID: string,
    viewMode: "tab view" | "openFile" = "tab view",
    isUnfocused: boolean = false
  ) {
    aras.uiShowItem(itemTypeName, itemID, viewMode, isUnfocused);
  }

  /** Show an item by criteria.
   * @param itemTypeName The item type name.
   * @param criteriaProperty The property to search by.
   * @param criteriaValue The value to search for.
   */
  public showItemByCriteria(
    itemTypeName: string,
    criteriaProperty: string,
    criteriaValue: string,
    viewMode: "tab view" | "openFile" = "tab view",
    isUnfocused: boolean = false
  ) {
    var item = aras.newIOMItem(itemTypeName, "get");
    item.setProperty(criteriaProperty, criteriaValue);
    item = item.apply();

    if (item.isError()) {
      this.showToast(item.getErrorString(), { type: "error" });
      return;
    }

    const itemID = item.getID();
    this.showItem(itemTypeName, itemID, viewMode, isUnfocused);
  }

  private constructor() {
    this.innovator = aras.IomInnovator;
    this.baseURL = aras.getBaseURL();
    this.scriptsURL = aras.getScriptsURL();
    this.mainWindow = aras.getMainWindow();
    this.arasModules = window.ArasModules;

    this.toolbarService = new ToolbarService(this);
    this.gridService = new GridService(this);
    this.dialogService = new DialogService(this);
  }

  public static async initializeArasApp(): Promise<ArasProvider> {
    if (!ArasProvider.instance) {
      await InitAras();
      ArasProvider.instance = new ArasProvider();
    }
    window.arasProvider = ArasProvider.instance;
    return ArasProvider.instance;
  }

  public static getInstance(): ArasProvider {
    if (!ArasProvider.instance) {
      return throwError("ArasProvider not initialized! You must call initializeArasApp() first.");
    }
    return ArasProvider.instance;
  }
}
