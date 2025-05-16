import { XmlNode } from "./aras";

export interface Item {
  [index: string]: unknown;
  ToString(): string;
  loadAML: (aml: string) => void;
  apply: () => Item;
  applyAsync: () => Promise<Item>;
  getProperty: (name: string, defaultValue?: string) => string;
  getPropertyItem: (name: string) => Item;
  getRelationships: (name: string) => Item;
  setAction: (action: string) => void;
  setProperty: (name: string, value: string | number | boolean, defaultValue?: string) => void;
  setPropertyCondition(propertyName: string, condition: string, lang?: string): void;
  setAttribute: (name: string, value: string) => void;
  setPropertyAttribute: (name: string, attribute: string, value: string) => void;
  setID: (id: string) => void;
  getID: () => string;
  getId: () => string;
  getAttribute: (name: string) => string;
  getErrorString: () => string;
  getResult: () => string;
  isError: () => boolean;
  isNew: () => boolean;
  getType: () => string;
  getItemCount: () => number;
  getItemByIndex: (index: number) => Item;
  getItemsByXPath: (xpath: string) => Item;
  getPropertyAttribute: (propery: string, attribute: string) => string;
  removeAttribute: (name: string) => void;
  removeProperty: (name: string) => void;
  removePropertyAttribute: (propery: string, attribute: string) => void;
  node?: XmlNode;
  nodeList?: XmlNode[];
  getErrorDetail: () => string;
  getRelatedItem(): Item | null;
  getRelatedItemID(): string | null;

  /**
   * Creates a new empty Item.
   * @returns A new empty Item.
   */
  newItem(): Item;

  /**
   * Creates a new Item with the specified type.
   * @param itemTypeName - Name of the ItemType.
   * @returns A new Item with the specified type.
   */
  newItem(itemTypeName: string): Item;

  /**
   * Creates a new Item with the specified type and action.
   * @param itemTypeName - Name of the ItemType.
   * @param action - Name of the action to be set on the Item.
   * @returns A new Item with the specified type and action.
   */
  newItem(itemTypeName: string, action: string): Item;

  /* No Descriptions */
  // Methods for manipulating relationships
  addRelationship(item: Item): void;
  appendItem(item: Item): void;
  removeItem(item: Item): void;

  // Cloning
  clone(cloneRelationships: boolean): Item;

  // Property item creation
  createPropertyItem(propName: string, type: string, action: string): Item;

  // Relationship item creation
  createRelatedItem(type: string, action: string): Item;
  createRelationship(type: string, action: string): Item;

  // Fetch operations
  fetchDefaultPropertyValues(overwriteCurrent: boolean): Item;
  fetchLockStatus(): number;
  fetchRelationships(relationshipTypeName: string, selectList?: string, orderBy?: string): Promise<Item>;

  // Get operations
  getAction(): string | null;

  getErrorCode(): string | null;

  getErrorSource(): string | null;

  getLockStatus(): number;
  getNewID(): string;
  getParentItem(): Item | null;

  getPropertyCondition(propertyName: string, lang?: string): string | null;
  getRelatedItem(): Item | null;
  getRelatedItemID(): string | null;

  setPropertyCondition(propertyName: string, condition: string, lang?: string): void;
  setPropertyItem(propertyName: string, item: Item): Item;
  setRelatedItem(item: Item): void;
  setType(itemTypeName: string): void;

  // Locking and unlocking
  lockItem(): Item;
  unlockItem(): Item;

  // Enumerator for collections
  [Symbol.iterator](): Iterator<Item>;

  // Checks
  isCollection(): boolean;
  isEmpty(): boolean;
  isLogical(): boolean;
  isRoot(): boolean;
}
export {};
