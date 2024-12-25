import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Card from '../components/Card';

const FruitPage = () => {
  const [fruits, setFruits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  useEffect(() => {
    fetchFruits();
  }, []);

  const fetchFruits = async () => {
    try {
      const response = await axios.get('http://localhost:5000/fruits');
      setFruits(response.data);
      setError(null);
    } catch (err) {
      setError('Error fetching fruits data');
      toast.error('Failed to load fruits');
      console.error('Error fetching fruits:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (fruit) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        toast.error('Please login to add items to cart');
        return;
      }


      const response = await axios.post('http://localhost:5000/cart', {
        id: fruit._id,    
        quantity: 1     
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        toast.success(`Added ${fruit.name} to cart!`);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Please login to add items to cart');
      } else {
        toast.error('Failed to add to cart');
        console.error('Error adding to cart:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchFruits}
            className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-50 via-white to-green-50 shadow-md rounded-lg">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Fresh Fruits
          </h1>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto">
            Discover our handpicked selection of fresh, premium quality fruits.
            Direct from local farms to your table.
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fruits.map((fruit) => (
            <Card 
              key={fruit._id} 
              fruit={fruit} 
              onAddToCart={() => handleAddToCart(fruit)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FruitPage;