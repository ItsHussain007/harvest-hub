import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-green-900 text-white py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-lg md:text-xl font-bold mb-4">Harvest Hub</h3>
            <p className="text-sm opacity-80 mb-4">
              Harvest Hub connects local farmers to communities, delivering fresh, farm-grown produce to your doorstep
            </p>
            <div className="text-sm">
              <div>(219) 555-0114</div>
              <div>Harvesthub@gmail.com</div>
            </div>
          </div>
          
          <div className="col-span-1">
            <h4 className="font-bold mb-4">My Account</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="/account" className="hover:text-gray-300">My Account</a></li>
              <li><a href="/orders" className="hover:text-gray-300">Order History</a></li>
              <li><a href="/cart" className="hover:text-gray-300">Shopping Cart</a></li>
              <li><a href="/wishlist" className="hover:text-gray-300">Wishlist</a></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="font-bold mb-4">Helps</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="/contact" className="hover:text-gray-300">Contact</a></li>
              <li><a href="/faqs" className="hover:text-gray-300">FAQs</a></li>
              <li><a href="/terms" className="hover:text-gray-300">Terms & Condition</a></li>
              <li><a href="/privacy" className="hover:text-gray-300">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h4 className="font-bold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="/category/fruits-vegetables" className="hover:text-gray-300">Fruit & Vegetables</a></li>
              <li><a href="/category/meat-fish" className="hover:text-gray-300">Meat & Fish</a></li>
              <li><a href="/category/dairy-eggs" className="hover:text-gray-300">Dairy & Eggs</a></li>
              <li><a href="/category/seasonal" className="hover:text-gray-300">Seasonal Produce</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 md:mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-xs text-gray-300 order-2 md:order-1">
              Harvest Hub © 2024. All Rights Reserved
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
