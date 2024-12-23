export const calculateGrandTotal = (cartItems) => {
    return cartItems.reduce((total, item) => 
      total + item.product.price * item.quantity, 0
    );
  };
  
  export const handleCartSuccess = (response, dispatch, setCart, quantityRef) => {
    if (response.data.success) {
      const productsInCart = response.data.cart.productsInCart;
      dispatch(setCart({
        items: productsInCart,
        totalQuantity: productsInCart.length,
        grandTotal: calculateGrandTotal(productsInCart),
      }));
      if (quantityRef.current) {
        quantityRef.current.value = "1";
      }
      return true;
    }
    return false;
  };