const app = require('./blackFridayApp');

const PORT = process.env.BLACK_FRIDAY_PORT || 3002;

app.listen(PORT, () => {
    console.log(`Black Friday API rodando em http://localhost:${PORT}`);
});
