import type { Item } from "./item";
import type { XmlDocument } from "./xml-node";

export interface Innovator {
  /**
   * Sends a request to the Innovator server and returns the response as an Item.
   * @param AML - AML script to be sent to the Innovator server.
   * @param args - Parameters to be injected into the query.
   * @returns The server response as an Item.
   */
  applyAML(AML: string, ...args: Array<unknown>): Item;

  /**
   * Apply a method by name, passing a string value as its body.
   * @param methodName - Name of the method.
   * @param body - Context for the method (method item).
   * @returns The Item response.
   */
  applyMethod(methodName: string, body: string): Item;

  /**
   * Sends SQL request to the Innovator server and returns the response as an Item.
   * @param sql - SQL to be sent to the Innovator server.
   * @param args - Parameters to be injected into the query.
   * @returns The server response as an Item.
   */
  applySQL(sql: string, ...args: Array<unknown>): Item;

  /**
   * Returns the server connection set on the instance.
   * @returns The server connection object.
   */
  getConnection(): unknown;

  /**
   * Fetches an Item by its type and ID.
   * @param itemTypeName - Name of the ItemType.
   * @param id - ID of the Item.
   * @returns The fetched Item or null if not found.
   */
  getItemById(itemTypeName: string, id: string): Item | null;

  /**
   * Fetches an Item by its type and keyed name.
   * @param itemTypeName - Name of the ItemType.
   * @param keyedName - Keyed name of the Item.
   * @returns The fetched Item or null if not found.
   */
  getItemByKeyedName(itemTypeName: string, keyedName: string): Item | null;

  /**
   * Generates a new unique ID as a string.
   * @returns A new GUID.
   */
  getNewID(): string;

  /**
   * Returns the next sequence value by sequence name.
   * @param sequenceName - Name of the sequence.
   * @returns The next sequence value or null if failed.
   */
  getNextSequence(sequenceName: string): string | null;

  /**
   * Returns the user ID of the currently logged-in user.
   * @returns The user ID.
   */
  getUserID(): string;

  /**
   * Creates a new error Item.
   * @param explanation - Explanation of the error.
   * @returns A new error Item.
   */
  newError(explanation: string): Item;

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

  /**
   * Creates a new Item populated with the provided AML.
   * @param aml - AML to populate the Item.
   * @param args - Parameters to be injected into the AML.
   * @returns A new Item populated with the provided AML.
   */
  newItemFromAml(aml: string, ...args: Array<unknown>): Item;

  /**
   * Creates a new Item where the provided text is the body for the `<Result>` tag.
   * @param text - Text to be set as the body for the `<Result>` tag.
   * @returns A new Item.
   */
  newResult(text: string): Item;

  /**
   * Computes the MD5 hash value for the specified string.
   * @param val - String to be hashed.
   * @returns The MD5 hash value.
   */
  ScalcMD5(val: string): string;

  getFileUrl: (fileid: string, token: unknown) => string;

  newXMLDocument: () => XmlDocument;
}
