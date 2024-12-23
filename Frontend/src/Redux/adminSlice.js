import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    products: [],
    orders: [],
    coupons: [],
    users: [],
  },
  reducers: {
    // Actions to set data
    setAdminProducts: (state, action) => {
      state.products = action.payload.products;
    },
    setAdminOrders: (state, action) => {
      state.orders = action.payload.orders;
    },
    setAdminCoupons: (state, action) => {
      state.coupons = action.payload.coupons;
    },
    setAdminUsers: (state, action) => {
      state.users = action.payload.users;
    },
    clearAdminData: (state) => {
      state.products = [];
      state.orders = [];
      state.coupons = [];
      state.users = [];
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const orderIndex = state.orders.findIndex((order) => order._id === orderId);
      if (orderIndex !== -1) {
        state.orders[orderIndex].orderStatus = status; // Update the status
      }
    },
    // New Actions for Coupon Management
    addCoupon: (state, action) => {
      state.coupons.push(action.payload); // Add a coupon to the state
    },
    deleteCoupon: (state, action) => {
      state.coupons = state.coupons.filter((coupon) => coupon.code !== action.payload); // Delete coupon by code
    }
  },
});

export const { 
  setAdminProducts, 
  setAdminOrders, 
  setAdminCoupons, 
  setAdminUsers, 
  clearAdminData, 
  updateOrderStatus, 
  addCoupon, 
  deleteCoupon 
} = adminSlice.actions;

export default adminSlice.reducer;
