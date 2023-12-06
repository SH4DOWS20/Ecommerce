// Import the required modules
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import express from 'express';
import http from 'http';
import methodOverride from 'method-override';
import bodyParser from 'body-parser';

const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(bodyParser.json()); // Parse JSON bodies
app.set('view engine', 'ejs'); // Set the view engine to EJS
app.set('views', __dirname + '/views'); // Set the views directory (adjust the path as needed)
app.use(methodOverride('_method')); // Override HTTP methods using a query parameter

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  next();
});

// MongoDB connection
(async function () {
  try {
    const client = await MongoClient.connect('mongodb://localhost:27017', { useUnifiedTopology: true });
    console.log('Connected to MongoDB.');
    const db = client.db("Ecommerce");
    mongoose.connect('mongodb://localhost:27017/Ecommerce', { useNewUrlParser: true, useUnifiedTopology: true });
  } catch (err) {
    console.error('Error occurred while connecting to MongoDB:', err);
  }
})();

// Mongoose Cart Schema
const cartItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  // Add more fields as needed
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

// Create a new cart item
app.post('/api/cart', async (req, res) => {
  try {
    const { name, quantity } = req.body;

    const newCartItem = new CartItem({
      name,
      quantity: quantity || 1,
    });

    const savedCartItem = await newCartItem.save();
    res.status(201).json(savedCartItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all cart items
app.get('/api/cart', async (req, res) => {
  try {
    const cartItems = await CartItem.find();
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific cart item by ID
app.get('/api/cart/:id', async (req, res) => {
  try {
    const cartItemId = req.params.id;
    const cartItem = await CartItem.findById(cartItemId);

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a cart item by ID
app.put('/api/cart/:id', async (req, res) => {
  try {
    const cartItemId = req.params.id;
    const { name, quantity } = req.body;

    const updatedCartItem = await CartItem.findByIdAndUpdate(
      cartItemId,
      { name, quantity },
      { new: true } // Return the updated document
    );

    if (!updatedCartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json(updatedCartItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a cart item by ID
app.delete('/api/cart/:id', async (req, res) => {
  try {
    const cartItemId = req.params.id;
    const deletedCartItem = await CartItem.findByIdAndRemove(cartItemId);

    if (!deletedCartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json(deletedCartItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for the root URL
app.get('/', (req, res) => {
  res.send(`
    <button><a href="/api/cart">Cart</a></button>
    <button><a href="/api/cart/add">Add to Cart</a></button>
  `);
});

// Create an HTTP server and pass the Express app to it.
const server = http.createServer(app);

// Define the port number. Use the value from the environment variable 'PORT', or default to 3008.
const PORT = process.env.PORT || 3008;

// Start the server on the specified port and log a message to the console.
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Add an error event listener to handle server-related errors.
server.on('error', (err) => {
  console.error('Server error:', err);
});
