import { moves, setMoves, activeId, setActiveId, currentCategory, setCurrentCategory,
         selectedTag, setSelectedTag, setActiveFilter, els,
         navHistory, pushNavHistory, popNavHistory, clearNavHistory } from './state.js';
import { DEFAULT_TAG } from './data/tag-meta.js';
import { saveData } from './storage.js';
import { renderList, renderVideos, showWelcome } from './render.js';
import { updateFilterUI } from './ui.js';
import { cancelEdit, toggleEditMode } from './editor.js';
import { refreshTagUI } from './tags.js';

export function changeCategory() {
    setCurrentCategory(els.categorySelect.value);
    els.searchInput.value = '';
    setActiveFilter('all');
    updateFilterUI();
    renderList();
    clearNavHistory();
    const first = moves.find(m => m.type === currentCategory);
    if (first) loadMove(first.id);
    else showWelcome();
}

export function loadMove(id) {
    cancelEdit();
    setActiveId(id);
    const move = moves.find(m => m.id === id);
    if (!move) return;

    document.getElementById('welcome-screen')?.classList.add('hidden');
    els.detail.classList.remove('hidden');
    renderList((els.searchInput.value || '').toLowerCase());

    els.idDisplay.innerText = move.id;
    els.categoryDisplay.innerText = move.type;

    setSelectedTag(move.tag || DEFAULT_TAG);
    if (els.tagDisplay) els.tagDisplay.classList.remove('hidden');
    if (els.tagEditor) els.tagEditor.classList.add('hidden');
    refreshTagUI();
    if (els.headerActiveTitle) {
        els.headerActiveTitle.textContent = move.title;
    }
    if (els.mobileHeaderTitle) {
        els.mobileHeaderTitle.textContent = move.title;
    }

    els.detailTitleText.innerText = move.title;

    els.subtitle.innerText = move.subtitle;
    els.desc.innerText = move.desc;

    els.passi.innerText = move.steps;
    els.prep.innerText = move.prep;
    els.cmd.innerText = move.cmd;
    els.intention.innerText = move.intention;

    if (move.deepSearch && move.deepSearch.trim() !== "") {
        els.deepSearch.innerText = move.deepSearch;
        els.deepSearch.classList.remove('hidden');
        els.deepSearchPlaceholder.classList.add('hidden');
    } else {
        els.deepSearch.innerText = "";
        els.deepSearch.classList.add('hidden');
        els.deepSearchPlaceholder.classList.remove('hidden');
    }

    if (move.link) {
        els.link.href = move.link;
        els.link.classList.remove('hidden');
    } else {
        els.link.classList.add('hidden');
    }
    els.editLinkInput.value = move.link || "";

    els.notesInput.value = move.notes || "";
    renderVideos(move.videos || []);

    renderConfidenceStars(move.confidence);

    document.getElementById('ai-section').classList.add('hidden');
    document.getElementById('ai-content').innerHTML = '';

    document.getElementById('main-content').scrollTop = 0;

    renderRelatedMoves(move);
    updateBackButton();
}

function renderConfidenceStars(confidence) {
    const container = document.getElementById('confidence-stars');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const btn = document.createElement('button');
        const filled = i <= (confidence || 0);
        btn.className = `text-lg leading-none transition-colors ${filled ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'}`;
        btn.textContent = '★';
        btn.title = `Confidenza ${i}/5`;
        const newLevel = (i === confidence) ? null : i;
        btn.onclick = () => window.setConfidence(newLevel);
        container.appendChild(btn);
    }
}

function renderRelatedMoves(move) {
    const section = document.getElementById('related-moves-section');
    const chipsEl = document.getElementById('related-moves-chips');
    const input = document.getElementById('related-ids-input');
    if (!section || !chipsEl) return;

    const explicit = move.relatedIds || [];
    const reverse = moves
        .filter(m => m.id !== move.id && (m.relatedIds || []).includes(move.id))
        .map(m => m.id);
    const allIds = [...new Set([...explicit, ...reverse])];

    if (input) input.value = explicit.join(', ');

    if (allIds.length === 0) {
        section.classList.add('hidden');
        return;
    }
    section.classList.remove('hidden');

    chipsEl.innerHTML = '';
    allIds.forEach(relId => {
        const relMove = moves.find(m => m.id === relId);
        if (!relMove) return;
        const btn = document.createElement('button');
        btn.className = 'px-3 py-1.5 text-xs font-semibold rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 active:bg-indigo-200 transition-colors flex items-center gap-1.5';
        btn.innerHTML = `<span class="opacity-60 text-[10px]">${relMove.id}</span> ${relMove.title}`;
        btn.onclick = () => window.navigateToLinked(relId);
        chipsEl.appendChild(btn);
    });
}

function updateBackButton() {
    if (!els.backBtn) return;
    els.backBtn.classList.toggle('hidden', navHistory.length === 0);
}

export function navigateToLinked(id) {
    pushNavHistory(activeId);
    loadMove(id);
}

export function goBack() {
    const prevId = popNavHistory();
    if (!prevId) return;
    loadMove(prevId);
}

export function setConfidence(level) {
    const move = moves.find(m => m.id === activeId);
    if (!move) return;
    move.confidence = level;
    saveData();
    renderConfidenceStars(move.confidence);
    renderList((els.searchInput.value || '').toLowerCase());
}

export function createNewMove() {
    const prefix = currentCategory === 'bachata' ? 'b' : (currentCategory === 'salsa' ? 's' : 'r');
    let maxNum = 0;
    moves.forEach(m => {
        if (m.type === currentCategory) {
            const match = (m.id || '').toString().match(/^[a-zA-Z](\d+)$/);
            if (match) {
                const num = parseInt(match[1], 10);
                if (!isNaN(num)) maxNum = Math.max(maxNum, num);
            }
        }
    });
    const newId = `${prefix}${maxNum + 1}`;
    const newMove = {
        id: newId,
        type: currentCategory,
        tag: selectedTag || DEFAULT_TAG,
        title: "Nuova Mossa",
        subtitle: "Modifica per iniziare...",
        desc: "...",
        steps: "...",
        prep: "...",
        cmd: "...",
        intention: "...",
        link: "",
        videos: [],
        notes: "",
        deepSearch: "",
        confidence: null
    };
    let lastIdx = -1;
    for (let i = 0; i < moves.length; i++) {
        if (moves[i].type === currentCategory) lastIdx = i;
    }
    if (lastIdx >= 0) {
        moves.splice(lastIdx + 1, 0, newMove);
    } else {
        moves.push(newMove);
    }
    saveData();
    renderList();
    clearNavHistory();
    loadMove(newId);
    toggleEditMode();

    if (window.innerWidth < 768) {
        els.sidebar.classList.add('-translate-x-full');
        els.backdrop.classList.add('hidden');
    }
}

export function deleteCurrentMove() {
    if (!confirm("Eliminare questa mossa?")) return;
    setMoves(moves.filter(m => m.id !== activeId));
    saveData();

    const next = moves.find(m => m.type === currentCategory);
    renderList();

    if (next) {
        loadMove(next.id);
    } else {
        showWelcome();
        if (els.headerActiveTitle) els.headerActiveTitle.textContent = 'Nessuna mossa';
        if (els.mobileHeaderTitle) els.mobileHeaderTitle.textContent = 'Dance DB';
    }
}
