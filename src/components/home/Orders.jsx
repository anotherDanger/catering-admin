import React from 'react';
import './order.css'; // pastikan ini diimpor

function Orders() {
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

        <div className="row  mx-2 justify-content-center">
         <div className="col-md-4  text-center ">
            <form className="order-form">
              <div className="card text-center p-4">
                <div className="card-body">
                   
                      <input type="hidden" name="transaction_id" value="12345" />
                      <p><strong>Transaction ID:</strong> 12345</p>
                      <p><strong>Username:</strong> user1</p>
                      <p><strong>Product Name:</strong> Espresso</p>
                      <p><strong>Quantity:</strong> 2</p>
                      <p><strong>Status:</strong> pending</p>

                      <label htmlFor="status-12345">Update Status:</label>
                      <select name="status" id="status-12345" defaultValue="pending">
                        <option disabled value="">-- Select --</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                      </select>

                      <br /><br />

                      <input type="submit" className="btn btn-primary" value="Update" />
                      <button className="btn btn-danger mx-2" onClick={handleDelete}>
                        Delete
                      </button>
              </div>
            </div>
          </form>
          </div>
         </div> 
      </div>
    </section>
  );
}

export default Orders;
