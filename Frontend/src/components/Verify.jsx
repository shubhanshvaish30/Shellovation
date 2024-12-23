import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { url } from "../utils/constant";
import axios from "axios";
import { setSeller } from "../Redux/authSlice";
import { toast } from "react-toastify";

function Verify() {
  const [data, setData] = useState({
    sellerId: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/admin/verify-seller`, data);
      const { seller } = res.data;

      if (res.data.success) {
        localStorage.setItem("sellerId", seller.sellerId);
        dispatch(setSeller({ seller }));
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      toast.error("Verification failed. Please check your Seller ID.");
    }
  };

  return (
    <div className="bg-gray-50 flex justify-center items-center min-h-screen px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Verify Seller Account</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          A verification email has been sent with your Seller ID. Please enter it below to verify your account.
        </p>
        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label htmlFor="sellerId" className="block text-sm font-medium text-gray-700">
              Seller ID
            </label>
            <input
              type="text"
              name="sellerId"
              id="sellerId"
              value={data.sellerId}
              onChange={onChangeHandler}
              placeholder="Enter your Seller ID"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700 transition-all duration-200"
          >
            Verify Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default Verify;
