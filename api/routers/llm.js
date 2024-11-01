const express = require("express")
const route = express.Router()
const { searchProduct } = require("../controller/product")
const { addCompanyVector } = require("../controller/company")
route.post("/search", searchProduct)
route.post("/vector", addCompanyVector)
module.exports = route