import React, { useEffect, useState } from 'react';
import './order.css';
import { getOrders, updateOrder } from '../../api/orders';

function Orders() {
  const [orders, setOrders] = useState([]);


  useEffect(() => {
    getOrders()
      .then((data) => {
        if (data) setOrders(data);
      });
  }, []);

  // Handle update order status
  const handleClick = async (e, orderId, newStatus) => {
    e.preventDefault();

    if (window.confirm(`Update status for order with ID ${orderId} to ${newStatus}?`)) {
      const result = await updateOrder(orderId, newStatus);
      if (result) {
        alert(`Order ${orderId} status updated to ${newStatus}`);

        setOrders(prev =>
          prev.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        alert('Failed to update order status');
      }
    }
  };

  return (
    <section>
      <div className="container">
        <h2 className="title text-center my-5">Orders</h2>
        <div className="row mx-2 justify-content-center">
          {orders.map((order) => (
            <div className="col-md-4 text-center" key={order.id}>
              <form className="order-form">
                <div className="card text-center p-4">
                  <div className="card-body">
                    <input type="hidden" name="transaction_id" value={order.id} />
                    <p><strong>Transaction ID:</strong> {order.id}</p>
                    <p><strong>Username:</strong> {order.username}</p>
                    <p><strong>Product Name:</strong> {order.product_name}</p>
                    <p><strong>Quantity:</strong> {order.quantity}</p>
                    <p><strong>Status:</strong> {order.status}</p>

                    {/* Update Status */}
                    <label htmlFor={`status-${order.id}`}>Update Status:</label>
                    <select 
                      name="status" 
                      id={`status-${order.id}`} 
                      defaultValue={order.status}
                    >
                      <option disabled value="">-- Select --</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                    <br /><br />
                    {/* Tombol Update */}
                    <button 
                      type="button" 
                      className="btn btn-primary" 
                      onClick={(e) => handleClick(e, order.id, document.getElementById(`status-${order.id}`).value)}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Orders;
