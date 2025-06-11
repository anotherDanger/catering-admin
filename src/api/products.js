async function handleUnauthorized(status) {
    if (status === 401) {
      const refreshResponse = await fetch("http://localhost:8081/v1/refresh", {
        method: "POST",
        credentials: "include"
      });
  
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        localStorage.setItem("access_token", refreshData.access_token);
        localStorage.setItem("user", JSON.stringify(refreshData.user));
        return;
      }
  
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      window.location.reload();
    }
  }
  

async function getProducts() {
    const accessToken = localStorage.getItem('access_token');
    const request = new Request("http://localhost:8080/api/v1/products", {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        },
        credentials: "include",
        method: "GET"
    });

    try {
        const response = await fetch(request);
        if (!response.ok) {
            handleUnauthorized(response.status);
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        return null;
    }
}

export async function addProduct(data) {
    const accessToken = localStorage.getItem('access_token');
    const formData = new FormData(data);
    const request = new Request("http://localhost:8080/api/v1/products", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${accessToken}`
        },
        credentials: "include",
        body: formData
    });

    try {
        const response = await fetch(request);
        if (!response.ok) {
            handleUnauthorized(response.status);
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        return null;
    }
}

export async function deleteProduct(id) {
    const accessToken = localStorage.getItem('access_token');
    const request = new Request(`http://localhost:8080/api/v1/products/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${accessToken}`
        },
        credentials: "include",
    });

    try {
        const response = await fetch(request);
        if (!response.ok) {
            handleUnauthorized(response.status);
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
        }
        return true;
    } catch (error) {
        return false;
    }
}

export async function updateProduct(id, formData) {
    const accessToken = localStorage.getItem('access_token');
    const request = new Request(`http://localhost:8080/api/v1/products/${id}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${accessToken}`
        },
        credentials: "include",
        body: formData
    });

    try {
        const response = await fetch(request);
        if (!response.ok) {
            handleUnauthorized(response.status);
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        return null;
    }
}

export default getProducts;
