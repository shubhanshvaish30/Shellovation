import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addCoupon, deleteCoupon, setAdminCoupons } from "../Redux/adminSlice"; // Import actions
import { url } from "../utils/constant"; // Adjust URL if needed

function Coupons() {
  const [coupon, setCoupon] = useState({
    code: "",
    discountPercentage: "",
  });

  const dispatch = useDispatch();
  const { coupons } = useSelector((state) => state.admin); // Get coupons from Redux store

  // Fetch all coupons when the component mounts
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get(`${url}/coupon/get-coupon`);
        if (response.data.success) {
          dispatch(setAdminCoupons({ coupons: response.data.coupons }));
        }
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };

    fetchCoupons();
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCoupon((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/coupon/save-coupon`, coupon);
      if (response.data.success) {
        // Add the new coupon to Redux state
        dispatch(addCoupon(response.data.coupon));
        alert("Coupon added successfully!");
        setCoupon({ code: "", discountPercentage: "" }); // Reset form
      } else {
        alert("Failed to add coupon.");
      }
    } catch (error) {
      console.error("Error adding coupon:", error.message);
      alert("An error occurred while adding the coupon.");
    }
  };

  const handleDeleteCoupon = async (couponCode) => {
    try {
      console.log(couponCode);
  
      const response = await axios.delete(`${url}/coupon/delete-coupon`, {
        data: { code: couponCode },  // This is fine as long as the backend expects 'code'
      });
  
      if (response.data.success) {
        dispatch(deleteCoupon(couponCode)); // Remove coupon from Redux state
        alert("Coupon deleted successfully!");
      } else {
        alert("Failed to delete coupon.");
      }
    } catch (error) {
      console.error("Error deleting coupon:", error.message);
      alert("An error occurred while deleting the coupon.");
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Coupons</h1>

        {/* Add Coupon Form */}
        <form onSubmit={handleAddCoupon} className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="code" className="block text-gray-700 font-medium">
                Coupon Code
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={coupon.code}
                onChange={handleChange}
                required
                className="w-full mt-2 p-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="discountPercentage" className="block text-gray-700 font-medium">
                Discount Percentage
              </label>
              <input
                type="number"
                id="discountPercentage"
                name="discountPercentage"
                value={coupon.discountPercentage}
                onChange={handleChange}
                required
                className="w-full mt-2 p-2 border rounded"
                min="1"
                max="100"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Add Coupon
          </button>
        </form>

        {/* List of Coupons */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">All Coupons</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Coupon Code</th>
              <th className="border px-4 py-2">Discount Percentage</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon._id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{coupon.code}</td>
                <td className="border px-4 py-2">{coupon.discountPercentage}%</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleDeleteCoupon(coupon.code)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Coupons;
