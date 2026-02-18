import { moves, activeId, apiKeyConst } from './state.js';

export async function getEffectiveApiKey() {
    if (apiKeyConst) return apiKeyConst;

    let storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) return storedKey;

    const input = prompt("Per usare l'IA, serve una API Key di Google Gemini (gratuita su aistudio.google.com).\nInseriscila qui (verrà salvata nel browser):");
    if (input) {
        localStorage.setItem('gemini_api_key', input.trim());
        return input.trim();
    }
    return null;
}

export async function askGemini() {
    const move = moves.find(m => m.id === activeId);
    if (!move) return;

    const aiSection = document.getElementById('ai-section');
    const aiContent = document.getElementById('ai-content');
    const aiLoading = document.getElementById('ai-loading');
    const aiBtn = document.getElementById('ai-btn');

    const effectiveKey = await getEffectiveApiKey();
    if (!effectiveKey) {
        alert("Chiave API mancante. Impossibile contattare l'IA.");
        return;
    }

    aiSection.classList.remove('hidden');
    aiContent.classList.add('hidden');
    aiLoading.classList.remove('hidden');
    aiBtn.disabled = true;
    aiBtn.classList.add('opacity-50', 'cursor-not-allowed');

    const promptText = `Agisci come un maestro di ballo professionista di ${move.type}. Spiega in italiano la mossa: "${move.title}" (${move.subtitle}). 1. **Il Segreto**: Un consiglio tecnico fondamentale. 2. **Attenzione a...**: L'errore più comune. 3. **Challenge**: Una variante creativa. Sii conciso.`;

    try {
        const responseText = await callGeminiAPI(promptText, effectiveKey);
        aiContent.innerHTML = marked.parse(responseText);
        aiLoading.classList.add('hidden');
        aiContent.classList.remove('hidden');
    } catch (error) {
        console.error(error);
        aiContent.innerHTML = `<p class="text-red-500">Errore: ${error.message}. Verifica la tua chiave API.</p>`;
        aiLoading.classList.add('hidden');
        aiContent.classList.remove('hidden');
    } finally {
        aiBtn.disabled = false;
        aiBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
}

export async function callGeminiAPI(promptText, key) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${key}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}
