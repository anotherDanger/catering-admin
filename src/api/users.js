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
  
  function getAuthHeaders(extraHeaders = {}) {
    const token = localStorage.getItem("access_token");
    return {
      ...extraHeaders,
      Authorization: `Bearer ${token}`
    };
  }
  
  export async function getUsers() {
    let response = await fetch("http://localhost:8080/api/v1/users", {
      method: "GET",
      headers: getAuthHeaders({ "Content-Type": "application/json" }),
      credentials: "include"
    });
  
    if (response.status === 401) {
      const refreshed = await tryRefreshToken();
      if (!refreshed) return null;
      response = await fetch("http://localhost:8080/api/v1/users", {
        method: "GET",
        headers: getAuthHeaders({ "Content-Type": "application/json" }),
        credentials: "include"
      });
    }
  
    if (!response.ok) return null;
    const data = await response.json();
    
    return data.data;
  }
  
  export default getUsers;
  
  