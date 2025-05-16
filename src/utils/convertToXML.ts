import { XmlNode } from "../types/aras";
import { Item } from "../types/item";

export const convertItemToXML = (item: Item, list = false): XmlNode => {
  let xmlStr = "";

  if (item.node) {
    xmlStr = item.node.xml;
    if (xmlStr && list) xmlStr = `<Items>${xmlStr}</Items>`;
  }

  if (item.nodeList) {
    xmlStr = item.nodeList.map((node) => node.xml).join("");
    if (xmlStr) xmlStr = `<Items>${xmlStr}</Items>`;
  }

  if (!xmlStr) throw new Error("No XML string found in the item");

  return convertStringToXML(xmlStr);
};

export const convertStringToXML = (xmlStr: string): XmlNode => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlStr, "application/xml");
  const errorNode = xmlDoc.getElementsByTagName("parsererror");

  if (errorNode.length) {
    throw new Error("Error parsing XML: " + errorNode[0].textContent);
  }

  return xmlDoc.documentElement as any;
};
