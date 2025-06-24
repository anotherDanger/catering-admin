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

export async function getOrders() {
  let response = await fetch("https://khatering.shop/api/v1/orders", {
    method: "GET",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    credentials: "include"
  });

  if (response.status === 401) {
    const refreshed = await tryRefreshToken();
    if (!refreshed) return null;
    response = await fetch("https://khatering.shop/api/v1/orders", {
      method: "GET",
      headers: getAuthHeaders({ "Content-Type": "application/json" }),
      credentials: "include"
    });
  }

  if (!response.ok) return null;
  const data = await response.json();
  return data.data;
}

export async function getOrdersByUsername(username) {
  let response = await fetch(`https://khatering.shop/api/v1/orders/user/${username}`, {
    method: "GET",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    credentials: "include"
  });

  if (response.status === 401) {
    const refreshed = await tryRefreshToken();
    if (!refreshed) return null;
    response = await fetch(`https://khatering.shop/v1/orders/user/${username}`, {
      method: "GET",
      headers: getAuthHeaders({ "Content-Type": "application/json" }),
      credentials: "include"
    });
  }

  if (!response.ok) return null;
  const data = await response.json();
  return data.data;
}

export async function getOrderById(id) {
  let response = await fetch(`https://khatering.shop/api/v1/orders/${id}`, {
    method: "GET",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    credentials: "include"
  });

  if (response.status === 401) {
    const refreshed = await tryRefreshToken();
    if (!refreshed) return null;
    response = await fetch(`https://khatering.shop/api/v1/orders/${id}`, {
      method: "GET",
      headers: getAuthHeaders({ "Content-Type": "application/json" }),
      credentials: "include"
    });
  }

  if (!response.ok) return null;
  const data = await response.json();
  return data.data;
}

export async function addOrder(data) {
  const formData = new FormData(data);
  let response = await fetch("https://khatering.shop/api/v1/orders", {
    method: "POST",
    body: formData,
    headers: getAuthHeaders(),
    credentials: "include"
  });

  if (response.status === 401) {
    const refreshed = await tryRefreshToken();
    if (!refreshed) return null;
    response = await fetch("https://khatering.shop/api/v1/orders", {
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

export async function updateOrder(id, data) {
  let response = await fetch(`https://khatering.shop/api/v1/orders/${id}`, {
    method: "PUT",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (response.status === 401) {
    const refreshed = await tryRefreshToken();
    if (!refreshed) return { success: false, message: "Unauthorized" };
    response = await fetch(`https://khatering.shop/api/v1/orders/${id}`, {
      method: "PUT",
      headers: getAuthHeaders({ "Content-Type": "application/json" }),
      credentials: "include",
      body: JSON.stringify(data),
    });
  }

  const json = await response.json();

  if (!response.ok) {
    return {
      success: false,
      message: json?.status || "Unknown error",
    };
  }

  return {
    success: true,
    message: json?.status || "Update berhasil",
  };
}

export async function deleteOrder(id) {
  let response = await fetch(`http://212.85.27.181:8082/api/v1/orders/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include"
  });

  if (response.status === 401) {
    const refreshed = await tryRefreshToken();
    if (!refreshed) return false;
    response = await fetch(`http://212.85.27.181:8082/api/v1/orders/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      credentials: "include"
    });
  }

  return response.ok;
}

export default getOrders;
