import React, { useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import { toast } from 'react-hot-toast';

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    toast('Good Job!', {
      icon: '👏',
    });
    setEmail("");
  };

  return (
    <div className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Get Fresh Updates</h2>
          <p className="text-gray-300 mb-8">Subscribe to our newsletter for weekly updates on fresh arrivals and special offers.</p>
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg text-gray-900"
                required
              />
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg transition-colors"
              >
                Subscribe
              </button>
            </div>
          </form>

          <div className="flex justify-center gap-6">
            {[
              { icon: FaFacebookF, link: "https://facebook.com" },
              { icon: FaTwitter, link: "https://twitter.com" },
              { icon: FaLinkedinIn, link: "https://linkedin.com" },
              { icon: FaInstagram, link: "https://instagram.com" },
            ].map((social, index) => (
              <a
                key={index}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white text-xl transition-colors"
              >
                <social.icon />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
