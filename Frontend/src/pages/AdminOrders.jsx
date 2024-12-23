import React from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { updateOrderStatus } from "../Redux/adminSlice";
import { url } from "../utils/constant";

function AdminOrders() {
  const { orders } = useSelector((state) => state.admin); // Access orders from Redux store
  const dispatch = useDispatch();

  const handleStatusChange = async (orderId) => {
    try {
      // Send a request to update the order status
      const response = await axios.put(`${url}/order/update-status`, {
        orderId,
        status: "Delivered", // Send the new status
      });

      if (response.data.success) {
        // Update Redux state with the updated status
        dispatch(updateOrderStatus({ orderId, status: "Delivered" }));
        alert("Order status updated successfully.");
      } else {
        alert("Failed to update order status.");
      }
    } catch (error) {
      console.error("Error updating order status:", error.message);
      alert("An error occurred while updating the order status.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Orders</h1>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Order ID</th>
              <th className="border px-4 py-2">User ID</th>
              <th className="border px-4 py-2">Product Name</th>
              <th className="border px-4 py-2">Product Price</th>
              <th className="border px-4 py-2">Product Quantity</th>
              <th className="border px-4 py-2">Total Price</th>
              <th className="border px-4 py-2">Order Status</th>
              <th className="border px-4 py-2">Shipping Address</th>
              <th className="border px-4 py-2">Order Date</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{order._id}</td>
                <td className="border px-4 py-2">{order.userId}</td>
                
                {/* Display product information for each order */}
                {order.orderItems.map((item) => (
                  <React.Fragment key={item.productId}>
                    <td className="border px-4 py-2">{item.productName}</td>
                    <td className="border px-4 py-2">${item.productPrice}</td>
                    <td className="border px-4 py-2">{item.productQty}</td>
                    <td className="border px-4 py-2">${item.totalPrice}</td>
                  </React.Fragment>
                ))}

                <td className="border px-4 py-2">{order.orderStatus}</td>
                <td className="border px-4 py-2">{order.shippingAddress}</td>
                <td className="border px-4 py-2">{new Date(order.orderDate).toLocaleString()}</td>
                
                <td className="border px-4 py-2">
                  {order.orderStatus === "Pending" ? (
                    <button
                      onClick={() => handleStatusChange(order._id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Mark as Delivered
                    </button>
                  ) : (
                    <span className="text-green-500 font-bold">Delivered</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrders;
