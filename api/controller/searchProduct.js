const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

// Tüm performans sanatçılarını getirme işlemi
const searchProduct = asyncHandler(async (req, res) => {
    res.status(200).json({ message: "OK", data: {} });
});

module.exports = {
    searchProduct
};