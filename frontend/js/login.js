/**
 * Login JWT: chama POST /api/v1/auth/login e guarda token + usuario.
 *
 * IMPORTANTE (caveat de identidade — US-38):
 * O middleware do backend trata Bearer bruto como userId. Se o JWT for usado
 * como Bearer nas rotas autenticadas, o customerId muda a cada login e perde
 * vinculo com carrinho/pedidos. Por isso aqui guardamos o JWT em chaves
 * separadas (jwtToken/usuario) e mantemos o token de sessao guest (authToken)
 * intacto, ate que o middleware decodifique o JWT (ou US-27/futura issue).
 */
(function () {
    const form = document.getElementById('login-form');
    if (!form) return;

    const emailInput = document.getElementById('login-email');
    const senhaInput = document.getElementById('login-senha');
    const submitBtn = document.getElementById('login-submit');
    const feedback = document.getElementById('login-feedback');

    function showFeedback(kind, message) {
        feedback.className = 'login-feedback ' + kind;
        feedback.textContent = message;
    }

    function clearFeedback() {
        feedback.className = 'login-feedback';
        feedback.textContent = '';
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        clearFeedback();

        const email = emailInput.value.trim();
        const senha = senhaInput.value;

        if (!email || !senha) {
            showFeedback('error', 'Informe email e senha');
            return;
        }

        submitBtn.disabled = true;
        try {
            const response = await Api.post('/auth/login', { email, senha });

            if (response && response.token && response.usuario) {
                localStorage.setItem('jwtToken', response.token);
                localStorage.setItem('jwtExpiresIn', response.expiresIn || '');
                localStorage.setItem('usuario', JSON.stringify(response.usuario));
                showFeedback('success', `Bem-vindo, ${response.usuario.nome}!`);
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 600);
            } else {
                showFeedback('error', 'Resposta inesperada do servidor');
            }
        } catch (error) {
            if (error.status === 400) {
                showFeedback('error', error.message || 'Informe email e senha');
            } else if (error.status === 401) {
                showFeedback('error', error.message || 'Credenciais invalidas');
            } else {
                showFeedback('error', 'Nao foi possivel entrar. Tente novamente.');
            }
        } finally {
            submitBtn.disabled = false;
        }
    });
})();
