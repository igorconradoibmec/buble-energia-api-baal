// Esse JS vai lidar com validação de cupons de desconto!

const okCupomButton = document.getElementById("ok-cupom");
const inputCupom = document.getElementById("cupom-desconto");
const feedbackPositivo = document.getElementById("feedback-positivo");
const feedbackNegativo = document.getElementById("feedback-negativo");

// Banco de cupons
const cupons = [
    { codigo: "BULBE10", valor: 0.1 },
    { codigo: "BULBE15", valor: 0.15 },
    { codigo: "BLACKFRIDAY", valor: 0.2 },
    { codigo: "WELCOME5", valor: 0.05 },
    { codigo: "PROMO25", valor: 0.25 },
    { codigo: "SUPERPROMO", valor: 0.40},
    { codigo: "SUPER30", valor: 0.30 },
    { codigo: "CLIENTEVIP", valor: 0.12 },
    { codigo: "BULBE20", valor: 0.20 },
    { codigo: "MEGASALE", valor: 0.18 }
];

let descontoCupom = 0;

okCupomButton.addEventListener("click", () => {
    const valorInputCupom = inputCupom.value.trim().toUpperCase();

    //  Procurar o input no banco de cupons
    const cupomEncontrado = cupons.find((c) => c.codigo === valorInputCupom);

    if (cupomEncontrado) {
        descontoCupom = cupomEncontrado.valor;
        feedbackPositivo.style.display = "inline";
        feedbackNegativo.style.display = "none";
        localStorage.setItem("cupomCodigo", cupomEncontrado.codigo);
        localStorage.setItem("descontoCupom", descontoCupom);
    } else {
        descontoCupom = 0;
        feedbackNegativo.style.display = "inline";
        feedbackPositivo.style.display = "none";
        localStorage.removeItem("cupomCodigo");
        localStorage.removeItem("descontoCupom");
    }
});
