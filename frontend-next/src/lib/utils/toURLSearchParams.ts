// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toURLSearchParams(obj: Record<string, any>) {
  const cleanedObj = Object.entries(obj).reduce((acc, [key, value]) => {
    if (value === null || value === undefined) {
      return acc;
    }

    return {
      ...acc,
      [key]: value,
    };
  }, {});

  return new URLSearchParams(cleanedObj).toString();
}
