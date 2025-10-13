import type { GridPluginEvent, GridEventPayloadPlugin } from "arasjs";
import { wildcardMatcher } from "../../../utils/wildcard-match";
import { GridPlugin } from "arasjs";

declare module "arasjs" {
  interface GridControl {
    clearFilters: () => void;
  }
}

type Matchers = Record<string, (filter: string, value: string) => boolean>;

const pluginEvents: Array<GridPluginEvent> = [
  {
    type: "filter",
    name: "filter",
    method(this: SearchGridPlugin) {
      if (!this.grid.settings.focusedCell) return;
      const { headId, rowId } = this.grid.settings.focusedCell;
      if (rowId !== "searchRow") return;
      const val = this.grid.head.get(headId, "searchValue");
      if (!val) return this.searchFilters.delete(headId);
      this.searchFilters.set(headId, val.toLowerCase().trim());
    },
  },
  {
    type: "keydown",
    name: "keydown",
    method(this: SearchGridPlugin, { data: [event] }: GridEventPayloadPlugin<KeyboardEvent>) {
      if (event.key !== "Enter") return;
      const target = event.target as HTMLElement;
      if (!this.grid.contains(target)) return;
      if (!target.parentElement?.classList.contains("aras-grid-search-row-cell")) return;
      this.handleSearch();
    },
  },
];

/**
 * Grid plugin to add client search functionality to grid columns.
 * @searchFilters Map of headId to search string
 * @matchers Map of column dataTypes to matcher functions
 */
export class SearchGridPlugin extends GridPlugin {
  events = pluginEvents;
  searchFilters = new Map<string, string>();
  matchers: Matchers = {};

  async init() {
    this.grid.clearFilters = this.clearFilters;
  }

  handleSearch = () => {
    const filters: Array<[string, (value: string) => boolean]> = [...this.searchFilters].map(
      ([headId, filter]) => {
        const headType = this.grid.head.get(headId, "dataType");
        const headMatcher = this.matchers[headType];
        const matcher = headMatcher ? headMatcher.bind(null, filter) : wildcardMatcher(filter);
        return [headId, matcher];
      },
    );
    if (filters.length === 0) return this.clearFilters();

    const filteredRows = [...this.grid.rows.store!.keys()]
      .map((id) => {
        const row = this.grid.rows.get(id);
        if (!row) return false;
        const isMatch = filters.every(([property, matcher]) => {
          const cellValue =
            this.grid.rows.get(id, `${property}@aras.keyed_name`) ||
            this.grid.rows.get(id, property);
          // if (cellValue === undefined || cellValue === null) return false;
          return matcher(cellValue?.toString()?.toLowerCase());
        });
        if (isMatch) return id;
        return false;
      })
      .filter(Boolean);

    this.grid.settings.indexRows = filteredRows as Array<string>;
    this.grid.settings.orderBy = [];
  };

  clearFilters = () => {
    this.grid.head.store!.forEach((head) => {
      head.searchValue = "";
    });
    this.searchFilters.clear();
    this.grid.settings.indexRows = [...this.grid.rows.store!.keys()];
    this.grid.settings.orderBy = [];
  };
}
