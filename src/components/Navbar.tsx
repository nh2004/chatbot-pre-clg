import React from 'react';

export const Navbar = (): JSX.Element => {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/image-124.png"
            alt="Precollege"
            className="h-8 w-auto"
          />
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
            Home
          </a>
          <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
            College Predictor
          </a>
          <a href="#" className="text-orange-500 hover:text-orange-600 font-medium">
            AI counselor
          </a>
          <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
            Contacts
          </a>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors">
            Search mentor
          </button>
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">NH</span>
          </div>
        </div>
      </div>
    </nav>
  );
};