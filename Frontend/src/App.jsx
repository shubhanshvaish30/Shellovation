import React, { useEffect } from "react"
import Navbar from "./components/Navbar/Navbar"
import { Navigate, Route,Routes } from "react-router-dom"
import Home from "./pages/Home/Home"
import Cart from "./pages/Cart/Cart"
import Place from "./pages/PlaceOrder/Place"
import { useState } from "react"
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Login from "./components/Login/Login"
import Product from "./pages/Product/Product"
import SearchResults from "./pages/SearchResults/SearchResults"
import Confirmation from "./components/Confirmation/Confirmation"
// import Payment from "./components/Payment/Payment"
import Shipping from "./components/Shipping/Shipping"
import { useDispatch, useSelector } from "react-redux"
import Success from "./components/Success/Success"
import axios from "axios"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { url } from "./utils/constant"
import { setCart } from "./Redux/cartSlice"
import Orders from "./components/Orders/Orders"
import Verify from "./components/Verify"
import Profile from "./components/Profile"
import AdminHome from "./pages/AdminHome"
import { setAdminCoupons, setAdminOrders, setAdminProducts, setAdminUsers } from "./Redux/adminSlice"
import AdminOrders from "./pages/AdminOrders"
import AdminUsers from "./pages/AdminUsers"
import AddProduct from "./pages/AddProduct"
import Coupons from "./pages/Coupons"
import ComplaintForm from "./pages/ComplaintForm"
import AdminComplaint from "./pages/AdminComplaint"

function App() {
  const [showLogin,setShowLogin]=useState(false)
  const dispatch=useDispatch()
  const {user}=useSelector(state=>state.auth)
  const userId=localStorage.getItem("userId");
  const sellerId=localStorage.getItem("sellerId");
  const [stripeApiKey,setStripeApiKey]=useState("")
  const fetchCart = async () => {
    try {
      const response = await axios.post(`${url}/cart/get-cart`, { userId });
      if (response.data.success) {
        const { cart } = response.data;
  
        // Calculate total quantity and grand total if not provided in the response
        const totalQuantity = cart.productsInCart.reduce((total, item) => total + item.productQty, 0);
        const grandTotal = cart.productsInCart.reduce((total, item) => total + item.totalPrice, 0);
  
        // Dispatch the updated cart state
        console.log(cart);
        
        dispatch(setCart({
          items: cart.productsInCart,
          grandTotal,
          totalQuantity,
        }));
      } else {
        console.log("Failed to fetch products:", response.data.message);
      }
    } catch (error) {
      console.log("Error fetching cart:", error.message);
    }
  };
  const fetchAdmin=async() => {  
    try {
      const [productsRes, ordersRes, couponsRes,userRes] = await Promise.all([
        axios.get(`${url}/get-product`),
        axios.get(`${url}/order/get-orders`),
        axios.get(`${url}/coupon/get-coupon`),
        axios.get(`${url}/auth/get-users`),
      ]);
  
      if (productsRes.data.success) {
        dispatch(setAdminProducts({ products: productsRes.data.products }));
      }
      if (ordersRes.data.success) {
        dispatch(setAdminOrders({ orders: ordersRes.data.orders }));
      }
      if (couponsRes.data.success) {
        dispatch(setAdminCoupons({ coupons: couponsRes.data.coupons }));
      }
      if (userRes.data.success) {
        dispatch(setAdminUsers({ users: userRes.data.users }));
      }
      console.log(productsRes.data);
      console.log(ordersRes.data);
      console.log(couponsRes.data);
      console.log(userRes.data);
      
    } catch (error) {
      console.error("Error fetching admin data:", error.message);
    }
  };
  
  // async function getStripeApiKey() {
  //   try {
  //     const { data } = await axios.get(`${url}/make/stripeKey`,{
  //       headers: {
  //           Authorization:`Bearer ${userId}`,
  //       },
  //   });
  //     setStripeApiKey(data.stripeApiKey);
  //   } catch (error) {
  //     console.error('Error fetching Stripe API key:', error);
  //   }
  // }
  useEffect(() => {
    if(sellerId){
      fetchAdmin()
      console.log("yaha");
      
    }
    if(userId){
      fetchCart();
      setShowLogin(false)
    }else{
      dispatch(setCart({
        items: [],
        grandTotal: 0,
        totalQuantity: 0,
    }));
    }
    // getStripeApiKey()
    }, [userId])   

  return (
    <>
      <div className="app">
      <ToastContainer/>
        <Navbar setShowLogin={setShowLogin}/>
        <Routes>
          <Route path="/" element={!sellerId?<Home/>:<AdminHome/>}/>
          <Route
            path="/login"
            element={!userId?<Login setShowLogin={setShowLogin}/>:<Navigate to="/"/>}
          />
          <Route
            path="/signup"
            element={<Login setShowLogin={setShowLogin} />}
          />
          <Route path="/verify" element={<Verify/>} />
          <Route path="/search" element={<SearchResults/>} />
          <Route path="/products/:id" element={<Product/>}/>
          <Route path="/cart" element={<Cart/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/place" element={userId?<Place/>:<Login/>}/>
          <Route path="/newAddress" element={userId?<Shipping />:<Login/>} />
          <Route path="/confirm" element={userId?<Confirmation />:<Login/>} />
          <Route path="/success" element={userId?<Success />:<Login/>} />
          <Route path="/orders" element={userId?<Orders />:<Login/>} />
          <Route path="/addComplaint" element={userId?<ComplaintForm />:<Login/>} />
          <Route path="/adminOrders" element={sellerId?<AdminOrders/>:<Login/>} />
          <Route path="/adminUsers" element={sellerId?<AdminUsers/>:<Login/>} />
          <Route path="/addProduct" element={sellerId?<AddProduct/>:<Login/>} />
          <Route path="/coupons" element={sellerId?<Coupons/>:<Login/>} />
          <Route path="/adminComplaint" element={sellerId?<AdminComplaint/>:<Login/>} />
          {/* <Route path="/payment" element={<PaymentPage />} /> */}
        </Routes>
      </div>
    </>
  )
}

export default App
