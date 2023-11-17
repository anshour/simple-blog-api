// Mimic SQL LIKE operator
export default function searchLike<T extends Record<string, any>, K extends keyof T>(
  arrayOfObjects: T[],
  key: K,
  pattern: string
): T[] {
  const regex = new RegExp("^" + `.*${pattern}.*` + "$", "i");

  return arrayOfObjects.filter((obj) => regex.test(String(obj[key])));
}
