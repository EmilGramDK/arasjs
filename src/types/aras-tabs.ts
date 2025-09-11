export interface ArasTabs {
  data: Map<string, Record<string, unknown>>;
  tabs: Array<string>;
  selectTab: (id: string, preventFocus?: boolean) => Promise<boolean>;
  forceCloseAllTabs: () => void;
  closeTabs: () => void;
  closeOtherTabs: (excludedTabId: string) => void;
  updateTitleTab: (id: string, props: Partial<HeaderTab>) => void;
  setTabContent: (id: string, props: Partial<HeaderTab>) => void;
  addTab: (id: string, options: Partial<HeaderTab>, position?: number) => void;
  open: (src: string, winName: string, isUnfocused: boolean, className?: string) => void;
  openSearch: (itemTypeId: string, favoriteSearchId?: string) => void;
  getSearchGridTabs: (id: string) => any;
  focusedTab: string;
  selectedTab: string;
  options: {
    updateTabState: (setState: unknown, type: "dockTabs" | "mainTabs") => void;
  };
}

export interface HeaderTab {
  label?: string;
  image?: string;
  [key: string]: any;
}
