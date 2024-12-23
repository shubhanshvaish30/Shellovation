import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Success.css';
import confetti from 'canvas-confetti';
import { url } from '../../utils/constant';

function Success() {
  const { paymentInfo, orderItems } = useSelector((store) => store.shipping);
  const navigate = useNavigate();
  console.log(orderItems)
  // Trigger confetti on component mount
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  const handleViewOrders = () => {
    navigate('/orders');
  };

  return (
    <div className="success-container">
      <h1 className="congratulations-message">Congratulations!</h1>
      <h3 className='message'>Your Order Placed!</h3>

      <div className="order-summary-container">
        {/* <p>Transaction ID: {paymentInfo.id}</p>
        <p>Transaction Status: {paymentInfo.status.toUpperCase()}</p> */}

        {/* Order Items Section */}
        <div className="order-items-section">
          <h3>Your Order Items</h3>
          {orderItems.orderItems.length > 0 ? (
            <div className="order-items">
              {orderItems.orderItems.map((item) => (
                <div className="order-item" key={item.productId}>
                  <img
                    src={`${item.productImg}`}
                    alt={item.productName}
                  />
                  <div className="item-details">
                    <h4>{item.productName}</h4>
                    <p>Price: ₹{item.productPrice}</p>
                    <p>Quantity: {item.productQty}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No items in the order.</p>
          )}
        </div>
      </div>

      <button className="view-orders-button" onClick={handleViewOrders}>
        View Orders
      </button>
    </div>
  );
}

export default Success;
