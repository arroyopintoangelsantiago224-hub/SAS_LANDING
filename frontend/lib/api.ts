const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Public functions
export async function fetchCategories() {
  const res = await fetch(`${API_URL}/categorias`, {
    headers: { 'Accept': 'application/json' }
  });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function fetchProducts(categoryId?: number | string) {
  const url = categoryId && categoryId !== 'Todos'
    ? `${API_URL}/productos?categoria_id=${categoryId}`
    : `${API_URL}/productos`;
  const res = await fetch(url, {
    headers: { 'Accept': 'application/json' }
  });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchBanners() {
  const res = await fetch(`${API_URL}/banners`, {
    headers: { 'Accept': 'application/json' }
  });
  if (!res.ok) throw new Error('Failed to fetch banners');
  return res.json();
}

// Admin functions
export async function uploadImage(file: File, type: 'items' | 'banners', id?: number | string) {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('type', type);
  if (id) formData.append('id', id.toString());

  const res = await fetch(`${API_URL}/admin/upload`, {
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
  const res = await fetch(`${API_URL}/admin/productos?admin=true`, {
    headers: { 'Accept': 'application/json' }
  });
  return res.json();
}

export async function adminSaveProduct(product: any) {
  const method = product.id ? 'PUT' : 'POST';
  const url = product.id ? `${API_URL}/admin/productos/${product.id}` : `${API_URL}/admin/productos`;
  const res = await fetch(url, {
    method,
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(product),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to save product');
  }
  return res.json();
}

export async function adminDeleteProduct(id: number) {
  const res = await fetch(`${API_URL}/admin/productos/${id}`, { 
    method: 'DELETE',
    headers: { 'Accept': 'application/json' }
  });
  return res.json();
}

export async function adminFetchBanners() {
  const res = await fetch(`${API_URL}/admin/banners?admin=true`, {
    headers: { 'Accept': 'application/json' }
  });
  return res.json();
}

export async function adminSaveBanner(banner: any) {
  const method = banner.id ? 'PUT' : 'POST';
  const url = banner.id ? `${API_URL}/admin/banners/${banner.id}` : `${API_URL}/admin/banners`;
  const res = await fetch(url, {
    method,
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(banner),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to save banner');
  }
  return res.json();
}

export async function adminDeleteBanner(id: number) {
  const res = await fetch(`${API_URL}/admin/banners/${id}`, { 
    method: 'DELETE',
    headers: { 'Accept': 'application/json' }
  });
  return res.json();
}
