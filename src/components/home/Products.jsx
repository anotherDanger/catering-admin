import React, { useEffect, useState, useRef } from "react";
import { Modal } from "bootstrap";
import "./products.css";
import getProducts, { addProduct, deleteProduct, updateProduct, getProductImage } from "../../api/products";

function Products() {
  const [products, setProducts] = useState([]);
  const [imageURLs, setImageURLs] = useState({});
  const [errors, setErrors] = useState({});
  const [updateErrors, setUpdateErrors] = useState({});
  const addModalRef = useRef(null);
  const addModalInstance = useRef(null);
  const editModalInstances = useRef({});

  useEffect(() => {
    async function fetchProducts() {
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : []);
      const imageMap = {};
      for (const product of data || []) {
        if (product.image_metadata) {
          const imageUrl = await getProductImage(product.image_metadata);
          imageMap[product.id] = imageUrl;
        }
      }
      setImageURLs(imageMap);
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    if (addModalRef.current) {
      addModalInstance.current = new Modal(addModalRef.current);
    }
  }, []);

  const bukaModalTambah = () => {
    setErrors({});
    if (addModalInstance.current) addModalInstance.current.show();
  };

  const tutupModalTambah = () => {
    setErrors({});
    if (addModalInstance.current) addModalInstance.current.hide();
  };

  const handleTambahSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const id = formData.get("id")?.trim();
    const name = formData.get("name")?.trim();
    const price = formData.get("price")?.trim();
    const stock = formData.get("stock")?.trim();
    const description = formData.get("description")?.trim();
    const newErrors = {};
    if (!id) newErrors.id = "ID produk wajib diisi.";
    else if (!/^[A-Za-z0-9]+$/.test(id)) newErrors.id = "ID hanya boleh alfanumerik tanpa spasi.";
    else if (id.length < 3) newErrors.id = "ID minimal 3 karakter.";
    else if (id.length > 10) newErrors.id = "ID maksimal 10 karakter.";
    if (!name) newErrors.name = "Nama produk wajib diisi.";
    else if (!/^[A-Za-z\s]+$/.test(name)) newErrors.name = "Nama hanya boleh huruf dan spasi.";
    else if (name.length < 5) newErrors.name = "Nama minimal 5 karakter.";
    else if (name.length > 50) newErrors.name = "Nama maksimal 50 karakter.";
    if (!stock) newErrors.stock = "Stok wajib diisi.";
    else if (isNaN(stock)) newErrors.stock = "Stok harus berupa angka.";
    if (!price) newErrors.price = "Harga wajib diisi.";
    else if (isNaN(price)) newErrors.price = "Harga harus berupa angka.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    try {
      const berhasilTambah = await addProduct(form);
      if (!berhasilTambah) throw new Error("Gagal menambah produk, coba lagi.");
      const dataBaru = await getProducts();
      setProducts(Array.isArray(dataBaru) ? dataBaru : []);
      const imageMap = {};
      for (const product of dataBaru || []) {
        if (product.image_metadata) {
          const imageUrl = await getProductImage(product.image_metadata);
          imageMap[product.id] = imageUrl;
        }
      }
      setImageURLs(imageMap);
      alert("Produk berhasil ditambahkan!");
      tutupModalTambah();
      form.reset();
    } catch (error) {
      alert(`Gagal menambah produk: ${error.message}`);
      console.error("Error tambah produk:", error);
    }
  };

  const bukaModalEdit = (id) => {
    setUpdateErrors({});
    if (!editModalInstances.current[id]) {
      const modalEl = document.getElementById(`edit-product-${id}`);
      if (modalEl) {
        editModalInstances.current[id] = new Modal(modalEl);
      }
    }
    editModalInstances.current[id]?.show();
  };

  const tutupModalEdit = (id) => {
    setUpdateErrors({});
    editModalInstances.current[id]?.hide();
  };

  const handleUpdateSubmit = async (e, id) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const name = formData.get("name")?.trim();
    const price = formData.get("price")?.trim();
    const stock = formData.get("stock")?.trim();
    const description = formData.get("description")?.trim();
    const newErrors = {};
    if (!name) newErrors.name = "Nama produk wajib diisi.";
    else if (name.length < 5) newErrors.name = "Nama minimal 5 karakter.";
    else if (name.length > 50) newErrors.name = "Nama maksimal 50 karakter.";
    if (!stock) newErrors.stock = "Stok wajib diisi.";
    else if (isNaN(stock)) newErrors.stock = "Stok harus berupa angka.";
    if (!price) newErrors.price = "Harga wajib diisi.";
    else if (isNaN(price)) newErrors.price = "Harga harus berupa angka.";
    setUpdateErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    try {
      const berhasilUpdate = await updateProduct(id, formData);
      if (!berhasilUpdate) throw new Error("Gagal memperbarui produk, coba lagi.");
      const dataBaru = await getProducts();
      setProducts(Array.isArray(dataBaru) ? dataBaru : []);
      const imageMap = {};
      for (const product of dataBaru || []) {
        if (product.image_metadata) {
          const imageUrl = await getProductImage(product.image_metadata);
          imageMap[product.id] = imageUrl;
        }
      }
      setImageURLs(imageMap);
      alert("Produk berhasil diperbarui!");
      tutupModalEdit(id);
    } catch (error) {
      alert(`Gagal memperbarui produk: ${error.message}`);
      console.error("Error update produk:", error);
    }
  };

  const handleHapus = async (name, id) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus produk "${name}"?`)) {
      try {
        const berhasilHapus = await deleteProduct(id);
        if (!berhasilHapus) throw new Error("Gagal menghapus produk, coba lagi.");
        setProducts(products.filter((p) => p.id !== id));
        const newImageURLs = { ...imageURLs };
        delete newImageURLs[id];
        setImageURLs(newImageURLs);
        alert("Produk berhasil dihapus!");
      } catch (error) {
        alert(`Gagal menghapus produk: ${error.message}`);
        console.error("Error hapus produk:", error);
      }
    }
  };

  return (
    <>
      <button className="floating-btn btn btn-primary" onClick={bukaModalTambah} aria-label="Tambah Produk">
        <i className="fas fa-plus"></i>
      </button>
      <div className="container mt-5">
        <h2 className="titlee text-center mb-4">Total Produk</h2>
        {products.length === 0 ? (
          <p className="text-center">Belum ada produk.</p>
        ) : (
          <div className="row p-3 justify-content-center">
            {products.map((p) => (
              <div className="col-md-6 col-lg-4 mb-4" key={p.id}>
                <div className="card justify-content-center align-items-center p-4">
                  <img
                    src={imageURLs[p.id] || ""}
                    className="card-img-top text-center"
                    alt={p.name}
                    style={{ objectFit: "cover", height: "200px" }}
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title p-3">{p.name}</h5>
                    <p className="card-text">Harga: {p.price}</p>
                    <p className="card-text">Stok: {p.stock}</p>
                    <div className="mt-auto">
                      <button className="btn btn-primary mx-2 mt-3" onClick={() => bukaModalEdit(p.id)}>
                        Edit
                      </button>
                      <button className="btn btn-danger mx-2 mt-3" onClick={() => handleHapus(p.name, p.id)}>
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
                <div className="modal fade" id={`edit-product-${p.id}`} tabIndex="-1" aria-hidden="true">
                  <div className="modal-dialog">
                    <div className="modal-content p-3">
                      <form onSubmit={(e) => handleUpdateSubmit(e, p.id)}>
                        <img
                          src={imageURLs[p.id] || ""}
                          alt={p.name}
                          className="img-fluid mb-2"
                          style={{ maxHeight: "200px", objectFit: "cover" }}
                        />
                        <div className="input-field mb-2">
                          <label>Nama Produk</label>
                          <input type="text" name="name" defaultValue={p.name} className="form-control" required />
                          {updateErrors.name && <small className="text-danger">{updateErrors.name}</small>}
                        </div>
                        <div className="input-field mb-2">
                          <label>Harga</label>
                          <input type="number" name="price" defaultValue={p.price} className="form-control" required />
                          {updateErrors.price && <small className="text-danger">{updateErrors.price}</small>}
                        </div>
                        <div className="input-field mb-2">
                          <label>Stok</label>
                          <input type="number" name="stock" defaultValue={p.stock} className="form-control" required />
                          {updateErrors.stock && <small className="text-danger">{updateErrors.stock}</small>}
                        </div>
                        <div className="input-field mb-2">
                          <label>Deskripsi</label>
                          <textarea name="description" defaultValue={p.description} className="form-control" />
                          {updateErrors.description && (
                            <small className="text-danger">{updateErrors.description}</small>
                          )}
                        </div>
                        <div className="input-field mb-2">
                          <label>Gambar</label>
                          <input type="file" name="image" className="form-control" />
                        </div>
                        <div className="modal-footer p-0">
                          <button type="submit" className="btn btn-primary me-2">Perbarui</button>
                          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => tutupModalEdit(p.id)}>Batal</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="modal fade" id="tambah-product" tabIndex="-1" aria-hidden="true" ref={addModalRef}>
        <div className="modal-dialog">
          <div className="modal-content p-3">
            <form onSubmit={handleTambahSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">Tambah Produk Baru</h5>
                <button type="button" className="btn-close" aria-label="Tutup" onClick={tutupModalTambah} />
              </div>
              <div className="modal-body">
                <div className="input-field mb-2">
                  <label>ID Produk</label>
                  <input type="text" name="id" className="form-control" required />
                  {errors.id && <small className="text-danger">{errors.id}</small>}
                </div>
                <div className="input-field mb-2">
                  <label>Nama Produk</label>
                  <input type="text" name="name" className="form-control" required />
                  {errors.name && <small className="text-danger">{errors.name}</small>}
                </div>
                <div className="input-field mb-2">
                  <label>Harga</label>
                  <input type="number" name="price" className="form-control" required />
                  {errors.price && <small className="text-danger">{errors.price}</small>}
                </div>
                <div className="input-field mb-2">
                  <label>Stok</label>
                  <input type="number" name="stock" className="form-control" required />
                  {errors.stock && <small className="text-danger">{errors.stock}</small>}
                </div>
                <div className="input-field mb-2">
                  <label>Deskripsi</label>
                  <textarea name="description" className="form-control" />
                  {errors.description && <small className="text-danger">{errors.description}</small>}
                </div>
                <div className="input-field mb-2">
                  <label>Gambar</label>
                  <input type="file" name="image" className="form-control" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={tutupModalTambah}>Batal</button>
                <input type="submit" value="Simpan" className="btn btn-primary" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Products;
