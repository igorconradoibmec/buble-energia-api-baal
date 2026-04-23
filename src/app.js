const express = require('express');
const cors = require('cors');

const productsRoutes = require('./routes/products.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);

module.exports = app;
