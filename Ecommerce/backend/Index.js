import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express();

// Enable CORS
app.use(cors());

// Function to generate a JWT token
const generateToken = (user) => {
  const payload = { id: user._id, username: user.username };
  const secretKey = '1234'; // Secret Key
  const options = { expiresIn: '1h' }; // Token expiration time

  return jwt.sign(payload, secretKey, options);
};

// Access Control middleware
const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  res.status(403).send('Forbidden');
};

// Example usage: Protect the '/admin' route
app.get('/admin', isAdmin, (req, res) => {
  res.send('Admin Dashboard');
});

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.set('views', `${__dirname}/views`);

// MongoDB connection
let db;

(async function () {
  try {
    const client = await MongoClient.connect('mongodb://localhost:27017', { useUnifiedTopology: true });
    console.log('Connected to MongoDB.');
    db = client.db("Ecommerce");
    mongoose.connect('mongodb://localhost:27017/Ecommerce', { useNewUrlParser: true, useUnifiedTopology: true });
  } catch (err) {
    console.error('Error occurred while connecting to MongoDB:', err);
  }
})();

// Mongoose Cart Schema
const cartItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, default: 1 },
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

// Mongoose User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Passport.js configuration
passport.use(new LocalStrategy(
  { usernameField: 'username' },
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username });

      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Express session setup
app.use(session({ secret: '1231243534543', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  next();
});

// Create a new cart item
app.post('/api/cart', async (req, res) => {
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

// Registration route
app.get('/register', (req, res) => {
  res.render('register'); // You can create a registration.ejs file for the registration form
});

app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Create a new user
    const newUser = new User({
      username,
      password: await bcrypt.hash(password, 10), // Hash the password before saving
    });

    const savedUser = await newUser.save();
    res.redirect('/login'); // Redirect to the login page after successful registration
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login route
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
);

// Logout route
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Ensure authentication for certain routes
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

// Protected route (example)
app.get('/profile', ensureAuthenticated, (req, res) => {
  res.send(`Welcome, ${req.user.username}!`);
});

// Route for the root URL
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    // Display content for authenticated users
    res.send(`Welcome, ${req.user.username}! <button><a href="/logout">Logout</a></button>`);
  } else {
    // Display content for non-authenticated users
    res.send(`
      <button><a href="/api/cart">Cart</a></button>
      <button><a href="/api/cart/add">Add to Cart</a></button>
      <button><a href="/login">Login</a></button>
      <button><a href="/register">Register</a></button>
    `);
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
