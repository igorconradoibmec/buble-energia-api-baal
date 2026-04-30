const express = require('express');
const cors = require('cors');

const productsRoutes = require('./routes/products.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/products', productsRoutes);

module.exports = app;
