// Date helpers.
//
// Dates travel through the app as "YYYY-MM-DD" strings (the format of
// <input type="date">). We build and read them from LOCAL date parts.
// `new Date().toISOString()` would use UTC, which gives the wrong day
// for a few hours every night in time zones such as India (UTC+5:30).

const pad = (n) => String(n).padStart(2, '0');

export function toISODate(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export const todayISO = () => toISODate(new Date());

export function addDays(days, from = new Date()) {
  const result = new Date(from);
  result.setDate(result.getDate() + days);
  return result;
}

/** "2026-10-22" -> Date at local midnight (never shifted by time zone). */
export function parseISODate(iso) {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/** True only for real calendar dates ("2026-02-31" is rejected). */
export function isValidISODate(iso) {
  if (typeof iso !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  return toISODate(parseISODate(iso)) === iso;
}

export function formatDate(iso, options = {}, locale = 'en-IN') {
  return parseISODate(iso).toLocaleDateString(locale, options);
}

/** "19:30" -> 1170 */
export function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/** 1170 -> "19:30" */
export function minutesToTime(totalMinutes) {
  return `${pad(Math.floor(totalMinutes / 60))}:${pad(totalMinutes % 60)}`;
}

export function currentMinutes(now = new Date()) {
  return now.getHours() * 60 + now.getMinutes();
}

/**
 * Booking slots from opening time until 30 minutes before closing.
 * generateTimeSlots('11:00', '12:00') -> ['11:00', '11:30']
 * A closing time of "24:00" is fine.
 */
export function generateTimeSlots(openTime, closeTime, stepMinutes = 30) {
  const slots = [];
  const last = timeToMinutes(closeTime) - stepMinutes;
  for (let t = timeToMinutes(openTime); t <= last; t += stepMinutes) {
    slots.push(minutesToTime(t));
  }
  return slots;
}
