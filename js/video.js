import { moves, activeId, els } from './state.js';
import { saveData } from './storage.js';
import { renderVideos, renderList } from './render.js';

export function savePrivateNotes() {
    const move = moves.find(m => m.id === activeId);
    if (move) {
        move.notes = els.notesInput.value;
        saveData();
    }
}

export function addPrivateVideo() {
    const url = els.videoInput.value.trim();
    if (!url) return;
    const move = moves.find(m => m.id === activeId);
    if (move) {
        if (!move.videos) move.videos = [];
        move.videos.push(url);
        saveData();
        renderVideos(move.videos);
        renderList();
        els.videoInput.value = '';
    }
}

export function deleteVideo(index) {
    const move = moves.find(m => m.id === activeId);
    if (move && move.videos) {
        move.videos.splice(index, 1);
        saveData();
        renderVideos(move.videos);
        renderList();
    }
}
