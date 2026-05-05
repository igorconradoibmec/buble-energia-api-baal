const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');

const productsRoutes = require('./routes/products.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const customerRoutes = require('./routes/customer.routes');
const couponRoutes = require('./routes/coupon.routes');
const userRoutes = require('./routes/user.routes');

const app = express();

app.use(cors());
app.use(express.json());

const openapiSpec = yaml.load(
    fs.readFileSync(path.join(__dirname, '..', 'docs', 'openapi.yaml'), 'utf8')
);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
app.get('/openapi.json', (_req, res) => res.json(openapiSpec));

app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/coupons', couponRoutes);
app.use('/api/v1/users', userRoutes);

module.exports = app;
