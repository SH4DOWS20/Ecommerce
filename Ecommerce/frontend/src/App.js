import React, { useState, useEffect } from 'react';
import CartList from './components/CartList';
import RandomHatPurchase from './randomhatpurchse';

function App() {
  const [cart, setCart] = useState([]);
  const [newItem, setNewItem] = useState('');

  // Implement the delete functionality here
  const handleDelete = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
  };

  // Implement the update functionality here
  const handleUpdate = (id, updatedItem) => {
    const updatedCart = cart.map(item => item.id === id ? updatedItem : item);
    setCart(updatedCart);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Create a new item object and add it to the cart
    const newItemObject = {
      id: cart.length + 1, // You should use a proper ID generation mechanism
      name: newItem,
    };
    setCart([...cart, newItemObject]);
    setNewItem('');
  };

  return (
    <div>
      <h1>Cart Items</h1>
      <CartList cart={cart} onDelete={handleDelete} onUpdate={handleUpdate} />

      <h2>Add Item to Cart</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type an item"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <button type="submit">Add Item to Cart</button>
      </form>

      <h2>Random Hat Purchase</h2>
      <RandomHatPurchase />
    </div>
  );
}

export default App;
