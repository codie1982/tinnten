
require("dotenv").config()
const path = require('path');
const compression = require('compression');
const express = require("express")
const session = require('express-session');
const colors = require("colors")
const fileUpload = require('express-fileupload');
const cors = require('cors');
const { SitemapStream, streamToPromise } = require('sitemap');
const { createGzip } = require('zlib');
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;

const llmRouter = require("./api/routers/llm.js")
const companyRouter = require("./api/routers/company.js")


const app = express()
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true })); // Form-data verisini almak için
app.use(express.static(path.join(__dirname, 'public')));
// GZIP sıkıştırmasını etkinleştir
app.use(compression());
// Middleware
app.use(fileUpload({
  //limits: { fileSize: 5 * 1024 * 1024 * 1024 }, // 5 GB aws sunucusunun bir kerede max upload miktarı.
  limits: { fileSize: 10 * 1024 * 1024 }, // 5 GB aws sunucusunun bir kerede max upload miktarı.
}));

app.use("/api/v10/llm", llmRouter)
app.use("/api/v10/company", companyRouter)
app.get("/", (req, res) => {
    res.json({
        data:"Hello world"
    })
  })

app.listen(PORT, () => { console.log(`Started on Port : ${PORT}`) })