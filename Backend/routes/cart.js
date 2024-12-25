const express = require('express');
const router = express.Router();
const Cart = require('../models/CartItem');
const authenticateToken = require('../middleware/authenticateToken');

const cartController = {
    getCartItems: async (req, res) => {
        try {
            const cart = await Cart.findOne({ userId: req.user._id })
                .populate('items.id');
            
            if (!cart) {
                return res.status(200).json({ items: [] });
            }
            res.json(cart);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    addToCart: async (req, res) => {
        try {
            const { id, quantity } = req.body;

            if (!id || !quantity || quantity < 1) {
                return res.status(400).json({ message: 'Invalid input data' });
            }

            let cart = await Cart.findOne({ userId: req.user._id });

            if (!cart) {
                cart = new Cart({
                    userId: req.user._id,
                    items: [{ id, quantity }]
                });
            } else {
                
                const itemIndex = cart.items.findIndex(
                    item => item.id && item.id.toString() === id.toString()
                );

                if (itemIndex > -1) {
                    
                    cart.items[itemIndex].quantity += quantity;
                } else {
                   
                    cart.items.push({ id, quantity });
                }
            }

            await cart.save();
            const populatedCart = await Cart.findById(cart._id)
                .populate('items.id');

            res.json(populatedCart);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

  
    removeFromCart: async (req, res) => {
        try {
            const id = req.params.id;
            
            if (!id) {
                return res.status(400).json({ message: 'Item ID is required' });
            }

            const cart = await Cart.findOne({ userId: req.user._id });

            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }

            cart.items = cart.items.filter(item => 
                item.id && item.id.toString() !== id.toString()
            );

            await cart.save();
            const populatedCart = await Cart.findById(cart._id)
                .populate('items.id');

            res.json(populatedCart);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    incrementQuantity: async (req, res) => {
        try {
            const { id } = req.body;
            let cart = await Cart.findOne({ userId: req.user._id });

            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }

            const itemIndex = cart.items.findIndex(
                item => item.id && item.id.toString() === id.toString()
            );

            if (itemIndex === -1) {
                return res.status(404).json({ message: 'Item not found in cart' });
            }

            cart.items[itemIndex].quantity += 1;
            await cart.save();

            const populatedCart = await Cart.findById(cart._id).populate('items.id');
            res.json(populatedCart);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    decrementQuantity: async (req, res) => {
        try {
            const { id } = req.body;
            let cart = await Cart.findOne({ userId: req.user._id });

            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }

            const itemIndex = cart.items.findIndex(
                item => item.id && item.id.toString() === id.toString()
            );

            if (itemIndex === -1) {
                return res.status(404).json({ message: 'Item not found in cart' });
            }

            if (cart.items[itemIndex].quantity <= 1) {
                return res.status(400).json({ message: 'Quantity cannot be less than 1' });
            }

            cart.items[itemIndex].quantity -= 1;
            await cart.save();

            const populatedCart = await Cart.findById(cart._id).populate('items.id');
            res.json(populatedCart);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};

router.use(authenticateToken);

router.get('/cart', cartController.getCartItems);
router.post('/cart', cartController.addToCart);
router.delete('/cart/:id', cartController.removeFromCart);
router.post('/cart/increment', cartController.incrementQuantity);
router.post('/cart/decrement', cartController.decrementQuantity);

module.exports = router;