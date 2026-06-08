const express = require('express');
const cors = require('cors');

const blackFridayRoutes = require('./routes/blackFriday.routes');

// App isolado da campanha de Black Friday.
//
// Roda como processo proprio, numa porta dedicada (BLACK_FRIDAY_PORT), para
// que o pico de trafego da campanha nao concorra pelo event loop do app
// principal (catalogo, carrinho, checkout). Padrao bulkhead: se a Black
// Friday saturar, a loja continua vendendo.
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/products/black-friday', blackFridayRoutes);

module.exports = app;
