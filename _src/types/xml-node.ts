export interface XmlNode {
  [index: string]: any;
  ownerDocument: XmlDocument;
  xml: string;
  nodeType: number;
  nodeName: string;
  attributes: Array<{
    name: string;
    value: string;
  }>;
  childNodes: Array<XmlNode>;
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
  selectNodes: (xpath: string) => Array<XmlNode>;
  textContent: string;
  remove: () => void;
}
export type XmlItem = XmlNode;

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
  selectNodes: (xpath: string) => Array<XmlNode>;
  createNode: (type: number, name: string, namespaceURI: string) => XmlNode;
  createTextNode: (text: string) => XmlNode;
};
