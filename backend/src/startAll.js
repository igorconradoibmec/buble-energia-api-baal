/**
 * Launcher de producao (deploy single-service).
 *
 * Sobe os dois processos do produto no mesmo container, cada um na sua porta:
 *   - server.js            -> app principal (loja + API) na PORT publica
 *   - blackFridayServer.js -> campanha Black Friday na BLACK_FRIDAY_PORT (3002, interna)
 *
 * O app principal faz proxy de /bf -> http://127.0.0.1:BLACK_FRIDAY_PORT, entao
 * o front consome tudo pela mesma origem. Mantem o bulkhead (processos/event-loops
 * separados) sem precisar de uma segunda hospedagem.
 *
 * migrate + seed ja rodaram no script start:prod:all antes deste launcher.
 */
const path = require('path');
const { spawn } = require('child_process');

const procs = [
    { script: 'blackFridayServer.js', label: 'BF' },
    { script: 'server.js', label: 'MAIN' },
];

const children = procs.map(({ script, label }) => {
    const child = spawn('node', [path.join(__dirname, script)], {
        stdio: 'inherit',
        env: process.env,
    });
    child.on('exit', (code, signal) => {
        console.error(`[startAll] ${label} encerrou (code=${code}, signal=${signal}). Derrubando o container.`);
        process.exit(code === null ? 1 : code);
    });
    return child;
});

function shutdown() {
    for (const child of children) child.kill();
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
