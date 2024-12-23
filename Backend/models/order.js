const mongoose = require('mongoose');

// Order Schema
const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // User who placed the order
  orderItems: [
    {
      productId: { type: String, required: true }, // Product ID
      productName: { type: String, required: true }, // Product Name
      productPrice: { type: Number, required: true }, // Price per item
      productQty: { type: Number, required: true }, // Quantity ordered
      totalPrice: { type: Number, required: true }, // Total price for this item (productPrice * productQty)
      productImg: { type: String, required: true } // Image URL for the product
    }
  ],
  totalOrderPrice: { type: Number, required: true }, // Total price for all items in the order
  orderStatus: { type: String, default: 'Pending' }, // Order status (Pending, Shipped, Delivered, etc.)
  shippingAddress: { type: String, required: true }, // Shipping address
  orderDate: { type: Date, default: Date.now }, // Date when the order was placed
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
