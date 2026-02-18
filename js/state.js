import { DEFAULT_TAG_META, DEFAULT_TAG } from './data/tag-meta.js';

// --- Mutable application state ---
export let moves = [];
export let activeId = null;
export let currentCategory = 'bachata';
export let selectedTag = DEFAULT_TAG;
export let activeFilter = 'all';
export let isEditing = false;
export let TAG_META = { ...DEFAULT_TAG_META };

// Setters (ES module exports are read-only from importers)
export function setMoves(val) { moves = val; }
export function setActiveId(val) { activeId = val; }
export function setCurrentCategory(val) { currentCategory = val; }
export function setSelectedTag(val) { selectedTag = val; }
export function setActiveFilter(val) { activeFilter = val; }
export function setIsEditing(val) { isEditing = val; }
export function setTagMeta(val) { TAG_META = val; }

// --- Constants ---
export const LS_KEY = 'dance_db_data_v23';
export const apiKeyConst = "";

// --- DOM element cache ---
export let els = {};

export function initElements() {
    els = {
        list: document.getElementById('moves-list'),
        sidebar: document.getElementById('sidebar'),
        detail: document.getElementById('move-detail'),
        categorySelect: document.getElementById('category-select'),
        filterContainer: document.getElementById('filter-container'),
        title: document.getElementById('detail-title'),
        subtitle: document.getElementById('detail-subtitle'),
        desc: document.getElementById('detail-desc'),
        link: document.getElementById('ext-link'),
        linkText: document.getElementById('ext-link-text'),
        linkEditContainer: document.getElementById('link-edit-container'),
        editLinkInput: document.getElementById('edit-link'),
        passi: document.getElementById('detail-passi'),
        prep: document.getElementById('detail-preparazione'),
        cmd: document.getElementById('detail-comando'),
        intention: document.getElementById('detail-intenzione'),
        deepSearch: document.getElementById('detail-deepsearch'),
        deepSearchPlaceholder: document.getElementById('deepsearch-placeholder'),
        idDisplay: document.getElementById('detail-id'),
        categoryDisplay: document.getElementById('detail-category'),
        detailColorTag: document.getElementById('detail-color-tag'),
        tagDisplay: document.getElementById('tag-display'),
        tagBadge: document.getElementById('tag-badge'),
        tagEditor: document.getElementById('tag-editor'),
        mobileHeaderTitle: document.getElementById('mobile-header-title'),
        headerActiveTitle: document.getElementById('header-active-title'),
        detailTitleText: document.getElementById('detail-title-text'),
        videoInput: document.getElementById('video-input'),
        notesInput: document.getElementById('notes-input'),
        videoContainer: document.getElementById('saved-video-container'),
        editBtn: document.getElementById('edit-btn'),
        editActions: document.getElementById('edit-actions'),
        searchInput: document.getElementById('search-input'),
        mobileMenu: document.getElementById('mobile-menu-btn'),
        closeSidebar: document.getElementById('close-sidebar-btn'),
        backdrop: document.getElementById('sidebar-backdrop')
    };
}
