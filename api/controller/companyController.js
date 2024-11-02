const axios = require("axios")
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const addCompany = asyncHandler(async (req, res) => {
    const data = req.body
    console.log("Data : ",data)
    const response = await axios.post('http://localhost:5003/api/v10/llm/vector', { text:data.description });
    console.log("Vektör:", response.data.vektor);
    res.status(200).json({ message: "OK", data: {} });
});

module.exports = {
    addCompany
};
