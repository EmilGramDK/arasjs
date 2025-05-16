import { XmlNode } from "../types/aras";
import { Item } from "../types/item";

export const convertToXML = (item: Item): XmlNode => {
  let xmlStr = "";

  if (item.node) {
    xmlStr = item.node.xml;
  }

  if (item.nodeList) {
    xmlStr = item.nodeList.map((node) => node.xml).join("");
    if (xmlStr) xmlStr = `<Items>${xmlStr}</Items>`;
  }

  if (!xmlStr) throw new Error("No XML string found in the item");

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlStr, "application/xml");

  return xmlDoc.documentElement as any;
};
