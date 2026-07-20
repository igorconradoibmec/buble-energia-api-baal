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
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());

const openapiSpec = yaml.load(
    fs.readFileSync(path.join(__dirname, '..', 'docs', 'openapi.yaml'), 'utf8')
);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
app.get('/openapi.json', (_req, res) => res.json(openapiSpec));

// A black-friday foi isolada num app/porta proprios (ver blackFridayApp.js);
// o app principal nao serve mais essa rota.
app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/coupons', couponRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);

// Proxy da Black Friday: encaminha /bf/* para o processo isolado (bulkhead)
// rodando na porta dedicada, mantendo o front na mesma origem (sem CORS).
const BLACK_FRIDAY_PORT = process.env.BLACK_FRIDAY_PORT || 3002;
app.use('/bf', async (req, res) => {
    const upstreamPath = req.originalUrl.replace(/^\/bf/, '') || '/';
    const target = `http://127.0.0.1:${BLACK_FRIDAY_PORT}${upstreamPath}`;
    try {
        const upstream = await fetch(target, {
            method: req.method,
            headers: { Accept: req.headers.accept || 'application/json' },
        });
        const body = await upstream.text();
        res.status(upstream.status);
        res.set('Content-Type', upstream.headers.get('content-type') || 'application/json');
        res.send(body);
    } catch (err) {
        res.status(502).json({ error: 'Black Friday indisponivel' });
    }
});

// Serve o frontend estático (mesma origem da API em producao)
const frontendPath = path.join(__dirname, '..', '..', 'frontend');
// Entrada do site abre pela tela de login.
app.get('/', (_req, res) => res.sendFile(path.join(frontendPath, 'login.html')));
app.use(express.static(frontendPath));

module.exports = app;
