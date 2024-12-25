const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/CartItem');
const User = require('../models/User');
const authenticateToken = require('../middleware/authenticateToken');

const orderController = {
    getOrders: async (req, res) => {
        try {
            const orders = await Order.find({ userId: req.user._id })
                .populate('items.productId')
                .populate('userId', 'fullName email phone address')
                .sort({ createdAt: -1 });
            
            res.json(orders);
        } catch (err) {
            console.error("Error fetching orders:", err);
            res.status(500).json({ message: "Error fetching orders" });
        }
    },

    createOrder: async (req, res) => {
        try {
            const cart = await Cart.findOne({ userId: req.user._id })
                .populate('items.id');
            
            if (!cart || !cart.items || cart.items.length === 0) {
                return res.status(400).json({ message: "Cart is empty" });
            }

            const orderItems = cart.items.map(item => {
                if (!item.id || !item.id.price) {
                    throw new Error(`Invalid fruit data for item: ${JSON.stringify(item)}`);
                }
                return {
                    productId: item.id._id, 
                    quantity: item.quantity,
                    price: item.id.price,    
                    name: item.id.name,    
                    unit: item.id.unit     
                };
            });

            const totalAmount = orderItems.reduce(
                (sum, item) => sum + (item.quantity * item.price),
                0
            );

            const order = new Order({
                userId: req.user._id,
                items: orderItems,
                totalAmount: totalAmount
            });

            await order.save();

            await Cart.findOneAndUpdate(
                { userId: req.user._id },
                { $set: { items: [] } }
            );

            const populatedOrder = await Order.findById(order._id)
                .populate('items.productId')
                .populate('userId', 'fullName email phone address');

            res.status(201).json({
                message: "Order created successfully",
                order: populatedOrder
            });

        } catch (err) {
            console.error("Error creating order:", err);
            res.status(500).json({ 
                message: "Failed to create order",
                error: err.message 
            });
        }
    },
};

router.use(authenticateToken);

router.get('/orders', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('items.productId')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch orders' 
    });
  }
});

router.post('/orders', orderController.createOrder);

module.exports = router;