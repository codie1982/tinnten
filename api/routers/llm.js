const express = require("express")
const route = express.Router()
const { searchProduct } = require("../controller/searchProduct")
route.post("/search", searchProduct)
module.exports = route