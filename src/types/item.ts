import type { BaseItem } from "./base-item";
import type { XmlNode } from "./xml-node";

export interface ItemClass extends Item {
  new <T = BaseItem>(): Item<T>;
  new <T = BaseItem>(itemTypeName: string): Item<T>;
  new <T = BaseItem>(itemTypeName: string, action: string): Item<T>;
}

export type ItemAttributes =
  | "id"
  | "idList"
  | "type"
  | "action"
  | "maxRecords"
  | "select"
  | (string & {});

export interface Item<T = BaseItem, P = keyof T | (string & {})> {
  [index: string]: any;
  ToString(): string;
  loadAML: (aml: string) => void;
  apply: <T = BaseItem>() => Item<T>;
  applyAsync: <T = BaseItem>() => Promise<Item<T>>;
  getProperty: (name: P, defaultValue?: string) => string;
  getPropertyItem: <I = BaseItem>(name: string) => Item<I>;
  getRelationships: <I = BaseItem>(name: string) => Item<I>;
  setAction: (action: string) => void;
  setProperty: (name: P, value: string | number | boolean, defaultValue?: string) => void;
  setPropertyCondition(propertyName: P, condition: string, lang?: string): void;
  setAttribute: (name: ItemAttributes, value: string) => void;
  setPropertyAttribute: (name: string, attribute: ItemAttributes, value: string) => void;
  setID: (id: string) => void;
  getID: () => string;
  getAttribute: (name: ItemAttributes) => string;
  getErrorString: () => string;
  getResult: () => string;
  isError: () => boolean;
  isNew: () => boolean;
  getType: () => string;
  getItemCount: () => number;
  getItemByIndex: <I = BaseItem>(index: number) => Item<I>;
  getItemsByXPath: <I = BaseItem>(xpath: string) => Item<I>;
  getPropertyAttribute: (propery: string, attribute: ItemAttributes) => string;
  removeAttribute: (name: string) => void;
  removeProperty: (name: string) => void;
  removePropertyAttribute: (propery: string, attribute: ItemAttributes) => void;
  node?: XmlNode;
  nodeList?: Array<XmlNode>;
  getErrorDetail: () => string;
  getRelatedItem<I = BaseItem>(): Item<I> | null;
  getRelatedItemID(): string | null;

  /**
   * Creates a new empty Item.
   * @returns A new empty Item.
   */
  newItem<T = BaseItem>(): Item<T>;

  /**
   * Creates a new Item with the specified type.
   * @param itemTypeName - Name of the ItemType.
   * @returns A new Item with the specified type.
   */
  newItem<T = BaseItem>(itemTypeName: string): Item<T>;

  /**
   * Creates a new Item with the specified type and action.
   * @param itemTypeName - Name of the ItemType.
   * @param action - Name of the action to be set on the Item.
   * @returns A new Item with the specified type and action.
   */
  newItem<T = BaseItem>(itemTypeName: string, action: string): Item<T>;

  /* No Descriptions */
  // Methods for manipulating relationships
  addRelationship(item: Item): void;
  appendItem(item: Item): void;
  removeItem(item: Item): void;

  // Cloning
  clone<T = BaseItem>(cloneRelationships: boolean): Item<T>;

  // Property item creation
  createPropertyItem(propName: string, type: string, action: string): Item;

  // Relationship item creation
  createRelatedItem(type: string, action: string): Item;
  createRelationship(type: string, action: string): Item;

  // Fetch operations
  fetchDefaultPropertyValues(overwriteCurrent: boolean): Item;
  fetchLockStatus(): number;
  fetchRelationships(
    relationshipTypeName: string,
    selectList?: string,
    orderBy?: string,
  ): Promise<Item>;

  // Get operations
  getAction(): string | null;

  getErrorCode(): string | null;

  getErrorSource(): string | null;

  getLockStatus(): number;
  getNewID(): string;
  getParentItem<T = BaseItem>(): Item<T> | null;

  getPropertyCondition(propertyName: string, lang?: string): string | null;
  getRelatedItem<T = BaseItem>(): Item<T> | null;
  getRelatedItemID(): string | null;

  setPropertyCondition(propertyName: string, condition: string, lang?: string): void;
  setPropertyItem(propertyName: string, item: Item): Item;
  setRelatedItem(item: Item): void;
  setType(itemTypeName: string): void;

  // Locking and unlocking
  lockItem(): Item<T>;
  unlockItem(): Item<T>;

  // Enumerator for collections
  [Symbol.iterator](): Iterator<Item<T>>;

  // Checks
  isCollection(): boolean;
  isEmpty(): boolean;
  isLogical(): boolean;
  isRoot(): boolean;
}

export interface ODataItem {
  id: string;
  keyed_name: string;
  "@odata.type": string;
  "@odata.id": string;
  [key: string]: unknown;
}
