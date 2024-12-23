const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Cart = require('../models/cartmodel');
const Order = require('../models/complaintmodel'); // Replace with correct path
const User = require('../models/user'); // Replace with correct path
const Product = require('../models/product'); // Replace with correct path
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: `pecommerce8@gmail.com`,
    pass: `rqrdabxuzpaecigz`
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Add to Cart Route
router.post('/addtocart', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    console.log(productId,quantity);
    let cart = await Cart.findOne({ userId });
    if (cart) {
      const productIndex = cart.productsInCart.findIndex(
        (item) => item.productId === productId
      );
      if (productIndex > -1) {
        cart.productsInCart[productIndex].productQty += quantity;
      } else {
        cart.productsInCart.push({ productId, productQty: quantity });
      }
      await cart.save();
    } else {
      cart = new Cart({
        userId,
        productsInCart: [{ productId, productQty: quantity }],
      });
      await cart.save();
    }
    console.log(cart.productsInCart);
    
    res.status(200).json({ success: true, message: 'Product added to cart successfully', cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding product to cart', error: error.message });
  }
});

// Get Cart by User ID Route
router.post('/get-cart', async (req, res) => {
  try {
    const { userId } = req.body;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found for this user' });
    }

    // Fetch product details for each product in the cart
    const productsWithDetails = await Promise.all(
      cart.productsInCart.map(async (item) => {
        const product = await Product.findOne({ productId: item.productId });
        if (product) {
          // Extract the actual price from the formatted price string
          const priceMatch = product.price.match(/₹(\d+)/); // Matches the number after '₹'
          const actualPrice = priceMatch ? parseInt(priceMatch[1]) : 0; // Default to 0 if not found

          return {
            productId: item.productId,
            productName: product.name, // Assuming the product has a name field
            productPrice: actualPrice,
            productQty: item.productQty,
            totalPrice: actualPrice * item.productQty,
            productImg: product.img, // Assuming the image URL is stored in the "img" field
          };
        }
        return {
          productId: item.productId,
          productName: 'Unknown Product',
          productPrice: 0,
          productQty: item.productQty,
          totalPrice: 0,
          productImg: '', // Default to an empty string if the product is not found
        };
      })
    );

    // Construct response with updated product details
    const updatedCart = {
      userId: cart.userId,
      productsInCart: productsWithDetails,
      grandTotal: productsWithDetails.reduce((total, item) => total + item.totalPrice, 0),
    };

    res.status(200).json({ success: true, cart: updatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching cart', error: error.message });
  }
});

router.put('/update-quantity', async (req, res) => {
  const { userId, productId, productQty } = req.body;

  if (!userId || !productId || typeof productQty !== 'number') {
    return res.status(400).json({ message: 'userId, productId, and a valid productQty are required.' });
  }

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    const product = cart.productsInCart.find(item => item.productId === productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found in the cart.' });
    }

    product.productQty = productQty;
    await cart.save();

    res.status(200).json({ message: 'Quantity updated successfully.' });
  } catch (error) {
    console.error('Error updating quantity:', error);
    res.status(500).json({ message: 'An error occurred while updating the quantity.' });
  }
});
// Delete Item from Cart Route
router.post('/delete-items', async (req, res) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return res.status(400).json({ message: 'userId and productId are required.' });
  }

  try {
    const result = await Cart.updateOne(
      { userId },
      { $pull: { productsInCart: { productId } } }
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'Item deleted successfully.' });
    } else {
      res.status(404).json({ message: 'Item not found in the cart.' });
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'An error occurred while deleting the item.' });
  }
});

// Route to update quantity

// Place Order Route
router.post('/place-order', async (req, res) => {
  try {
    const { userId, date, time, address, price, productsOrdered } = req.body;

    const orderId = Math.floor(100000 + Math.random() * 900000).toString();
    const trackingId = Math.random().toString(36).substring(2, 14).toUpperCase();

    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const productIds = productsOrdered.map(item => item.productId);

    const productDetails = await Product.find({ productId: { $in: productIds } });

    const order = new Order({
      userId,
      orderId,
      date,
      time,
      address,
      email: user.email,
      name: user.name,
      productIds,
      trackingId,
      price
    });

    await order.save();

    const emailHtml = `<div>Order Confirmation for ${user.name}...</div>`; // Simplified for brevity
    await transporter.sendMail({ from: `pecommerce8@gmail.com`, to: user.email, subject: 'Order Confirmation', html: emailHtml });

    res.status(200).json({ success: true, message: 'Order placed successfully', orderId, trackingId });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error placing order', error: error.message });
  }
});

module.exports = router;
