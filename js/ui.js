import { activeFilter, setActiveFilter, els, TAG_META } from './state.js';
import { renderList } from './render.js';

export function toggleFilter(filterType) {
    if (activeFilter === filterType) {
        setActiveFilter('all');
    } else {
        setActiveFilter(filterType);
    }
    updateFilterUI();
    const term = (els.searchInput.value || '').toLowerCase();
    renderList(term);
}

export function updateFilterUI() {
    const chips = document.querySelectorAll('.filter-chip');
    chips.forEach(chip => {
        const key = chip.dataset.filter;
        const isActive = key === activeFilter;
        chip.classList.toggle('active', isActive);
        chip.classList.toggle('ring-2', isActive);
        chip.classList.toggle('ring-offset-1', isActive);
        chip.classList.toggle('ring-blue-400', isActive);

        if (key === 'all') {
            chip.style.backgroundColor = isActive ? '#4b5563' : 'white';
            chip.style.color = isActive ? '#ffffff' : '#4b5563';
        } else if (TAG_META[key]) {
            const meta = TAG_META[key];
            if (isActive) {
                chip.style.backgroundColor = meta.color || '#64748b';
                chip.style.color = meta.textHex || '#ffffff';
            } else {
                chip.style.backgroundColor = 'white';
                chip.style.color = '#4b5563';
            }
        }
    });
}

export function filterMatches(move) {
    if (activeFilter === 'all') return true;
    return move.tag === activeFilter;
}
