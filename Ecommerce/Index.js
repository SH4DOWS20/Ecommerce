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
    const cartItem = Cart.find(item => item.id === CartId);
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
    const index = Cart.findIndex(item => item.id === CartId);
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
    const cartItem = Cart.find(item => item.id === CartId);

    if (cartItem) {
        cartItem.name = updateName;
        res.redirect('/api/cart');
    } else {
        res.status(404).send(`Cart with ID ${CartId} not found.`);
    }
});

function startServer() {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/`);
    });
}

module.exports = { startServer };

startServer();  // Move this line to the end of the code
