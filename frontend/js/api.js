/**
 * API client central do frontend.
 *
 * Centraliza BASE_URL, montagem de query string, header Authorization Bearer,
 * parsing de JSON e tratamento de erro. Todas as telas devem consumir a API
 * por aqui — sem `fetch` espalhado.
 *
 * BASE_URL pode ser sobrescrita antes do load via:
 *   window.__BULBE_API_BASE_URL__ = 'http://x.y/api/v1'
 *
 * Sessao guest (US-27): `ensureSession()` chama `POST /users` quando nao ha
 * token salvo e persiste `token`/`userId` no localStorage (`authToken`/`userId`).
 * O middleware do backend trata qualquer Bearer nao vazio como `userId`, logo
 * o token guest serve de portador de identidade para carrinho e pedidos.
 */
const Api = (function () {
    const BASE_URL = window.__BULBE_API_BASE_URL__ || 'http://localhost:3001/api/v1';

    const TOKEN_KEY = 'authToken';
    const USER_KEY = 'userId';

    function getToken() {
        return localStorage.getItem(TOKEN_KEY);
    }

    function setSession(token, userId) {
        if (token) localStorage.setItem(TOKEN_KEY, token);
        if (userId) localStorage.setItem(USER_KEY, userId);
    }

    function getUserId() {
        return localStorage.getItem(USER_KEY);
    }

    function clearSession() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }

    let _sessionPromise = null;

    async function ensureSession() {
        const existing = getToken();
        if (existing) return existing;
        if (_sessionPromise) return _sessionPromise;

        _sessionPromise = (async () => {
            try {
                const response = await fetch(BASE_URL + '/users', {
                    method: 'POST',
                    headers: { Accept: 'application/json' },
                });
                if (!response.ok) throw new Error('HTTP ' + response.status);
                const data = await response.json();
                setSession(data.token, data.userId);
                return data.token;
            } catch (err) {
                _sessionPromise = null;
                throw err;
            }
        })();

        return _sessionPromise;
    }

    function buildQuery(params) {
        if (!params) return '';
        const parts = [];
        for (const [key, value] of Object.entries(params)) {
            if (value === undefined || value === null || value === '') continue;
            parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
        }
        return parts.length ? `?${parts.join('&')}` : '';
    }

    async function request(method, path, options) {
        const opts = options || {};
        const url = BASE_URL + path + buildQuery(opts.query);
        const headers = { Accept: 'application/json' };
        if (opts.body !== undefined) headers['Content-Type'] = 'application/json';
        if (opts.auth) headers['Authorization'] = `Bearer ${await ensureSession()}`;

        const response = await fetch(url, {
            method,
            headers,
            body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
        });

        let payload = null;
        const text = await response.text();
        if (text) {
            try {
                payload = JSON.parse(text);
            } catch (_err) {
                payload = text;
            }
        }

        if (!response.ok) {
            const message = (payload && payload.error) || `HTTP ${response.status}`;
            const error = new Error(message);
            error.status = response.status;
            error.payload = payload;
            throw error;
        }

        return payload;
    }

    return {
        BASE_URL,
        getToken,
        setSession,
        getUserId,
        clearSession,
        ensureSession,
        buildQuery,
        get(path, opts) {
            return request('GET', path, opts);
        },
        post(path, body, opts) {
            return request('POST', path, Object.assign({}, opts, { body }));
        },
        put(path, body, opts) {
            return request('PUT', path, Object.assign({}, opts, { body }));
        },
        delete(path, opts) {
            return request('DELETE', path, opts);
        },
    };
})();

// US-38: icone "perfil" do header aponta para login.html
document.addEventListener('DOMContentLoaded', () => {
    const profileBtns = document.querySelectorAll('.profile-photo, #profileBtn');
    profileBtns.forEach((btn) => {
        if (btn.dataset.bulbeProfileBound === 'true') return;
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
        btn.dataset.bulbeProfileBound = 'true';
    });
});
