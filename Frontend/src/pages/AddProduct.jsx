import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { url } from "../utils/constant"; // URL constant

function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    img: "",
    category: "",
    rating: "",
    productId: "",
    inStockValue: "",
    soldStockValue: "",
  });

  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  // Handle form submission to create the product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/create-product`, product);
      if (response.data.success) {
        alert("Product added successfully!");
        navigate("/"); // Redirect to the products page
      } else {
        alert("Failed to add product.");
      }
    } catch (error) {
      console.error("Error adding product:", error.message);
      alert("An error occurred while adding the product.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={product.name}
                onChange={handleChange}
                required
                className="w-full mt-2 p-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-gray-700 font-medium">
                Price
              </label>
              <input
                type="text"
                id="price"
                name="price"
                value={product.price}
                onChange={handleChange}
                required
                className="w-full mt-2 p-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="img" className="block text-gray-700 font-medium">
                Product Image URL
              </label>
              <input
                type="text"
                id="img"
                name="img"
                value={product.img}
                onChange={handleChange}
                required
                className="w-full mt-2 p-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-gray-700 font-medium">
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={product.category}
                onChange={handleChange}
                required
                className="w-full mt-2 p-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="rating" className="block text-gray-700 font-medium">
                Rating
              </label>
              <input
                type="number"
                id="rating"
                name="rating"
                value={product.rating}
                onChange={handleChange}
                required
                className="w-full mt-2 p-2 border rounded"
                min="0"
                max="5"
              />
            </div>
            <div>
              <label htmlFor="productId" className="block text-gray-700 font-medium">
                Product ID
              </label>
              <input
                type="text"
                id="productId"
                name="productId"
                value={product.productId}
                onChange={handleChange}
                required
                className="w-full mt-2 p-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="inStockValue" className="block text-gray-700 font-medium">
                In-Stock Quantity
              </label>
              <input
                type="number"
                id="inStockValue"
                name="inStockValue"
                value={product.inStockValue}
                onChange={handleChange}
                required
                className="w-full mt-2 p-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="soldStockValue" className="block text-gray-700 font-medium">
                Sold Quantity
              </label>
              <input
                type="number"
                id="soldStockValue"
                name="soldStockValue"
                value={product.soldStockValue}
                onChange={handleChange}
                required
                className="w-full mt-2 p-2 border rounded"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
