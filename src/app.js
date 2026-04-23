const express = require('express');
const cors = require('cors');

const productsRoutes = require('./routes/products.routes');
const cartRoutes = require('./routes/cart.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/cart', cartRoutes);

module.exports = app;
