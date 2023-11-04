const express = require('express');
const app = express();
const port = 3000;
const methodOverride = require('method-override');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});

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

// Route for fetching cart data
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
    res.status(500).send(error.message);
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

const Cart = [
    { id: 1, name: 'Limited IceDog hat' },
    { id: 2, name: 'Navy blue beanie' },
    { id: 3, name: 'Green baseball cap' },
];

app.get('/', (req, res) => {
    res.send(`<button><a href="/cart">Cart</a></button> <button><a href="/addCart">Add Cart</a></button>`);
});

app.get('/api/cart', async (req, res) => {
    try {
        const delayedData = new Promise((resolve) => {
            setTimeout(() => {
                resolve(Cart);
            }, 2000);
        });

        const result = await delayedData;
        res.render("index", { Cart: result });
    } catch (error) {
        console.log(error);
        res.status(500).send(`${error}`);
    }
});

app.get('/api/cart/add', (req, res) => {
    res.render('addCart.ejs');
});

app.get('/api/cart/add/:id', (req, res) => {
    const CartId = parseInt(req.params.id);
    const cartItem = Cart.find(item => item.id == CartId);
    if (cartItem) {
        res.render('updateCart.ejs', { cartItem: cartItem });
    } else {
        res.status(404).send(`Cart with ID ${CartId} not found.`);
    }
});

app.post('/api/cart', (req, res) => {
    console.log(req.body.name);

    const newCart = {
        id: Cart.length + 1,
        name: req.body.name,
    };

    Cart.push(newCart);
    res.redirect('/api/cart');
});

app.post('/api/cart/delete/:id', (req, res) => {
  const CartId = parseInt(req.params.id);
  const index = Cart.findIndex(item => item.id == CartId);
  if (index !== -1) {
    Cart.splice(index, 1);
    res.redirect('/api/cart/');
  } else {
    res.status(404).send(`Cart with ID ${CartId} not found.`);
  }
});

app.post('/api/cart/update/:id', (req, res) => {
  const CartId = parseInt(req.params.id);
  const updateName = req.body.name;
  const cartItem = Cart.find(item => item.id == CartId);

  if (cartItem) {
    cartItem.name = updateName;
    res.redirect('/api/cart');
  } else {
    res.status(404).send(`Cart with ID ${CartId} not found.`);
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
