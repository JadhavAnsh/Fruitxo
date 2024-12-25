import React, { useEffect, useState } from 'react';
import ServiceCard from '../components/ServiceCard';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {

    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:5000/services');
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        setServices(data); 
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false); 
      }
    };

    fetchServices();
  }, []); 

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>; 
  }

  return (
    <section className="py-12 mb-12 bg-gradient-to-b from-red-50 to-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Our Services</h2>
        <p className="text-gray-600 mb-8">
        We offer a curated selection of premium fruits delivered straight to your doorstep.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
        {/* <button className="mt-8 px-6 py-3 bg-black text-white rounded-lg shadow hover:bg-gray-800">
          Read More
        </button> */}
      </div>
    </section>
  );
};

export default Services;
