async function tryRefreshToken() {
    const refreshResponse = await fetch("http://localhost:8081/v1/refresh", {
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
  
  function isTokenExpired(token) {
    if (!token) return true;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return (payload.exp * 1000) < Date.now();
  }
  
  async function authorizedFetch(input, init = {}, retry = true) {
    const token = localStorage.getItem("access_token");
    if (!token || isTokenExpired(token)) {
      const refreshed = await tryRefreshToken();
      if (!refreshed) return;
    }
  
    const accessToken = localStorage.getItem("access_token");
    init.headers = {
      ...(init.headers || {}),
      Authorization: `Bearer ${accessToken}`
    };
    init.credentials = "include";
  
    const response = await fetch(input, init);
  
    if (response.status === 401 && retry) {
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        return authorizedFetch(input, init, false);
      }
    }
  
    return response;
  }
  
  export async function getProducts() {
    const response = await authorizedFetch("http://localhost:8080/api/v1/products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
  
    if (!response || !response.ok) return null;
  
    const data = await response.json();
    return data.data;
  }
  
  export async function addProduct(data) {
    const formData = new FormData(data);
    const response = await authorizedFetch("http://localhost:8080/api/v1/products", {
      method: "POST",
      body: formData
    });
  
    if (!response || !response.ok) return null;
  
    const dataJson = await response.json();
    return dataJson.data;
  }
  
  export async function deleteProduct(id) {
    const response = await authorizedFetch(`http://localhost:8080/api/v1/products/${id}`, {
      method: "DELETE"
    });
  
    return response && response.ok;
  }
  
  export async function updateProduct(id, formData) {
    const response = await authorizedFetch(`http://localhost:8080/api/v1/products/${id}`, {
      method: "PUT",
      body: formData
    });
  
    if (!response || !response.ok) return null;
  
    const dataJson = await response.json();
    return dataJson.data;
  }
  
  export default getProducts;
  