// frontend/src/components/CartList.js
import React from 'react';

const CartList = ({ cart, onDelete, onUpdate }) => {
  return (
    <div>
      {cart.map((item) => (
        <div key={item.id}>
          <p>{item.name}</p>
          <button onClick={() => onDelete(item.id)}>Delete</button>
          <button onClick={() => onUpdate(item.id)}>Update</button>
        </div>
      ))}
    </div>
  );
};

export default CartList;
