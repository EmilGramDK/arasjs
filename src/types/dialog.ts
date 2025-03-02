import { Aras } from "./aras";

export interface SearchDialogFilter {
  property: string;
  value: string;
  condition?: "like" | "eq";
  fixed?: boolean;
}

export interface SearchDialogOptions {
  title?: string;
  itemtypeName: string;
  sourceItemTypeName?: string;
  sourcePropertyName?: string;
  dialogWidth?: number;
  dialogHeight?: number;
  filters?: SearchDialogFilter[];
  maxRecords?: number;
  autoSearch?: boolean;
}

export interface ArasDialogParameters {
  title: string;
  type?: DialogTypes;
  itemtypeName?: string;
  sourceItemTypeName?: string;
  sourcePropertyName?: string;
  multiselect?: boolean;
  aras: Aras;
  dialogWidth?: number;
  dialogHeight?: number;
  classList?: string;
  okButtonText?: string;
  formId?: string;
}

export type DialogTypes =
  | "WhereUsed"
  | "SearchDialog"
  | "ImageBrowser"
  | "HTMLEditorDialog"
  | "RevisionsDialog"
  | "ManageFileProperty"
  | "Text"
  | "Color";

export {};
