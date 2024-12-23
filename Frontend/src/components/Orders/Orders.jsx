import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { url } from '../../utils/constant';
import './Orders.css';
import { assets } from "../../assets/assets";

function Orders() {
    const [orders, setOrders] = useState([]);
    const userId=localStorage.getItem("userId")
    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${url}/order/get?userId=${userId}`);
            if (response.data.success) {
                // Sort orders based on creation date (assuming 'createdAt' field exists)
                const sortedOrders = response.data.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrders(sortedOrders);
            } else {
                console.log("Failed to fetch orders:", response.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchOrders();
        }
    }, [userId]);

    return (
        <div className="orders-container-box">
            <div className="orders-container">
                <h1>Your Orders</h1>
                {orders.length > 0 ? (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div className="order-item" key={order._id}>
                                <div className="order-header">
                                    <h2>Order ID: {order._id}</h2>
                                    <p>Status: {order.orderStatus}</p>
                                    <p className="payment-status">Payment Status: {order.paymentInfo?.status}</p>
                                </div>
                                <div className="order-items">
                                    {order.orderItems.map((item) => (
                                        <div className="order-item-details" key={item.productId}>
                                            <img src={item.productImg} alt={item.productName} className="order-item-image" />
                                            <div className="order-item-info">
                                                <h3>{item.productName}</h3>
                                                <p>Quantity: {item.productQty}</p>
                                                <p>Price: ₹{item.productPrice}</p>
                                                <p>Total: ₹{item.totalPrice}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="order-summary">
                                    <p>Total Order Price: ₹{order.totalPrice}</p>
                                    <p>Total Quantity: {order.totalQuantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-cart">
                        <img src={assets.logo} alt="Empty Cart" />
                        <p>You haven't ordered yet!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Orders;
