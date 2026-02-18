import { moves, setMoves, LS_KEY, TAG_META, setTagMeta } from './state.js';
import { DEFAULT_TAG_META, LS_TAGS } from './data/tag-meta.js';

export function saveData() {
    localStorage.setItem(LS_KEY, JSON.stringify(moves));
}

export function loadTagPalette() {
    try {
        const raw = localStorage.getItem(LS_TAGS);
        if (raw) {
            const custom = JSON.parse(raw);
            if (custom && typeof custom === 'object') {
                setTagMeta({ ...TAG_META, ...custom });
            }
        }
    } catch (e) {}
}

export function saveTagPalette() {
    const baseKeys = new Set(['green', 'darkgreen', 'blue', 'yellow', 'red']);
    const toSave = {};
    Object.entries(TAG_META).forEach(([k, v]) => { if (!baseKeys.has(k)) toSave[k] = v; });
    localStorage.setItem(LS_TAGS, JSON.stringify(toSave));
}

export function exportData() {
    const dataStr = JSON.stringify(moves, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dance_db_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export function triggerImport() {
    document.getElementById('import-file').click();
}

export function importData(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const importedMoves = JSON.parse(e.target.result);
            if (Array.isArray(importedMoves)) {
                if (confirm("Sovrascrivere i dati?")) {
                    setMoves(importedMoves);
                    saveData();
                    // changeCategory is called via window binding to avoid circular import
                    window.changeCategory();
                    alert("Fatto!");
                }
            } else alert("File non valido.");
        } catch (err) { alert("Errore file: " + err); }
        input.value = '';
    };
    reader.readAsText(file);
}
