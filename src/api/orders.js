async function tryRefreshToken() {
  const refreshResponse = await fetch("https://khatering.shop/v1/refresh", {
    method: "POST",
    credentials: "include"
  });

  if (refreshResponse.ok) {
    const refreshData = await refreshResponse.json();
    localStorage.setItem("access_token", refreshData.access_token);
    localStorage.setItem("user", JSON.stringify(refreshData.user));
    return true;
  }

  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
  window.location.href = "/login";
  return false;
}

function getAuthHeaders(extraHeaders = {}) {
  const token = localStorage.getItem("access_token");
  const headers = { ...extraHeaders };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function fetchWithRetry(url, options = {}) {
  let response = await fetch(url, {
    ...options,
    headers: getAuthHeaders(options.headers),
    credentials: "include"
  });

  if (response.status === 401) {
    const refreshed = await tryRefreshToken();
    if (!refreshed) throw new Error("Sesi berakhir, silakan login kembali.");

    response = await fetch(url, {
      ...options,
      headers: getAuthHeaders(options.headers),
      credentials: "include"
    });
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.status || "Terjadi kesalahan pada server.");
  }
  
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function getOrders() {
  const result = await fetchWithRetry("https://khatering.shop/api/v1/orders");
  return result.data;
}

export async function getOrdersByUsername(username) {
  const result = await fetchWithRetry(`https://khatering.shop/api/v1/orders/user/${username}`);
  return result.data;
}

export async function getOrderById(id) {
  const result = await fetchWithRetry(`https://khatering.shop/api/v1/orders/${id}`);
  return result.data;
}

export async function addOrder(orderData) {
  return await fetchWithRetry("https://khatering.shop/api/v1/orders", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
}

export async function updateOrder(id, data) {
  return await fetchWithRetry(`https://khatering.shop/api/v1/orders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function deleteOrder(id) {
  await fetchWithRetry(`https://khatering.shop/api/v1/orders/${id}`, {
    method: 'DELETE',
  });
  return true;
}