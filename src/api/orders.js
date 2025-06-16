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
  
export async function updateOrder(orderId, newStatus) {
  const accessToken = localStorage.getItem('access_token');
  
  const response = await fetch(`http://localhost:8080/v1/orders/${orderId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    credentials: 'include',
    body: JSON.stringify({ status: newStatus }),
  });

  if (!response.ok) {
    console.error('Failed to update order:', response.statusText);
    return null;
  }

  return await response.json();
}
