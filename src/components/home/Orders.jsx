import React, { useEffect, useState, useRef } from 'react';
import './order.css';
import {
  getOrders,
  getOrdersByUsername,
  getOrderById,
  updateOrder,
  deleteOrder,
  addOrder
} from '../../api/orders';
import { fetchDistricts, fetchVillagesByDistrict } from '../../api/wilayah';

function AddOrderModal({ show, onClose, onSave }) {
  const modalRef = useRef(null);
  const formRef = useRef(null);
  const [modalInstance, setModalInstance] = useState(null);
  
  const initialFormState = {
    product_id: '', product_name: '', name: '', phone: '',
    alamat: '', kecamatan: '', desa: '', username: '',
    quantity: 1, total: 0, status: 'pending',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (modalRef.current) {
      const instance = new window.bootstrap.Modal(modalRef.current);
      setModalInstance(instance);
    }
  }, []);

  useEffect(() => {
    if (!modalInstance) return;
    if (show) {
      modalInstance.show();
    } else {
      modalInstance.hide();
    }
  }, [show, modalInstance]);

  useEffect(() => {
    const loadDistricts = async () => {
      try {
        const data = await fetchDistricts();
        setDistricts(data);
      } catch (error) {
        console.error(error);
      }
    };
    loadDistricts();
  }, []);

  useEffect(() => {
    if (formData.kecamatan) {
      const loadVillages = async () => {
        try {
          const selectedDistrict = districts.find(d => d.name === formData.kecamatan);
          if (selectedDistrict) {
            const data = await fetchVillagesByDistrict(selectedDistrict.id);
            setVillages(data);
          }
        } catch (error) {
          console.error(error);
        }
      };
      loadVillages();
      setFormData(prev => ({ ...prev, desa: '' }));
    } else {
      setVillages([]);
    }
  }, [formData.kecamatan, districts]);
  
  useEffect(() => {
    if(!show){
        setFormData(initialFormState);
        setVillages([]);
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formRef.current);
      onClose();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade" ref={modalRef} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <form onSubmit={handleSubmit} ref={formRef}>
            <div className="modal-header">
              <h5 className="modal-title">Add New Order</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
               <div className="row g-3">
                <div className="col-md-6"><label className="form-label">Product ID</label><input type="text" className="form-control" name="product_id" value={formData.product_id} onChange={handleChange} required /></div>
                <div className="col-md-6"><label className="form-label">Product Name</label><input type="text" className="form-control" name="product_name" value={formData.product_name} onChange={handleChange} required /></div>
                <div className="col-md-6"><label className="form-label">Name</label><input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required /></div>
                <div className="col-md-6"><label className="form-label">Phone</label><input type="tel" className="form-control" name="phone" value={formData.phone} onChange={handleChange} required /></div>
                <div className="col-12"><label className="form-label">Alamat</label><textarea className="form-control" name="alamat" value={formData.alamat} onChange={handleChange} required></textarea></div>
                <div className="col-md-6"><label className="form-label">Kecamatan</label><select className="form-select" name="kecamatan" value={formData.kecamatan} onChange={handleChange} required><option value="">Pilih Kecamatan</option>{districts.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}</select></div>
                <div className="col-md-6"><label className="form-label">Desa</label><select className="form-select" name="desa" value={formData.desa} onChange={handleChange} disabled={!formData.kecamatan} required><option value="">Pilih Desa</option>{villages.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}</select></div>
                <div className="col-md-6"><label className="form-label">Username</label><input type="text" className="form-control" name="username" value={formData.username} onChange={handleChange} required /></div>
                <div className="col-md-3"><label className="form-label">Quantity</label><input type="number" className="form-control" name="quantity" min="1" value={formData.quantity} onChange={handleChange} required /></div>
                <div className="col-md-3">
                  <label className="form-label">Total</label>
                  <div className="input-group">
                    <span className="input-group-text">Rp</span>
                    <input type="number" className="form-control" name="total" min="0" value={formData.total} onChange={handleChange} required />
                  </div>
                </div>
                <div className="col-md-12"><label className="form-label">Status</label><select className="form-select" name="status" value={formData.status} onChange={handleChange} required><option value="pending">Pending</option><option value="completed">Completed</option></select></div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Order'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [updateErrors, setUpdateErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data || []);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const handleSearch = async () => {
    const term = inputValue.trim();
    setSearchTerm(term);
    setLoading(true);
    try {
      if (!term) {
        await fetchAllOrders();
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
    } catch (error) {
      console.error(error);
      alert(error.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setInputValue('');
    setSearchTerm('');
    fetchAllOrders();
  };

  const handleAddOrder = async (formElement) => {
    await addOrder(formElement);
    alert("Order baru berhasil ditambahkan!");
    await fetchAllOrders();
  };

  const handleUpdate = async (e, id) => {
    e.preventDefault();
    const status = e.target.status.value;
    if (!status) {
      setUpdateErrors((prev) => ({ ...prev, [id]: "Status wajib dipilih." }));
      return;
    }
    setUpdateErrors((prev) => ({ ...prev, [id]: null }));
    try {
      await updateOrder(id, { status });
      alert("Order berhasil diperbarui!");
      if (searchTerm) {
        await handleSearch();
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
        await deleteOrder(id);
        alert("Order berhasil dihapus!");
        setOrders((prev) => prev.filter((order) => order.id !== id));
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <section>
      <div className="container">
        <h2 className="title text-center my-5">Orders</h2>
        <div className="row justify-content-center mb-4">
          <div className="col-md-8">
            <div className="d-flex gap-2">
              <input type="text" className="form-control" placeholder="Search by username or id" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyUp={(e) => e.key === 'Enter' && handleSearch()} />
              <button className="btn btn-primary" type="button" onClick={handleSearch}>Search</button>
              <button className="btn btn-secondary" type="button" onClick={handleReset}>Reset</button>
              <button className="btn btn-success text-nowrap" type="button" onClick={() => setShowAddModal(true)}>Add Order</button>
            </div>
          </div>
        </div>
        <AddOrderModal show={showAddModal} onClose={() => setShowAddModal(false)} onSave={handleAddOrder} />
        {loading && <p className="text-center">Loading...</p>}
        <div className="row mx-2 justify-content-center gy-4">
          {!loading && orders.length === 0 && <p className="text-center">No orders found.</p>}
          {orders.map((order) => (
            <div className="col-md-4" key={order.id}>
              <form className="order-form h-100" onSubmit={(e) => handleUpdate(e, order.id)}>
                <div className="card text-center p-3 h-100">
                  <div className="card-body d-flex flex-column">
                    <p><strong>ID:</strong><br/>{order.id}</p>
                    <p><strong>Username:</strong> {order.username}</p>
                    <p><strong>Product:</strong> {order.product_name}</p>
                    <p><strong>Quantity:</strong> {order.quantity}</p>
                    <p><strong>Status:</strong> {order.status}</p>
                    <div className="mt-auto">
                      <label htmlFor={`status-${order.id}`} className="form-label">Update Status:</label>
                      <select name="status" id={`status-${order.id}`} defaultValue={order.status} className="form-select my-2"><option disabled value="">-- Select --</option><option value="pending">Pending</option><option value="completed">Completed</option></select>
                      {updateErrors[order.id] && <small className="text-danger d-block mb-2">{updateErrors[order.id]}</small>}
                      <div className="d-flex justify-content-center mt-2 gap-2">
                        <input type="submit" className="btn btn-primary" value="Update" />
                        <button type="button" className="btn btn-danger" onClick={() => handleDelete(order.id)}>Delete</button>
                      </div>
                    </div>
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