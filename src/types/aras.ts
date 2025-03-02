import { ArasDialogParameters } from "./dialog";
import { Innovator } from "./innovator";
import { Item } from "./item";

export interface Aras {
  [index: string]: unknown;
  getI18NXMLResource: (resource: string) => string;
  calcMD5: (input: string) => string;
  clearStatus: (id: string) => void;
  setStatus: (status: string, image: string) => string;
  generateNewGUID: () => string;
  getBaseURL: () => string;
  itemsCache: Record<string, DefaultHandler>;
  applyItemMethod: (action: string, type: string, body: string) => void;
  newItem: (itemtype: string, optional?: unknown) => XmlNode;
  newIOMItem: (type?: string, action?: string) => Item;
  evalMethod: (method: string | XmlNode, XMLinput: string | XmlNode, args?: unknown) => unknown;
  createXMLDocument: () => XmlDocument;
  uiDrawFieldEx: (field: XmlNode, type: unknown, mode: string) => string;
  getItemProperty: (item: XmlNode, property: string, defaultValue?: string | number) => string;
  getItemByName: (type: string, name: string, levels?: number, configPath?: string, select?: string) => XmlNode;
  getUserID: () => string;
  user: ArasUser;
  getMostTopWindowWithAras: (target?: Window) => Window;
  getMainArasObject: () => Aras;
  getMainWindow: () => ArasWindow;
  getItemTypeForClient: (name: string, searchType: string) => Item;
  getResource: (location: string, key: string, ...parameters: unknown[]) => string;
  getLanguagesResultNd: () => XmlNode;
  getItemTypeId: (name: string) => string;
  getDotNetDatePattern: (pattern: string) => string;
  getItemById: (id: string, type: string, levels?: number) => XmlNode;
  getItemTypeName: (id: string) => string;
  getPermissions: (type: string, itemid: string, itemtype?: string) => boolean;
  setItemProperty: (item: XmlNode, property: string, value: string | XmlNode) => void;
  evalItemMethod: (methodName: string, itemNode: XmlNode, contextParameters: unknown) => void;
  setItemPropertyAttribute: (item: XmlNode, property: string, attribute: string, value: string | boolean) => void;
  convertFromNeutral: (value: unknown, datatype: string, format: string) => unknown;
  getItemFromServer: (type: string, id: string, properties: string) => Item;
  getItemTranslation: (item: XmlNode, property: string, language: string, defaultValue?: string) => string;
  uiShowItem: (
    itemTypeName: string,
    itemID: string,
    viewMode?: "tab view" | "openFile",
    isUnfocused?: boolean
  ) => Promise<boolean>;

  /*
   * uiShowItemEx
   *
   * parameters:
   * 1) itemNd          - item to be shown
   * 2) viewMode        - 'tab view' or 'openFile'
   * 3) isOpenInTearOff - true or false
   */
  uiShowItemEx: (itemNd: XmlNode, viewMode?: string, isOpenInTearOff?: boolean) => boolean;
  getRelationshipTypeId: (name: string) => string;
  confirm: (message: string) => boolean;
  AlertWarning: (message: string) => void;
  AlertError: (error: string | XmlNode | Item | Error) => Promise<void>;
  AlertSuccess: (message: string) => void;
  getScriptsURL: () => string;
  getCommonPropertyValue: (name: string) => unknown;
  setCommonPropertyValue: (name: string, value: unknown) => void;
  getItemTypeDictionary: (name: string) => Item;
  newObject: () => Record<string, unknown>;
  uiGetFormID4ItemEx: (item: XmlNode, type: string) => string;
  getFormForDisplay: (id: string) => Item;
  saveItemExAsync: (item: XmlNode, confirm?: boolean) => Promise<XmlNode>;
  setItemTranslation: (item: XmlNode, property: string, value: string, language: string) => void;
  unlockItemEx: (item: XmlNode) => XmlNode;
  getVariable: (id: string) => unknown;
  setVariable: (id: string, value: unknown) => void;
  isDirtyEx: (item: XmlNode) => boolean;
  isTempEx: (item: XmlNode) => boolean;
  isEditStateEx: (item: XmlNode) => boolean;
  uiFindWindowEx: (id: string) => ArasItemViewWindow;
  isLockedByUser: (item: XmlNode) => boolean;
  uiUnregWindowEx: (id: string) => void;
  uiRegWindowEx: (id: string, wnd: ArasItemViewWindow) => void;
  isNew: (item: XmlNode) => boolean;
  MetadataCache: MetadataCache;
  browserHelper: BrowserHelper;
  Browser: Browser;
  shortcutsHelperFactory: ShortcutsHelperFactory;
  IomInnovator: Innovator;
  Enums: {
    UrlType: {
      SecurityToken: 0;
    };
  };
  OAuthClient: {
    login: (options: any) => void;
    relogin: (options: any) => void;
    logout: (options: any) => void;
    getToken: () => string;
    isLogged: () => boolean;
    getAuthorizationHeader: () => object;
    unauthorizedStatusCode: number;
    getNewTokens: () => Promise<{
      clientId: string;
      access_token: string;
      token_type: string;
      expires_at: number;
      scope: string;
      refresh_token?: string;
    }>;
  };

  getServerBaseURL: () => string;
  getServerURL: () => string;
  _getStartURL: () => string;

  /*-- newRelationship
   *
   *   Method to create a new Relationship for an item
   *   relTypeId = the RelatinshpType id
   *   srcItem   = the source item in the relationship (may be null:i.e. when created with mainMenu)
   *   searchDialog = true or false : if search dialog to be displayed
   *   wnd =  the window from which the dialog is opened
   *
   */
  newRelationship: (
    relTypeId: string,
    srcItem: XmlNode,
    searchDialog: boolean,
    wnd: Window,
    relatedItem: XmlNode | HTMLElement,
    relatedTypeName?: string
  ) => XmlNode;

  registerEventHandler: (eventName: string, win: Window, handler: any) => void;
  unregisterEventHandler: (eventName: string, win: Window, handler: any) => void;
}
interface Browser {
  isIe: () => false;
  isCh: () => boolean;
}
interface ShortcutsHelperFactory {
  getInstance: (wnd: Window) => ShortcutsHelperFactoryInstance;
}
interface ShortcutsHelperFactoryInstance {
  subscribe: (descriptor: Record<string, unknown>, deep: boolean) => void;
}
export interface GlobalStore {
  boundActionCreators: {
    createItemLocalChangesRecord: (itemtype: string, id: string, properties: Record<string, unknown>) => void;
    deleteItemLocalChangesRecord: (itemtype: string, id: string) => void;
  };
  getState: () => {
    dependencies: object;
    favorites: object;
    layout: object;
    localChanges: object;
    preferences: object;
    system: object;
  };
}
export interface ReturnBlockerHelper {
  blockInChildFrames: (target: Window, deep: boolean) => void;
}
export interface ArasWindow extends Window {
  aras: Aras;
  ArasCore: ArasCore;
  ArasModules: ArasModules;
  store: GlobalStore;
  returnBlockerHelper: ReturnBlockerHelper;
}
export interface ArasItemViewWindow extends ArasWindow {
  onSaveCommand: (...parameters: unknown[]) => void;
  onUnlockCommand: (...parameters: unknown[]) => void;
  onSaveUnlockAndExitCommand: (...parameters: unknown[]) => void;
}
export interface ArasFormWindow extends Window {
  getFieldByName: (name: string) => HTMLElement;
  getFieldComponentById: (id: string) => FormField;
}
export interface FormDocument extends Document {
  fieldsTab: Record<string, string>;
}
export interface FormField extends HTMLElement {
  getValue: () => string;
  setValue: (value: string) => void;
  setDisabled: (value: boolean) => void;
  dom?: HTMLElement;
  component?: ComponentField;
}
export type DefaultHandler = (...args: unknown[]) => unknown;
export interface ComponentField extends HTMLElement {
  _getCurrentInputValue: () => string;
  _getInputTemplate: () => void;
  _onInputFocusoutHandler: (e: Event) => void;
  _onButtonClickHandler: (e: Event) => void;
  format: (format: ComponentFormFieldFormat) => void;
  setState: (state: Record<string, unknown>) => void;
  state: {
    refs: Record<string, HTMLElement>;
    disabled: boolean;
    predictedValue: string;
  };
}
export interface ComponentFormFieldFormat {
  children: HTMLElement[];
}
export interface DialogShowResult {
  dialogNode: HTMLElement;
  promise: Promise<SearchDialogResult | string[] | any>;
}
export interface SearchDialogResult {
  itemID: string;
  keyed_name: string;
  item: XmlNode;
}
export interface SvgManager {
  load: (icons: string | string[]) => void;
}
export interface ArasConfirmDialogParameters {
  additionalButtons?: Record<string, unknown>[];
  cancelButtonModifier?: string;
  cancelButtonText?: string;
  okButtonModifier?: string;
  okButtonText?: string;
  title?: string;
  image?: string;
  buttonsOrdering?: string[];
}
interface ArasDialogAttachedEventDescriptor {
  node: HTMLElement;
  eventName: string;
  callback: () => void;
}
export type ArasDialogModule = {
  new (type: "html", parameters: ArasDialogParameters): ArasDialogModule;
  contentNode: HTMLElement;
  dialogNode: HTMLElement;
  attachedEvents: Record<string, ArasDialogAttachedEventDescriptor>;
  show: (type?: string, options?: ArasDialogParameters) => DialogShowResult;
  close: () => void;
  confirm: (message: string, parameters: ArasConfirmDialogParameters) => Promise<string>;
  alert: (message: string, options: object) => Promise<void>;
  promise: Promise<unknown>;
};
export interface ArasModules {
  SvgManager: SvgManager;
  Dialog: ArasDialogModule;
  MaximazableDialog: {
    show: (type: string, options: Record<string, unknown>) => DialogShowResult;
  };
  odataFetch: (url: string, options?: RequestInit) => Promise<any>;
  notify: (message: string, options?: object) => void;
  xmlToJson: (xml: string | XmlNode) => object;
  xmlToODataJson: (xml: string | XmlNode, skipNullValues?: boolean) => object;
  xmlToODataJsonAsCollection: (xml: string) => object[];
  xmlToODataJsonByItemType: (itemNode: XmlNode, itemType: any, options: object) => object;
  metadata: {
    itemType: unknown;
    list: unknown;
    addToPackage: unknown;
    propertyEvents: unknown;
  };
  vault: any;
  jsonToXml: (data: string | object) => string;
}
export interface ArasCore {
  user: ArasUser;
  Dialogs: {
    datePicker: (options: Record<string, unknown>) => Promise<{
      result: unknown;
    }>;
  };
  searchConverter: {
    convertDatesFromNeutral: (criteria: unknown, format: string) => unknown;
    convertDatesToNeutral: (criteria: unknown, format: string) => unknown;
    criteriaToAml: (
      criteria: unknown,
      propName: string,
      options: { type: string; condition: string },
      useNOTNode: boolean
    ) => unknown;
    criteriaToJson: (
      criteria: unknown,
      propName: string,
      options: { type: string; condition: string },
      useNOTNode: boolean
    ) => unknown;
  };
}
export interface MetadataCacheXmlData {
  results: string;
}
export interface MetadataCache {
  GetConfigurableUi: (parameters: Record<string, string>) => MetadataCacheXmlData;
}
export interface BrowserHelper {
  [index: string]: unknown;
  toggleSpinner: (target: Document, enable: boolean) => boolean;
}
export type CuiLayout = {
  new (node: HTMLElement, section: string, parameters: unknown): CuiLayout;
  init: () => Promise<void>;
  destroy: () => void;
  observer: {
    notify: (message: string) => void;
  };
};

export type XmlDocument = {
  [index: string]: unknown;
  new (): XmlDocument;
  documentElement: XmlNode;
  nodeType: number;
  xml: string;
  preserveWhiteSpace: boolean;
  loadXML: (input: string) => boolean;
  transformNode: (input: string) => string;
  createElement: (name: string) => XmlNode;
  selectSingleNode: (xpath: string) => XmlNode | undefined;
  importNode: (node: XmlNode, deep: boolean) => XmlNode;
  selectNodes: (xpath: string) => XmlNode[];
  createNode: (type: number, name: string, namespaceURI: string) => XmlNode;
  createTextNode: (text: string) => XmlNode;
};
export interface XmlNode {
  [index: string]: unknown;
  ownerDocument: XmlDocument;
  xml: string;
  nodeType: number;
  nodeName: string;
  attributes: {
    name: string;
    value: string;
  }[];
  childNodes: XmlNode[];
  cloneNode: (deep: boolean) => XmlNode;
  parentNode: XmlNode | null;
  firstChild: XmlNode | null;
  selectSingleNode: (xpath: string) => XmlNode | undefined;
  appendChild: (child: XmlNode) => void;
  removeChild: (child: XmlNode) => void;
  replaceChild: (candidate: XmlNode, target: XmlNode) => void;
  insertBefore: (candidate: XmlNode, target: XmlNode) => void;
  getAttribute: (name: string) => string;
  setAttribute: (name: string, value: string | boolean) => void;
  removeAttribute: (name: string) => void;
  hasAttribute: (name: string) => boolean;
  hasChildNodes: () => boolean;
  selectNodes: (xpath: string) => XmlNode[];
  textContent: string;
  remove: () => void;
}
export interface SelecitonRange {
  startContainer: HTMLElement;
  startOffset: number;
  collapsed: boolean;
}
export interface ArasUser {
  type: string;
  loginName: string;
  setStorageProperty: (propertyName: string, propertyValue: string) => void;
  userInfo: {
    authenticationType: string;
    database: string;
    defaultVault: string;
    firstName: string;
    lastName: string;
    id: string;
    identityId: string;
    keyedName: string;
    loginName: string;
    picture: string;
    startingPage: string;
    type: string;
  };
}
export interface TopWindowHelper {
  getMostTopWindowWithAras: (target?: Window) => Window;
}
export {};
