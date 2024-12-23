const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const cartmodel = require('../models/cartmodel');

router.post('/create-order', async (req, res) => {
    try {
      const { userId, orderItems, shippingAddress} = req.body;
  
      // Calculate total order price by summing the totalPrice of all order items
      let totalOrderPrice = 0;
      orderItems.forEach(item => {
        totalOrderPrice += item.totalPrice;
      });
  
      // Create new order
      const newOrder = new Order({
        userId,
        orderItems,
        totalOrderPrice,
        shippingAddress,
      });
  
      // Save the order to the database
      const savedOrder = await newOrder.save();
      await cartmodel.findOneAndUpdate({ userId }, { $set: { productsInCart: [] } });
      // Send a response back to the client
      res.status(201).json({
        success: true,
        message: 'Order created successfully!',
        order: savedOrder
      });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating order, please try again later',
        error: error.message
      });
    }
  });

  // Backend route to get orders (using Authorization header)
router.get('/get', async (req, res) => {
    const userId =req.query.userId; // Get userId from custom header
    console.log(userId);
    
    try {
        const orders = await Order.find({ userId: userId })
            // .populate('orderItems.product')
            .sort({ createdAt: -1 });

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No orders found.',
            });
        }

        const formattedOrders = orders.map(order => {
            const orderData = {
                _id: order._id,
                orderStatus: order.orderStatus,
                paymentInfo: order.paymentInfo,
                orderItems: order.orderItems.map(item => ({
                    productId: item.productId,
                    productName: item.productName,
                    productImg: item.productImg,
                    productPrice: item.productPrice,
                    productQty: item.productQty,
                    totalPrice: item.totalPrice,
                })),
                totalPrice: order.totalOrderPrice,
                totalQuantity: order.totalQuantity,
                createdAt: order.createdAt,
            };
            return orderData;
        });

        res.status(200).json({
            success: true,
            orders: formattedOrders,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.',
        });
    }
});


router.get('/get-orders', async (req, res) => {
  try {
    const orders = await Order.find();
    
    res.status(200).json({
      success: true,
      orders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

router.put('/update-status', async (req, res) => {
  try {
    const { orderId, status } = req.body;

    // Validate the status
    const validStatuses = ['Pending', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value. Accepted values are Pending, Delivered, or Cancelled.',
      });
    }

    // Find the order by ID and update the status
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully.',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Unable to update order status.',
      error: error.message,
    });
  }
});


module.exports=router;