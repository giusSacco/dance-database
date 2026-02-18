import { selectedTag, setSelectedTag, els, TAG_META, setActiveFilter } from './state.js';
import { DEFAULT_TAG } from './data/tag-meta.js';
import { saveTagPalette } from './storage.js';
import { renderFilterChips } from './render.js';

export function buildTagPicker() {
    if (!els.tagEditor) return;
    els.tagEditor.innerHTML = '';
    Object.entries(TAG_META).forEach(([tag, meta]) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.dataset.tag = tag;
        btn.className = `w-8 h-8 rounded-full border-2 border-transparent flex items-center justify-center text-[10px] font-bold uppercase transition-transform duration-150 transform shadow-sm`;
        if (meta.bg && meta.bg.startsWith('bg-')) {
            btn.className += ` ${meta.bg} ${meta.text}`;
        } else {
            btn.style.backgroundColor = meta.color || '#64748b';
            btn.style.color = meta.textHex || '#ffffff';
        }
        btn.title = meta.label;
        btn.textContent = meta.label.charAt(0);
        btn.addEventListener('click', () => selectTag(tag));
        els.tagEditor.appendChild(btn);
    });
    const add = document.createElement('button');
    add.type = 'button';
    add.className = 'w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-[14px] font-bold text-gray-500 hover:border-blue-400 hover:text-blue-500';
    add.title = 'Aggiungi tag';
    add.textContent = '+';
    add.addEventListener('click', addNewTagPrompt);
    els.tagEditor.appendChild(add);
}

export function selectTag(tag) {
    setSelectedTag(tag);
    refreshTagUI();
}

export function refreshTagUI() {
    const meta = TAG_META[selectedTag] || TAG_META[DEFAULT_TAG];
    if (els.tagBadge) {
        els.tagBadge.textContent = meta.label;
        els.tagBadge.className = `px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider`;
        if (meta.bg && meta.bg.startsWith('bg-')) {
            els.tagBadge.className += ` ${meta.bg} ${meta.text}`;
            els.tagBadge.style.backgroundColor = '';
            els.tagBadge.style.color = '';
        } else {
            els.tagBadge.style.backgroundColor = meta.color || '#64748b';
            els.tagBadge.style.color = meta.textHex || '#ffffff';
        }
    }
    if (els.detailColorTag) {
        els.detailColorTag.className = `absolute top-0 right-0 w-24 h-24 transform translate-x-12 -translate-y-12 rotate-45 opacity-20`;
        if (meta.stripe) {
            els.detailColorTag.className += ` ${meta.stripe}`;
            els.detailColorTag.style.backgroundColor = '';
        } else {
            els.detailColorTag.style.backgroundColor = meta.color || '#64748b';
        }
    }
    if (els.tagEditor) {
        els.tagEditor.querySelectorAll('button').forEach(btn => {
            if (btn.dataset.tag === selectedTag) {
                btn.classList.add('border-blue-500', 'scale-105');
            } else {
                btn.classList.remove('border-blue-500', 'scale-105');
            }
        });
    }
}

export function addNewTagPrompt() {
    const key = prompt('Chiave tag (es. purple, soft, etc.)');
    if (!key) return;
    const safeKey = key.trim().toLowerCase();
    if (!safeKey || TAG_META[safeKey]) { alert('Chiave non valida o già esistente.'); return; }
    const label = prompt('Etichetta da mostrare (es. Speciale)') || safeKey;
    let color = prompt('Colore di sfondo HEX (es. #8b5cf6)') || '#64748b';
    if (!color.startsWith('#') || (color.length !== 7 && color.length !== 4)) color = '#64748b';
    const hex = color.replace('#', '');
    const to6 = hex.length === 3 ? hex.split('').map(c => c + c).join('') : hex;
    const r = parseInt(to6.slice(0, 2), 16), g = parseInt(to6.slice(2, 4), 16), b = parseInt(to6.slice(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    const textHex = luminance > 0.6 ? '#111827' : '#ffffff';
    TAG_META[safeKey] = { label, color, textHex };
    saveTagPalette();
    buildTagPicker();
    renderFilterChips();
    selectTag(safeKey);
    setActiveFilter(safeKey);
    window.updateFilterUI();
    window.renderList((els.searchInput.value || '').toLowerCase());
}
