type ListJson = {
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
};

type Option = {
  inactive: boolean;
  label: string;
  sortOrder: number;
  value: string;
  filter?: string | null;
};

export async function getListValues(listId: string): Promise<Option[]> {
  return getListOptions([listId], false).then((map) => {
    return map.get(listId) || [];
  });
}

export async function getListFilterValues(listId: string): Promise<Option[]> {
  return getListOptions([listId], true).then((map) => {
    return map.get(listId) || [];
  });
}

export async function getListValuesMap(listIds: string[]): Promise<Map<string, Option[]>> {
  return getListOptions(listIds, false);
}

export async function getListFilterValuesMap(listIds: string[]): Promise<Map<string, Option[]>> {
  return getListOptions(listIds, true);
}

async function getListOptions(
  listIds: string[],
  useFilterValue: boolean,
): Promise<Map<string, Option[]>> {
  const result = (await aras.MetadataCacheJson.GetList(
    useFilterValue ? [] : listIds,
    useFilterValue ? listIds : [],
  )) as Array<{ value: Array<ListJson> }>;

  const map = new Map<string, Option[]>();

  for (const item of result) {
    const list = item.value?.[0];
    if (!list) continue;

    const values = useFilterValue ? list["Filter Value"] : list.Value;
    if (!values) continue;

    const options: Option[] = values.map(({ inactive, label, value, sort_order, filter }) => ({
      inactive: inactive === "1",
      label: label || value,
      sortOrder: sort_order,
      value,
      ...(useFilterValue && { filter: filter || null }),
    }));

    map.set(list.id, options);
  }

  return map;
}
