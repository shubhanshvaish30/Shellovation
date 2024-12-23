import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        grandTotal: 0,
        totalQuantity: 0,
    },
    reducers: {
        setCart: (state, action) => {
            const { items, grandTotal, totalQuantity } = action.payload;
            state.items = items;
            state.grandTotal = grandTotal;
            state.totalQuantity = totalQuantity;
        },
        clearCart:(state)=>{
            state.items = [];
            state.grandTotal = 0;
            state.totalQuantity = 0;
        }
    },
});

export const {setCart,clearCart } = cartSlice.actions;

export default cartSlice.reducer;
