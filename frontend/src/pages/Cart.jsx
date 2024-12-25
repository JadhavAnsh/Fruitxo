import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Trash, Minus, Plus, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [itemQuantities, setItemQuantities] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('http://localhost:5000/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch cart items');
      
      const data = await response.json();
      const items = data.items?.map(item => ({
        id: item.id._id,
        name: item.id.name,
        price: item.id.price,
        image: item.id.image || '/api/placeholder/80/80',
        quantity: item.quantity
      })) || [];

      const initialQuantities = {};
      items.forEach(item => {
        initialQuantities[item.id] = item.quantity;
      });

      setCartItems(items);
      setItemQuantities(initialQuantities);
    } catch (err) {
      setError('Failed to load cart items');
      console.error('Error fetching cart:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (id) => {
    try {
      setItemQuantities(prev => ({
        ...prev,
        [id]: (prev[id] || 0) + 1
      }));

      const token = localStorage.getItem('userToken');
      const response = await fetch('http://localhost:5000/cart/increment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      });

      if (!response.ok) {
        throw new Error('Failed to add item');
      }

      const updatedCart = await response.json();
      updateCartState(updatedCart);
    } catch (error) {
      console.error('Error adding item:', error);
      fetchCartItems();
    }
  };

  const subtractItem = async (id) => {
    if (itemQuantities[id] <= 1) return;

    try {
      setItemQuantities(prev => ({
        ...prev,
        [id]: prev[id] - 1
      }));

      const token = localStorage.getItem('userToken');
      const response = await fetch('http://localhost:5000/cart/decrement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      });

      if (!response.ok) {
        throw new Error('Failed to subtract item');
      }

      const updatedCart = await response.json();
      updateCartState(updatedCart);
    } catch (error) {
      console.error('Error subtracting item:', error);
      fetchCartItems();
    }
  };

  const updateCartState = (updatedCart) => {
    const items = updatedCart.items.map(item => ({
      id: item.id._id,
      name: item.id.name,
      price: item.id.price,
      image: item.id.image || '/api/placeholder/80/80',
      quantity: item.quantity
    }));

    const newQuantities = {};
    items.forEach(item => {
      newQuantities[item.id] = item.quantity;
    });

    setCartItems(items);
    setItemQuantities(newQuantities);
  };

  const handleRemoveItem = async (id) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`http://localhost:5000/cart/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to remove item');
      
      const updatedCart = await response.json();
      setCartItems(updatedCart.items.map(item => ({
        id: item.id._id,
        name: item.id.name,
        price: item.id.price,
        image: item.id.image || '/api/placeholder/80/80',
        quantity: item.quantity
      })));
    } catch (err) {
      console.error('Error removing item:', err);
      alert('Failed to remove item. Please try again.');
    }
  };

  const calculateSubtotal = () =>
    cartItems.reduce((total, item) => total + item.quantity * item.price, 0);

  const calculateTax = () => calculateSubtotal() * 0.1;
  const calculateTotal = () => calculateSubtotal() + calculateTax();

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('http://localhost:5000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            id: item.id,
            quantity: item.quantity
          })),
          total: calculateTotal(),
          tax: calculateTax(),
          subtotal: calculateSubtotal()
        })
      });

      if (!response.ok) throw new Error('Failed to process order');

      await response.json();
      toast.success(`Order Confirmed! 🎉`);
      setCartItems([]);
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Checkout error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Loading cart...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Error</h1>
          <p className="text-red-600 mb-8">{error}</p>
          <button
            onClick={fetchCartItems}
            className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!cartItems?.length) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <NavLink
            to="/fruits"
            className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-colors"
          >
            <ArrowLeft className="mr-2" />
            Continue Shopping
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      <div className="bg-white rounded-lg shadow">
        <ul className="divide-y divide-gray-200">
          {cartItems.map((item) => (
            <li key={item.id} className="flex items-center p-6">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="ml-6 flex-1">
                <h2 className="text-lg font-bold text-gray-900">{item.name}</h2>
                <p className="text-sm text-gray-500">Price: ${item.price.toFixed(2)}</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => subtractItem(item.id)}
                    className="p-1 rounded-full hover:bg-gray-100"
                    disabled={itemQuantities[item.id] <= 1}
                  >
                    <Minus className="text-gray-500" />
                  </button>
                  <span className="w-8 text-center font-medium">
                    {itemQuantities[item.id] || 0}
                  </span>
                  <button
                    onClick={() => addItem(item.id)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <Plus className="text-gray-500" />
                  </button>
                </div>
                
                <span className="text-lg font-semibold text-gray-800 w-24 text-right">
                  ${(item.quantity * item.price).toFixed(2)}
                </span>
                
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-2 text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="p-6 border-t border-gray-200">
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (10%)</span>
              <span>${calculateTax().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full py-3 px-6 text-white font-semibold bg-green-500 rounded-full hover:bg-green-600 transition-colors disabled:bg-green-300 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
            </button>
            
            <NavLink
              to="/fruits"
              className="block w-full py-3 px-6 text-center text-gray-600 font-semibold bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              Continue Shopping
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;