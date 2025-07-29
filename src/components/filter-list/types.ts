export interface FilterListOption {
  value: string;
  label: string;
}

export interface FilterListState {
  label: string;
  placeholder: string;
  mode: string;
  focus: boolean;
  icon: string | null;
  invalid: boolean;
  showAll: boolean;
  shown: boolean;
  list: Array<FilterListOption>;
  refs: {
    input: HTMLInputElement;
    dropdown: HTMLDivElement;
    button: HTMLButtonElement;
  };
  dom: FilterList;
}

export interface FilterList extends HTMLElement {
  new (): FilterList;
  state: FilterListState;
  setState: (state: Partial<FilterListState>) => void;
  onSelectValue: (callback: (item: FilterListOption | undefined) => void) => void;
}
