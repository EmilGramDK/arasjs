import type { GridEventPayloadPlugin, GridPluginEvent } from "../../../types/grid-plugin";
import { GridPlugin } from "../../../types/grid-plugin";
import { wildcardMatcher } from "../../wildcard-match";

declare module "arasjs/types" {
  interface GridControl {
    clearFilters: () => void;
  }
}

type Matchers = Record<string, (filter: string, value: string, rowId: string) => boolean>;

const pluginEvents: Array<GridPluginEvent> = [
  {
    type: "search",
    name: "search",
    method(this: SearchGridPlugin, { data: [event] }: GridEventPayloadPlugin<KeyboardEvent>) {
      console.log("search event", event);
      this.handleSearch();
    },
  },
  {
    type: "click",
    name: "click",
    method(this: SearchGridPlugin, { data: [event] }: GridEventPayloadPlugin<MouseEvent>) {
      const target = event.target as HTMLElement;
      const listItem = target?.closest(".aras-grid-search-row-cell .aras-list-item") as HTMLElement;
      if (!listItem) return;
      this.handleSearch();
    },
  },
];

/**
 * Grid plugin to add client search functionality to grid columns.
 * @matchers Map of column dataTypes to matcher functions
 */
export class SearchGridPlugin extends GridPlugin {
  events: Array<GridPluginEvent> = pluginEvents;
  matchers: Matchers = {};

  async init(): Promise<void> {
    this.grid.clearFilters = this.clearFilters;
  }

  getCellValue = (rowId: string, headId: string): string | undefined => {
    const row = (this.grid.rows.get(rowId) as Record<string, string>) || {};
    return row[`${headId}@aras.keyed_name`] || row[headId];
  };

  handleSearch = (): void => {
    const filters = this.getFilters().map(([headId, filter]) => {
      const headType = this.grid.head.get(headId, "dataType") as string;
      const headMatcher = this.matchers[headType];
      const matcher = headMatcher ? headMatcher.bind(undefined, filter) : wildcardMatcher(filter);
      return [headId, matcher] as [string, (value: string, rowId: string) => boolean];
    });
    if (filters.length === 0) return this.clearFilters();

    const filteredRows = [...this.grid.rows.store!.keys()]
      .map((id) => {
        const row = this.grid.rows.get(id);
        if (!row) return false;
        const isMatch = filters.every(([headId, matcher]) => {
          const cellValue = this.getCellValue(id, headId);
          return matcher(cellValue?.toString()?.toLowerCase() || "", id);
        });
        if (isMatch) return id;
        return false;
      })
      .filter(Boolean);

    this.grid.settings.indexRows = filteredRows as Array<string>;
    this.grid.settings.orderBy = [];
  };

  getFilters = (): Array<[string, string]> => {
    return [...this.grid.head.store!.values()]
      .filter((h) => h.searchValue)
      .map((h) => [h.id, h.searchValue] as [string, string]);
  };

  clearFilters = (): void => {
    this.grid.head.store!.forEach((head: Record<string, unknown>) => {
      head.searchValue = "";
    });
    this.grid.settings.indexRows = [...this.grid.rows.store!.keys()];
    this.grid.settings.orderBy = [];
  };
}
