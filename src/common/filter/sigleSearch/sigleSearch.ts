export function buildSingleSearch(
  searchField: string,
  searchValue?: string
): Record<string, any> | undefined {
  if (!searchValue || searchValue.trim() === "") {
    return undefined;
  }

  return {
    [searchField]: {
      contains: searchValue,
    },
  };
}
