    import React from 'react';
    import { useDispatch, useSelector } from 'react-redux';
    import { useNavigate } from 'react-router-dom';
    import './Confirmation.css';
    import { assets } from '../../assets/assets';
    import { clearCart, setCart } from '../../Redux/cartSlice';
    import { url } from '../../utils/constant';
    import OrderBar from '../OrderBar/OrderBar';
    import { loadStripe } from '@stripe/stripe-js';
    import { STRIPE_PUBLIC_KEY } from '../../utils/constant';
    import { toast } from "react-toastify";
    import axios from 'axios';
    import {setOrderItems} from '../../Redux/shippingSlice';

    function Confirmation() {
        const { shippingInfo, orderItems, totalPrice } = useSelector(state => state.shipping);
        const {user}=useSelector(store=>store.auth)
        const userId=localStorage.getItem("userId")
        const navigate = useNavigate();
        const dispatch=useDispatch()
        const {totalQuantity}=useSelector(store=>store.cart)
        const orderData=orderItems.orderItems;
        const handleProceed = async () => {
            try {
                // Prepare the order data to be sent to the backend
                const orderDetails = {
                    userId: userId, // Assuming user has an id in your state
                    orderItems: orderData,
                    shippingAddress: shippingInfo.address,
                };
    
                // Send the order details to the backend API to create the order
                const response = await axios.post(`${url}/order/create-order`, orderDetails);
    
                if (response.data.success) {
                    // Dispatch the orderItems to Redux if necessary (optional)
                    dispatch(setOrderItems({ orderItems: orderData }));
                    dispatch(clearCart());
                    // Show success toast
                    toast.success('Order placed successfully!');
    
                    // Redirect to success page
                    navigate('/success');
                } else {
                    toast.error('Failed to place the order. Please try again.');
                }
            } catch (error) {
                console.error('Error placing order:', error);
                toast.error('An error occurred. Please try again.');
            }
        };
        console.log(orderItems);
        
    
        return (
            <div>
                <OrderBar currentStep={2}/>
                <div className="confirmation-container">
                    <h2>Order Confirmation</h2>
                    <div className="confirmation-section">
                        <h3>Shipping Information:</h3>
                        <p>Name: {user.name}</p>
                        <p>Address: {shippingInfo.address}</p>
                    </div>
                    <div className="confirmation-section">
                        <h3>Order Items:</h3>
                        {orderData.length > 0 ? (
                        <>
                            <div className="cart-items">
                                {orderData.map((item) => (
                                    <div className="cart-item" key={item.productId}>
                                        <img src={`${item.productImg}`} alt={item.productName} />
                                        <div className="item-details">
                                            <h2>{item.productName}</h2>
                                            <p>Price: ₹{item.productPrice}</p>
                                            <div className="quantity-controls">
                                                <p>Quantity: {item.productQty}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="cart-summary">
                                <div className="summary-details">
                                    <span>Total Quantity:</span>
                                    <span>{totalQuantity}</span>
                                </div>
                                <div className="summary-details">
                                    <span>Total Price:</span>
                                    <span>₹{totalPrice.totalPrice}</span>
                                </div>
                            </div>
                        </>
                        ): (
                        <div className="empty-cart">
                            <img src={assets.logo} alt="Empty Cart" />
                            <p>Your cart is empty.</p>
                        </div>
                        )}
                    <div className="confirmation-button">
                        <button className="proceed-btn" onClick={handleProceed}>Place Order</button>
                    </div>
                </div>
            </div>
        </div>
    )
    }

    export default Confirmation;
