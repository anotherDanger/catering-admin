import React, { useEffect, useState } from 'react';
import './order.css';
import { getOrders } from '../../api/orders';

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrders()
      .then((data) => {
        if (data) setOrders(data);
      });
  }, []);

  const handleDelete = (e) => {
    e.preventDefault();
    if (window.confirm('Delete this order?')) {
      alert('Deleted!');
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
                    <label htmlFor={`status-${order.id}`}>Update Status:</label>
                    <select name="status" id={`status-${order.id}`} defaultValue={order.status}>
                      <option disabled value="">-- Select --</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                    <br /><br />
                    <input type="submit" className="btn btn-primary" value="Update" />
                    <button className="btn btn-danger mx-2" onClick={handleDelete}>Delete</button>
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
