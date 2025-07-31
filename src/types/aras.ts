import type { ArasObjectUser } from "./aras-user";
import type { ArasDialogParameters } from "./dialog";
import type { Innovator } from "./innovator";
import type { Item, ODataItem } from "./item";
import type { ItemType } from "./itemtype";
import type { XmlDocument, XmlNode } from "./xml-node";

/**
 *
 */
export interface Aras {
  [index: string]: any;
  vault: any;
  itemsCache: Record<string, DefaultHandler>;

  getCurrentUserID: () => string;
  logout: () => void;
  lockItemAsync: (itemID: string, itemTypeName: string) => Promise<XmlNode>;
  unlockItemAsync: (itemID: string, itemTypeName: string) => Promise<XmlNode>;
  getI18NXMLResource: (resource: string) => string;
  calcMD5: (input: string) => string;
  clearStatus: (id: string) => void;
  setStatus: (status: string, image: string) => string;
  generateNewGUID: () => string;
  getBaseURL: () => string;
  applyItemMethod: (action: string, type: string, body: string) => void;
  newItem: (itemtype: string, optional?: unknown) => XmlNode;
  newIOMItem: (type?: string, action?: string) => Item;
  evalMethod: (method: string | XmlNode, XMLinput: string | XmlNode, args?: unknown) => unknown;
  createXMLDocument: () => XmlDocument;
  uiDrawFieldEx: (field: XmlNode, type: unknown, mode: string) => string;
  getItemProperty: (item: XmlNode, property: string, defaultValue?: string | number) => string;
  getItemByName: (
    type: string,
    name: string,
    levels?: number,
    configPath?: string,
    select?: string,
  ) => XmlNode;
  getItemByKeyedName: (
    type: string,
    keyedName: string,
    levels?: number,
    configPath?: string,
    select?: string,
  ) => XmlNode;
  uiGetItemByKeyedName: (typeName: string, keyedName: string, skipDialog?: boolean) => XmlNode;
  getUserID: () => string;
  user: ArasObjectUser;
  getMostTopWindowWithAras: (target?: Window) => Window;
  getMainArasObject: () => Aras;
  getMainWindow: () => ArasWindow;
  getItemTypeForClient: (criteriaValue: string, criteriaName: string) => Item;
  getItemTypeNodeForClient: (criteriaValue: string, criteriaName: string) => XmlNode;
  getItemTypeDictionaryJson: (criteriaValue: string, criteriaName: string) => Promise<ItemType>;
  getResource: (location: string, key: string, ...parameters: Array<unknown>) => string;
  getLanguagesResultNd: () => XmlNode;
  getItemTypeId: (name: string) => string;
  getDotNetDatePattern: (pattern: string) => string;
  getItemById: (id: string, type: string, levels?: number) => XmlNode;
  getItemTypeName: (id: string) => string;
  getPermissions: (type: string, itemid: string, itemtype?: string) => boolean;
  setItemProperty: (item: XmlNode, property: string, value: string | XmlNode) => void;
  evalItemMethod: (methodName: string, itemNode: XmlNode, contextParameters: unknown) => void;
  setItemPropertyAttribute: (
    item: XmlNode,
    property: string,
    attribute: string,
    value: string | boolean,
  ) => void;
  convertFromNeutral: (value: unknown, datatype: string, format: string) => unknown;
  getItemFromServer: (type: string, id: string, properties: string) => Item;
  getItemTranslation: (
    item: XmlNode,
    property: string,
    language: string,
    defaultValue?: string,
  ) => string;
  uiShowItem: (
    itemTypeName: string,
    itemID: string,
    viewMode?: "tab view" | "openFile",
    isUnfocused?: boolean,
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
  MetadataCacheJson: MetadataCacheJson;
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
    login: (options: any) => Promise<void>;
    relogin: (options: any) => Promise<void>;
    logout: (options: any) => Promise<void>;
    getToken: () => string;
    isLogged: () => boolean;
    getAuthorizationHeader: () => Record<string, unknown>;
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
    relatedTypeName?: string,
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
    createItemLocalChangesRecord: (
      itemtype: string,
      id: string,
      properties: Record<string, unknown>,
    ) => void;
    deleteItemLocalChangesRecord: (itemtype: string, id: string) => void;
  };
  getState: () => {
    dependencies: Record<string, unknown>;
    favorites: Record<string, unknown>;
    layout: Record<string, unknown>;
    localChanges: Record<string, unknown>;
    preferences: Record<string, unknown>;
    system: Record<string, unknown>;
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
  onSaveCommand: (...parameters: Array<unknown>) => void;
  onUnlockCommand: (...parameters: Array<unknown>) => void;
  onSaveUnlockAndExitCommand: (...parameters: Array<unknown>) => void;
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

export type DefaultHandler = (...args: Array<unknown>) => unknown;
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
  children: Array<HTMLElement>;
}

export interface DialogShowResult {
  dialogNode: HTMLElement;
  promise: Promise<SearchDialogResult | Array<string> | any>;
}

export interface SearchDialogResult {
  itemID: string;
  keyed_name: string;
  item: XmlNode;
}

export interface SvgManager {
  load: (icons: string | Array<string>) => void;
}

export interface ArasConfirmDialogParameters {
  additionalButtons?: Array<Record<string, unknown>>;
  cancelButtonModifier?: string;
  cancelButtonText?: string;
  okButtonModifier?: string;
  okButtonText?: string;
  title?: string;
  image?: string;
  buttonsOrdering?: Array<string>;
}

interface ArasDialogAttachedEventDescriptor {
  node: HTMLElement;
  eventName: string;
  callback: () => void;
}

export type ArasDialogModule = {
  new (type: "html" | "iframe", parameters: ArasDialogParameters): ArasDialogModule;
  contentNode: HTMLElement;
  dialogNode: HTMLElement;
  attachedEvents: Record<string, ArasDialogAttachedEventDescriptor>;
  show: (type?: string, options?: ArasDialogParameters) => DialogShowResult;
  close: () => void;
  confirm: (message: string, parameters: ArasConfirmDialogParameters) => Promise<string>;
  alert: (message: string, options: Record<string, unknown>) => Promise<void>;
  maximize: () => void;
  promise: Promise<unknown>;
};

export interface ArasModules {
  SvgManager: SvgManager;
  Dialog: ArasDialogModule;
  MaximazableDialog: ArasDialogModule;
  odataFetch: (url: string, options?: RequestInit) => Promise<unknown>;
  notify: (message: string, options?: Record<string, unknown>) => void;
  xmlToJson: (xml: string | XmlNode) => unknown;
  xmlToODataJson: <T extends ODataItem>(xml: string | XmlNode, skipNullValues?: boolean) => T;
  xmlToODataJsonAsCollection: <T extends ODataItem>(xml: string) => Array<T>;
  xmlToODataJsonByItemType: <T extends ODataItem>(
    itemNode: XmlNode,
    itemType: any,
    options: Record<string, unknown>,
  ) => T;
  metadata: {
    itemType: unknown;
    list: unknown;
    addToPackage: unknown;
    propertyEvents: unknown;
  };
  vault: any;
  jsonToXml: (data: string | Record<string, unknown>) => XmlNode;
  soap: (data: Record<string, unknown>, options: Record<string, unknown>) => Promise<unknown>;
}

export interface ArasCore {
  user: ArasObjectUser;
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
      useNOTNode: boolean,
    ) => unknown;
    criteriaToJson: (
      criteria: unknown,
      propName: string,
      options: { type: string; condition: string },
      useNOTNode: boolean,
    ) => unknown;
  };
}

export interface MetadataCacheXmlData {
  results: string;
}

export interface MetadataCache {
  GetConfigurableUi: (parameters: Record<string, string>) => MetadataCacheXmlData;
  GetList: (listId: string) => MetadataCacheXmlData;
  GetItem: (id: string) => MetadataCacheXmlData;
  GetItemType: (criteriaValue: string, criteriaName: string) => MetadataCacheXmlData;
  GetItemTypeId: (itemTypeName: string) => MetadataCacheXmlData;
}

export interface MetadataCacheJson {
  GetConfigurableUi: (parameters: Record<string, string>) => Promise<unknown>;
  GetList: (listId: Array<string>, filterListId?: Array<string>) => Promise<unknown>;
  GetItem: (id: string) => Promise<unknown>;
  GetItemType: (criteriaValue: string, criteriaName: string) => Promise<unknown>;
  GetItemTypeId: (itemTypeName: string) => Promise<unknown>;
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

export interface SelecitonRange {
  startContainer: HTMLElement;
  startOffset: number;
  collapsed: boolean;
}

export interface TopWindowHelper {
  getMostTopWindowWithAras: (target?: Window) => Window;
}
