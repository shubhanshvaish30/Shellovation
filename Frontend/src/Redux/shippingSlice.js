import {createSlice} from '@reduxjs/toolkit';

const initialState={
    shippingInfo:{
        addressId:"",
        address:'',
    },
    orderItems:[],
    totalPrice:0,
    isCheckOut:false,
};

const shippingSlice=createSlice({
    name:'shipping',
    initialState,
    reducers:{
        setShippingInfo:(state,action)=>{
            state.shippingInfo=action.payload;
        },
        setOrderItems:(state,action)=>{
            state.orderItems=action.payload;
        },
        setTotalPrice:(state,action)=>{
            state.totalPrice=action.payload;
        },
        setCheckOut:(state,action)=>{
            state.isCheckOut=action.payload;
        }
    },
});

export const {setShippingInfo,setOrderItems,setTotalPrice,setCheckOut}=shippingSlice.actions;
export default shippingSlice.reducer;
