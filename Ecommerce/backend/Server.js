const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const ProductModel = require('./models/Products')
const app = express()

/*
//First sample to build an array to display data in client side
app.get("/api", (req, res) => {
    res.json({"users": ["Sebastian","Matias","Molly","Ember","test"] })
})

app.listen(5000, () => { console.log("Server started on port 5000") })
*/





app.use(cors())
app.use(express.json())

mongoose.connect("mongodb://127.0.0.1:27017/Ecommerce")

app.get('/getProducts', (req, res) =>  {
  ProductModel.find()
  .then(products => res.json(products))
  .catch(err => res.json(err))
})

app.listen(5000, () => { 
  console.log("Server started on port 5000") 
})