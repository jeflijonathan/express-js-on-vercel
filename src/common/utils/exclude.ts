function exclude<T, Key extends keyof T>(obj: T, keys: Key[]): Omit<T, Key> {
  const newObj = { ...obj };
  for (let key of keys) {
    delete newObj[key];
  }
  return newObj;
}
export default exclude;
