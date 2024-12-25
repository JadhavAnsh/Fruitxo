import React from 'react';
import { NavLink } from 'react-router-dom';
import mainPage from "../templates/mainPage.png";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 lg:pr-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Welcome to<br />
              Our Fruits Shop
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Discover the finest selection of fresh fruits, carefully handpicked for you. Experience unmatched quality and taste in every bite.
            </p>
            <div className="flex flex-wrap gap-4">
              <NavLink
                to="/fruits"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-full text-white bg-red-500 hover:bg-red-600 shadow-lg transition-transform transform hover:scale-105"
              >
                SHOP NOW
              </NavLink>
              <NavLink
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-full text-white bg-gray-800 hover:bg-gray-900 shadow-lg transition-transform transform hover:scale-105"
              >
                CONTACT US
              </NavLink>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <img
              src={mainPage}
              alt="Fresh Fruits Plate"
              className="w-full rounded-2xl shadow-2xl"
            />
            <div className="absolute -z-10 top-6 right-6 w-full h-full bg-red-100 rounded-2xl shadow-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
