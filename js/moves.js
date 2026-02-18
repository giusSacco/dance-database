import { moves, setMoves, activeId, setActiveId, currentCategory, setCurrentCategory,
         selectedTag, setSelectedTag, setActiveFilter, els } from './state.js';
import { DEFAULT_TAG } from './data/tag-meta.js';
import { saveData } from './storage.js';
import { renderList, renderVideos } from './render.js';
import { updateFilterUI } from './ui.js';
import { cancelEdit, toggleEditMode } from './editor.js';
import { refreshTagUI } from './tags.js';

export function changeCategory() {
    setCurrentCategory(els.categorySelect.value);
    els.searchInput.value = '';
    setActiveFilter('all');
    updateFilterUI();
    renderList();
    const first = moves.find(m => m.type === currentCategory);
    if (first) loadMove(first.id);
}

export function loadMove(id) {
    cancelEdit();
    setActiveId(id);
    const move = moves.find(m => m.id === id);
    if (!move) return;

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

    document.getElementById('ai-section').classList.add('hidden');
    document.getElementById('ai-content').innerHTML = '';

    document.getElementById('main-content').scrollTop = 0;
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
        deepSearch: ""
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
        els.detail.classList.add('hidden');
        if (els.headerActiveTitle) {
            els.headerActiveTitle.textContent = 'Nessuna mossa';
        }
        if (els.mobileHeaderTitle) {
            els.mobileHeaderTitle.textContent = 'Dance DB';
        }
    }
}
