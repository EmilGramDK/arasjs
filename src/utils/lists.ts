import type { ODataItem } from "../types/item";
import type { XmlNode } from "../types/xml-node";

interface ListJson {
  id: string;
  name: string;
  Value: Array<{
    inactive: "1" | "0";
    filter?: string;
    label?: string;
    sort_order: number;
    value: string;
  }>;
  "Filter Value": ListJson["Value"];
}

interface ODataOption extends ODataItem {
  inactive: "1" | "0";
  filter?: string;
  label: string;
  sort_order: number;
  value: string;
}

export interface ListOption {
  inactive: boolean;
  label: string;
  sortOrder: number;
  value: string;
  filter?: string;
}

export async function getListValues(listId: string): Promise<Array<ListOption>> {
  return getListOptions([listId], false).then((map) => {
    return map.get(listId) || [];
  });
}

export async function getListFilterValues(listId: string): Promise<Array<ListOption>> {
  return getListOptions([listId], true).then((map) => {
    return map.get(listId) || [];
  });
}

export async function getListsValuesMap(
  listIds: string[],
): Promise<Map<string, Array<ListOption>>> {
  return getListOptions(listIds, false);
}

export async function getListsFilterValuesMap(
  listIds: string[],
): Promise<Map<string, Array<ListOption>>> {
  return getListOptions(listIds, true);
}

export function getListsValuesJson(
  listIds: string[],
  filterListIds: string[] = [],
): Map<string, Array<ListOption>> {
  return getListsValues(listIds, filterListIds, "json") as Map<string, Array<ListOption>>;
}

export function getListsValuesXml(
  listIds: string[],
  filterListIds: string[] = [],
): Map<string, Array<XmlNode>> {
  return getListsValues(listIds, filterListIds, "xml") as Map<string, Array<XmlNode>>;
}

function getListsValues(
  listIds: string[],
  filterListIds: string[] = [],
  responseMode: "json" | "xml" = "json",
): Map<string, Array<ListOption>> | Map<string, Array<XmlNode>> {
  const combinedListIds = [
    ...listIds.map((id) => ({ id, relType: "Value" as const })),
    ...filterListIds.map((id) => ({ id, relType: "Filter Value" as const })),
  ];

  const rawResponse = aras.getSeveralListsValues(combinedListIds);

  if (responseMode === "xml") {
    return new Map(Object.entries(rawResponse));
  }

  const result = new Map<string, Array<ListOption>>();

  for (const [key, nodes] of Object.entries(rawResponse)) {
    const value = nodes.map((item) => {
      const json = ArasModules.xmlToODataJson<ODataOption>(item);
      return {
        ...json,
        inactive: json.inactive === "1",
        sortOrder: json.sort_order,
      };
    });
    result.set(key, value);
  }

  return result;
}

async function getListOptions(
  listIds: string[],
  useFilterValue: boolean,
): Promise<Map<string, Array<ListOption>>> {
  const result = (await aras.MetadataCacheJson.GetList(
    useFilterValue ? [] : listIds,
    useFilterValue ? listIds : [],
  )) as Array<{ value: Array<ListJson> }>;

  const map = new Map<string, Array<ListOption>>();

  for (const item of result) {
    const list = item.value?.[0];
    if (!list) continue;

    const values = useFilterValue ? list["Filter Value"] : list.Value;
    if (!values) continue;

    const options: Array<ListOption> = values.map(
      ({ inactive, label, value, sort_order, filter }) => ({
        inactive: inactive === "1",
        label: label || value,
        sortOrder: sort_order,
        value,
        ...(useFilterValue && { filter }),
      }),
    );

    map.set(list.id, options);
  }

  return map;
}
