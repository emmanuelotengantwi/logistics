export const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

export const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const userScopedKey = (prefix, userInfo) => {
  const id = userInfo?._id || userInfo?.email || 'anon';
  return `${prefix}:${id}`;
};
