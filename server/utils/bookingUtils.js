export const LOCATIONS = [
  'Mumbai',
  'Navi Mumbai',
  'Panvel',
  'Thane',
  'Pune',
  'Mumbai Airport',
];

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function parseDateTime(date, time) {
  if (!DATE_PATTERN.test(date) || !TIME_PATTERN.test(time)) {
    return null;
  }
  const iso = `${date}T${time}:00`;
  const value = new Date(iso);
  if (Number.isNaN(value.getTime())) {
    return null;
  }
  return value;
}

export function calculateRentalDays(pickupAt, returnAt) {
  const ms = returnAt.getTime() - pickupAt.getTime();
  if (ms <= 0) {
    return 0;
  }
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

export function isBlockingBooking(booking, now, pendingHoldMinutes) {
  if (booking.status === 'cancelled' || booking.status === 'completed') {
    return false;
  }
  if (booking.status === 'confirmed') {
    return true;
  }
  if (booking.status === 'pending') {
    const created = new Date(booking.createdAt).getTime();
    const holdMs = pendingHoldMinutes * 60 * 1000;
    return now.getTime() - created <= holdMs;
  }
  return false;
}

export function findConflict(existingBookings, pickupAt, returnAt, now, pendingHoldMinutes) {
  return existingBookings.find((booking) => {
    if (!isBlockingBooking(booking, now, pendingHoldMinutes)) {
      return false;
    }
    return rangesOverlap(booking.pickupAt, booking.returnAt, pickupAt, returnAt);
  });
}
