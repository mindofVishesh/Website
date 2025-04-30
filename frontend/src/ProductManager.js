import React, { useState } from 'react';
import apiService from './apiService';

function ProductManager() {
  const [form, setForm] = useState({
    productid: '',
    name: '',
    price: '',
    category: '',
    brand: '',
    size: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await apiService.addProduct({
        ...form,
        price: parseFloat(form.price)
      });
      alert('✅ Product added');
    } catch (err) {
      alert('❌ Failed to add product');
      console.error(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await apiService.updateProduct(form.productid, {
        name: form.name,
        price: parseFloat(form.price),
        category: form.category,
        brand: form.brand,
        size: form.size,
        description: form.description
      });
      alert('✅ Product updated');
    } catch (err) {
      alert('❌ Failed to update product');
      console.error(err);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await apiService.deleteProduct(form.productid);
      alert('✅ Product deleted');
    } catch (err) {
      alert('❌ Failed to delete product');
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2>Product Manager</h2>
      <form>
        <input name="productid" placeholder="Product ID" value={form.productid} onChange={handleChange} required />
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input name="price" placeholder="Price" type="number" step="0.01" value={form.price} onChange={handleChange} />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        <input name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} />
        <input name="size" placeholder="Size" value={form.size} onChange={handleChange} />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        
        <button onClick={handleAdd}>Add Product</button>
        <button onClick={handleUpdate}>Update Product</button>
        <button onClick={handleDelete}>Delete Product</button>
      </form>
    </div>
  );
}

export default ProductManager;
