import React, { useState, useEffect } from 'react';
import CartList from './components/CartList';
import React, { useState, useEffect } from 'react';
import { randomhatpurchase } from './randomhatpurchse';

function App() {
  const [cart, setCart] = useState([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    // Fetch data from the server and update the state
    fetch('/api/cart')
      .then((response) => response.json())
      .then((data) => setCart(data))
      .catch((error) => console.error(error));
  }, []);
  //
  function randomhatpurchase() {
    const [hat, setHat] = useState(0);
  
    useEffect(() => {
      document.title = `Hats: ${hats}`;
    }, [hats]);
  
    const incrementSteps = () => {
      setSteps(steps + 1);
    };
    return (
      <div>
        <h1>IceDog</h1>
        <p>How many Random Hats would you like to purchse?: {steps}</p>
        <button onClick={incrementSteps}>Add Random Hat</button>
        {steps >= 10 && <p>You've reached the maximum amount of hats that can be purchased</p>}
      </div>
    )
}  
//
  const handleDelete = (id) => {
    // Implement the delete functionality here
  };

  const handleUpdate = (id) => {
    // Implement the update functionality here
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Assuming newItem is an object representing a cart item
    setCart([...cart, newItem]);
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
    </div>
  );
}

export default App;
