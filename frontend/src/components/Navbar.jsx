import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import logo from "../templates/logo.png";
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState(0);
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const AuthButtons = () => {
    if (isLoggedIn) {
      return (
        <>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-full ${
                isActive
                  ? 'bg-red-500 text-white'
                  : 'border border-red-500 text-red-500 hover:bg-red-50'
              }`
            }
          >
            <FaUserCircle className="text-lg" />
            <span>Profile</span>
          </NavLink>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium rounded-full border border-red-500 text-red-500 hover:bg-red-50"
          >
            Logout
          </button>
        </>
      );
    }

    return (
      <>
        <NavLink
          to="/login"
          className={({ isActive }) =>
            `px-4 py-2 text-sm font-medium rounded-full ${
              isActive
                ? 'bg-red-500 text-white'
                : 'border border-red-500 text-red-500 hover:bg-red-50'
            }`
          }
        >
          LOGIN
        </NavLink>
        <NavLink
          to="/signup"
          className={({ isActive }) =>
            `px-4 py-2 text-sm font-medium rounded-full ${
              isActive
                ? 'bg-red-500 text-white'
                : 'border border-red-500 text-red-500 hover:bg-red-50'
            }`
          }
        >
          SIGN IN
        </NavLink>
      </>
    );
  };

  return (
    <nav className="bg-white shadow-sm py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <NavLink to="/" className="flex items-center">
            <img src={logo} alt="Logo" className="h-10 w-auto mr-2" />
            <span className="text-2xl font-bold text-gray-800">FRUITXO</span>
          </NavLink>

          {/* Mobile menu button and cart for mobile */}
          <div className="flex items-center space-x-4 md:hidden">
            <NavLink to="/cart" className="relative">
              <FaShoppingCart className="text-2xl text-gray-700 hover:text-gray-900" />
              {cartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems}
                </span>
              )}
            </NavLink>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium ${
                  isActive ? 'text-orange-500' : 'text-gray-800 hover:text-gray-600'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/fruits"
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium ${
                  isActive ? 'text-orange-500' : 'text-gray-800 hover:text-gray-600'
                }`
              }
            >
              Fruits
            </NavLink>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium ${
                  isActive ? 'text-orange-500' : 'text-gray-800 hover:text-gray-600'
                }`
              }
            >
              Services
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium ${
                  isActive ? 'text-orange-500' : 'text-gray-800 hover:text-gray-600'
                }`
              }
            >
              Contact Us
            </NavLink>

            <NavLink to="/cart" className="relative">
              <FaShoppingCart className="text-2xl text-gray-700 hover:text-gray-900" />
              {cartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems}
                </span>
              )}
            </NavLink>

            <div className="flex items-center space-x-4">
              <AuthButtons />
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isOpen ? 'block' : 'hidden'} md:hidden mt-4`}>
          <div className="flex flex-col space-y-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded ${
                  isActive ? 'text-orange-500' : 'text-gray-800 hover:bg-gray-100'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/fruits"
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded ${
                  isActive ? 'text-orange-500' : 'text-gray-800 hover:bg-gray-100'
                }`
              }
            >
              Fruits
            </NavLink>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded ${
                  isActive ? 'text-orange-500' : 'text-gray-800 hover:bg-gray-100'
                }`
              }
            >
              Services
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded ${
                  isActive ? 'text-orange-500' : 'text-gray-800 hover:bg-gray-100'
                }`
              }
            >
              Contact Us
            </NavLink>
            <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
              <AuthButtons />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
