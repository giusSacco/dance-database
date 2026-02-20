import { initElements, els, moves, setMoves, currentCategory, clearNavHistory } from './state.js';
import { LS_KEY } from './state.js';
import { bachataMoves, salsaMoves, ruedaMoves } from './data/default-moves.js';
import { loadTagPalette, saveData, exportData, triggerImport, importData } from './storage.js';
import { renderList, renderFilterChips, showWelcome } from './render.js';
import { buildTagPicker } from './tags.js';
import { loadMove, changeCategory, createNewMove, deleteCurrentMove, setConfidence, navigateToLinked, goBack } from './moves.js';
import { toggleEditMode, saveEdit, cancelEdit } from './editor.js';
import { addPrivateVideo, deleteVideo, savePrivateNotes } from './video.js';
import { askGemini } from './ai.js';
import { toggleFilter, updateFilterUI, updateStarFilter } from './ui.js';
import { pushToGist, pullFromGist, resetGistConfig, copyGistId } from './gist.js';

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

    showWelcome();

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
window.showWelcome = function() {
    clearNavHistory();
    showWelcome();
};

window.loadRandomMove = function () {
    const categoryMoves = moves.filter(m => m.type === currentCategory);
    if (!categoryMoves.length) return;
    const random = categoryMoves[Math.floor(Math.random() * categoryMoves.length)];
    clearNavHistory();
    loadMove(random.id);
    if (window.innerWidth < 768) {
        els.sidebar.classList.add('-translate-x-full');
        els.backdrop.classList.add('hidden');
    }
};

window.selectCategory = function (cat) {
    els.categorySelect.value = cat;
    changeCategory();
};

window.changeCategory = changeCategory;
window.toggleFilter = toggleFilter;
window.updateFilterUI = updateFilterUI;
window.updateStarFilter = updateStarFilter;
window.renderList = renderList;
window.createNewMove = createNewMove;
window.toggleEditMode = toggleEditMode;
window.saveEdit = saveEdit;
window.cancelEdit = cancelEdit;
window.deleteCurrentMove = deleteCurrentMove;
window.loadMove = loadMove;
window.navigateToLinked = navigateToLinked;
window.goBack = goBack;
window.navigateFresh = function(id) {
    clearNavHistory();
    loadMove(id);
};
window.setConfidence = setConfidence;
window.addPrivateVideo = addPrivateVideo;
window.deleteVideo = deleteVideo;
window.savePrivateNotes = savePrivateNotes;
window.exportData = exportData;
window.triggerImport = triggerImport;
window.importData = importData;
window.askGemini = askGemini;
window.pushToGist = pushToGist;
window.pullFromGist = pullFromGist;
window.resetGistConfig = resetGistConfig;
window.copyGistId = copyGistId;

// Register service worker for PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
}

init();
