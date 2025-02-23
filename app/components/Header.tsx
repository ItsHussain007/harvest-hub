import React, { useState } from 'react';
import Link from 'next/link';

type HeaderProps = {
  cartTotal: number;
}

export const Header: React.FC<HeaderProps> = ({ cartTotal }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden hover:bg-gray-100 p-1 rounded-md transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <a href="/" className="text-xl md:text-2xl font-bold text-green-900 hover:text-green-700 transition-colors duration-200">
              Harvest Hub
            </a>
          </div>

          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-20 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 transition-colors duration-200"
              />
              <button className="absolute right-0 top-0 h-full px-6 bg-green-900 text-white rounded-r-md hover:bg-green-700 transition-colors duration-200">
                Search
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
          <Link href="/Registration-type">
            <button className="text-gray-600 hover:text-green-900 hidden md:block p-2 hover:bg-gray-100 rounded-full transition-all duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            </Link>
            <button className="text-gray-600 hover:text-green-900 hidden md:block p-2 hover:bg-gray-100 rounded-full transition-all duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <button className="text-gray-600 hover:text-green-900 p-2 hover:bg-gray-100 rounded-full transition-all duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </button>
              <div className="bg-green-600 text-white text-xs rounded-lg px-2 py-1">
                <span>£{cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`${isMenuOpen ? 'block' : 'hidden'} lg:hidden mt-4 pb-4 border-t border-gray-200`}>
          <div className="mt-4 space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-20 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 transition-colors duration-200"
              />
              <button className="absolute right-0 top-0 h-full px-6 bg-green-900 text-white rounded-r-md hover:bg-green-700 transition-colors duration-200">
                Search
              </button>
            </div>
            <div className="flex flex-col space-y-2">
              <a href="/" className="text-green-900 hover:text-green-700 hover:bg-gray-50 py-2 px-3 rounded-md transition-all duration-200">Home</a>
              <a href="#" className="text-gray-600 hover:text-green-900 hover:bg-gray-50 py-2 px-3 rounded-md transition-all duration-200">Shop</a>
              <a href="#" className="text-gray-600 hover:text-green-900 hover:bg-gray-50 py-2 px-3 rounded-md transition-all duration-200">Locations</a>
              <a href="#" className="text-gray-600 hover:text-green-900 hover:bg-gray-50 py-2 px-3 rounded-md transition-all duration-200">About Us</a>
              <a href="#" className="text-gray-600 hover:text-green-900 hover:bg-gray-50 py-2 px-3 rounded-md transition-all duration-200">Contact Us</a>
              <a href="#" className="text-gray-600 hover:text-green-900 hover:bg-gray-50 py-2 px-3 rounded-md transition-all duration-200">Farmers Guide</a>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center space-x-8 mt-4 pt-4 border-t border-gray-200">
          <a href="/" className="text-green-900 hover:text-green-700 hover:bg-gray-50 py-2 px-3 rounded-md transition-all duration-200">Home</a>
          <a href="#" className="text-gray-600 hover:text-green-900 hover:bg-gray-50 py-2 px-3 rounded-md transition-all duration-200">Shop</a>
          <a href="#" className="text-gray-600 hover:text-green-900 hover:bg-gray-50 py-2 px-3 rounded-md transition-all duration-200">Locations</a>
          <a href="#" className="text-gray-600 hover:text-green-900 hover:bg-gray-50 py-2 px-3 rounded-md transition-all duration-200">About Us</a>
          <a href="#" className="text-gray-600 hover:text-green-900 hover:bg-gray-50 py-2 px-3 rounded-md transition-all duration-200">Contact Us</a>
          <a href="#" className="text-gray-600 hover:text-green-900 hover:bg-gray-50 py-2 px-3 rounded-md transition-all duration-200">Farmers Guide</a>
        </div>
      </div>
    </nav>
  );
};