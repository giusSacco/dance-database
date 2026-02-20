import { activeFilter, setActiveFilter, els, TAG_META } from './state.js';
import { renderList } from './render.js';

export let starMin = 0;
export let starMax = 5;

export function updateStarFilter(changed) {
    const minEl = document.getElementById('star-min');
    const maxEl = document.getElementById('star-max');
    if (!minEl || !maxEl) return;

    let min = parseInt(minEl.value);
    let max = parseInt(maxEl.value);

    if (changed === 'min' && min > max) {
        max = min;
        maxEl.value = max;
    } else if (changed === 'max' && max < min) {
        min = max;
        minEl.value = min;
    }

    starMin = min;
    starMax = max;

    const label = document.getElementById('star-range-label');
    if (label) {
        if (min === 0 && max === 5) {
            label.textContent = 'tutte';
        } else if (min === max) {
            label.textContent = min === 0 ? '☆' : '★'.repeat(min);
        } else {
            const minStr = min === 0 ? '☆' : '★'.repeat(min);
            label.textContent = `${minStr}–${'★'.repeat(max)}`;
        }
    }

    const fill = document.getElementById('star-track-fill');
    if (fill) {
        fill.style.left = `${(min / 5) * 100}%`;
        fill.style.width = `${((max - min) / 5) * 100}%`;
    }

    const term = (els.searchInput.value || '').toLowerCase();
    renderList(term);
}

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
    if (activeFilter !== 'all' && move.tag !== activeFilter) return false;
    if (starMin > 0 || starMax < 5) {
        const conf = move.confidence || 0;
        if (conf < starMin || conf > starMax) return false;
    }
    return true;
}
