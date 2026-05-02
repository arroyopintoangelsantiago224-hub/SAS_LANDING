const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const COMMON_HEADERS = {
  'Accept': 'application/json',
  'ngrok-skip-browser-warning': 'true'
};

// Public functions
export async function fetchCategories() {
  const res = await fetch(`${API_URL}/categorias`, { headers: COMMON_HEADERS });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function fetchProducts(categoryId?: number | string) {
  const url = categoryId && categoryId !== 'Todos' ? `${API_URL}/productos?categoria_id=${categoryId}` : `${API_URL}/productos`;
  const res = await fetch(url, { headers: COMMON_HEADERS });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchBanners() {
  const res = await fetch(`${API_URL}/banners`, { headers: COMMON_HEADERS });
  if (!res.ok) throw new Error('Failed to fetch banners');
  return res.json();
}

export async function fetchConfigs() {
  const res = await fetch(`${API_URL}/configs`, { headers: COMMON_HEADERS });
  if (!res.ok) throw new Error('Failed to fetch configs');
  return res.json();
}

export async function fetchPaymentMethods() {
  const res = await fetch(`${API_URL}/metodos-pago`, { headers: { 'Accept': 'application/json' } });
  if (!res.ok) throw new Error('Failed to fetch payment methods');
  return res.json();
}

// Admin functions
export async function uploadImage(file: File, type: 'items' | 'banners' | 'site' | 'pagos', id?: number | string) {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('type', type);
  if (id) formData.append('id', id.toString());

  const res = await fetch(`/api/proxy/admin/upload`, {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to upload image');
  }
  return res.json();
}

export async function adminFetchProducts() {
  const res = await fetch(`/api/proxy/admin/productos?admin=true`, { headers: { 'Accept': 'application/json' } });
  return res.json();
}

export async function adminSaveProduct(product: any) {
  const method = product.id ? 'PUT' : 'POST';
  const url = product.id ? `/api/proxy/admin/productos/${product.id}` : `/api/proxy/admin/productos`;
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to save product');
  }
  return res.json();
}

export async function adminDeleteProduct(id: number) {
  const res = await fetch(`/api/proxy/admin/productos/${id}`, { method: 'DELETE', headers: { 'Accept': 'application/json' } });
  return res.json();
}

// Categories Admin
export async function adminFetchCategories() {
  const res = await fetch(`/api/proxy/admin/categorias?admin=true`, { headers: { 'Accept': 'application/json' } });
  return res.json();
}

export async function adminSaveCategory(category: any) {
  const method = category.id ? 'PUT' : 'POST';
  const url = category.id ? `/api/proxy/admin/categorias/${category.id}` : `/api/proxy/admin/categorias`;
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(category),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to save category');
  }
  return res.json();
}

export async function adminDeleteCategory(id: number, force: boolean = false) {
  const url = force ? `/api/proxy/admin/categorias/${id}?force=true` : `/api/proxy/admin/categorias/${id}`;
  const res = await fetch(url, { method: 'DELETE', headers: { 'Accept': 'application/json' } });
  if (!res.ok) {
    return res.json(); // Return error body to handle 409
  }
  return res.json();
}

// Banners Admin
export async function adminFetchBanners() {
  const res = await fetch(`/api/proxy/admin/banners?admin=true`, { headers: { 'Accept': 'application/json' } });
  return res.json();
}

export async function adminSaveBanner(banner: any) {
  const method = banner.id ? 'PUT' : 'POST';
  const url = banner.id ? `/api/proxy/admin/banners/${banner.id}` : `/api/proxy/admin/banners`;
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(banner),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to save banner');
  }
  return res.json();
}

export async function adminDeleteBanner(id: number) {
  const res = await fetch(`/api/proxy/admin/banners/${id}`, { method: 'DELETE', headers: { 'Accept': 'application/json' } });
  return res.json();
}

export async function adminUpdateConfigs(configs: any) {
  const res = await fetch(`/api/proxy/admin/configs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(configs),
  });
  return res.json();
}

// Orders Admin
export async function adminFetchOrders() {
  const res = await fetch(`/api/proxy/admin/pedidos?admin=true`, { headers: { 'Accept': 'application/json' } });
  return res.json();
}

export async function adminUpdateOrder(id: number, data: any) {
  const res = await fetch(`/api/proxy/admin/pedidos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to update order');
  }
  return res.json();
}

// Payment Methods Admin
export async function adminFetchPaymentMethods() {
  const res = await fetch(`/api/proxy/admin/metodos-pago?admin=true`, { headers: { 'Accept': 'application/json' } });
  return res.json();
}

export async function adminSavePaymentMethod(method: any) {
  const verb = method.id ? 'PUT' : 'POST';
  const url = method.id ? `/api/proxy/admin/metodos-pago/${method.id}` : `/api/proxy/admin/metodos-pago`;
  const res = await fetch(url, {
    method: verb,
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(method),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to save payment method');
  }
  return res.json();
}

export async function adminDeletePaymentMethod(id: number) {
  const res = await fetch(`/api/proxy/admin/metodos-pago/${id}`, { method: 'DELETE', headers: { 'Accept': 'application/json' } });
  if (!res.ok) throw new Error('Failed to delete payment method');
  return true;
}
