import { initElements, els, moves, setMoves, currentCategory } from './state.js';
import { LS_KEY } from './state.js';
import { bachataMoves, salsaMoves, ruedaMoves } from './data/default-moves.js';
import { loadTagPalette, saveData, exportData, triggerImport, importData } from './storage.js';
import { renderList, renderFilterChips } from './render.js';
import { buildTagPicker } from './tags.js';
import { loadMove, changeCategory, createNewMove, deleteCurrentMove } from './moves.js';
import { toggleEditMode, saveEdit, cancelEdit } from './editor.js';
import { addPrivateVideo, deleteVideo, savePrivateNotes } from './video.js';
import { askGemini } from './ai.js';
import { toggleFilter, updateFilterUI } from './ui.js';

// Initialize DOM cache
initElements();

// --- Init ---
function init() {
    loadTagPalette();
    const savedData = localStorage.getItem(LS_KEY);
    if (savedData) {
        const parsed = JSON.parse(savedData);
        if (Array.isArray(parsed) && parsed.length > 0) {
            setMoves(parsed);
        } else {
            setMoves([...bachataMoves, ...salsaMoves, ...ruedaMoves]);
        }
    } else {
        setMoves([...bachataMoves, ...salsaMoves, ...ruedaMoves]);
        saveData();
    }

    buildTagPicker();
    renderFilterChips();
    renderList();

    // Apri sidebar al primo caricamento su mobile
    els.sidebar.classList.remove('-translate-x-full');
    els.backdrop.classList.remove('hidden');

    const first = moves.find(m => m.type === currentCategory);
    if (first) loadMove(first.id);

    lucide.createIcons();

    els.searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        renderList(term);
    });

    els.mobileMenu.addEventListener('click', () => {
        els.sidebar.classList.remove('-translate-x-full');
        els.backdrop.classList.remove('hidden');
    });
    const close = () => {
        els.sidebar.classList.add('-translate-x-full');
        els.backdrop.classList.add('hidden');
    };
    els.closeSidebar.addEventListener('click', close);
    els.backdrop.addEventListener('click', close);
}

// Expose functions to HTML inline handlers
window.changeCategory = changeCategory;
window.toggleFilter = toggleFilter;
window.updateFilterUI = updateFilterUI;
window.renderList = renderList;
window.createNewMove = createNewMove;
window.toggleEditMode = toggleEditMode;
window.saveEdit = saveEdit;
window.cancelEdit = cancelEdit;
window.deleteCurrentMove = deleteCurrentMove;
window.loadMove = loadMove;
window.addPrivateVideo = addPrivateVideo;
window.deleteVideo = deleteVideo;
window.savePrivateNotes = savePrivateNotes;
window.exportData = exportData;
window.triggerImport = triggerImport;
window.importData = importData;
window.askGemini = askGemini;

// Register service worker for PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
}

init();
