import { api } from './api.js';

export function register(payload) {
  return api('/api/auth/register', { method: 'POST', body: payload });
}

export function login(payload) {
  return api('/api/auth/login', { method: 'POST', body: payload });
}

export function logout() {
  return api('/api/auth/logout', { method: 'POST' });
}

export function getMe() {
  return api('/api/auth/me');
}
