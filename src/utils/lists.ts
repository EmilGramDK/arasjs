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

type ListJsonResult = {
  id: string;
  name: string;
  options: Array<{
    inactive: boolean;
    label: string;
    sortOrder: number;
    value: string;
    filter?: string | null;
  }>;
};

export async function getListValues(listId: string): Promise<Array<ListJsonResult | null>> {
  const result = (await aras.MetadataCacheJson.GetList([listId], [])) as Array<{
    value: Array<ListJson>;
  }>;

  return result.map((item: { value: Array<ListJson> }) => {
    const list = item.value?.[0] ?? null;
    const listValue = list?.Value;
    if (!list || !listValue) return null;

    return {
      id: list.id,
      name: list.name,
      options: listValue.map(({ filter, inactive, label, value, sort_order: sortOrder }) => ({
        inactive: inactive === "1",
        label: label || value,
        sortOrder,
        value: value,
      })),
    };
  });
}

export async function getListFilterValues(listId: string): Promise<Array<ListJsonResult | null>> {
  const result = (await aras.MetadataCacheJson.GetList([], [listId])) as Array<{
    value: Array<ListJson>;
  }>;

  return result.map((item: { value: Array<ListJson> }) => {
    const list = item.value?.[0] ?? null;
    const listValue = list?.["Filter Value"];
    if (!list || !listValue) return null;

    return {
      id: list.id,
      name: list.name,
      options: listValue.map(({ filter, inactive, label, value, sort_order: sortOrder }) => ({
        inactive: inactive === "1",
        label: label || value,
        sortOrder,
        value: value,
        filter: filter || null,
      })),
    };
  });
}
