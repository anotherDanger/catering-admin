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
  return {
    ...extraHeaders,
    Authorization: `Bearer ${token}`
  };
}

export async function getProducts() {
  let response = await fetch("https://khatering.shop/api/v1/products", {
    method: "GET",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    credentials: "include"
  });

  if (response.status === 401) {
    const refreshed = await tryRefreshToken();
    if (!refreshed) return null;
    response = await fetch("https://khatering.shop/api/v1/products", {
      method: "GET",
      headers: getAuthHeaders({ "Content-Type": "application/json" }),
      credentials: "include"
    });
  }

  if (!response.ok) return null;
  const data = await response.json();
  return data.data;
}

export async function addProduct(data) {
  const formData = new FormData(data);
  let response = await fetch("https://khatering.shop/api/v1/products", {
    method: "POST",
    body: formData,
    headers: getAuthHeaders(),
    credentials: "include"
  });

  if (response.status === 401) {
    const refreshed = await tryRefreshToken();
    if (!refreshed) return null;
    response = await fetch("https://khatering.shop/api/v1/products", {
      method: "POST",
      body: formData,
      headers: getAuthHeaders(),
      credentials: "include"
    });
  }

  if (!response.ok) return null;
  const dataJson = await response.json();
  return dataJson.data;
}

export async function deleteProduct(id) {
  let response = await fetch(`https://khatering.shop/api/v1/products/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include"
  });

  if (response.status === 401) {
    const refreshed = await tryRefreshToken();
    if (!refreshed) return false;
    response = await fetch(`https://khatering.shop/api/v1/products/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      credentials: "include"
    });
  }

  return response.ok;
}

export async function updateProduct(id, formData) {
  let response = await fetch(`https://khatering.shop/api/v1/products/${id}`, {
    method: "PUT",
    body: formData,
    headers: getAuthHeaders(),
    credentials: "include"
  });

  if (response.status === 401) {
    const refreshed = await tryRefreshToken();
    if (!refreshed) return null;
    response = await fetch(`https://khatering.shop/api/v1/products/${id}`, {
      method: "PUT",
      body: formData,
      headers: getAuthHeaders(),
      credentials: "include"
    });
  }

  if (!response.ok) return null;
  const dataJson = await response.json();
  return dataJson.data;
}

export async function getProductImage(filename) {
  const response = await fetch(`https://khatering.shop/images/${filename}`, {
    method: "GET"
  });

  if (!response.ok) return null;
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

export default getProducts;
