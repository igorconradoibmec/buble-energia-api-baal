// Validação de cupons via POST /api/v1/coupons/validate.

const okCupomButton = document.getElementById("ok-cupom");
const inputCupom = document.getElementById("cupom-desconto");
const feedbackPositivo = document.getElementById("feedback-positivo");
const feedbackNegativo = document.getElementById("feedback-negativo");

let descontoCupom = 0;

function clearCupom() {
    descontoCupom = 0;
    feedbackNegativo.style.display = "inline";
    feedbackPositivo.style.display = "none";
    localStorage.removeItem("cupomCodigo");
    localStorage.removeItem("descontoCupom");
}

okCupomButton.addEventListener("click", async () => {
    const code = inputCupom.value.trim();

    if (!code) {
        clearCupom();
        return;
    }

    okCupomButton.disabled = true;
    try {
        const result = await Api.post('/coupons/validate', { code });

        if (result && result.valid) {
            descontoCupom = Number(result.discountPercentage) || 0;
            feedbackPositivo.style.display = "inline";
            feedbackNegativo.style.display = "none";
            localStorage.setItem("cupomCodigo", result.code);
            localStorage.setItem("descontoCupom", descontoCupom);
        } else {
            clearCupom();
        }
    } catch (error) {
        console.error('Erro ao validar cupom:', error);
        clearCupom();
    } finally {
        okCupomButton.disabled = false;
    }
});
