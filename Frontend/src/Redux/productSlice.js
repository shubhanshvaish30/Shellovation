import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
    products: [],
    productData:null,
    category:"All",
    subCategory:"All",
    cart: [],
};

export const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        setList:(state,action)=>{
            state.products=action.payload
        },
        setProductData:(state,action)=>{
            state.productData=action.payload
        },
        setCategory:(state,action)=>{
            state.category=action.payload;
        },
        setSubCategory:(state,action)=>{
            state.subCategory=action.payload;
        },
        resetFilters: (state) => {
            state.category = "All";
            state.subCategory = "All";
        }
    },
});

export const {setList,setProductData,setCategory,setSubCategory,resetFilters} = productSlice.actions;
export default productSlice.reducer;
