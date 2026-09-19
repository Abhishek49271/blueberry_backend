const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

function getToken() {
  return localStorage.getItem('bluberry_token');
}

export async function api<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.message || `Request failed (${res.status})`);
  }
  return data as T;
}

export const authApi = {
  login: (phone: string, name?: string, password?: string) =>
    api<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, name, password }),
    }),
  me: () => api('/auth/me'),
};

export const menuApi = {
  list: () => api<{ categories: any[]; items: any[] }>('/menu'),
  allAdmin: () => api('/menu/all'),
  updateItem: (id: string, body: any) =>
    api(`/menu/items/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  addItem: (body: any) =>
    api('/menu/items', { method: 'POST', body: JSON.stringify(body) }),
  deleteItem: (id: string) => api(`/menu/items/${id}`, { method: 'DELETE' }),
};

export const orderApi = {
  create: (body: any) => api('/orders', { method: 'POST', body: JSON.stringify(body) }),
  get: (id: string) => api(`/orders/${id}`),
  list: () => api('/orders'),
  updateStatus: (id: string, status: string) =>
    api(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  getUpiQr: (id: string) => api(`/orders/${id}/upi-qr`),
  validateCoupon: (code: string, subtotal: number) =>
    api('/orders/validate-coupon', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal }),
    }),
  markUpiPaid: (orderId: string, utr?: string) =>
    api('/payments/upi/mark-paid', {
      method: 'POST',
      body: JSON.stringify({ orderId, utr }),
    }),
};

export const paymentApi = {
  createRazorpay: (orderId: string) =>
    api('/payments/razorpay/create', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    }),
  verifyRazorpay: (body: any) =>
    api('/payments/razorpay/verify', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};

export const adminApi = {
  dashboard: () => api('/admin/dashboard'),
  settings: () => api('/admin/settings'),
  saveSettings: (body: any) =>
    api('/admin/settings', { method: 'PUT', body: JSON.stringify(body) }),
  coupons: () => api('/admin/coupons'),
};

export function isApiConfigured() {
  return true; // always try API; fallback handled in UI
}

export { API_BASE };
