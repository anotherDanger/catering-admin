export async function getOrders() {
    const accessToken = localStorage.getItem('access_token');
  
    const response = await fetch("http://localhost:8080/v1/orders", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      credentials: "include",
      method: "GET"
    });
  
    if (!response.ok) return null;
  
    const data = await response.json();
    return data.data;
  }
  