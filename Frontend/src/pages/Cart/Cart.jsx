import React, { useEffect, useState } from "react";
import { setCart } from "../../Redux/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { url } from "../../utils/constant";
import { useNavigate } from "react-router-dom";
import { setCheckOut, setOrderItems, setTotalPrice } from "../../Redux/shippingSlice";

function Cart() {
  const { user } = useSelector((store) => store.auth);
  const userId = localStorage.getItem("userId");
  const { items, grandTotal, totalQuantity } = useSelector((store) => store.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(grandTotal);

  const fetchCart = async () => {
    try {
      const response = await axios.post(`${url}/cart/get-cart`, { userId });
      if (response.data.success) {
        const { cart } = response.data;

        const totalQuantity = cart.productsInCart.reduce((total, item) => total + item.productQty, 0);
        const grandTotal = cart.productsInCart.reduce((total, item) => total + item.totalPrice, 0);

        dispatch(
          setCart({
            items: cart.productsInCart,
            grandTotal,
            totalQuantity,
          })
        );
        setFinalTotal(grandTotal); // Initialize final total
      } else {
        console.log("Failed to fetch products:", response.data.message);
      }
    } catch (error) {
      console.log("Error fetching cart:", error.message);
    }
  };

  const verifyCoupon = async () => {
    try {
      const response = await axios.post(`${url}/coupon/verify-coupon`, { code: couponCode });
      if (response.data.success) {
        const discountPercentage = response.data.discountPercentage;
        const discountAmount = (grandTotal * discountPercentage) / 100;
        setDiscount(discountAmount);
        setFinalTotal(grandTotal - discountAmount);
        alert(`Coupon applied! You saved ₹${discountAmount}`);
      } else {
        alert("Invalid coupon code. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying coupon:", error.message);
      alert("Error applying coupon. Please try again.");
    }
  };

  const checkOut = () => {
    dispatch(setOrderItems({ orderItems: items }));
    dispatch(setTotalPrice({ totalPrice: finalTotal }));
    dispatch(setCheckOut(true));
    navigate("/place");
  };

  useEffect(() => {
    if (userId) {
      fetchCart();
    } else {
      dispatch(
        setCart({
          items: [],
          grandTotal: 0,
          totalQuantity: 0,
        })
      );
    }
  }, [userId]);

  return (
    <div className="max-w-sm md:max-w-lg lg:max-w-4xl mx-auto p-4 md:p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">Your Shopping Cart</h1>
      {items.length > 0 ? (
        <>
          <div className="space-y-6">
            {items.map((item) => (
              <div className="flex flex-col md:flex-row items-center border-b pb-4" key={item.productId}>
                <img
                  src={`${item.productImg}`}
                  alt={item.productName}
                  className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg mr-0 md:mr-4 mb-4 md:mb-0"
                />
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-lg md:text-xl font-medium text-gray-800">{item.productName}</h2>
                  <p className="text-gray-600">Price: ₹{item.productPrice}</p>
                  <div className="flex items-center justify-center md:justify-start mt-2 space-x-4">
                    <p className="text-gray-600">Quantity:</p>
                    <button className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300">
                      -
                    </button>
                    <span className="px-4">{item.productQty}</span>
                    <button className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300">
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-700 font-medium">Total Quantity:</span>
                <span className="text-gray-800">{totalQuantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 font-medium">Total Price:</span>
                <span className="text-gray-800">₹{grandTotal}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-gray-700 font-medium">Discount:</span>
                <span className="text-gray-800">- ₹{discount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 font-medium">Final Price:</span>
                <span className="text-gray-800">₹{finalTotal}</span>
              </div>
            </div>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Enter Coupon Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full px-4 py-2 border rounded mb-2"
              />
              <button
                onClick={verifyCoupon}
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition w-full"
              >
                Apply Coupon
              </button>
            </div>
            <div className="text-center mt-6">
              <button
                onClick={checkOut}
                className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700 transition"
              >
                <i className="fas fa-shopping-cart mr-2"></i> Checkout
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <img src="/path/to/empty-cart-image.png" alt="Empty Cart" className="max-w-xs mb-4" />
          <p className="text-xl text-gray-600">Your cart is empty.</p>
        </div>
      )}
    </div>
  );
}

export default Cart;
