const axios = require("axios")
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const Company = require("../model/companyModel")
const ApiResponse = require("../helpers/response")

const addCompany = asyncHandler(async (req, res) => {
    const data = req.body
    const vectorResponse = await axios.post(process.env.VECTOR_URI, { text:data.description });
    const vector = vectorResponse.data.vektor;
    const company = await Company.create({
        name:data.title,
        description:data.description,
        type: data.type,
        categories: data.categories,
        vector:vector
    })
    res.status(201).json(ApiResponse.success(company, 201, "Album created successfully"));
});

module.exports = {
    addCompany
};
