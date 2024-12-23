import React, { useRef } from "react";
import { useSelector,useDispatch } from "react-redux";
import {CardNumberElement,CardCvcElement,CardExpiryElement,useStripe,useElements} from '@stripe/react-stripe-js'
import OrderBar from "../OrderBar/OrderBar";
import { FaCreditCard, FaCalendarAlt, FaKey } from "react-icons/fa";
import './Payment.css'
import axios from 'axios'
import { setCheckOut, setPaymentInfo } from "../../Redux/shippingSlice";
import {toast} from 'react-toastify'
import { url } from "../../utils/constant";
import { useNavigate } from "react-router-dom";
import { setCart } from "../../Redux/cartSlice";

function Payment(){
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const stripe=useStripe()
    const elements=useElements()
    const payBtn=useRef(null)
    const {user,token}=useSelector(store=>store.auth)
    const {totalPrice,shippingInfo,orderItems}=useSelector(store=>store.shipping)
    const { isCheckOut } = useSelector(store => store.shipping);
    
    const paymentData = { totalPrice: Math.round(totalPrice.totalPrice) };
    const handleSubmit = async (e) => {
        e.preventDefault();
        payBtn.current.disabled = true;
    
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.post(`${url}/make/payment`, paymentData, config);
    
            if (!data || !data.client_secret) {
                toast.error('Failed to retrieve payment intent secret.');
                payBtn.current.disabled = false;
                return;
            }
    
            const result = await stripe.confirmCardPayment(data.client_secret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email,
                    },
                },
            });
    
            if (result.error) {
                toast.error(result.error.message);
                payBtn.current.disabled = false;
                return;
            }
    
            if (result.paymentIntent.status === "succeeded") {
                const orderData = {
                    shippingAddress: shippingInfo.addressId,
                    orderItems: orderItems.orderItems.map(item => ({
                        product: item.product._id,
                        quantity: item.quantity
                    })),
                    paymentInfo: {
                        id: result.paymentIntent.id,
                        status: result.paymentIntent.status,
                    },
                    totalPrice: totalPrice.totalPrice,
                };
    
                const orderResponse = await axios.post(`${url}/order/create`, orderData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                if (orderResponse.data.success) {
                    dispatch(setPaymentInfo({ id: result.paymentIntent.id, status: result.paymentIntent.status }));
    
                    if (isCheckOut) {
                        dispatch(setCart({
                            items: [],
                            grandTotal: 0,
                            totalQuantity: 0,
                        }));
                        dispatch(setCheckOut(false));
                    }
    
                    toast.success("Payment and Order Successful!");

                    console.log(orderResponse);
                    
                    // Send email
                    const emailResponse = await axios.post(`${url}/auth/mail`, {
                        email: user.email,
                        userName: user.name,
                        type: 'order',
                        details: {
                            orderId: orderResponse.data.order.id,
                            totalPrice: orderResponse.data.order.totalPrice,
                            orderItems: await Promise.all(orderResponse.data.order.orderItems.map(async item => {
                                const productResponse = await axios.get(`${url}/products/${item.product}`);
                                console.log('Fetched product data:', productResponse.data); // Log product data
                                const product = productResponse.data;
                                return {
                                    productName: product.name,
                                    description: product.desc,
                                    price: product.price,
                                    quantity: item.quantity
                                };
                            })),
                        }
                    });
                    console.log(emailResponse);
                    
    
                    if (emailResponse.data.success) {
                        console.log("Order confirmation email sent.");
                    } else {
                        toast.error("Failed to send order confirmation email.");
                    }
    
                    navigate('/success');
                } else {
                    toast.error("Order creation failed.");
                }
            } else {
                toast.error("Payment failed or requires further action.");
            }
        } catch (error) {
            console.error("Error during payment processing:", error);
            toast.error("An error occurred during payment processing.");
        } finally {
            payBtn.current.disabled = false;
        }
    };
    
    return(
        <div>
            <OrderBar currentStep={3} />
            <div className="payment-container">
                <form className="paymentForm" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="cardNumber">
                    <FaCreditCard className="icon" /> Card Number
                    </label>
                    <CardNumberElement id="cardNumber" className="payment-input" />
                </div>

                <div className="form-group">
                    <label htmlFor="cardExpiry">
                    <FaCalendarAlt className="icon" /> Expiry Date
                    </label>
                    <CardExpiryElement id="cardExpiry" className="payment-input" />
                </div>

                <div className="form-group">
                    <label htmlFor="cardCvc">
                    <FaKey className="icon" /> CVC
                    </label>
                    <CardCvcElement id="cardCvc" className="payment-input" />
                </div>

                <button type="submit" className="payment-button" ref={payBtn}>
                    Pay ₹{totalPrice.totalPrice}
                </button>
                </form>
            </div>
        </div>
    )
}

export default Payment;