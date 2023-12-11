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
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
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

// Registration route
app.get('/registration', (req, res) => {
  res.render('registration'); // You can create a registration.ejs file for the registration form
});

app.post('/registration', async (req, res) => {
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
  res.send(`
    <button><a href="/api/cart">Cart</a></button>
    <button><a href="/api/cart/add">Add to Cart</a></button>
    <button><a href="/login">Login</a></button>
    <button><a href="/logout">Logout</a></button>
    <button><a href="/registration">Registration</a></button> <!-- Added registration link -->
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
  console.error(err);
});
