export function deepConvertBigNumbers(obj: object) {
  return JSON.parse(JSON.stringify(obj));
}
