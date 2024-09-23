export const getLocalStorage = (key: string) => {
  const item = typeof window !== "undefined" ? localStorage.getItem(key) : null;
  if (item != null) {
    return item;
  }
};

export const setLocalStorage = (key: string, value: any) => {
  const item = typeof window !== "undefined" ? localStorage.getItem(key) : null;
  if (item == null) {
    return localStorage.setItem(key, value);
  }
};
