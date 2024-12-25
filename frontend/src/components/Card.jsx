import React, { useState } from 'react';

const Card = ({ fruit, onAddToCart }) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleClick = async () => {
    setIsAdding(true);
    try {
      await onAddToCart();
    } finally {
      setIsAdding(false);
    }
  };

  const formatPrice = (price) => {
    const numPrice = Number(price);
    return !isNaN(numPrice) ? numPrice.toFixed(2) : '0.00';
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative pb-2/3">
      <img
          src={fruit.image}
          alt={fruit.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/images/fallback-fruit.png';
            e.target.onerror = null;
          }}
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-bold text-gray-900">{fruit.name}</h2>
          <span className="text-lg font-semibold text-green-600">
  ${formatPrice(fruit.price)} <span className="text-sm font-normal">per kg</span>
</span>
        </div>
        <p className="text-gray-600 mb-4">{fruit.description}</p>
        <button
          onClick={handleClick}
          disabled={isAdding}
          className={`w-full py-2 px-4 rounded-full font-medium transition-colors ${
            isAdding
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isAdding ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </span>
          ) : (
            'Add to Cart'
          )}
        </button>
      </div>
    </div>
  );
};

export default Card;