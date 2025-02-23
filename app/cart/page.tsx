"use client";

import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Breadcrumb } from '../components/Breadcrumb';

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

const ShoppingCartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: 'Green Capsicum',
      price: 14.00,
      quantity: 5,
      image: 'picturesForCart/green-capsicum.jpg'
    },
    {
      id: 2,
      name: 'Red Capsicum',
      price: 14.00,
      quantity: 3,
      image: 'picturesForCart/Red-capsicum.jpg'
    }
  ]);
  
  const [couponCode, setCouponCode] = useState('');

  const updateQuantity = (id: number, change: number): void => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
      )
    );
  };
  
  const removeItem = (id: number): void => {
    setCartItems(items => items.filter(item => item.id !== id));
  };
  
  const calculateSubtotal = (): number => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const cartTotal = subtotal;

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartTotal={cartTotal} />

      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Breadcrumb pageName="My Shopping Cart" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                <div className="hidden md:grid grid-cols-12 gap-4 p-4 text-sm text-gray-600 border-b">
                  <div className="col-span-6">PRODUCT</div>
                  <div className="col-span-2">PRICE</div>
                  <div className="col-span-2">QUANTITY</div>
                  <div className="col-span-2">SUBTOTAL</div>
                </div>

                {cartItems.map(item => (
                  <div key={item.id} className="flex flex-col md:grid md:grid-cols-12 gap-4 p-4 items-center border-b">
                    <div className="w-full md:col-span-6 flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="w-full md:col-span-2 flex justify-between md:block">
                      <span className="md:hidden">Price:</span>
                      <span>£{item.price.toFixed(2)}</span>
                    </div>
                    <div className="w-full md:col-span-2 flex justify-between md:block">
                      <span className="md:hidden">Quantity:</span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="w-full md:col-span-2 flex justify-between items-center">
                      <span className="md:hidden">Subtotal:</span>
                      <span>£{(item.price * item.quantity).toFixed(2)}</span>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-gray-600 text-xl"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}

                <div className="p-4 border-t">
                  <button className="px-6 py-2 border border-gray-200 rounded hover:bg-gray-50 w-full md:w-auto transition-colors duration-200">
                    Return to shop
                  </button>
                </div>

                <div className="p-4 border-t">
                  <div className="flex flex-col md:flex-row items-center gap-4 p-3 border rounded">
                    <span className="text-sm text-gray-600">Coupon Code</span>
                    <input
                      type="text"
                      placeholder="Enter code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full md:flex-1 p-2 border rounded focus:outline-none focus:border-green-500"
                    />
                    <button className="w-full md:w-auto px-6 py-2 bg-green-900 text-white rounded hover:bg-green-800 transition-colors duration-200">
                      Apply Coupon
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Cart Total</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b">
                    <span>Subtotal:</span>
                    <span>£{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Shipping:</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between py-2 font-bold">
                    <span>Total:</span>
                    <span>£{cartTotal.toFixed(2)}</span>
                  </div>
                </div>
                <button className="w-full mt-6 px-6 py-3 bg-green-900 text-white rounded hover:bg-green-800 transition-colors duration-200">
                  Proceed to checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ShoppingCartPage;