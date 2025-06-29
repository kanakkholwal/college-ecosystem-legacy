export function formatNumber(num: number) {
  const formatter = new Intl.NumberFormat("en-IN", {
    notation: "compact",
    compactDisplay: "short",
  });
  return formatter.format(num);
}
export function formatNumberOrdinal(num: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = num % 100;
  return num + (s[(v - 20) % 10] || s[v] || s[0]);
}
