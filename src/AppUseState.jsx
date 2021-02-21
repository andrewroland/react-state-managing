import React, { useState, useEffect } from 'react';
import './App.css';
import Footer from './Footer';
import Header from './Header';
import Products from './Products';
import { Routes, Route } from 'react-router-dom';
import Detail from './Detail';
import Cart from './Cart';
import Checkout from './Checkout';

export default function App() {
  const [cart, setCart] = useState(() => {
    try {
      return localStorage.getItem('cart')
        ? JSON.parse(localStorage.getItem('cart'))
        : [];
    } catch (e) {
      console.error('The cart could not be parsed into JSON');
      return [];
    }
  });

  useEffect(() => localStorage.setItem('cart', JSON.stringify(cart)), [cart]);

  function addToCart(id, sku) {
    setCart(() => {
      const itemInCart = cart.find((c) => c.sku === sku);
      if (itemInCart) {
        return cart.map((c) =>
          itemInCart ? { ...c, quantity: c.quantity++ } : c
        );
      } else {
        return [...cart, { id, sku, quantity: 1 }];
      }
    });
  }

  function updateQuantity(sku, quantity) {
    setCart((items) => {
      if (quantity === 0) {
        return items.filter((i) => i.sku !== sku);
      } else {
        return items.map((i) =>
          i.sku === sku ? { ...i, quantity: quantity } : i
        );
      }
    });
  }

  function emptyCart() {
    setCart([]);
  }

  return (
    <>
      <div className="content">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<h1>Welcome</h1>} />
            <Route path="/:category" element={<Products />} />
            <Route
              path="/:category/:id"
              element={<Detail addToCart={addToCart} />}
            />
            <Route
              path="/cart"
              element={<Cart cart={cart} updateQuantity={updateQuantity} />}
            />
            <Route
              path="/checkout"
              element={<Checkout cart={cart} emptyCart={emptyCart} />}
            />
          </Routes>
        </main>
      </div>
      <Footer />
    </>
  );
}
