import type { Property } from "../types/itemtype";

export async function getItemType(itemTypeName: string) {
  try {
    return await aras.getItemTypeDictionaryJson(itemTypeName, "name");
  } catch {
    throw new Error(`Item type "${itemTypeName}" not found.`);
  }
}

export async function getItemTypeProperties(itemTypeName: string): Promise<Array<Property>> {
  const itemType = await getItemType(itemTypeName);
  return itemType.Property;
}
