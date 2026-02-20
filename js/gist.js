import { moves, setMoves } from './state.js';
import { saveData } from './storage.js';

const GIST_TOKEN_KEY = 'dance_db_gist_token';
const GIST_ID_KEY    = 'dance_db_gist_id';
const GIST_FILENAME  = 'dance_db_data.json';

function getStoredToken() { return localStorage.getItem(GIST_TOKEN_KEY); }
function getStoredGistId() { return localStorage.getItem(GIST_ID_KEY); }

async function ensureToken() {
    let token = getStoredToken();
    if (!token) {
        token = prompt(
            'GitHub Personal Access Token (scope: gist)\n' +
            'Crealo su: github.com/settings/tokens → "New token" → spunta solo "gist"\n\n' +
            'Verrà salvato nel browser.'
        );
        if (!token) return null;
        token = token.trim();
        localStorage.setItem(GIST_TOKEN_KEY, token);
    }
    return token;
}

function setButtonLoading(btnId, loading) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.disabled = loading;
    btn.classList.toggle('opacity-50', loading);
    btn.classList.toggle('cursor-not-allowed', loading);
}

export async function pushToGist() {
    const token = await ensureToken();
    if (!token) return;

    setButtonLoading('gist-push-btn', true);
    const content = JSON.stringify(moves, null, 2);
    const gistId  = getStoredGistId();

    try {
        let url    = 'https://api.github.com/gists';
        let method = 'POST';
        let body   = {
            description: 'Dance DB backup',
            public: false,
            files: { [GIST_FILENAME]: { content } }
        };

        if (gistId) {
            url    = `https://api.github.com/gists/${gistId}`;
            method = 'PATCH';
            body   = { files: { [GIST_FILENAME]: { content } } };
        }

        const res = await fetch(url, {
            method,
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (res.status === 401) {
            localStorage.removeItem(GIST_TOKEN_KEY);
            throw new Error('Token non valido o scaduto. Riprova — ti verrà chiesto di nuovo.');
        }
        if (!res.ok) throw new Error(`Errore HTTP ${res.status}`);

        const data = await res.json();
        localStorage.setItem(GIST_ID_KEY, data.id);
        alert(`✓ Backup salvato nel cloud!\nGist ID: ${data.id}\n\nCopia questo ID per recuperare i dati su un altro dispositivo.`);
    } catch (err) {
        alert(`Errore push: ${err.message}`);
    } finally {
        setButtonLoading('gist-push-btn', false);
    }
}

export async function pullFromGist() {
    const token = await ensureToken();
    if (!token) return;

    let gistId = getStoredGistId();
    if (!gistId) {
        gistId = prompt('Gist ID da cui caricare:\n(trovalo nel messaggio ricevuto dopo il primo Push, oppure su gist.github.com)');
        if (!gistId) return;
        gistId = gistId.trim();
    }

    setButtonLoading('gist-pull-btn', true);

    try {
        const res = await fetch(`https://api.github.com/gists/${gistId}`, {
            headers: { 'Authorization': `token ${token}` }
        });

        if (res.status === 401) {
            localStorage.removeItem(GIST_TOKEN_KEY);
            throw new Error('Token non valido o scaduto. Riprova.');
        }
        if (res.status === 404) throw new Error('Gist non trovato. Verifica il Gist ID.');
        if (!res.ok) throw new Error(`Errore HTTP ${res.status}`);

        const data = await res.json();
        const file = data.files[GIST_FILENAME];
        if (!file) throw new Error(`File "${GIST_FILENAME}" non trovato nel Gist.`);

        const imported = JSON.parse(file.content);
        if (!Array.isArray(imported)) throw new Error('Formato non valido.');

        const updatedAt = new Date(data.updated_at).toLocaleString('it-IT');
        if (!confirm(`Caricare ${imported.length} mosse dal cloud?\nUltimo aggiornamento: ${updatedAt}\n\nI dati locali verranno sostituiti.`)) return;

        setMoves(imported);
        saveData();
        localStorage.setItem(GIST_ID_KEY, gistId);
        window.changeCategory();
        alert('✓ Dati caricati dal cloud!');
    } catch (err) {
        alert(`Errore pull: ${err.message}`);
    } finally {
        setButtonLoading('gist-pull-btn', false);
    }
}

export function resetGistConfig() {
    const hasToken = !!getStoredToken();
    const gistId   = getStoredGistId();
    const info     = gistId ? `Gist ID attuale: ${gistId}` : 'Nessun Gist ID salvato.';
    if (confirm(`${info}\n\nRimuovere token e Gist ID salvati?`)) {
        localStorage.removeItem(GIST_TOKEN_KEY);
        localStorage.removeItem(GIST_ID_KEY);
        alert('Configurazione cloud rimossa.');
    }
}

export function copyGistId() {
    const gistId = getStoredGistId();
    if (!gistId) {
        alert('Nessun Gist ID salvato. Fai prima un Push.');
        return;
    }
    navigator.clipboard.writeText(gistId).then(
        () => alert(`✓ Gist ID copiato!\n${gistId}`),
        () => alert(`Gist ID:\n${gistId}`)
    );
}
