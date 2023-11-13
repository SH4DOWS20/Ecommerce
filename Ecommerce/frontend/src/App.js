import React, { useState, useEffect, useReducer } from 'react';
import CartList from './CartList';

// Reducer function to manage cart state
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return action.payload;
    case 'ADD_ITEM':
      return [...state, action.payload];
    case 'DELETE_ITEM':
      return state.filter(item => item.id !== action.payload);
    case 'UPDATE_ITEM':
      return state.map(item => (item.id === action.payload.id ? action.payload : item));
    default:
      return state;
  }
};

function App() {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    // Fetch data from the server and update the cart state
    fetch('http://localhost:3008/api/cart')
      .then(response => response.json())
      .then(data => {
        dispatch({ type: 'SET_CART', payload: data });
        console.log(data);
      })
      .catch(error => console.error(error));
  }, []);

  const handleDelete = id => {
    fetch(`http://localhost:3008/api/cart/delete/${id}`, { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        dispatch({ type: 'DELETE_ITEM', payload: id });
        console.log(data);
      })
      .catch(error => console.error(error));
  const handleDelete = (id) => {
    setCart(cart.filter(item => item.id !== id));
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(cart.filter(item => item.id !== id));
  };

  // Implement the update functionality here
  const handleUpdate = (id, updatedItem) => {
    const updatedCart = cart.map(item => item.id === id ? updatedItem : item);
    setCart(updatedCart);
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Assuming newItem is an object representing a cart item
    setCart([...cart, newItem]);
    setNewItem('');
  };

  return (
    <div>
      <h1>Cart Items</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty. Add items below:</p>
      ) : null}
      <CartList cart={cart} onDelete={handleDelete} onUpdate={handleUpdate} />

      <h2>Add Item to Cart</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type an item"
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
        />
        <button type="submit">Add Item to Cart</button>
      </form>

      <h2>Random Hat Purchase</h2>
      <RandomHatPurchase />
    </div>
  );
}
}
export default App;