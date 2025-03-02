/**
 * Recursively traverses and replaces keys in the response object.
 * @param obj The response object.
 * @param replacements An array of word replacements where the key is the word to replace and the value is the replacement word.
 * @returns The modified object.
 */
export function _replaceKeys(obj: any, replacements?: { [key: string]: string }): any {
  if (!replacements) return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => _replaceKeys(item, replacements));
  } else if (obj !== null && typeof obj === "object") {
    const newObj: { [key: string]: any } = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = replacements[key] || key; // Replace key if it exists in replacements, otherwise use original key
        newObj[newKey] = _replaceKeys(obj[key], replacements);
      }
    }
    return newObj;
  } else {
    return obj;
  }
}
