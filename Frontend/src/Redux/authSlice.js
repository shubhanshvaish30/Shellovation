import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        seller:null,
    },
    reducers:{
        // actions
        setUser:(state, action) => {
            state.user = action.payload.user;
        },
        clearAuth: (state) => {
            state.user = null;
        },
        setSeller:(state, action) => {
            state.seller = action.payload.seller;
        },
        clearAuthSeller: (state) => {
            state.seller = null;
        }
    }
});
export const { setUser, clearAuth,setSeller,clearAuthSeller} = authSlice.actions;
export default authSlice.reducer;