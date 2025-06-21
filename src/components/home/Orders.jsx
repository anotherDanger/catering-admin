import React, { useEffect, useState } from 'react';
import './order.css';
import {
  getOrders,
  getOrdersByUsername,
  getOrderById,
  updateOrder,
  deleteOrder
} from '../../api/orders';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [updateErrors, setUpdateErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAllOrders = async () => {
    setLoading(true);
    const data = await getOrders();
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const handleSearch = async (e) => {
    const term = e.target.value.trim();
    setSearchTerm(term);
    setLoading(true);

    if (!term) {
      const data = await getOrders();
      setOrders(data || []);
      setLoading(false);
      return;
    }

    const isPossibleId = /^[0-9a-fA-F-]{6,36}$/.test(term);

    if (isPossibleId) {
      const data = await getOrderById(term);
      setOrders(data ? [data] : []);
    } else {
      const data = await getOrdersByUsername(term);
      setOrders(data || []);
    }
    setLoading(false);
  };

  const handleUpdate = async (e, id) => {
    e.preventDefault();
    const form = e.target;
    const status = form.status.value.trim();

    if (!status) {
      setUpdateErrors((prev) => ({ ...prev, [id]: "Status wajib dipilih." }));
      return;
    }

    setUpdateErrors((prev) => ({ ...prev, [id]: null }));

    try {
      const result = await updateOrder(id, { status });
      if (!result.success) throw new Error(result.message);
      alert("Order berhasil diperbarui!");
      if (searchTerm) {
        await handleSearch({ target: { value: searchTerm } });
      } else {
        await fetchAllOrders();
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this order?")) {
      try {
        const deleted = await deleteOrder(id);
        if (!deleted) throw new Error("Gagal menghapus order, coba lagi.");
        setOrders((prev) => prev.filter((order) => order.id !== id));
        alert("Order berhasil dihapus!");
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <section>
      <div className="container">
        <h2 className="title text-center my-5">Orders</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by username or id"
            className="form-control"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        {loading && <p className="text-center">Loading...</p>}
        <div className="row mx-2 justify-content-center">
          {!loading && orders.length === 0 && <p className="text-center">No orders found.</p>}
          {orders.map((order) => (
            <div className="col-md-4 text-center" key={order.id}>
              <form className="order-form" onSubmit={(e) => handleUpdate(e, order.id)}>
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
                    {updateErrors[order.id] && (
                      <small className="text-danger d-block mb-2">{updateErrors[order.id]}</small>
                    )}
                    <input type="submit" className="btn btn-primary mt-2" value="Update" />
                    <button
                      type="button"
                      className="btn btn-danger mx-2 mt-2"
                      onClick={() => handleDelete(order.id)}
                    >
                      Delete
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
