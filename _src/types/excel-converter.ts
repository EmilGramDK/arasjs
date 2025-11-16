export type ExcelConverterAPI = {
  convertItemView: (item: Record<string, string>, itemType: any) => Promise<excelJsonInterface>;
  convertTreeGrid: (treeGrid: any) => excelJsonInterface;
  convertGrid: (grid: any) => excelJsonInterface;
  convertJsonToExcel: (worksheets: any) => any;
};

export interface worksheetCellsInterface {
  columnIndex: number;
  rowIndex: number;
  value: string;
  type?: "date" | "number";
  style?: {
    backgroundColor?: string;
    color?: string;
    textAlign?: string;
    bold?: boolean;
  };
}

export interface columnsSettingsInterface {
  columnIndex: number;
  width: number;
}

export interface excelJsonInterface {
  worksheetCells: Array<worksheetCellsInterface>;
  columnsSettings: Array<columnsSettingsInterface>;
}
