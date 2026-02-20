import { isEditing, setIsEditing, activeId, moves, selectedTag, els } from './state.js';
import { saveData } from './storage.js';
import { refreshTagUI } from './tags.js';

export function toggleEditMode() {
    setIsEditing(true);
    els.detail.classList.add('editing');

    els.editBtn.classList.add('hidden');
    els.editActions.classList.remove('hidden');

    if (els.tagEditor) {
        els.tagEditor.classList.remove('hidden');
        refreshTagUI();
    }

    makeEditable(els.detailTitleText, 'input');
    makeEditable(els.subtitle, 'input');
    makeEditable(els.desc, 'textarea');
    makeEditable(els.deepSearch, 'textarea');
    const deepSearchArea = els.deepSearch.querySelector('textarea');
    if (deepSearchArea) {
        els.deepSearch.classList.remove('hidden');
        els.deepSearchPlaceholder.classList.add('hidden');
    } else {
        els.deepSearch.innerText = "";
        els.deepSearch.classList.remove('hidden');
        makeEditable(els.deepSearch, 'textarea');
        els.deepSearchPlaceholder.classList.add('hidden');
    }

    makeEditable(els.passi, 'textarea');
    makeEditable(els.prep, 'textarea');
    makeEditable(els.cmd, 'textarea');
    makeEditable(els.intention, 'textarea');

    els.link.classList.add('hidden');
    els.linkEditContainer.classList.remove('hidden');

    const relSection = document.getElementById('related-moves-section');
    if (relSection) relSection.classList.remove('hidden');
    const relEdit = document.getElementById('related-moves-edit');
    if (relEdit) relEdit.classList.remove('hidden');
}

export function makeEditable(element, type) {
    const currentText = element.innerText;
    const input = document.createElement(type);
    input.className = 'edit-input';
    input.value = currentText;
    if (type === 'textarea') input.rows = 4;
    element.innerHTML = '';
    element.appendChild(input);
}

export function getInputValue(element) {
    const input = element.querySelector('.edit-input');
    return input ? input.value : element.innerText;
}

export function cancelEdit() {
    if (!isEditing) return;
    setIsEditing(false);
    els.detail.classList.remove('editing');

    els.editBtn.classList.remove('hidden');
    els.editActions.classList.add('hidden');

    els.linkEditContainer.classList.add('hidden');
    const relEdit = document.getElementById('related-moves-edit');
    if (relEdit) relEdit.classList.add('hidden');
    // loadMove via window to avoid circular import
    window.loadMove(activeId);
}

export function saveEdit() {
    const moveIndex = moves.findIndex(m => m.id === activeId);
    if (moveIndex === -1) return;

    const fullTitle = getInputValue(els.detailTitleText);

    moves[moveIndex].title = fullTitle;
    moves[moveIndex].subtitle = getInputValue(els.subtitle);
    moves[moveIndex].desc = getInputValue(els.desc);
    moves[moveIndex].deepSearch = getInputValue(els.deepSearch);
    moves[moveIndex].steps = getInputValue(els.passi);
    moves[moveIndex].prep = getInputValue(els.prep);
    moves[moveIndex].cmd = getInputValue(els.cmd);
    moves[moveIndex].intention = getInputValue(els.intention);
    moves[moveIndex].link = els.editLinkInput.value;
    moves[moveIndex].tag = selectedTag;

    const relInput = document.getElementById('related-ids-input');
    if (relInput) {
        const raw = relInput.value.trim();
        moves[moveIndex].relatedIds = raw
            ? raw.split(',').map(s => s.trim()).filter(Boolean)
            : [];
    }

    saveData();
    setIsEditing(false);
    els.detail.classList.remove('editing');

    els.editBtn.classList.remove('hidden');
    els.editActions.classList.add('hidden');

    els.linkEditContainer.classList.add('hidden');
    const relEditSave = document.getElementById('related-moves-edit');
    if (relEditSave) relEditSave.classList.add('hidden');

    window.loadMove(activeId);
}
