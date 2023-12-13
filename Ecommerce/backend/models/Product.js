const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    category: String,
    item: Number,
    price: Number,
    quantity: Number
})

const ProductModel = mongoose.model("products", ProductSchema)
module.exports = ProductModel