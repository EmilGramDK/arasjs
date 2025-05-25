import type { Item } from "../types/item";
import type { XmlNode } from "../types/xml-node";

/**
 *
 * @param item XML node representing an item
 * @description Converts an XML node to an IOM Item.
 * This function creates a new IOM Item of the type specified in the XML node and loads the XML content into it.
 * @param action Optional action to set on the item.
 * If provided, this action will be set on the newly created item.
 * If not provided, the item will be created without a specific action.
 * @returns {Item} The newly created IOM Item with the XML content loaded.
 * @throws {Error} If the XML node does not have a 'type' attribute or if the XML content is invalid.
 */
export function convertToIOMItem(item: XmlNode, action?: string): Item {
  const newItem = aras.newIOMItem(item.getAttribute("type"), "get");
  newItem.loadAML(item.xml);
  if (action) newItem.setAction(action);
  return newItem;
}

/**
 * Converts an Item or an array of Items to an XML string.
 *
 * @param item - The Item or array of Items to convert.
 * @param forceList - If true, wraps the XML in <Items> tags even if it's a single item.
 * @returns {XmlNode} The converted XML node.
 * @throws {Error} If no XML string is found in the item.
 */
export function convertItemToXML(item: Item, forceList = false): XmlNode {
  let xmlStr = "";

  if (item.node) {
    xmlStr = item.node.xml;
    if (xmlStr && forceList) xmlStr = `<Items>${xmlStr}</Items>`;
  }

  if (item.nodeList) {
    xmlStr = item.nodeList.map((node) => node.xml).join("");
    if (xmlStr) xmlStr = `<Items>${xmlStr}</Items>`;
  }

  if (!xmlStr) throw new Error("No XML string found in the item");

  return convertStringToXML(xmlStr);
}
/**
 * Converts a string representation of XML into an XmlNode.
 *
 * @param xmlStr - The XML string to convert.
 * @returns {XmlNode} The converted XmlNode.
 * @throws {Error} If the XML string is invalid or cannot be parsed.
 */
export function convertStringToXML(xmlStr: string): XmlNode {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlStr, "application/xml");
  const errorNode = xmlDoc.getElementsByTagName("parsererror");

  if (errorNode.length) {
    throw new Error("Error parsing XML: " + errorNode[0].textContent);
  }

  return xmlDoc.documentElement as any;
}
