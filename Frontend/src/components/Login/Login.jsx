import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { url } from "../../utils/constant";
import axios from "axios";
import { setSeller, setUser } from "../../Redux/authSlice";
import { toast } from "react-toastify";

function Login() {
  const [currState, setCurrState] = useState("Login"); // "Login" or "Sign Up"
  const [isSeller, setIsSeller] = useState(false); // Toggle between user and seller
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    businessName: "",
    businessAddress: "",
    businessType: "",
    sellerId:"",
  });

  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isSeller
        ? currState === "Login"
          ? `${url}/admin/login`
          : `${url}/auth/seller/signup`
        : currState === "Login"
        ? `${url}/auth/login`
        : `${url}/auth/signup`;
        console.log(currState);
        // console.log(requestData);
        
      const requestData = isSeller
        ? {
          ...(currState === "Sign Up" && {
            businessName: data.businessName,
            businessAddress: data.businessAddress,
            businessType: data.businessType,
            phoneNumber: data.phone, // Required for Sign Up
            emailId: data.email,    // Required for Sign Up
            name: data.name,        // Seller's full name
          }),
          ...(currState === "Login" && {
            sellerId:data.sellerId,
            emailOrPhone: data.email, // For Login
            password: data.password,  // For Login
          }),
          password: data.password, // Common field for both Login and Sign Up
        }
      : data;
        console.log(endpoint);
        console.log(requestData);
        
      const response = await axios.post(endpoint, requestData);
      console.log(response.data);
      
      if (response.data.success) {
        console.log(currState);
        
        if(!isSeller){
        const { user } = response.data;
        localStorage.setItem("userId", user.userId);
        dispatch(setUser({ user }));
        toast.success(response.data.message);
        navigate("/");
        }else{
          if(currState=="Sign Up")
          navigate("/verify")
          else{
            const { seller } = response.data;
            localStorage.setItem("sellerId", seller.sellerId);
            dispatch(setSeller({ seller }));
            toast.success(response.data.message);
            navigate("/");
          }
        }
      } else {
        toast.error(response.data.error || "Failed to authenticate.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="bg-gray-100 flex justify-center items-center min-h-screen">
      <form
        onSubmit={submitHandler}
        className="bg-white p-8 rounded-md shadow-md w-96 space-y-6"
      >
        <h1 className="text-2xl font-bold">{currState} {isSeller && "as Seller"}</h1>

        {currState === "Sign Up" && (
          <>
            <div>
              <label className="block text-sm">Username</label>
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={onChangeHandler}
                className="w-full p-2 border rounded-md"
                placeholder="Your Name"
                required
              />
            </div>
            <div>
              <label className="block text-sm">Phone</label>
              <input
                type="tel"
                name="phone"
                value={data.phone}
                onChange={onChangeHandler}
                className="w-full p-2 border rounded-md"
                placeholder="Phone Number"
                required
              />
            </div>
            {isSeller && (
              <>
                <div>
                  <label className="block text-sm">Business Name</label>
                  <input
                    type="text"
                    name="businessName"
                    value={data.businessName}
                    onChange={onChangeHandler}
                    className="w-full p-2 border rounded-md"
                    placeholder="Business Name"
                  />
                </div>
                <div>
                  <label className="block text-sm">Business Address</label>
                  <input
                    type="text"
                    name="businessAddress"
                    value={data.businessAddress}
                    onChange={onChangeHandler}
                    className="w-full p-2 border rounded-md"
                    placeholder="Business Address"
                  />
                </div>
                <div>
                  <label className="block text-sm">Business Type</label>
                  <input
                    type="text"
                    name="businessType"
                    value={data.businessType}
                    onChange={onChangeHandler}
                    className="w-full p-2 border rounded-md"
                    placeholder="Business Type"
                  />
                </div>
              </>
            )}
          </>
        )}

        <div>
          <label className="block text-sm">Email</label>
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={onChangeHandler}
            className="w-full p-2 border rounded-md"
            placeholder="Email"
            required
          />
        </div>
        {isSeller && currState!="Sign Up" && <div>
          <label className="block text-sm">Seller ID</label>
          <input
            type="text"
            name="sellerId"
            value={data.sellerId}
            onChange={onChangeHandler}
            className="w-full p-2 border rounded-md"
            placeholder="Seller ID"
            required
          />
        </div>}
        <div>
          <label className="block text-sm">Password</label>
          <input
            type="password"
            name="password"
            value={data.password}
            onChange={onChangeHandler}
            className="w-full p-2 border rounded-md"
            placeholder="Password"
            required
          />
        </div>

        <button type="submit" className="w-full bg-gray-500 text-white py-2 rounded-md">
          {currState === "Sign Up" ? "Create Account" : "Login"}
        </button>

        <div className="text-center text-sm">
          {currState === "Login" ? (
            <p>
              Don't have an account?{" "}
              <button
                onClick={() => setCurrState("Sign Up")}
                className="text-blue-500 underline"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => setCurrState("Login")}
                className="text-blue-500 underline"
              >
                Login
              </button>
            </p>
          )}
        </div>

        <div className="text-center text-sm">
          <button
            onClick={() => setIsSeller(!isSeller)}
            className="text-green-500 underline"
          >
            {isSeller ? "Switch to User" : "Switch to Seller"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
