/**
 * NEXUS - Formatters and Coordinate Utilities
 */

export function formatUTCTime(date = new Date()) {
  const h = String(date.getUTCHours()).padStart(2, '0');
  const m = String(date.getUTCMinutes()).padStart(2, '0');
  const s = String(date.getUTCSeconds()).padStart(2, '0');
  return `${h}:${m}:${s} UTC`;
}

export function formatCoordinates(lat, lng) {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  const latAbs = Math.abs(lat).toFixed(2);
  const lngAbs = Math.abs(lng).toFixed(2);
  return `${latAbs}°${latDir} ${lngAbs}°${lngDir}`;
}

export function formatNumber(num) {
  return new Intl.NumberFormat().format(num);
}
