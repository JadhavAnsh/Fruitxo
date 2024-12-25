import React from 'react';

const ServiceCard = ({ icon, title, description }) => {
  return (
    <div className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-orange-500">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default ServiceCard;
