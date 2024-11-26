export const copyWith = <T>(current: T, updates: Partial<T>): T => {
  return {
    ...current,
    ...updates,
  };
};
