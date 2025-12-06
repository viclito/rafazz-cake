'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('rafazz-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart data:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('rafazz-cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = (item, quantity = 1, customizations = {}) => {
    setCart((prevCart) => {
      // Create a unique ID for the item based on ID and customizations
      const customizationKey = JSON.stringify(customizations);
      const existingItemIndex = prevCart.findIndex(
        (cartItem) => 
          cartItem._id === item._id && 
          JSON.stringify(cartItem.customizations) === customizationKey
      );

      if (existingItemIndex > -1) {
        // Item exists with same customizations, update quantity
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        toast.success(`Updated quantity for ${item.name}`);
        return newCart;
      } else {
        // Add new item
        toast.success(`Added ${item.name} to cart`);
        return [...prevCart, { ...item, quantity, customizations }];
      }
    });
  };

  const removeFromCart = (itemId, customizations) => {
    setCart((prevCart) => {
      const customizationKey = JSON.stringify(customizations);
      return prevCart.filter(
        (item) => 
          !(item._id === itemId && JSON.stringify(item.customizations) === customizationKey)
      );
    });
  };

  const updateQuantity = (itemId, customizations, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart((prevCart) => {
      const customizationKey = JSON.stringify(customizations);
      return prevCart.map((item) => {
        if (item._id === itemId && JSON.stringify(item.customizations) === customizationKey) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => {
    // Parse price string (e.g., "$45") to number
    const price = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
    return total + price * item.quantity;
  }, 0);

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
