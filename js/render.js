import { moves, activeId, currentCategory, TAG_META, els } from './state.js';
import { DEFAULT_TAG } from './data/tag-meta.js';
import { filterMatches } from './ui.js';

export function renderList(searchTerm = '') {
    const normalizedTerm = (searchTerm || '').toLowerCase();
    els.list.innerHTML = '';

    const filtered = moves.filter(m => {
        const matchesCat = m.type === currentCategory;
        const matchesSearch = m.title.toLowerCase().includes(normalizedTerm) ||
            (m.subtitle && m.subtitle.toLowerCase().includes(normalizedTerm));
        const matchesFilter = filterMatches(m);
        return matchesCat && matchesSearch && matchesFilter;
    });

    if (filtered.length === 0) {
        els.list.innerHTML = '<p class="text-center text-gray-400 mt-4 text-sm">Nessuna mossa trovata</p>';
        return;
    }

    filtered.forEach((move, index) => {
        const isActive = move.id === activeId;
        const tagMeta = TAG_META[move.tag] || TAG_META[DEFAULT_TAG];
        const div = document.createElement('div');
        div.className = `cursor-pointer hover:bg-gray-50 border-b border-gray-100 flex items-stretch ${isActive ? 'active-move' : ''}`;

        div.onclick = () => {
            // loadMove is called via window binding to avoid circular import
            window.loadMove(move.id);
            if (window.innerWidth < 768) {
                els.sidebar.classList.add('-translate-x-full');
                els.backdrop.classList.add('hidden');
            }
        };

        const stripe = document.createElement('div');
        stripe.className = `w-2 flex-shrink-0`;
        if (tagMeta.stripe) {
            stripe.className += ` ${tagMeta.stripe}`;
        } else {
            stripe.style.backgroundColor = tagMeta.color || '#94a3b8';
        }

        const content = document.createElement('div');
        content.className = 'py-3 pl-4 pr-3 flex-1 flex justify-between items-center gap-3';

        const info = document.createElement('div');
        info.className = 'flex items-center gap-3 overflow-hidden';
        info.innerHTML = `
            <span class="opacity-40 text-[11px] w-5 text-right">${index + 1}.</span>
            <span class="font-bold text-sm truncate">${move.title}</span>
        `;

        const right = document.createElement('div');
        right.className = 'flex items-center gap-2 flex-shrink-0';

        if (move.videos && move.videos.length > 0) {
            const icon = document.createElement('i');
            icon.setAttribute('data-lucide', 'video');
            icon.className = 'w-3 h-3 text-blue-300';
            right.appendChild(icon);
        }

        content.appendChild(info);
        content.appendChild(right);

        div.appendChild(stripe);
        div.appendChild(content);
        els.list.appendChild(div);
    });
    lucide.createIcons();
}

export function renderVideos(videoList) {
    els.videoContainer.innerHTML = '';
    if (!videoList || videoList.length === 0) return;

    videoList.forEach((url, idx) => {
        const vidDiv = document.createElement('div');
        vidDiv.className = "bg-gray-50 border border-gray-200 rounded-lg p-3 relative group";

        const youtubeID = getYoutubeID(url);
        let content = '';

        if (youtubeID) {
            content = `
                <div class="video-container aspect-video mb-2 shadow-sm">
                    <iframe src="https://www.youtube.com/embed/${youtubeID}" frameborder="0" allowfullscreen></iframe>
                </div>
            `;
        } else {
            content = `
                <a href="${url}" target="_blank" rel="noopener noreferrer" onclick="window.open(this.href, '_blank'); return false;" class="flex items-center gap-2 text-blue-600 hover:underline break-all mb-4 font-bold text-sm bg-white p-3 rounded border z-20 relative">
                    <i data-lucide="link" class="w-4 h-4 flex-shrink-0"></i>
                    ${url.includes('drive.google.com') ? 'VIDEO DRIVE' : 'LINK ESTERNO'}
                </a>
            `;
        }

        vidDiv.innerHTML = `
            ${content}
            <button onclick="deleteVideo(${idx})" class="absolute top-2 right-2 bg-white text-red-500 p-2 rounded shadow hover:bg-red-50 transition-colors z-10" title="Rimuovi">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
        `;
        els.videoContainer.appendChild(vidDiv);
    });
    lucide.createIcons();
}

export function getYoutubeID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

export function renderFilterChips() {
    if (!els.filterContainer) return;
    els.filterContainer.innerHTML = '';
    const makeChip = (key, label) => {
        const b = document.createElement('button');
        b.className = 'filter-chip';
        b.dataset.filter = key;
        b.textContent = label;
        b.addEventListener('click', () => window.toggleFilter(key));
        return b;
    };
    els.filterContainer.appendChild(makeChip('all', 'Tutti'));
    Object.entries(TAG_META).forEach(([key, meta]) => {
        els.filterContainer.appendChild(makeChip(key, meta.label));
    });
    // updateFilterUI is called via window binding
    window.updateFilterUI();
}
