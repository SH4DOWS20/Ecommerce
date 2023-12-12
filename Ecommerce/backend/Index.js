import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();

// Middleware setup
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies
app.set('view engine', 'ejs'); // Set the view engine to EJS
app.set('views', __dirname + '/views'); // Set the views directory (adjust the path as needed)
app.use(methodOverride('_method')); // Override HTTP methods using a query parameter

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  next();
});

let db;

(async function() {
    try {
      const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
      console.log('Connected to MongoDB.');
      db = client.db("IceDog");

    } catch (err) {
      console.error('Error occurred while connecting to MongoDB:', err);
    }
})();

// Sample cart data
const cart = [
  { id: 1, name: 'Exclusive ice hat' },
  { id: 2, name: 'limited dog hat' },
  { id: 3, name: 'rare ice dog hat' },
];

// Route for the root URL
app.get('/', (req, res) => {
  res.send(`
    <button><a href="/api/cart">Cart</a></button>
    <button><a href="/api/cart/add">Add to cart</a></button>
  `);
});

app.get('/api/Cart', async (req, res) => {
  try {
      const collection = db.collection('browse');
      const workouts = await collection.find({}).toArray();
      res.render("workouts",{workouts});
  } catch (err) {
      console.log(err);
      res.status(500).send('Error fetching from database');
  }
});

// Get all cart items
app.get('/api/cart', async (req, res) => {
  try {
    // Simulate a delay in fetching data
    const delayedData = new Promise((resolve) => {
      setTimeout(() => {
        resolve(cart);
      }, 2000);
    });
    const result = await delayedData;
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for adding items to the cart
app.get('/api/cart/add', (req, res) => {
  res.render('Browse'); // Assuming you have a 'Browse.ejs' template in the 'views' directory
});

// Route for adding items to the cart by ID
app.get('/api/cart/add/:id', (req, res) => {
  res.render('Addtocart'); // Assuming you have an 'Addtocart.ejs' template in the 'views' directory
});

// Route for handling POST requests to add items to the cart
app.post('/api/cart', (req, res) => {
  console.log(req.body.name);

  const newcart = {
    id: cart.length + 1,
    name: req.body.name,
  };

  cart.push(newcart);
  res.redirect('/api/cart');
});

app.post('/api/Cart', (req, res) => {
  const { name, duration } = req.body;

  const newCart = {
    name,
    duration: parseInt(duration),
  };

  const collection = db.collection('Cart');
  collection.insertOne(newWorkout, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error saving to database');
      return;
    }
    console.log('Saved to database');
  });
  res.redirect('/api/Cart');
});

// Route for updating cart items by ID
app.put('/api/cart/update/:id', (req, res) => {
  console.log("fired put");
  const cartId = parseInt(req.params.id);
  const updatedName = req.body.name;

  const cartItem = cart.find(c => c.id === cartId);

  if (cartItem) {
    cartItem.name = updatedName;
    res.status(200).send(`Cart with ID ${cartId} updated.`);
  } else {
    res.status(404).send(`Cart with ID ${cartId} not found.`);
  }
});

// Route for deleting cart items by ID
app.delete('/api/cart/delete/:id', (req, res) => {
  const cartId = parseInt(req.params.id);

  const index = cart.findIndex(c => c.id === cartId);

  if (index !== -1) {
    cart.splice(index, 1);
    res.redirect('/api/cart');
  } else {
    res.status(404).send(`Cart with ID ${cartId} not found.`);
  }
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
  console.error(err);
});
