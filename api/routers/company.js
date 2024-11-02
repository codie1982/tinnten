const express = require("express")
const route = express.Router()
const { addCompany } = require("../controller/companyController")
route.post("/", addCompany)
module.exports = route