import { api } from './api.js';

export function fetchCars() {
  return api('/api/cars');
}

export function fetchCar(id) {
  return api(`/api/cars/${id}`);
}

export function createBooking(payload) {
  return api('/api/bookings', { method: 'POST', body: payload });
}

export function fetchMyBookings() {
  return api('/api/bookings');
}

export function fetchAdminStats() {
  return api('/api/admin/stats');
}

export function fetchAdminUsers() {
  return api('/api/admin/users');
}

export function fetchAdminCars() {
  return api('/api/admin/cars');
}

export function fetchAdminBookings() {
  return api('/api/admin/bookings');
}

export function updateBookingStatus(id, status) {
  return api(`/api/admin/bookings/${id}`, { method: 'PATCH', body: { status } });
}
