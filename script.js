(() => {
  const GENERAL_STORAGE_KEY = 'generalActions';
  const SCHEDULING_STORAGE_KEY = 'schedulingActions';
  const MEETING_STORAGE_KEY = 'meetingNotes';
  const MEETING_UI_STORAGE_KEY = 'meetingNotesUIState';
  const NEXT_NUMBER_STORAGE_KEY = 'nextActionNumber';
  const LEGACY_STORAGE_KEY = 'generalActions.v1';
  const DEFAULT_NEXT_NUMBER = 137;
  const ALLOWED_RICH_TAGS = new Set(['B', 'STRONG', 'I', 'EM', 'U', 'BR', 'P', 'UL', 'OL', 'LI', 'DIV']);

  const ALLOWED_MINUTES = ['00', '15', '30', '45'];
  const SUPABASE_URL = 'https://ngmcjvsqontdwgxyedwx.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_QNIuyXbtKQ_1-1NnU1J4pA_53Jckpes';
  const CLOUD_LAST_PUSH_KEY = 'lastPushAt';
  const CLOUD_LAST_PULL_KEY = 'lastPullAt';
  const CLOUD_LAST_SYNCED_AT_KEY = 'lastSyncedAt';
  const CLOUD_LAST_UPDATED_AT_KEY = 'lastCloudUpdatedAt';
  const LOCAL_DIRTY_SINCE_KEY = 'localDirtySince';
  const LOCAL_STATE_VERSION_KEY = 'dashboardStateVersion';
  const PRIVACY_MODE_KEY = 'dashboardPrivacyMode';
  const LATEST_STATE_VERSION = 12;
  const AUTOSYNC_DEBOUNCE_MS = 2000;
  const FOCUS_SYNC_DEBOUNCE_MS = 700;
  const PERSON_TAG_REGEX = /(^|[\s(>])(@[A-Za-z0-9_-]+)(?=$|[\s.,;:!?()[\]{}"'])/g;
  const HASH_TAG_REGEX = /(^|[\s(>])(#[A-Za-z0-9_-]+)(?=$|[\s.,;:!?()[\]{}"'])/g;
  const URGENCY_LOW = 3;
  const MOVE_HIGHLIGHT_MS = 5000;
  const ACTION_SHORTCUT_TOKEN_REGEX = /%(\d{1,5})%/g;
  const ACTION_SHORTCUT_TRIGGER_KEY_REGEX = /^[\s.,!?;:)}\]"']$/;

  const DEFAULT_DASHBOARD_TITLE = 'Angus’ Working Dashboard';

  const defaultTheme = {
    bannerBg: '#1e3a8a',
    bannerFg: '#ffffff',
    pageBg: '#f3f6fb',
    cardHeaderBg: '#0f172a',
    cardHeaderFg: '#ffffff',
  };

  const THEMES = {
    'Office Blue': {
      bannerBg: '#2563eb',
      bannerFg: '#ffffff',
      pageBg: '#f8fafc',
      cardHeaderBg: '#1d4ed8',
      cardHeaderFg: '#ffffff',
    },
    'Office Teal': {
      bannerBg: '#0f766e',
      bannerFg: '#f0fdfa',
      pageBg: '#f0fdfa',
      cardHeaderBg: '#115e59',
      cardHeaderFg: '#f0fdfa',
    },
    'Office Green': {
      bannerBg: '#15803d',
      bannerFg: '#f0fdf4',
      pageBg: '#f0fdf4',
      cardHeaderBg: '#166534',
      cardHeaderFg: '#f0fdf4',
    },
    'Office Red': {
      bannerBg: '#b91c1c',
      bannerFg: '#fef2f2',
      pageBg: '#fef2f2',
      cardHeaderBg: '#991b1b',
      cardHeaderFg: '#fef2f2',
    },
    'Office Orange': {
      bannerBg: '#c2410c',
      bannerFg: '#fff7ed',
      pageBg: '#fff7ed',
      cardHeaderBg: '#9a3412',
      cardHeaderFg: '#fff7ed',
    },
    'Office Purple': {
      bannerBg: '#7e22ce',
      bannerFg: '#faf5ff',
      pageBg: '#faf5ff',
      cardHeaderBg: '#6b21a8',
      cardHeaderFg: '#faf5ff',
    },
    'Office Grey': {
      bannerBg: '#475569',
      bannerFg: '#f8fafc',
      pageBg: '#f8fafc',
      cardHeaderBg: '#334155',
      cardHeaderFg: '#f8fafc',
    },
    Navy: {
      bannerBg: '#1e3a8a',
      bannerFg: '#eff6ff',
      pageBg: '#eff6ff',
      cardHeaderBg: '#1e40af',
      cardHeaderFg: '#eff6ff',
    },
    Charcoal: {
      bannerBg: '#1f2937',
      bannerFg: '#f9fafb',
      pageBg: '#f3f4f6',
      cardHeaderBg: '#111827',
      cardHeaderFg: '#f9fafb',
    },
    Forest: {
      bannerBg: '#14532d',
      bannerFg: '#f0fdf4',
      pageBg: '#ecfdf5',
      cardHeaderBg: '#166534',
      cardHeaderFg: '#f0fdf4',
    },
    Crimson: {
      bannerBg: '#9f1239',
      bannerFg: '#fff1f2',
      pageBg: '#fff1f2',
      cardHeaderBg: '#881337',
      cardHeaderFg: '#fff1f2',
    },
    Sunshine: {
      bannerBg: '#ca8a04',
      bannerFg: '#422006',
      pageBg: '#fefce8',
      cardHeaderBg: '#eab308',
      cardHeaderFg: '#422006',
    },
    'Pastel Mint': {
      bannerBg: '#6ee7b7',
      bannerFg: '#064e3b',
      pageBg: '#f0fdf4',
      cardHeaderBg: '#34d399',
      cardHeaderFg: '#064e3b',
    },
    'Pastel Lavender': {
      bannerBg: '#c4b5fd',
      bannerFg: '#312e81',
      pageBg: '#f5f3ff',
      cardHeaderBg: '#a78bfa',
      cardHeaderFg: '#312e81',
    },
    'Pastel Peach': {
      bannerBg: '#fdba74',
      bannerFg: '#7c2d12',
      pageBg: '#fff7ed',
      cardHeaderBg: '#fb923c',
      cardHeaderFg: '#7c2d12',
    },
  };

  const THEME_PRESET_NAMES = [...Object.keys(THEMES), 'Custom'];
  const movedActionHighlights = new Map();
  const movedBigTicketHighlights = new Map();

  const collapsedCardsDefault = {
    generalActions: false,
    personalActions: false,
    bigTicket: false,
    scheduling: false,
    meetingNotes: false,
    generalNotes: false,
  };

  const cardLayoutDefault = {
    columns: [
      ['generalActions'],
      ['bigTicket', 'scheduling'],
      ['meetingNotes', 'generalNotes'],
    ],
  };
  const cardColumnClassNames = ['general-column', 'planning-column', 'notes-column'];

  const { createClient } = supabase;
  const sb = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

  const modal = document.getElementById('action-modal');
  const modalBackdrop = document.getElementById('action-modal-backdrop');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalSaveBtn = document.getElementById('modal-save-btn');
  const modalCancelBtn = document.getElementById('modal-cancel-btn');
  const modalDictateBtn = document.getElementById('modal-dictate-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalStatus = document.getElementById('modal-status');
  const modalTextInput = document.getElementById('modal-text-input');
  const modalUrgencyBtn = document.getElementById('modal-urgency-btn');
  const modalUrgencyLabel = document.getElementById('modal-urgency-label');
  const modalTimeDependentBtn = document.getElementById('modal-time-dependent-btn');
  const modalTimeDependentLabel = document.getElementById('modal-time-dependent-label');

  const meetingBigEditModal = document.getElementById('meeting-big-edit-modal');
  const meetingBigEditBackdrop = document.getElementById('meeting-big-edit-backdrop');
  const meetingBigEditClose = document.getElementById('meeting-big-edit-close');
  const meetingBigEditForm = document.getElementById('meeting-big-edit-form');
  const meetingBigEditTitleInput = document.getElementById('meeting-big-edit-title-input');
  const meetingBigEditDateInput = document.getElementById('meeting-big-edit-date-input');
  const meetingBigEditHourInput = document.getElementById('meeting-big-edit-hour-input');
  const meetingBigEditMinuteInput = document.getElementById('meeting-big-edit-minute-input');
  const meetingBigEditNotesEditor = document.getElementById('meeting-big-edit-notes-editor');
  const meetingBigEditDictateBtn = document.getElementById('meeting-big-edit-dictate');
  const meetingBigEditRecordedInput = document.getElementById('meeting-big-edit-recorded');
  const bigTicketModal = document.getElementById('big-ticket-modal');
  const bigTicketModalBackdrop = document.getElementById('big-ticket-modal-backdrop');
  const bigTicketModalClose = document.getElementById('big-ticket-modal-close');
  const bigTicketModalSave = document.getElementById('big-ticket-modal-save');
  const bigTicketModalEditor = document.getElementById('big-ticket-modal-editor');
  const generalNoteBigEditModal = document.getElementById('general-note-big-edit-modal');
  const generalNoteBigEditBackdrop = document.getElementById('general-note-big-edit-backdrop');
  const generalNoteBigEditClose = document.getElementById('general-note-big-edit-close');
  const generalNoteBigEditForm = document.getElementById('general-note-big-edit-form');
  const generalNoteBigEditTitleInput = document.getElementById('general-note-big-edit-title-input');
  const generalNoteBigEditDateInput = document.getElementById('general-note-big-edit-date-input');
  const generalNoteBigEditEditor = document.getElementById('general-note-big-edit-editor');
  const generalNoteBigEditDictateBtn = document.getElementById('general-note-big-edit-dictate');
  const privacyToggleBtn = document.getElementById('privacy-toggle-btn');
  const generalNoteTabText = document.getElementById('general-note-tab-text');
  const generalNoteTabWhiteboard = document.getElementById('general-note-tab-whiteboard');
  const generalNoteTextPanel = document.getElementById('general-note-text-panel');
  const generalNoteWhiteboardPanel = document.getElementById('general-note-whiteboard-panel');
  const whiteboardCanvas = document.getElementById('general-note-whiteboard-canvas');
  const whiteboardCanvasWrap = whiteboardCanvas?.closest('.whiteboard-canvas-wrap') || null;
  const whiteboardColorInput = document.getElementById('whiteboard-color');
  const whiteboardWidthInput = document.getElementById('whiteboard-width');
  const whiteboardUndoBtn = document.getElementById('whiteboard-undo-btn');
  const whiteboardClearBtn = document.getElementById('whiteboard-clear-btn');
  const whiteboardImageActions = document.getElementById('whiteboard-image-actions');
  const whiteboardImageDeleteBtn = document.getElementById('whiteboard-image-delete-btn');
  const whiteboardImageForwardBtn = document.getElementById('whiteboard-image-forward-btn');
  const whiteboardImageBackwardBtn = document.getElementById('whiteboard-image-backward-btn');
  const mainContainer = document.getElementById('main-content');
  const columnsSection = document.querySelector('.columns');
  const signedOutMessage = document.getElementById('signed-out-message');
  const dashboardTitleEl = document.getElementById('dashboard-title');
  const dashboardDateEl = document.getElementById('dashboard-date');
  const globalFilterBar = document.getElementById('global-filter-bar');
  const globalPersonFilterSelect = document.getElementById('global-person-filter');
  const globalTagFilterSelect = document.getElementById('global-tag-filter');
  const globalSearchFilterInput = document.getElementById('global-search-filter');
  const globalFilterClearBtn = document.getElementById('global-filter-clear-btn');

  const settingsBtn = document.getElementById('cloud-settings-btn');
  const settingsModal = document.getElementById('settings-modal');
  const settingsModalBackdrop = document.getElementById('settings-modal-backdrop');
  const settingsModalClose = document.getElementById('settings-modal-close');
  const settingsForm = document.getElementById('settings-form');
  const settingsCancelBtn = document.getElementById('settings-cancel-btn');
  const themePresetSelect = document.getElementById('theme-preset-select');
  const dashboardTitleInput = document.getElementById('dashboard-title-input');
  const themeBannerBgInput = document.getElementById('theme-banner-bg');
  const themeBannerFgInput = document.getElementById('theme-banner-fg');
  const themePageBgInput = document.getElementById('theme-page-bg');
  const themeCardHeaderBgInput = document.getElementById('theme-card-header-bg');
  const themeCardHeaderFgInput = document.getElementById('theme-card-header-fg');
  const importModal = document.getElementById('import-modal');
  const importModalBackdrop = document.getElementById('import-modal-backdrop');
  const importModalClose = document.getElementById('import-modal-close');
  const importForm = document.getElementById('import-form');
  const importFileInput = document.getElementById('import-file-input');
  const importCancelBtn = document.getElementById('import-cancel-btn');
  const meetingBigEditCancel = document.getElementById('meeting-big-edit-cancel');
  const generalNoteBigEditCancel = document.getElementById('general-note-big-edit-cancel');

  const meeting = {
    items: [],
    expandedId: null,
    editingId: null,
    uiState: { collapsedMonths: {}, collapsedWeeks: {} },
    form: document.getElementById('meeting-add-form'),
    titleInput: document.getElementById('meeting-title-input'),
    dateInput: document.getElementById('meeting-date-input'),
    hourInput: document.getElementById('meeting-hour-input'),
    minuteInput: document.getElementById('meeting-minute-input'),
    notesEditor: document.getElementById('meeting-notes-editor'),
    listEl: document.getElementById('meeting-list'),
    bigBtn: document.getElementById('meeting-big-btn'),
  };

  const bigTicket = {
    items: [],
    form: document.getElementById('big-ticket-add-form'),
    input: document.getElementById('big-ticket-input'),
    listEl: document.getElementById('big-ticket-list'),
    activeId: null,
  };

  const generalNotes = {
    items: [],
    expandedId: null,
    editingId: null,
    uiState: { collapsedMonths: {} },
    form: document.getElementById('general-notes-add-form'),
    dateInput: document.getElementById('general-note-date-input'),
    titleInput: document.getElementById('general-note-title-input'),
    editor: document.getElementById('general-note-editor'),
    listEl: document.getElementById('general-notes-list'),
  };

  const uiState = {
    collapsedCards: { ...collapsedCardsDefault },
    cardLayout: [],
    collapsedGeneralNotesMonths: {},
    cardLayout: structuredClone(cardLayoutDefault),
    theme: { presetName: 'Office Blue', vars: { ...defaultTheme } },
    dashboardTitle: DEFAULT_DASHBOARD_TITLE,
    personFilter: 'All',
    tagFilter: 'All',
    searchQuery: '',
  };

  const appState = {
    stateVersion: LATEST_STATE_VERSION,
    generalActions: [],
    personalActions: [],
    schedulingActions: [],
    meetingNotes: [],
    bigTicketItems: [],
    generalNotes: [],
    ui: {
      collapsedCards: { ...collapsedCardsDefault },
      cardLayout: [],
      collapsedGeneralNotesMonths: {},
      cardLayout: structuredClone(cardLayoutDefault),
      theme: { presetName: 'Office Blue', vars: { ...defaultTheme } },
      dashboardTitle: DEFAULT_DASHBOARD_TITLE,
      personFilter: 'All',
      tagFilter: 'All',
      searchQuery: '',
    },
    meetingNotesUIState: { collapsedMonths: {}, collapsedWeeks: {} },
    nextActionNumber: DEFAULT_NEXT_NUMBER,
  };

  const cloud = {
    emailInput: document.getElementById('cloud-email-input'),
    passwordInput: document.getElementById('cloud-password-input'),
    signInBtn: document.getElementById('cloud-sign-in-btn'),
    signOutBtn: document.getElementById('cloud-sign-out-btn'),
    exportBtn: document.getElementById('cloud-export-btn'),
    importBtn: document.getElementById('cloud-import-btn'),
    settingsBtn: document.getElementById('cloud-settings-btn'),
    signedInDisplay: document.getElementById('cloud-signed-in-display'),
    signedInEmailEl: document.getElementById('cloud-signed-in-email'),
    collapseAllBtn: document.getElementById('collapse-all-btn'),
    statusEl: document.getElementById('cloud-status'),
    toastContainer: document.getElementById('toast-container'),
    signedInUser: null,
    busy: false,
    loadingContext: '',
    syncInFlight: false,
    refreshInFlight: false,
    focusRefreshTimer: null,
    importInProgress: false,
    lastCloudUpdatedAt: localStorage.getItem(CLOUD_LAST_UPDATED_AT_KEY) || null,
    lastSyncedAt: localStorage.getItem(CLOUD_LAST_SYNCED_AT_KEY) || null,
  };

  let transientStatusTimer = null;
  let lastTransientStatusMessage = '';
  let lastTransientStatusShownAt = 0;

  const lists = {
    general: {
      key: GENERAL_STORAGE_KEY,
      showDates: true,
      actions: [],
      form: document.getElementById('general-add-action-form'),
      input: document.getElementById('general-action-input'),
      listEl: document.getElementById('general-action-list'),
      clearBtn: document.getElementById('general-clear-completed-btn'),
      createUrgencyBtn: document.getElementById('general-create-urgency-btn'),
      createTimingBtn: document.getElementById('general-create-timing-btn'),
    },
    personal: {
      key: 'personalActions',
      showDates: true,
      hideNumber: true,
      idPrefix: 'pact',
      actions: [],
      form: document.getElementById('personal-add-action-form'),
      input: document.getElementById('personal-action-input'),
      listEl: document.getElementById('personal-action-list'),
      clearBtn: document.getElementById('personal-clear-completed-btn'),
    },
    scheduling: {
      key: SCHEDULING_STORAGE_KEY,
      showDates: false,
      hideNumber: false,
      idPrefix: 'act',
      actions: [],
      form: document.getElementById('scheduling-add-action-form'),
      input: document.getElementById('scheduling-action-input'),
      listEl: document.getElementById('scheduling-action-list'),
      clearBtn: document.getElementById('scheduling-clear-completed-btn'),
      createUrgencyBtn: document.getElementById('scheduling-create-urgency-btn'),
      createTimingBtn: document.getElementById('scheduling-create-timing-btn'),
    },
  };

  let nextActionNumber = DEFAULT_NEXT_NUMBER;
  let activeModalContext = null;
  const creationDefaults = { urgencyLevel: 0, timingFlag: null };
  const creationState = {
    general: { ...creationDefaults },
    scheduling: { ...creationDefaults },
  };
  const dictationState = { recognition: null, button: null, defaultTarget: null, fallbackTarget: null };
  let activeMeetingBigEditId = null;
  let activeMeetingBigEditDraft = null;
  let activeGeneralNoteBigEditId = null;
  let activeGeneralNoteBigEditDraft = null;
  let isAuthenticated = false;
  let suppressAutosync = false;
  let autosyncTimer = null;
  let autosyncPending = false;
  let autosyncInFlight = false;
  let settingsThemeDraft = null;
  let settingsThemeSavedSnapshot = null;
  let suppressThemePresetSync = false;
  let localDirtySince = Number(localStorage.getItem(LOCAL_DIRTY_SINCE_KEY)) || null;
  let meetingUserTouchedDate = false;
  let meetingUserTouchedTime = false;
  let meetingAutoFilledDateTimeThisEntry = false;
  let meetingTitleWasEmpty = true;

  let privacyMode = localStorage.getItem(PRIVACY_MODE_KEY) === '1';
  const whiteboardState = {
    mode: 'text',
    tool: 'pen',
    color: '#1f2937',
    width: 3,
    hasLoaded: false,
    touched: false,
    hasContent: false,
    undoStack: [],
    drawing: false,
    start: null,
    baseSnapshot: null,
    images: [],
    selectedImageId: null,
    draggingImageId: null,
    dragOffset: { x: 0, y: 0 },
    lastPointerPosition: null,
  };

  function canMutateData() {
    return !privacyMode;
  }

  function hashCode(value) {
    const text = String(value || '');
    let hash = 0;
    for (let i = 0; i < text.length; i += 1) hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
    return Math.abs(hash);
  }

  const PRIVACY_LOREM_LINES = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    'Curabitur pretium tincidunt lacus, nulla gravida orci a odio, semper porta lacus vehicula sed.',
  ];

  const PRIVACY_LOREM_BODIES = [
    [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    ],
    [
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      'Integer posuere erat a ante venenatis dapibus posuere velit aliquet.',
      'Praesent commodo cursus magna, vel scelerisque nisl consectetur et.',
    ],
    [
      'Morbi leo risus, porta ac consectetur ac, vestibulum at eros.',
      'Aenean lacinia bibendum nulla sed consectetur.',
      'Maecenas sed diam eget risus varius blandit sit amet non magna.',
      'Nulla vitae elit libero, a pharetra augue.',
      'Donec sed odio dui, id elit non mi porta gravida at eget metus.',
    ],
  ];

  function getPrivacyText(seed, kind = 'line') {
    const seedHash = hashCode(seed || kind);
    if (kind === 'modal') {
      const body = PRIVACY_LOREM_BODIES[seedHash % PRIVACY_LOREM_BODIES.length];
      const sentenceCount = 2 + (seedHash % Math.min(5, body.length - 1));
      return body.slice(0, sentenceCount).join(' ');
    }
    const line = PRIVACY_LOREM_LINES[seedHash % PRIVACY_LOREM_LINES.length];
    const minLength = 40;
    const targetLength = minLength + (seedHash % 41);
    const maxLength = Math.min(targetLength, line.length);
    const clipped = line.slice(0, maxLength).trim();
    const suffix = clipped.length < line.length ? '…' : '';
    return `${clipped}${suffix}`;
  }

  function renderText(realText, seed, kind = 'line') {
    if (!privacyMode) return realText;
    return getPrivacyText(seed, kind);
  }

  function anonymizeText(value, kind = 'Item', id = '') {
    return renderText(value, `${kind}:${id || value}`, 'line');
  }

  function anonymizeInlineHtml(value, kind = 'Item', id = '') {
    return escapeHtml(renderText(value, `${kind}:${id || value}`, 'line'));
  }

  function anonymizeRichHtml(value, kind = 'Note', id = '') {
    return `<p>${escapeHtml(renderText(value, `${kind}:${id || value}`, 'modal'))}</p>`;
  }

  function renderEmailForPrivacy(email) {
    if (privacyMode) return 'Signed in';
    return email || '—';
  }

  function escapeHtml(text) {
    return String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function textToRichHtml(text) {
    const escaped = escapeHtml(String(text || '').trim());
    if (!escaped) {
      return '<p><br></p>';
    }
    return `<p>${escaped.replace(/\n/g, '<br>')}</p>`;
  }

  function sanitizeRichHtml(inputHtml) {
    const template = document.createElement('template');
    template.innerHTML = inputHtml || '';

    function sanitizeNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        return document.createTextNode(node.textContent || '');
      }

      if (node.nodeType !== Node.ELEMENT_NODE) {
        return document.createDocumentFragment();
      }

      const tagName = node.tagName.toUpperCase();
      const childFragment = document.createDocumentFragment();
      Array.from(node.childNodes).forEach((child) => childFragment.appendChild(sanitizeNode(child)));

      if (!ALLOWED_RICH_TAGS.has(tagName)) {
        return childFragment;
      }

      const cleanEl = document.createElement(tagName.toLowerCase());
      cleanEl.appendChild(childFragment);
      return cleanEl;
    }

    const output = document.createElement('div');
    Array.from(template.content.childNodes).forEach((node) => output.appendChild(sanitizeNode(node)));
    return output.innerHTML.trim();
  }

  function htmlToPlainText(html, { preserveLineBreaks = false } = {}) {
    const container = document.createElement('div');
    container.innerHTML = html || '';

    const lineBreakTags = new Set(['BR', 'P', 'DIV', 'LI']);
    const blockTags = new Set(['P', 'DIV', 'LI', 'UL', 'OL']);
    let output = '';

    function appendSeparator() {
      if (!output) return;
      if (output.endsWith('\n')) return;
      output += '\n';
    }

    function walk(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        output += node.textContent || '';
        return;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) {
        return;
      }

      const tag = node.tagName.toUpperCase();
      if (lineBreakTags.has(tag)) appendSeparator();
      Array.from(node.childNodes).forEach(walk);
      if (blockTags.has(tag)) appendSeparator();
    }

    Array.from(container.childNodes).forEach(walk);

    const normalized = output
      .replace(/\r/g, '')
      .replace(/\n[\t \f\v]+/g, '\n')
      .replace(/[\t \f\v]+\n/g, '\n')
      .replace(/[\t \f\v]+/g, ' ')
      .replace(/\n{2,}/g, '\n')
      .trim();

    if (!preserveLineBreaks) {
      return normalized.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
    }
    return normalized;
  }

  function markLocalDirty() {
    localDirtySince = Date.now();
    localStorage.setItem(LOCAL_DIRTY_SINCE_KEY, String(localDirtySince));
  }

  function clearLocalDirty() {
    localDirtySince = null;
    localStorage.removeItem(LOCAL_DIRTY_SINCE_KEY);
  }

  function extractTags(sourceText, regex) {
    if (!sourceText) return [];
    const matches = new Map();
    const matcher = new RegExp(regex);
    let match;
    while ((match = matcher.exec(sourceText)) !== null) {
      const tag = match[2];
      const key = tag.toLowerCase();
      if (!matches.has(key)) matches.set(key, tag);
    }
    return Array.from(matches.values());
  }

  function extractPersonTagsFromAction(action) {
    const sourceText = (typeof action?.text === 'string' && action.text.trim())
      ? action.text
      : htmlToPlainText(action?.html || action?.html_inline || '');
    return extractTags(sourceText, PERSON_TAG_REGEX);
  }

  function extractHashTagsFromAction(action) {
    const sourceText = (typeof action?.text === 'string' && action.text.trim())
      ? action.text
      : htmlToPlainText(action?.html || action?.html_inline || '');
    return extractTags(sourceText, HASH_TAG_REGEX);
  }

  function extractPersonTagsFromMeeting(item) {
    const notesSource = (typeof item?.notesText === 'string' && item.notesText.trim())
      ? item.notesText
      : htmlToPlainText(item?.notesHtml || '');
    return extractTags(`${item?.title || ''} ${notesSource}`.trim(), PERSON_TAG_REGEX);
  }

  function extractHashTagsFromMeeting(item) {
    const notesSource = (typeof item?.notesText === 'string' && item.notesText.trim())
      ? item.notesText
      : htmlToPlainText(item?.notesHtml || '');
    return extractTags(`${item?.title || ''} ${notesSource}`.trim(), HASH_TAG_REGEX);
  }

  function extractPersonTagsFromGeneralNote(item) {
    const notesSource = (typeof item?.text === 'string' && item.text.trim())
      ? item.text
      : htmlToPlainText(item?.html || '');
    return extractTags(`${item?.title || ''} ${notesSource}`.trim(), PERSON_TAG_REGEX);
  }

  function extractHashTagsFromGeneralNote(item) {
    const notesSource = (typeof item?.text === 'string' && item.text.trim())
      ? item.text
      : htmlToPlainText(item?.html || '');
    return extractTags(`${item?.title || ''} ${notesSource}`.trim(), HASH_TAG_REGEX);
  }

  function collectPersonTags() {
    if (privacyMode) return ['@Person'];
    const unique = new Map();
    [
      [lists.general.actions, extractPersonTagsFromAction],
      [lists.scheduling.actions, extractPersonTagsFromAction],
      [meeting.items, extractPersonTagsFromMeeting],
      [generalNotes.items, extractPersonTagsFromGeneralNote],
    ].forEach(([items, extractor]) => {
      items.forEach((item) => {
        if (item?.archived) return;
        extractor(item).forEach((tag) => {
          const key = tag.toLowerCase();
          if (!unique.has(key)) unique.set(key, tag);
        });
      });
    });

    return Array.from(unique.values()).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  }

  function collectHashTags() {
    if (privacyMode) return ['#Tag'];
    const unique = new Map();
    [
      [lists.general.actions, extractHashTagsFromAction],
      [lists.scheduling.actions, extractHashTagsFromAction],
      [meeting.items, extractHashTagsFromMeeting],
      [generalNotes.items, extractHashTagsFromGeneralNote],
    ].forEach(([items, extractor]) => {
      items.forEach((item) => {
        if (item?.archived) return;
        extractor(item).forEach((tag) => {
          const key = tag.toLowerCase();
          if (!unique.has(key)) unique.set(key, tag);
        });
      });
    });

    return Array.from(unique.values()).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  }

  function richHtmlToInlineHtml(html) {
    const source = sanitizeRichHtml(html || '');
    const container = document.createElement('div');
    container.innerHTML = source;

    function nodeToInline(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent || '';
      }
      if (node.nodeType !== Node.ELEMENT_NODE) {
        return '';
      }
      const tag = node.tagName.toUpperCase();
      if (tag === 'BR') return ' ';
      if (tag === 'P') {
        return Array.from(node.childNodes).map(nodeToInline).join(' ').trim();
      }
      if (tag === 'UL' || tag === 'OL') {
        const items = Array.from(node.children)
          .filter((child) => child.tagName && child.tagName.toUpperCase() === 'LI')
          .map((li) => `• ${Array.from(li.childNodes).map(nodeToInline).join(' ').replace(/\s+/g, ' ').trim()}`)
          .filter(Boolean);
        return items.join('; ');
      }
      if (tag === 'LI') {
        return Array.from(node.childNodes).map(nodeToInline).join(' ').trim();
      }
      if (['B', 'STRONG', 'I', 'EM', 'U'].includes(tag)) {
        const content = Array.from(node.childNodes).map(nodeToInline).join(' ').replace(/\s+/g, ' ').trim();
        return content ? `<${tag.toLowerCase()}>${content}</${tag.toLowerCase()}>` : '';
      }
      return Array.from(node.childNodes).map(nodeToInline).join(' ');
    }

    const inline = Array.from(container.childNodes).map(nodeToInline).join(' ').replace(/\s+/g, ' ').trim();
    return inline || htmlToPlainText(source);
  }


  function richHtmlToFirstLineInlineHtml(html) {
    const source = sanitizeRichHtml(html || '');
    const container = document.createElement('div');
    container.innerHTML = source;
    const firstLineText = htmlToPlainText(source, { preserveLineBreaks: true }).split(/\n/)[0]?.trim() || '';

    const state = { hitBoundary: false, seenBoundary: false };

    function nodeToFirstLine(node) {
      if (state.hitBoundary) return '';
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent || '';
      }
      if (node.nodeType !== Node.ELEMENT_NODE) {
        return '';
      }
      const tag = node.tagName.toUpperCase();
      if (tag === 'BR') {
        state.hitBoundary = true;
        state.seenBoundary = true;
        return '';
      }
      if (['P', 'DIV', 'LI'].includes(tag) && state.seenBoundary) {
        state.hitBoundary = true;
        return '';
      }

      const childContent = Array.from(node.childNodes).map(nodeToFirstLine).join(' ');

      if (['P', 'DIV', 'LI'].includes(tag)) {
        state.seenBoundary = true;
      }

      if (['B', 'STRONG', 'I', 'EM', 'U'].includes(tag)) {
        const normalized = childContent.replace(/\s+/g, ' ').trim();
        return normalized ? `<${tag.toLowerCase()}>${normalized}</${tag.toLowerCase()}>` : '';
      }
      if (tag === 'UL' || tag === 'OL') {
        const normalized = childContent.replace(/\s+/g, ' ').trim();
        return normalized ? `• ${normalized}` : '';
      }
      return childContent;
    }

    const firstLineHtml = Array.from(container.childNodes).map(nodeToFirstLine).join(' ').replace(/\s+/g, ' ').trim();
    const fullText = htmlToPlainText(source, { preserveLineBreaks: true });
    const lines = fullText ? fullText.split(/\n/) : [];
    const hasMoreLines = lines.slice(1).some((line) => line.trim());

    return {
      firstLineHtml: firstLineHtml || escapeHtml(firstLineText),
      firstLineText,
      hasMoreLines,
    };
  }

  function resolveThemePresetName(themeVars) {
    return Object.entries(THEMES).find(([, vars]) => {
      const normalized = normalizeTheme(vars);
      return Object.keys(normalized).every((key) => normalized[key] === themeVars[key]);
    })?.[0] || 'Custom';
  }

  function normalizeThemeState(themeLike) {
    const source = themeLike && typeof themeLike === 'object' ? themeLike : {};
    const varsSource = source.vars && typeof source.vars === 'object' ? source.vars : source;
    const vars = normalizeTheme(varsSource);
    const presetName = THEME_PRESET_NAMES.includes(source.presetName)
      ? source.presetName
      : resolveThemePresetName(vars);
    return { presetName, vars };
  }

  function ensureActionRichContent(action) {
    if (!action) {
      return;
    }
    if (!action.html && action.text) {
      action.html = textToRichHtml(action.text);
    }
    action.html = sanitizeRichHtml(action.html || textToRichHtml(action.text || '')) || textToRichHtml(action.text || '');
    action.html_inline = richHtmlToInlineHtml(action.html);
    action.text = htmlToPlainText(action.html);
  }

  function ensureMeetingRichContent(item) {
    if (!item) {
      return;
    }
    if (!item.notesHtml && item.notes) {
      item.notesHtml = textToRichHtml(item.notes);
    }
    item.notesHtml = sanitizeRichHtml(item.notesHtml || textToRichHtml(item.notes || '')) || textToRichHtml(item.notes || '');
    item.notesText = htmlToPlainText(item.notesHtml);
  }

  function normalizeBigTicketItem(item) {
    const html = sanitizeRichHtml(typeof item?.html === 'string' ? item.html : textToRichHtml(item?.text || ''));
    const text = htmlToPlainText(html);
    if (!text) return null;
    return {
      id: typeof item?.id === 'string' && item.id ? item.id : `ticket-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      html,
      html_inline: richHtmlToInlineHtml(typeof item?.html_inline === 'string' ? item.html_inline : html),
      text,
      urgencyLevel: Math.max(0, Math.min(URGENCY_LOW, Number.isInteger(item?.urgencyLevel) ? item.urgencyLevel : 0)),
      timingFlag: item?.timingFlag === 'T' || item?.timingFlag === 'D' ? item.timingFlag : (item?.timeDependent ? 'T' : null),
      createdAt: Number(item?.createdAt) || Date.now(),
      updatedAt: Number(item?.updatedAt) || Date.now(),
    };
  }

  function normalizeGeneralNote(item) {
    const title = typeof item?.title === 'string' ? item.title.trim() : '';
    const date = typeof item?.date === 'string' ? item.date : '';
    const html = sanitizeRichHtml(typeof item?.html === 'string' ? item.html : textToRichHtml(item?.text || ''));
    const text = htmlToPlainText(html);
    if (!title || !date || !text) return null;
    return {
      id: typeof item?.id === 'string' && item.id ? item.id : `gn-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      date,
      title,
      html,
      html_inline: richHtmlToInlineHtml(typeof item?.html_inline === 'string' ? item.html_inline : html),
      text,
      createdAt: Number(item?.createdAt) || Date.now(),
      updatedAt: Number(item?.updatedAt) || Date.now(),
      whiteboardDataUrl: typeof item?.whiteboardDataUrl === 'string' && item.whiteboardDataUrl.startsWith('data:image/') ? item.whiteboardDataUrl : null,
      whiteboardMeta: item?.whiteboardMeta && typeof item.whiteboardMeta === 'object' ? item.whiteboardMeta : null,
      whiteboardImages: Array.isArray(item?.whiteboardImages)
        ? item.whiteboardImages
          .map((img) => ({
            id: typeof img?.id === 'string' && img.id ? img.id : `wbi-${Date.now()}-${Math.random().toString(16).slice(2)}`,
            x: Number(img?.x) || 0,
            y: Number(img?.y) || 0,
            w: Math.max(1, Number(img?.w) || 1),
            h: Math.max(1, Number(img?.h) || 1),
            dataUrl: typeof img?.dataUrl === 'string' && img.dataUrl.startsWith('data:image/') ? img.dataUrl : null,
          }))
          .filter((img) => img.dataUrl)
        : [],
    };
  }

  function formatLocalDate(timestamp) {
    if (!timestamp) return '--/--';
    const date = new Date(timestamp);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
  }

  function formatWeekday(date) {
    return date.toLocaleDateString('en-GB', { weekday: 'short' });
  }

  function formatTime24(date) {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  function getWeekCommencingMonday(dateInput) {
    const date = new Date(dateInput);
    date.setHours(0, 0, 0, 0);
    const day = date.getDay();
    date.setDate(date.getDate() + (day === 0 ? -6 : 1 - day));
    return date;
  }

  function dateToDateValue(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  function dateToTimeValue(date) {
    const minutes = date.getMinutes();
    const validMinute = ALLOWED_MINUTES.includes(String(minutes).padStart(2, '0')) ? minutes : 0;
    return `${String(date.getHours()).padStart(2, '0')}:${String(validMinute).padStart(2, '0')}`;
  }

  function roundToNearestQuarterHour(date) {
    const quarterMs = 15 * 60 * 1000;
    return new Date(Math.round(date.getTime() / quarterMs) * quarterMs);
  }


  function buildTimeValue(hourValue, minuteValue) {
    const hour = String(hourValue || '').padStart(2, '0');
    const minute = String(minuteValue || '').padStart(2, '0');
    return `${hour}:${minute}`;
  }

  function populateHourOptions(selectEl) {
    if (!selectEl || selectEl.options.length) return;
    for (let hour = 0; hour < 24; hour += 1) {
      const value = String(hour).padStart(2, '0');
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      selectEl.appendChild(option);
    }
  }

  function parseLocalDateTime(dateValue, timeValue) {
    if (!dateValue || !timeValue) return null;
    const [year, month, day] = dateValue.split('-').map(Number);
    const [hour, minute] = timeValue.split(':').map(Number);
    if (![year, month, day, hour, minute].every(Number.isFinite)) return null;
    const parsed = new Date(year, month - 1, day, hour, minute, 0, 0);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  function buildPrefix(action) {
    if (action.deleted) return `<span class="prefix-mark">X</span>${formatLocalDate(action.deletedAt)}`;
    if (action.completed) return `<span class="prefix-mark">C</span>${formatLocalDate(action.completedAt)}`;
    return formatLocalDate(action.createdAt);
  }

  function normalizeAction(item, options = {}) {
    const requireNumber = options.requireNumber !== false;
    const number = Number(item?.number);
    const text = typeof item?.text === 'string' ? item.text.trim() : '';
    const html = typeof item?.html === 'string' ? item.html : '';
    const createdAt = Number(item?.createdAt) || Date.now();
    const completedAt = Number(item?.completedAt) || null;
    const deletedAt = Number(item?.deletedAt) || null;
    const status = typeof item?.status === 'string' ? item.status.toLowerCase() : '';

    if ((requireNumber && !Number.isInteger(number)) || (!text && !html)) return null;

    const completed = Boolean(item?.completed || completedAt || status === 'completed');
    const deleted = Boolean(item?.deleted || deletedAt || status === 'deleted');
    const urgencyLevelRaw = Number.isInteger(item?.urgencyLevel) ? item.urgencyLevel : Number.isInteger(item?.urgency) ? item.urgency : item?.urgent ? 1 : 0;
    const urgencyLevel = Math.max(0, Math.min(URGENCY_LOW, urgencyLevelRaw));

    const normalized = {
      text,
      html,
      html_inline: richHtmlToInlineHtml(typeof item?.html_inline === 'string' ? item.html_inline : html),
      createdAt,
      completed,
      deleted,
      archived: Boolean(item?.archived || item?.purgedFromUI),
      urgencyLevel,
      timingFlag: item?.timingFlag === 'T' || item?.timingFlag === 'D' ? item.timingFlag : (item?.timeDependent ? 'T' : null),
      updatedAt: Number(item?.updatedAt) || createdAt,
      completedAt: completed ? completedAt || createdAt : null,
      deletedAt: deleted ? deletedAt || createdAt : null,
    };

    if (requireNumber) {
      normalized.number = number;
    } else {
      normalized.id = typeof item?.id === 'string' && item.id
        ? item.id
        : `${options.idPrefix || 'act'}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }

    ensureActionRichContent(normalized);
    return normalized;
  }

  function normalizeMeeting(item) {
    const title = typeof item.title === 'string' ? item.title.trim() : '';
    const date = new Date(item.datetime);
    if (!title || Number.isNaN(date.getTime())) return null;

    const normalized = {
      id: typeof item.id === 'string' && item.id ? item.id : `meeting-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title,
      datetime: date.toISOString(),
      notesHtml: typeof item.notesHtml === 'string' ? item.notesHtml : '',
      notes: typeof item.notes === 'string' ? item.notes : '',
      notesText: typeof item.notesText === 'string' ? item.notesText : '',
      createdAt: item.createdAt || null,
      updatedAt: item.updatedAt || null,
      draft: item?.draft === true,
      recorded: item?.recorded === true,
    };

    ensureMeetingRichContent(normalized);
    return normalized;
  }

  function saveList(list) {
    if (!canMutateData()) return;
    syncAppStateFromMemory();
    markLocalDirty();
    localStorage.setItem(list.key, JSON.stringify(list.actions));
    if (!suppressAutosync) requestAutosync();
  }

  function saveMeetings() {
    if (!canMutateData()) return;
    syncAppStateFromMemory();
    markLocalDirty();
    localStorage.setItem(MEETING_STORAGE_KEY, JSON.stringify(meeting.items));
    if (!suppressAutosync) requestAutosync();
  }

  function saveBigTicketItems() {
    if (!canMutateData()) return;
    syncAppStateFromMemory();
    markLocalDirty();
    localStorage.setItem('bigTicketItems', JSON.stringify(bigTicket.items));
    if (!suppressAutosync) requestAutosync();
  }

  function saveGeneralNotes() {
    if (!canMutateData()) return;
    syncAppStateFromMemory();
    markLocalDirty();
    localStorage.setItem('generalNotes', JSON.stringify(generalNotes.items));
    if (!suppressAutosync) requestAutosync();
  }

  function saveUiState(options = {}) {
    if (!canMutateData() && options.privacyBypass !== true) return;
    const shouldMarkDirty = options.markDirty !== false;
    const shouldAutosync = options.autosync !== false;
    syncAppStateFromMemory();
    if (shouldMarkDirty) markLocalDirty();
    localStorage.setItem('dashboardUiState', JSON.stringify(uiState));
    if (shouldAutosync && !suppressAutosync) requestAutosync();
  }

  function saveMeetingUIState() {
    if (!canMutateData()) return;
    syncAppStateFromMemory();
    markLocalDirty();
    localStorage.setItem(MEETING_UI_STORAGE_KEY, JSON.stringify(meeting.uiState));
    if (!suppressAutosync) requestAutosync();
  }

  function saveNextNumber() {
    if (!canMutateData()) return;
    syncAppStateFromMemory();
    markLocalDirty();
    localStorage.setItem(NEXT_NUMBER_STORAGE_KEY, String(nextActionNumber));
    localStorage.setItem(LOCAL_STATE_VERSION_KEY, String(LATEST_STATE_VERSION));
    if (!suppressAutosync) requestAutosync();
  }

  function loadList(list) {
    try {
      const raw = localStorage.getItem(list.key);
      list.actions = raw
        ? (Array.isArray(JSON.parse(raw))
          ? JSON.parse(raw)
            .map((item) => normalizeAction(item, { requireNumber: !list.hideNumber, idPrefix: list.idPrefix }))
            .filter(Boolean)
          : [])
        : [];
    } catch {
      list.actions = [];
    }
  }

  function loadMeetings() {
    try {
      const raw = localStorage.getItem(MEETING_STORAGE_KEY);
      meeting.items = raw ? (Array.isArray(JSON.parse(raw)) ? JSON.parse(raw).map(normalizeMeeting).filter(Boolean) : []) : [];
    } catch {
      meeting.items = [];
    }
  }

  function loadMeetingUIState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(MEETING_UI_STORAGE_KEY) || '{}');
      meeting.uiState = {
        collapsedMonths: parsed.collapsedMonths && typeof parsed.collapsedMonths === 'object' ? parsed.collapsedMonths : {},
        collapsedWeeks: parsed.collapsedWeeks && typeof parsed.collapsedWeeks === 'object' ? parsed.collapsedWeeks : {},
      };
    } catch {
      meeting.uiState = { collapsedMonths: {}, collapsedWeeks: {} };
    }
  }

  function loadBigTicketItems() {
    const parsed = parseStoredJson(localStorage.getItem('bigTicketItems'), []);
    bigTicket.items = Array.isArray(parsed) ? parsed.map(normalizeBigTicketItem).filter(Boolean) : [];
  }

  function loadGeneralNotes() {
    const parsed = parseStoredJson(localStorage.getItem('generalNotes'), []);
    generalNotes.items = Array.isArray(parsed) ? parsed.map(normalizeGeneralNote).filter(Boolean) : [];
  }

  function normalizeTheme(themeLike) {
    const source = themeLike && typeof themeLike === 'object' ? themeLike : {};
    return {
      bannerBg: typeof source.bannerBg === 'string' ? source.bannerBg : defaultTheme.bannerBg,
      bannerFg: typeof source.bannerFg === 'string' ? source.bannerFg : defaultTheme.bannerFg,
      pageBg: typeof source.pageBg === 'string' ? source.pageBg : defaultTheme.pageBg,
      cardHeaderBg: typeof source.cardHeaderBg === 'string' ? source.cardHeaderBg : defaultTheme.cardHeaderBg,
      cardHeaderFg: typeof source.cardHeaderFg === 'string' ? source.cardHeaderFg : defaultTheme.cardHeaderFg,
    };
  }

  function applyTheme(themeLike) {
    const theme = normalizeTheme(themeLike);
    const root = document.documentElement;
    root.style.setProperty('--banner-bg', theme.bannerBg);
    root.style.setProperty('--banner-fg', theme.bannerFg);
    root.style.setProperty('--page-bg', theme.pageBg);
    root.style.setProperty('--card-header-bg', theme.cardHeaderBg);
    root.style.setProperty('--card-header-fg', theme.cardHeaderFg);
  }


  function normalizeCardLayout(layoutLike) {
    const expectedCards = Object.keys(collapsedCardsDefault);
    const sourceColumns = Array.isArray(layoutLike?.columns) ? layoutLike.columns : [];
    const seen = new Set();
    const columns = cardLayoutDefault.columns.map((defaultColumn, columnIndex) => {
      const sourceColumn = Array.isArray(sourceColumns[columnIndex]) ? sourceColumns[columnIndex] : [];
      const normalized = sourceColumn.filter((cardId) => expectedCards.includes(cardId) && !seen.has(cardId));
      normalized.forEach((cardId) => seen.add(cardId));
      return normalized;
    });

    expectedCards.forEach((cardId) => {
      if (seen.has(cardId)) return;
      const fallbackColumnIndex = cardLayoutDefault.columns.findIndex((column) => column.includes(cardId));
      const targetColumnIndex = fallbackColumnIndex >= 0 ? fallbackColumnIndex : 0;
      columns[targetColumnIndex].push(cardId);
      seen.add(cardId);
    });

    return { columns };
  }

  function findCardLayoutPosition(cardId) {
    for (let columnIndex = 0; columnIndex < uiState.cardLayout.columns.length; columnIndex += 1) {
      const cardIndex = uiState.cardLayout.columns[columnIndex].indexOf(cardId);
      if (cardIndex >= 0) {
        return { columnIndex, cardIndex };
      }
    }
    return null;
  }

  function arrangeCardsByLayout() {
    if (!columnsSection) return;
    const columnStacks = cardColumnClassNames.map((className) => columnsSection.querySelector(`.${className}`)).filter(Boolean);
    if (columnStacks.length !== cardColumnClassNames.length) return;
    const cardsById = new Map([...columnsSection.querySelectorAll('.collapsible-card')].map((card) => [card.dataset.cardId, card]));

    uiState.cardLayout.columns.forEach((cardIds, columnIndex) => {
      const stack = columnStacks[columnIndex];
      if (!stack) return;
      cardIds.forEach((cardId) => {
        const card = cardsById.get(cardId);
        if (!card) return;
        stack.appendChild(card);
      });
    });
  }

  function loadUiState() {
    const parsed = parseStoredJson(localStorage.getItem('dashboardUiState'), {});
    uiState.collapsedCards = {
      ...collapsedCardsDefault,
      ...(parsed?.collapsedCards && typeof parsed.collapsedCards === 'object' ? parsed.collapsedCards : {}),
    };
    uiState.cardLayout = Array.isArray(parsed?.cardLayout) ? parsed.cardLayout : [];
    uiState.collapsedGeneralNotesMonths = parsed?.collapsedGeneralNotesMonths && typeof parsed.collapsedGeneralNotesMonths === 'object'
      ? parsed.collapsedGeneralNotesMonths
      : {};
    uiState.cardLayout = normalizeCardLayout(parsed?.cardLayout);
    uiState.theme = normalizeThemeState(parsed?.theme);
    uiState.dashboardTitle = typeof parsed?.dashboardTitle === 'string' && parsed.dashboardTitle.trim()
      ? parsed.dashboardTitle.trim()
      : DEFAULT_DASHBOARD_TITLE;
    uiState.personFilter = typeof parsed?.personFilter === 'string' && parsed.personFilter.trim()
      ? parsed.personFilter.trim()
      : 'All';
    uiState.tagFilter = typeof parsed?.tagFilter === 'string' && parsed.tagFilter.trim()
      ? parsed.tagFilter.trim()
      : 'All';
    const searchQuery = parsed?.searchQuery;
    uiState.searchQuery = typeof searchQuery === 'string'
      ? searchQuery
      : (typeof searchQuery?.general === 'string' ? searchQuery.general : '');
    generalNotes.uiState.collapsedMonths = uiState.collapsedGeneralNotesMonths;
    applyTheme(uiState.theme.vars);
  }

  function migrateLegacyGeneralData() {
    if (localStorage.getItem(GENERAL_STORAGE_KEY)) return;
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!legacyRaw) return;
    try {
      const parsed = JSON.parse(legacyRaw);
      if (Array.isArray(parsed.actions)) {
        lists.general.actions = parsed.actions.map(normalizeAction).filter(Boolean);
        saveList(lists.general);
      }
      if (!localStorage.getItem(NEXT_NUMBER_STORAGE_KEY) && Number.isInteger(parsed.nextNumber) && parsed.nextNumber > 0) {
        nextActionNumber = parsed.nextNumber;
        saveNextNumber();
      }
    } catch {
      // keep defaults
    }
  }


  function parseStoredJson(value, fallback) {
    if (typeof value !== 'string' || !value) return fallback;
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function migrateState(rawState) {
    const incoming = rawState && typeof rawState === 'object' ? rawState : {};
    const versionValue = Number(incoming.stateVersion);
    const baseState = {
      stateVersion: Number.isInteger(versionValue) && versionValue > 0 ? versionValue : 1,
      generalActions: Array.isArray(incoming.generalActions) ? incoming.generalActions.map((item) => normalizeAction(item, { requireNumber: true, idPrefix: 'act' })).filter(Boolean) : [],
      personalActions: Array.isArray(incoming.personalActions) ? incoming.personalActions.map((item) => normalizeAction(item, { requireNumber: false, idPrefix: 'pact' })).filter(Boolean) : [],
      schedulingActions: Array.isArray(incoming.schedulingActions) ? incoming.schedulingActions.map((item) => normalizeAction(item, { requireNumber: true, idPrefix: 'act' })).filter(Boolean) : [],
      meetingNotes: Array.isArray(incoming.meetingNotes) ? incoming.meetingNotes.map(normalizeMeeting).filter(Boolean) : [],
      bigTicketItems: Array.isArray(incoming.bigTicketItems) ? incoming.bigTicketItems.map(normalizeBigTicketItem).filter(Boolean) : [],
      generalNotes: Array.isArray(incoming.generalNotes) ? incoming.generalNotes.map(normalizeGeneralNote).filter(Boolean) : [],
      ui: incoming.ui && typeof incoming.ui === 'object' ? incoming.ui : {},
      meetingNotesUIState: incoming.meetingNotesUIState && typeof incoming.meetingNotesUIState === 'object'
        ? {
          collapsedMonths: incoming.meetingNotesUIState.collapsedMonths && typeof incoming.meetingNotesUIState.collapsedMonths === 'object' ? incoming.meetingNotesUIState.collapsedMonths : {},
          collapsedWeeks: incoming.meetingNotesUIState.collapsedWeeks && typeof incoming.meetingNotesUIState.collapsedWeeks === 'object' ? incoming.meetingNotesUIState.collapsedWeeks : {},
        }
        : { collapsedMonths: {}, collapsedWeeks: {} },
      nextActionNumber: Number.isInteger(Number(incoming.nextActionNumber)) && Number(incoming.nextActionNumber) > 0
        ? Number(incoming.nextActionNumber)
        : DEFAULT_NEXT_NUMBER,
    };

    if (baseState.stateVersion < 2) {
      baseState.bigTicketItems = baseState.bigTicketItems || [];
      baseState.generalNotes = baseState.generalNotes || [];
      baseState.ui = {
        collapsedCards: {
          ...collapsedCardsDefault,
          ...(baseState.ui.collapsedCards && typeof baseState.ui.collapsedCards === 'object' ? baseState.ui.collapsedCards : {}),
        },
      };
      baseState.stateVersion = 2;
    }

    if (baseState.stateVersion < 3) {
      baseState.ui = {
        ...baseState.ui,
        collapsedGeneralNotesMonths: baseState.ui.collapsedGeneralNotesMonths && typeof baseState.ui.collapsedGeneralNotesMonths === 'object' ? baseState.ui.collapsedGeneralNotesMonths : {},
        theme: normalizeThemeState(baseState.ui.theme),
      };
      baseState.stateVersion = 3;
    }

    if (baseState.stateVersion < 4) {
      baseState.generalActions.forEach(ensureActionRichContent);
      baseState.schedulingActions.forEach(ensureActionRichContent);
      baseState.bigTicketItems = baseState.bigTicketItems.map(normalizeBigTicketItem).filter(Boolean);
      baseState.generalNotes = baseState.generalNotes.map(normalizeGeneralNote).filter(Boolean);
      baseState.ui = { ...baseState.ui, theme: normalizeThemeState(baseState.ui.theme) };
      baseState.stateVersion = 4;
    }

    if (baseState.stateVersion < 5) {
      baseState.ui = {
        ...baseState.ui,
        theme: normalizeThemeState(baseState.ui.theme),
        dashboardTitle: typeof baseState.ui.dashboardTitle === 'string' && baseState.ui.dashboardTitle.trim()
          ? baseState.ui.dashboardTitle.trim()
          : DEFAULT_DASHBOARD_TITLE,
      };
      baseState.stateVersion = 5;
    }


    if (baseState.stateVersion < 6) {
      baseState.generalActions = baseState.generalActions.map((item) => ({ ...item, timingFlag: item?.timingFlag === 'T' || item?.timingFlag === 'D' ? item.timingFlag : (item?.timeDependent ? 'T' : null) }));
      baseState.schedulingActions = baseState.schedulingActions.map((item) => ({ ...item, timingFlag: item?.timingFlag === 'T' || item?.timingFlag === 'D' ? item.timingFlag : (item?.timeDependent ? 'T' : null) }));
      baseState.personalActions = Array.isArray(baseState.personalActions) ? baseState.personalActions.map((item) => ({ ...item, timingFlag: item?.timingFlag === 'T' || item?.timingFlag === 'D' ? item.timingFlag : (item?.timeDependent ? 'T' : null) })) : [];
      baseState.ui = {
        ...baseState.ui,
        collapsedCards: {
          ...collapsedCardsDefault,
          ...(baseState.ui.collapsedCards && typeof baseState.ui.collapsedCards === 'object' ? baseState.ui.collapsedCards : {}),
        },
      };
      baseState.stateVersion = 6;
    }

    if (baseState.stateVersion < 7) {
      baseState.bigTicketItems = baseState.bigTicketItems.map((item) => ({
        ...item,
        urgencyLevel: Math.max(0, Math.min(URGENCY_LOW, Number.isInteger(item?.urgencyLevel) ? item.urgencyLevel : 0)),
        timingFlag: item?.timingFlag === 'T' || item?.timingFlag === 'D' ? item.timingFlag : (item?.timeDependent ? 'T' : null),
      }));
      baseState.stateVersion = 7;
    }


    if (baseState.stateVersion < 9) {
      baseState.generalActions = baseState.generalActions.map((item) => ({
        ...item,
        urgencyLevel: Math.max(0, Math.min(URGENCY_LOW, Number.isInteger(item?.urgencyLevel) ? item.urgencyLevel : 0)),
        timingFlag: item?.timingFlag === 'T' || item?.timingFlag === 'D' ? item.timingFlag : (item?.timeDependent ? 'T' : null),
      }));
      baseState.schedulingActions = baseState.schedulingActions.map((item) => ({
        ...item,
        urgencyLevel: Math.max(0, Math.min(URGENCY_LOW, Number.isInteger(item?.urgencyLevel) ? item.urgencyLevel : 0)),
        timingFlag: item?.timingFlag === 'T' || item?.timingFlag === 'D' ? item.timingFlag : (item?.timeDependent ? 'T' : null),
      }));
      baseState.personalActions = Array.isArray(baseState.personalActions)
        ? baseState.personalActions.map((item) => ({
          ...item,
          urgencyLevel: Math.max(0, Math.min(URGENCY_LOW, Number.isInteger(item?.urgencyLevel) ? item.urgencyLevel : 0)),
          timingFlag: item?.timingFlag === 'T' || item?.timingFlag === 'D' ? item.timingFlag : (item?.timeDependent ? 'T' : null),
        }))
        : [];
      baseState.stateVersion = 9;
    }

    if (baseState.stateVersion < 10) {
      const ensureArchivedDefault = (item) => ({ ...item, archived: Boolean(item?.archived || item?.purgedFromUI) });
      baseState.generalActions = baseState.generalActions.map(ensureArchivedDefault);
      baseState.schedulingActions = baseState.schedulingActions.map(ensureArchivedDefault);
      baseState.personalActions = Array.isArray(baseState.personalActions) ? baseState.personalActions.map(ensureArchivedDefault) : [];
      baseState.stateVersion = 10;
    }

    if (baseState.stateVersion < 12) {
      baseState.ui = {
        ...baseState.ui,
        cardLayout: normalizeCardLayout(baseState.ui?.cardLayout),
      };
      baseState.stateVersion = 12;
    }

    if (baseState.stateVersion < LATEST_STATE_VERSION) {
      baseState.stateVersion = LATEST_STATE_VERSION;
    }

    baseState.ui = {
      collapsedCards: {
        ...collapsedCardsDefault,
        ...(baseState.ui.collapsedCards && typeof baseState.ui.collapsedCards === 'object' ? baseState.ui.collapsedCards : {}),
      },
      cardLayout: Array.isArray(baseState.ui.cardLayout) ? baseState.ui.cardLayout : [],
      collapsedGeneralNotesMonths: baseState.ui.collapsedGeneralNotesMonths && typeof baseState.ui.collapsedGeneralNotesMonths === 'object' ? baseState.ui.collapsedGeneralNotesMonths : {},
      cardLayout: normalizeCardLayout(baseState.ui.cardLayout),
      theme: normalizeThemeState(baseState.ui.theme),
      dashboardTitle: typeof baseState.ui.dashboardTitle === 'string' && baseState.ui.dashboardTitle.trim()
        ? baseState.ui.dashboardTitle.trim()
        : DEFAULT_DASHBOARD_TITLE,
      personFilter: typeof baseState.ui.personFilter === 'string' && baseState.ui.personFilter.trim()
        ? baseState.ui.personFilter.trim()
        : 'All',
      tagFilter: typeof baseState.ui.tagFilter === 'string' && baseState.ui.tagFilter.trim()
        ? baseState.ui.tagFilter.trim()
        : 'All',
      searchQuery: typeof baseState.ui.searchQuery === 'string' ? baseState.ui.searchQuery : '',
    };

    const highest = Math.max(DEFAULT_NEXT_NUMBER - 1, ...baseState.generalActions.map((i) => i.number), ...baseState.schedulingActions.map((i) => i.number));
    if (baseState.nextActionNumber <= highest) {
      baseState.nextActionNumber = highest + 1;
    }

    return baseState;
  }

  function withAutosyncSuppressed(callback) {
    suppressAutosync = true;
    try {
      return callback();
    } finally {
      suppressAutosync = false;
    }
  }

  function getStateSnapshotFromMemory() {
    return migrateState({
      stateVersion: appState.stateVersion,
      generalActions: appState.generalActions,
      personalActions: appState.personalActions,
      schedulingActions: appState.schedulingActions,
      meetingNotes: appState.meetingNotes,
      bigTicketItems: appState.bigTicketItems,
      generalNotes: appState.generalNotes,
      ui: appState.ui,
      meetingNotesUIState: appState.meetingNotesUIState,
      nextActionNumber: appState.nextActionNumber,
    });
  }

  function syncAppStateFromMemory() {
    appState.stateVersion = LATEST_STATE_VERSION;
    appState.generalActions = lists.general.actions;
    appState.personalActions = lists.personal.actions;
    appState.schedulingActions = lists.scheduling.actions;
    appState.meetingNotes = meeting.items;
    appState.bigTicketItems = bigTicket.items;
    appState.generalNotes = generalNotes.items;
    appState.ui = {
      collapsedCards: uiState.collapsedCards,
      cardLayout: uiState.cardLayout,
      collapsedGeneralNotesMonths: uiState.collapsedGeneralNotesMonths,
      cardLayout: uiState.cardLayout,
      theme: uiState.theme,
      dashboardTitle: uiState.dashboardTitle,
      personFilter: uiState.personFilter || 'All',
      tagFilter: uiState.tagFilter || 'All',
      searchQuery: typeof uiState.searchQuery === 'string' ? uiState.searchQuery : '',
    };
    appState.meetingNotesUIState = meeting.uiState;
    appState.nextActionNumber = nextActionNumber;
  }

  function getLocalDashboardState() {
    return getStateSnapshotFromMemory();
  }

  function hydrateFromLocalCacheAndRender() {
    loadData();
    syncAppStateFromMemory();
    renderAll();
  }

  function setLocalDashboardState(stateObj, options = {}) {
    const state = migrateState(stateObj);
    withAutosyncSuppressed(() => {
      localStorage.setItem(GENERAL_STORAGE_KEY, JSON.stringify(state.generalActions));
      localStorage.setItem('personalActions', JSON.stringify(state.personalActions));
      localStorage.setItem(SCHEDULING_STORAGE_KEY, JSON.stringify(state.schedulingActions));
      localStorage.setItem(MEETING_STORAGE_KEY, JSON.stringify(state.meetingNotes));
      localStorage.setItem('bigTicketItems', JSON.stringify(state.bigTicketItems));
      localStorage.setItem('generalNotes', JSON.stringify(state.generalNotes));
      localStorage.setItem('dashboardUiState', JSON.stringify(state.ui));
      localStorage.setItem(MEETING_UI_STORAGE_KEY, JSON.stringify(state.meetingNotesUIState));
      localStorage.setItem(NEXT_NUMBER_STORAGE_KEY, String(state.nextActionNumber));
      localStorage.setItem(LOCAL_STATE_VERSION_KEY, String(state.stateVersion || LATEST_STATE_VERSION));
      loadData();
      syncAppStateFromMemory();
      if (options.markDirty) {
        markLocalDirty();
      } else {
        clearLocalDirty();
      }
      renderAll();
    });
  }

  function formatCloudTimestamp(value) {
    if (!value) return null;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed.toLocaleString('en-GB', { hour12: false });
  }

  function updateCloudMeta() {
    const email = renderEmailForPrivacy(cloud.signedInUser?.email || '—');
    if (cloud.signedInEmailEl) {
      cloud.signedInEmailEl.textContent = email;
    }
    const label = formatCloudTimestamp(cloud.lastSyncedAt) || 'Never';
    if (cloud.signedInUser && !cloud.busy && !cloud.syncInFlight) {
      setStatus(`Synced — Last synced: ${label}`, 'success', { toast: false });
    }
  }

  function markLastSynced(timestamp, cloudUpdatedAt = null) {
    cloud.lastSyncedAt = timestamp || new Date().toISOString();
    localStorage.setItem(CLOUD_LAST_SYNCED_AT_KEY, cloud.lastSyncedAt);
    if (cloudUpdatedAt) {
      cloud.lastCloudUpdatedAt = cloudUpdatedAt;
      localStorage.setItem(CLOUD_LAST_UPDATED_AT_KEY, cloudUpdatedAt);
    }
    updateCloudMeta();
  }

  function showToast(message, type = 'info') {
    if (!cloud.toastContainer || !message) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    cloud.toastContainer.appendChild(toast);
    window.setTimeout(() => {
      toast.remove();
    }, 3600);
  }

  function setStatus(message, type = 'info', options = {}) {
    if (!cloud.statusEl) return;
    const normalizedType = ['info', 'success', 'warning', 'error', 'loading'].includes(type) ? type : 'info';
    const nextMessage = message || 'Ready';
    cloud.statusEl.textContent = nextMessage;
    cloud.statusEl.className = `cloud-status cloud-status-${normalizedType}`;
    const shouldToast = options.toast !== false;
    const criticalToast = normalizedType === 'error' || normalizedType === 'warning';
    if (normalizedType !== 'loading' && shouldToast && criticalToast) {
      showToast(nextMessage, normalizedType === 'warning' ? 'warning' : normalizedType);
    }
  }

  function showTransientStatus(message, type = 'info', durationMs = 3000) {
    if (!message) return;
    const now = Date.now();
    if (message === lastTransientStatusMessage && now - lastTransientStatusShownAt < 1000) return;
    lastTransientStatusMessage = message;
    lastTransientStatusShownAt = now;
    if (transientStatusTimer) {
      window.clearTimeout(transientStatusTimer);
      transientStatusTimer = null;
    }
    setStatus(message, type, { toast: false });
    transientStatusTimer = window.setTimeout(() => {
      transientStatusTimer = null;
      if (cloud.signedInUser && !cloud.busy && !cloud.syncInFlight) {
        updateCloudMeta();
      } else {
        setStatus('Ready', 'info', { toast: false });
      }
    }, durationMs);
  }

  function setLoading(isLoading, context = '') {
    cloud.busy = Boolean(isLoading);
    cloud.loadingContext = context || '';
    updateCloudUi();

    if (!isLoading) return;
    const label = {
      signIn: 'Signing in…',
      authLoad: 'Loading from cloud…',
      export: 'Preparing backup export…',
      import: 'Importing backup…',
    }[context] || 'Loading…';
    setStatus(label, 'loading');
  }

  function setSyncIndicator(isSyncing) {
    cloud.syncInFlight = Boolean(isSyncing);
    updateCloudUi();
    if (isSyncing) {
      setStatus('Syncing…', 'loading');
    }
  }

  function updateCloudUi() {
    const signedIn = Boolean(cloud.signedInUser);
    cloud.signOutBtn.hidden = !signedIn;
    cloud.signInBtn.hidden = signedIn;
    cloud.exportBtn.hidden = !signedIn;
    cloud.importBtn.hidden = !signedIn;
    cloud.settingsBtn.hidden = !signedIn;
    cloud.collapseAllBtn.hidden = !signedIn;
    cloud.signedInDisplay.hidden = !signedIn;
    cloud.emailInput.hidden = signedIn;
    cloud.passwordInput.hidden = signedIn;
    cloud.statusEl.hidden = false;
    cloud.exportBtn.disabled = cloud.busy || !signedIn;
    cloud.importBtn.disabled = cloud.busy || !signedIn || cloud.syncInFlight;
    cloud.signInBtn.disabled = cloud.busy || cloud.syncInFlight || signedIn;
    cloud.signOutBtn.disabled = cloud.busy || !signedIn;
    cloud.settingsBtn.disabled = cloud.busy || !signedIn || cloud.syncInFlight;
    cloud.collapseAllBtn.disabled = cloud.busy || !signedIn || cloud.syncInFlight;
    cloud.emailInput.disabled = cloud.busy || signedIn || cloud.syncInFlight;
    cloud.passwordInput.disabled = cloud.busy || cloud.syncInFlight || signedIn;

    if (cloud.busy || cloud.loadingContext || cloud.syncInFlight) {
      cloud.statusEl.classList.toggle('cloud-status-loading', true);
    }

    if (!signedIn && !cloud.busy && !cloud.syncInFlight) {
      setStatus('Ready', 'info', { toast: false });
    }
    updateCloudMeta();
  }

  function renderSignedOutState() {
    [lists.general, lists.personal, lists.scheduling].forEach((list) => {
      list.listEl.innerHTML = '';
    });
    meeting.listEl.innerHTML = '';
    bigTicket.listEl.innerHTML = '';
    generalNotes.listEl.innerHTML = '';
  }

  function applyAuthUiState(options = {}) {
    const signedIn = Boolean(cloud.signedInUser);
    isAuthenticated = signedIn;

    [lists.general, lists.personal, lists.scheduling].forEach((list) => {
      list.form.hidden = !signedIn;
      list.clearBtn.hidden = !signedIn;
    });
    meeting.form.hidden = !signedIn;

    updateCloudUi();

    mainContainer.classList.toggle('is-signed-out', !signedIn);
    if (columnsSection) {
      columnsSection.hidden = !signedIn;
    }
    if (signedOutMessage) {
      signedOutMessage.hidden = signedIn;
    }
    if (globalFilterBar) {
      globalFilterBar.hidden = !signedIn;
    }

    if (!signedIn) {
      renderSignedOutState();
      closeModal(true);
      closeMeetingBigEdit();
      closeBigTicketModal(true);
      closeGeneralNoteBigEdit();
      return;
    }

    if (options.deferRender) {
      return;
    }

    renderAll();
  }

  function emptyDashboardState() {
    return migrateState({
      stateVersion: LATEST_STATE_VERSION,
      generalActions: [],
      personalActions: [],
      schedulingActions: [],
      meetingNotes: [],
      bigTicketItems: [],
      generalNotes: [],
      ui: {
      collapsedCards: { ...collapsedCardsDefault },
      collapsedGeneralNotesMonths: {},
      cardLayout: structuredClone(cardLayoutDefault),
      theme: { presetName: 'Office Blue', vars: { ...defaultTheme } },
      dashboardTitle: DEFAULT_DASHBOARD_TITLE,
      personFilter: 'All',
      tagFilter: 'All',
      searchQuery: '',
    },
      meetingNotesUIState: { collapsedMonths: {}, collapsedWeeks: {} },
      nextActionNumber: DEFAULT_NEXT_NUMBER,
    });
  }

  function loadData() {
    withAutosyncSuppressed(() => {
      const storedNext = Number(localStorage.getItem(NEXT_NUMBER_STORAGE_KEY));
      if (Number.isInteger(storedNext) && storedNext > 0) nextActionNumber = storedNext;

      migrateLegacyGeneralData();
      loadList(lists.general);
      loadList(lists.personal);
      loadList(lists.scheduling);
      loadMeetings();
      loadMeetingUIState();
      loadBigTicketItems();
      loadGeneralNotes();
      loadUiState();

      const highest = Math.max(DEFAULT_NEXT_NUMBER - 1, ...lists.general.actions.map((i) => i.number), ...lists.scheduling.actions.map((i) => i.number));
      if (nextActionNumber <= highest) {
        nextActionNumber = highest + 1;
        saveNextNumber();
      }

      localStorage.setItem(LOCAL_STATE_VERSION_KEY, String(LATEST_STATE_VERSION));
      saveList(lists.general);
      saveList(lists.personal);
      saveList(lists.scheduling);
      saveMeetings();
      saveBigTicketItems();
      saveGeneralNotes();
      saveUiState();
      syncAppStateFromMemory();
    });
  }

  function sortNewestFirst(a, b) {
    return b.createdAt - a.createdAt || (Number(b.number) || 0) - (Number(a.number) || 0);
  }

  function sortWithinUrgencyTier(a, b) {
    const aIsTimeDependent = a.timingFlag === 'T';
    const bIsTimeDependent = b.timingFlag === 'T';
    if (aIsTimeDependent !== bIsTimeDependent) return aIsTimeDependent ? -1 : 1;
    return sortNewestFirst(a, b);
  }

  function getActionIdentifier(list, action) {
    return String(list.hideNumber ? action.id : action.number);
  }

  function queueMovedActionHighlight(list, action) {
    const key = `${list.key}:${getActionIdentifier(list, action)}`;
    const existing = movedActionHighlights.get(key);
    if (existing?.timeoutId) clearTimeout(existing.timeoutId);
    const timeoutId = window.setTimeout(() => {
      movedActionHighlights.delete(key);
      const row = list.listEl.querySelector(`.action-item[data-action-id="${CSS.escape(getActionIdentifier(list, action))}"]`);
      if (row) row.classList.remove('move-highlight');
    }, MOVE_HIGHLIGHT_MS);
    movedActionHighlights.set(key, { timeoutId, expiresAt: Date.now() + MOVE_HIGHLIGHT_MS });
  }

  function isActionMoveHighlighted(list, action) {
    const key = `${list.key}:${getActionIdentifier(list, action)}`;
    const entry = movedActionHighlights.get(key);
    if (!entry) return false;
    if (entry.expiresAt <= Date.now()) {
      movedActionHighlights.delete(key);
      return false;
    }
    return true;
  }

  function highlightBigTicketById(ticketId) {
    const key = String(ticketId || '');
    if (!key) return;
    const existing = movedBigTicketHighlights.get(key);
    if (existing?.timeoutId) clearTimeout(existing.timeoutId);
    const timeoutId = window.setTimeout(() => {
      movedBigTicketHighlights.delete(key);
      const row = bigTicket.listEl.querySelector(`.big-ticket-row[data-id="${CSS.escape(key)}"]`);
      if (row) row.classList.remove('move-highlight');
    }, MOVE_HIGHLIGHT_MS);
    movedBigTicketHighlights.set(key, { timeoutId, expiresAt: Date.now() + MOVE_HIGHLIGHT_MS });
    requestAnimationFrame(() => {
      const row = bigTicket.listEl.querySelector(`.big-ticket-row[data-id="${CSS.escape(key)}"]`);
      if (row) row.classList.add('move-highlight');
    });
  }

  function isBigTicketMoveHighlighted(ticketId) {
    const key = String(ticketId || '');
    if (!key) return false;
    const entry = movedBigTicketHighlights.get(key);
    if (!entry) return false;
    if (entry.expiresAt <= Date.now()) {
      movedBigTicketHighlights.delete(key);
      return false;
    }
    return true;
  }

  function getOrderedActions(list) {
    const visibleItems = list.actions.filter((i) => !i.archived);
    const active = visibleItems.filter((i) => !i.deleted && !i.completed);
    const superUrgent = active.filter((i) => i.urgencyLevel === 2).sort(sortWithinUrgencyTier);
    const urgent = active.filter((i) => i.urgencyLevel === 1).sort(sortWithinUrgencyTier);
    const normal = active.filter((i) => i.urgencyLevel === 0).sort(sortWithinUrgencyTier);
    const low = active.filter((i) => i.urgencyLevel === URGENCY_LOW).sort(sortWithinUrgencyTier);
    const completed = visibleItems.filter((i) => !i.deleted && i.completed).sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));
    const deleted = visibleItems.filter((i) => i.deleted).sort((a, b) => (b.deletedAt || 0) - (a.deletedAt || 0));
    return [...superUrgent, ...urgent, ...normal, ...low, ...completed, ...deleted];
  }

  function updateRowTruncation(row) {
    if (row?.dataset?.listKey === GENERAL_STORAGE_KEY) return;
    const textEl = row.querySelector('.action-text');
    const toggleBtn = row.querySelector('.action-text-toggle');
    if (!textEl || !toggleBtn) return;
    toggleBtn.hidden = !(textEl.scrollWidth > textEl.clientWidth + 1);
  }

  function getUrgencyLabel(action) {
    if (action.urgencyLevel === 2) return 'Super urgent';
    if (action.urgencyLevel === 1) return 'Urgent';
    if (action.urgencyLevel === URGENCY_LOW) return 'Low';
    return 'None';
  }

  function getUrgencyButtonText(level) {
    if (level === 2) return '!!';
    if (level === URGENCY_LOW) return 'L';
    return '!';
  }

  function cycleUrgencyLevel(level, direction = 'up') {
    const ladder = [URGENCY_LOW, 0, 1, 2];
    const index = ladder.indexOf(level);
    const currentIndex = index === -1 ? 1 : index;
    if (direction === 'down') return ladder[(currentIndex - 1 + ladder.length) % ladder.length];
    return ladder[(currentIndex + 1) % ladder.length];
  }

  function cycleUrgency(action, direction = 'up') {
    action.urgencyLevel = cycleUrgencyLevel(action.urgencyLevel, direction);
    action.updatedAt = Date.now();
  }

  function bindPriorityDirectionControls(button, onDirectionChange) {
    if (!button || typeof onDirectionChange !== 'function') return;
    let clickTimer = null;
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      if (event.detail > 1) return;
      window.clearTimeout(clickTimer);
      clickTimer = window.setTimeout(() => {
        clickTimer = null;
        onDirectionChange('up');
      }, 350);
    });
    button.addEventListener('dblclick', (event) => {
      event.stopPropagation();
      if (clickTimer) {
        window.clearTimeout(clickTimer);
        clickTimer = null;
      }
      onDirectionChange('down');
    });
  }

  function updateModalUrgencyUI(action) {
    modalUrgencyLabel.textContent = getUrgencyLabel(action);
    modalUrgencyBtn.classList.toggle('active', action.urgencyLevel === 1);
    modalUrgencyBtn.classList.toggle('super', action.urgencyLevel === 2);
    modalUrgencyBtn.classList.toggle('low', action.urgencyLevel === URGENCY_LOW);
    modalUrgencyBtn.textContent = getUrgencyButtonText(action.urgencyLevel);
    modalUrgencyBtn.disabled = action.deleted;
  }


  function getTimingFlagLabel(timingFlag) {
    return timingFlag === 'T' ? 'Time-dependent' : timingFlag === 'D' ? 'Delegated' : '';
  }

  function cycleTimingFlag(flag) {
    if (!flag) return 'T';
    if (flag === 'T') return 'D';
    return null;
  }

  function updateModalTimeDependentUI(action) {
    if (!modalTimeDependentBtn || !modalTimeDependentLabel) return;
    const timingFlag = action.timingFlag || null;
    modalTimeDependentBtn.classList.toggle('active', Boolean(timingFlag));
    modalTimeDependentBtn.classList.toggle('delegated', timingFlag === 'D');
    modalTimeDependentBtn.textContent = timingFlag || 'T';
    modalTimeDependentBtn.disabled = action.deleted;
    modalTimeDependentLabel.textContent = getTimingFlagLabel(timingFlag);
    modalTimeDependentLabel.hidden = !timingFlag;
  }

  function getSelectedPersonFilter() {
    return typeof uiState.personFilter === 'string' && uiState.personFilter.trim() ? uiState.personFilter.trim() : 'All';
  }

  function getSelectedTagFilter() {
    return typeof uiState.tagFilter === 'string' && uiState.tagFilter.trim() ? uiState.tagFilter.trim() : 'All';
  }

  function persistViewFilters() {
    saveUiState({ markDirty: false, autosync: false });
  }

  function setPersonFilter(value) {
    uiState.personFilter = typeof value === 'string' && value.trim() ? value.trim() : 'All';
    persistViewFilters();
    renderAll();
  }

  function setTagFilter(value) {
    uiState.tagFilter = typeof value === 'string' && value.trim() ? value.trim() : 'All';
    persistViewFilters();
    renderAll();
  }

  function getSearchQuery() {
    return typeof uiState.searchQuery === 'string' ? uiState.searchQuery.trim().toLowerCase() : '';
  }

  function setSearchQuery(value) {
    uiState.searchQuery = typeof value === 'string' ? value : '';
    persistViewFilters();
    renderAll();
  }

  function textMatchesSearch(text, query) {
    if (privacyMode) return true;
    if (!query) return true;
    return String(text || '').toLowerCase().includes(query);
  }

  function actionHasPersonTag(action, selectedFilter) {
    if (privacyMode) return true;
    if (!selectedFilter || selectedFilter === 'All') return true;
    const selectedLower = selectedFilter.toLowerCase();
    return extractPersonTagsFromAction(action).some((tag) => tag.toLowerCase() === selectedLower);
  }

  function actionHasHashTag(action, selectedFilter) {
    if (privacyMode) return true;
    if (!selectedFilter || selectedFilter === 'All') return true;
    const selectedLower = selectedFilter.toLowerCase();
    return extractHashTagsFromAction(action).some((tag) => tag.toLowerCase() === selectedLower);
  }

  function renderActionFilterControls() {
    const personTags = collectPersonTags();
    const hashTags = collectHashTags();
    const selectedPerson = getSelectedPersonFilter();
    const selectedTag = getSelectedTagFilter();
    let didReset = false;

    const validPerson = selectedPerson === 'All' || personTags.some((tag) => tag.toLowerCase() === selectedPerson.toLowerCase());
    if (!validPerson) {
      uiState.personFilter = 'All';
      didReset = true;
    }

    const validTag = selectedTag === 'All' || hashTags.some((tag) => tag.toLowerCase() === selectedTag.toLowerCase());
    if (!validTag) {
      uiState.tagFilter = 'All';
      didReset = true;
    }

    if (didReset) persistViewFilters();

    const effectivePerson = validPerson ? selectedPerson : 'All';
    const effectiveTag = validTag ? selectedTag : 'All';
    if (globalPersonFilterSelect) {
      globalPersonFilterSelect.innerHTML = '';
      const allOption = document.createElement('option');
      allOption.value = 'All';
      allOption.textContent = 'All people';
      globalPersonFilterSelect.appendChild(allOption);
      personTags.forEach((tag) => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        globalPersonFilterSelect.appendChild(option);
      });
      const selected = personTags.find((tag) => tag.toLowerCase() === effectivePerson.toLowerCase());
      globalPersonFilterSelect.value = effectivePerson === 'All' ? 'All' : (selected || 'All');
    }

    if (globalTagFilterSelect) {
      globalTagFilterSelect.innerHTML = '';
      const allOption = document.createElement('option');
      allOption.value = 'All';
      allOption.textContent = 'All tags';
      globalTagFilterSelect.appendChild(allOption);
      hashTags.forEach((tag) => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        globalTagFilterSelect.appendChild(option);
      });
      const selected = hashTags.find((tag) => tag.toLowerCase() === effectiveTag.toLowerCase());
      globalTagFilterSelect.value = effectiveTag === 'All' ? 'All' : (selected || 'All');
    }

    if (globalSearchFilterInput) globalSearchFilterInput.value = typeof uiState.searchQuery === 'string' ? uiState.searchQuery : '';
  }

  function renderList(list) {
    list.listEl.innerHTML = '';
    const ordered = getOrderedActions(list);
    const selectedPerson = getSelectedPersonFilter();
    const selectedTag = getSelectedTagFilter();
    const useFilters = list.key === GENERAL_STORAGE_KEY || list.key === SCHEDULING_STORAGE_KEY;
    const query = getSearchQuery();
    const visible = useFilters
      ? ordered.filter((action) => actionHasPersonTag(action, selectedPerson) && actionHasHashTag(action, selectedTag) && textMatchesSearch(action.text, query))
      : ordered;

    if (!visible.length) {
      const empty = document.createElement('li');
      empty.className = 'coming-soon';
      empty.textContent = !useFilters || (selectedPerson === 'All' && selectedTag === 'All' && !query)
        ? 'No actions yet. Add one to get started.'
        : 'No actions match the selected filters.';
      list.listEl.appendChild(empty);
      return;
    }

    visible.forEach((action) => {
      const li = document.createElement('li');
      li.className = 'action-item';
      li.dataset.actionId = getActionIdentifier(list, action);
      li.dataset.listKey = list.key;
      if (action.completed) li.classList.add('completed');
      if (action.deleted) li.classList.add('deleted');
      if (!action.completed && !action.deleted) {
        const priorityClass = action.urgencyLevel === 2
          ? 'pri-super'
          : action.urgencyLevel === 1
            ? 'pri-urgent'
            : action.urgencyLevel === URGENCY_LOW
              ? 'pri-low'
              : 'pri-normal';
        li.classList.add(priorityClass);
      }
      if (isActionMoveHighlighted(list, action)) li.classList.add('move-highlight');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = action.completed;
      checkbox.disabled = action.deleted;
      checkbox.addEventListener('change', () => {
        if (privacyMode) { checkbox.checked = action.completed; return; }
        action.completed = checkbox.checked;
        action.completedAt = action.completed ? Date.now() : null;
        action.updatedAt = Date.now();
        saveList(list);
        renderList(list);
      });

      const actionKey = list.hideNumber ? action.id : action.number;

      const number = document.createElement('span');
      number.className = 'action-number';
      number.textContent = list.hideNumber ? '' : String(action.number);
      if (list.hideNumber) number.hidden = true;

      const textWrap = document.createElement('div');
      textWrap.className = 'action-text-wrap';
      if (list.showDates) {
        const prefix = document.createElement('span');
        prefix.className = 'action-date-prefix';
        prefix.innerHTML = buildPrefix(action);
        textWrap.appendChild(prefix);
      }

      const text = document.createElement('span');
      text.className = 'action-text';
      const isGeneralList = list.key === GENERAL_STORAGE_KEY;
      const firstLine = isGeneralList ? richHtmlToFirstLineInlineHtml(action.html || action.html_inline || textToRichHtml(action.text || '')) : null;
      text.innerHTML = privacyMode
        ? anonymizeInlineHtml(isGeneralList ? (firstLine?.firstLineText || action.text) : action.text, 'Action', actionKey)
        : (isGeneralList ? firstLine.firstLineHtml : (action.html_inline || escapeHtml(action.text)));
      if (action.urgencyLevel === 2 && !action.completed && !action.deleted) text.classList.add('super-urgent-text');
      textWrap.appendChild(text);

      const expandBtn = document.createElement('button');
      expandBtn.type = 'button';
      expandBtn.className = 'action-text-toggle';
      expandBtn.textContent = isGeneralList ? '⋯' : '+';
      if (isGeneralList) expandBtn.classList.add('more-detail-indicator');
      expandBtn.hidden = isGeneralList ? !firstLine?.hasMoreLines : true;
      expandBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        openModal(list, actionKey);
      });
      textWrap.appendChild(expandBtn);

      const controls = document.createElement('div');
      controls.className = 'action-controls';

      const urgentBtn = document.createElement('button');
      urgentBtn.type = 'button';
      urgentBtn.className = 'icon-btn urgent-btn';
      urgentBtn.disabled = action.deleted;
      urgentBtn.textContent = getUrgencyButtonText(action.urgencyLevel);
      urgentBtn.classList.toggle('active', action.urgencyLevel === 1);
      urgentBtn.classList.toggle('super', action.urgencyLevel === 2);
      urgentBtn.classList.toggle('low', action.urgencyLevel === URGENCY_LOW);
      bindPriorityDirectionControls(urgentBtn, (direction) => {
        cycleUrgency(action, direction);
        queueMovedActionHighlight(list, action);
        saveList(list);
        renderList(list);
      });

      const timeDependentBtn = document.createElement('button');
      timeDependentBtn.type = 'button';
      timeDependentBtn.className = 'icon-btn time-dependent-btn';
      timeDependentBtn.disabled = action.deleted;
      timeDependentBtn.textContent = action.timingFlag || 'T';
      timeDependentBtn.classList.toggle('active', Boolean(action.timingFlag));
      timeDependentBtn.classList.toggle('delegated', action.timingFlag === 'D');
      timeDependentBtn.setAttribute('aria-label', 'Toggle time-dependent');
      timeDependentBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        action.timingFlag = cycleTimingFlag(action.timingFlag || null);
        action.updatedAt = Date.now();
        queueMovedActionHighlight(list, action);
        saveList(list);
        renderList(list);
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'icon-btn delete-btn';
      deleteBtn.textContent = action.deleted ? 'UD' : 'X';
      deleteBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        if (action.deleted) {
          action.deleted = false;
          action.deletedAt = null;
        } else {
          action.deleted = true;
          action.deletedAt = Date.now();
        }
        action.updatedAt = Date.now();
        saveList(list);
        renderList(list);
      });

      controls.append(urgentBtn, timeDependentBtn, deleteBtn);
      li.append(checkbox, number, textWrap, controls);
      li.addEventListener('click', (event) => {
        if (event.target.closest('.action-controls') || event.target.closest('.action-text-toggle') || event.target.closest('input[type="checkbox"]')) {
          return;
        }
        openModal(list, actionKey);
      });
      list.listEl.appendChild(li);
      if (!isGeneralList) requestAnimationFrame(() => updateRowTruncation(li));
    });
  }

  function meetingMatchesFilters(item) {
    if (privacyMode) return true;
    const selectedPerson = getSelectedPersonFilter();
    const selectedTag = getSelectedTagFilter();
    const personMatches = selectedPerson === 'All'
      || extractPersonTagsFromMeeting(item).some((tag) => tag.toLowerCase() === selectedPerson.toLowerCase());
    const tagMatches = selectedTag === 'All'
      || extractHashTagsFromMeeting(item).some((tag) => tag.toLowerCase() === selectedTag.toLowerCase());
    const query = getSearchQuery();
    const searchMatches = textMatchesSearch(`${item.title} ${item.notesText}`, query);
    return personMatches && tagMatches && searchMatches;
  }

  function getFilteredMeetings() {
    const selectedPerson = getSelectedPersonFilter();
    const selectedTag = getSelectedTagFilter();
    if (selectedPerson === 'All' && selectedTag === 'All' && !getSearchQuery()) return [...meeting.items];
    return meeting.items.filter((item) => meetingMatchesFilters(item));
  }

  function getMeetingGroups(items = meeting.items) {
    const byMonth = new Map();
    [...items]
      .sort((a, b) => new Date(b.datetime) - new Date(a.datetime))
      .forEach((item) => {
        const date = new Date(item.datetime);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!byMonth.has(monthKey)) {
          byMonth.set(monthKey, {
            monthKey,
            monthLabel: date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
            monthStart: new Date(date.getFullYear(), date.getMonth(), 1).getTime(),
            weeks: new Map(),
          });
        }
        const month = byMonth.get(monthKey);
        const monday = getWeekCommencingMonday(date);
        const weekKey = dateToDateValue(monday);
        if (!month.weeks.has(weekKey)) {
          month.weeks.set(weekKey, { weekKey, weekStart: monday.getTime(), weekLabel: `W/C ${formatLocalDate(monday)}`, meetings: [] });
        }
        month.weeks.get(weekKey).meetings.push(item);
      });

    return [...byMonth.values()]
      .sort((a, b) => b.monthStart - a.monthStart)
      .map((month) => ({
        ...month,
        weeks: [...month.weeks.values()]
          .sort((a, b) => b.weekStart - a.weekStart)
          .map((week) => ({ ...week, meetings: week.meetings.sort((a, b) => new Date(b.datetime) - new Date(a.datetime)) })),
      }));
  }

  function renderMeetingExpanded(item) {
    const detail = document.createElement('div');
    detail.className = 'meeting-details';

    if (meeting.editingId === item.id) {
      const editForm = document.createElement('form');
      editForm.className = 'meeting-edit-form';
      const date = new Date(item.datetime);

      const titleInput = document.createElement('input');
      titleInput.type = 'text';
      titleInput.required = true;
      titleInput.value = item.title;
      titleInput.maxLength = 200;

      const dateTimeWrap = document.createElement('div');
      dateTimeWrap.className = 'meeting-edit-datetime';
      const dateInput = document.createElement('input');
      dateInput.type = 'date';
      dateInput.required = true;
      dateInput.value = dateToDateValue(date);
      const hourInput = document.createElement('select');
      hourInput.required = true;
      populateHourOptions(hourInput);
      hourInput.value = String(date.getHours()).padStart(2, '0');

      const minuteInput = document.createElement('select');
      minuteInput.required = true;
      ALLOWED_MINUTES.forEach((minute) => {
        const option = document.createElement('option');
        option.value = minute;
        option.textContent = minute;
        minuteInput.appendChild(option);
      });
      minuteInput.value = ALLOWED_MINUTES.includes(String(date.getMinutes()).padStart(2, '0')) ? String(date.getMinutes()).padStart(2, '0') : '00';
      dateTimeWrap.append(dateInput, hourInput, minuteInput);

      const toolbar = document.createElement('div');
      toolbar.className = 'rtf-toolbar';
      const editorId = `meeting-edit-${item.id}`;
      toolbar.dataset.editorTarget = editorId;
      toolbar.innerHTML = '<button type="button" data-command="bold">B</button><button type="button" data-command="italic">I</button><button type="button" data-command="underline">U</button><button type="button" data-command="insertUnorderedList">•</button><button type="button" data-command="insertOrderedList">1.</button>';

      const notesEditor = document.createElement('div');
      notesEditor.id = editorId;
      notesEditor.className = 'modal-editor';
      notesEditor.contentEditable = 'true';
      notesEditor.innerHTML = item.notesHtml;

      const controls = document.createElement('div');
      controls.className = 'meeting-edit-controls';
      const saveBtn = document.createElement('button');
      saveBtn.type = 'submit';
      saveBtn.className = 'subtle-button';
      saveBtn.textContent = 'Save';
      const cancelBtn = document.createElement('button');
      cancelBtn.type = 'button';
      cancelBtn.className = 'subtle-button';
      cancelBtn.textContent = 'Cancel';
      cancelBtn.addEventListener('click', () => {
        meeting.editingId = null;
        renderMeetings();
      });

      controls.append(saveBtn, cancelBtn);
      editForm.append(titleInput, dateTimeWrap, toolbar, notesEditor, controls);
      detail.appendChild(editForm);
      bindRtfToolbar(toolbar);
      bindEditorShortcuts(notesEditor);

      editForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const parsed = parseLocalDateTime(dateInput.value, buildTimeValue(hourInput.value, minuteInput.value));
        if (!parsed) return;
        const title = titleInput.value.trim();
        const notesHtml = sanitizeRichHtml(notesEditor.innerHTML);
        const notesText = htmlToPlainText(notesHtml);
        if (!title || !notesText) return;

        item.title = title;
        item.datetime = parsed.toISOString();
        item.notesHtml = notesHtml;
        item.notesText = notesText;
        item.updatedAt = new Date().toISOString();
        saveMeetings();
      saveBigTicketItems();
      saveGeneralNotes();
      saveUiState();
        meeting.editingId = null;
        renderMeetings();
      });
      return detail;
    }

    const title = document.createElement('h4');
    title.className = 'meeting-detail-title';
    title.textContent = item.title;

    const notesWrap = document.createElement('div');
    notesWrap.className = 'meeting-notes-rendered';
    notesWrap.innerHTML = privacyMode ? anonymizeRichHtml(item.notesText, 'Meeting notes', item.id) : item.notesHtml;

    const controls = document.createElement('div');
    controls.className = 'meeting-detail-controls';

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'meeting-link-btn';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => {
      meeting.editingId = item.id;
      renderMeetings();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'meeting-link-btn delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
      if (!window.confirm(`Delete meeting: "${item.title}"?`)) return;
      meeting.items = meeting.items.filter((entry) => entry.id !== item.id);
      if (meeting.expandedId === item.id) meeting.expandedId = null;
      if (meeting.editingId === item.id) meeting.editingId = null;
      saveMeetings();
      saveBigTicketItems();
      saveGeneralNotes();
      saveUiState();
      renderMeetings();
    });

    const bigEditBtn = document.createElement('button');
    bigEditBtn.type = 'button';
    bigEditBtn.className = 'meeting-link-btn';
    bigEditBtn.textContent = 'Big edit';
    bigEditBtn.addEventListener('click', () => openMeetingBigEdit(item.id));

    controls.append(editBtn, bigEditBtn, deleteBtn);
    detail.append(title, controls, notesWrap);
    return detail;
  }

  function renderMeetings() {
    meeting.listEl.innerHTML = '';
    const filteredMeetings = getFilteredMeetings();
    const selectedPerson = getSelectedPersonFilter();
    const selectedTag = getSelectedTagFilter();
    if (!filteredMeetings.length) {
      const empty = document.createElement('p');
      empty.className = 'meeting-empty';
      empty.textContent = (selectedPerson !== 'All' || selectedTag !== 'All' || getSearchQuery())
        ? 'No meetings match filter.'
        : 'No meeting notes yet. Add one to get started.';
      meeting.listEl.appendChild(empty);
      return;
    }

    getMeetingGroups(filteredMeetings).forEach((month) => {
      const monthSection = document.createElement('section');
      monthSection.className = 'meeting-month-group';

      const monthHeaderRow = document.createElement('div');
      monthHeaderRow.className = 'meeting-header-row';
      const monthToggle = document.createElement('button');
      monthToggle.type = 'button';
      monthToggle.className = 'collapse-toggle';
      const monthCollapsed = Boolean(meeting.uiState.collapsedMonths[month.monthKey]);
      monthToggle.textContent = monthCollapsed ? '+' : '–';
      monthToggle.addEventListener('click', () => {
        meeting.uiState.collapsedMonths[month.monthKey] = !monthCollapsed;
        saveMeetingUIState();
        renderMeetings();
      });

      const monthHeader = document.createElement('h3');
      monthHeader.className = 'meeting-month-header';
      monthHeader.textContent = month.monthLabel;
      monthHeaderRow.append(monthToggle, monthHeader);
      monthSection.appendChild(monthHeaderRow);

      const monthBody = document.createElement('div');
      monthBody.className = 'meeting-month-body';
      monthBody.hidden = monthCollapsed;

      month.weeks.forEach((week) => {
        const weekSection = document.createElement('section');
        weekSection.className = 'meeting-week-group';

        const weekHeaderRow = document.createElement('div');
        weekHeaderRow.className = 'meeting-header-row';
        const weekToggle = document.createElement('button');
        weekToggle.type = 'button';
        weekToggle.className = 'collapse-toggle';
        const weekMapKey = `${month.monthKey}:${week.weekKey}`;
        const weekCollapsed = Boolean(meeting.uiState.collapsedWeeks[weekMapKey]);
        weekToggle.textContent = weekCollapsed ? '+' : '–';
        weekToggle.addEventListener('click', () => {
          meeting.uiState.collapsedWeeks[weekMapKey] = !weekCollapsed;
          saveMeetingUIState();
          renderMeetings();
        });

        const weekHeader = document.createElement('h4');
        weekHeader.className = 'meeting-week-header';
        weekHeader.textContent = week.weekLabel;
        weekHeaderRow.append(weekToggle, weekHeader);

        const weekItemsContainer = document.createElement('div');
        weekItemsContainer.className = 'meeting-week-items';
        weekItemsContainer.hidden = weekCollapsed;

        const meetingsEl = document.createElement('ul');
        meetingsEl.className = 'meeting-items';

        week.meetings.forEach((item) => {
          const li = document.createElement('li');
          li.className = 'meeting-item';
          const date = new Date(item.datetime);
          const row = document.createElement('div');
          row.className = 'meeting-row';

          const summary = document.createElement('button');
          summary.type = 'button';
          summary.className = 'meeting-summary';
          const summaryPrefix = `${formatWeekday(date)} ${formatLocalDate(date)} ${formatTime24(date)} - `;
          const summaryTitle = privacyMode
            ? anonymizeText(item.title, 'Meeting', item.id)
            : item.title;
          summary.innerHTML = `${escapeHtml(summaryPrefix)}<span class="meeting-summary-title">${escapeHtml(summaryTitle)}</span>`;
          summary.addEventListener('click', () => {
            meeting.expandedId = meeting.expandedId === item.id ? null : item.id;
            meeting.editingId = null;
            renderMeetings();
          });

          const quickEditBtn = document.createElement('button');
          quickEditBtn.type = 'button';
          quickEditBtn.className = 'row-quick-edit-btn';
          quickEditBtn.title = 'Big edit';
          quickEditBtn.setAttribute('aria-label', `Big edit ${item.title}`);
          quickEditBtn.textContent = '✎';
          quickEditBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            openMeetingBigEdit(item.id);
          });

          if (item.recorded) {
            const recordedIndicator = document.createElement('span');
            recordedIndicator.className = 'meeting-recorded-indicator';
            recordedIndicator.textContent = 'R';
            recordedIndicator.title = 'Recorded';
            row.append(summary, recordedIndicator, quickEditBtn);
          } else {
            row.append(summary, quickEditBtn);
          }
          li.appendChild(row);
          if (meeting.expandedId === item.id) li.appendChild(renderMeetingExpanded(item));
          meetingsEl.appendChild(li);
        });

        weekItemsContainer.appendChild(meetingsEl);
        weekSection.append(weekHeaderRow, weekItemsContainer);
        monthBody.appendChild(weekSection);
      });

      monthSection.appendChild(monthBody);
      meeting.listEl.appendChild(monthSection);
    });
  }



  function moveCardAcrossColumns(cardId, direction) {
    const position = findCardLayoutPosition(cardId);
    if (!position) return;
    const targetColumnIndex = position.columnIndex + direction;
    if (targetColumnIndex < 0 || targetColumnIndex >= uiState.cardLayout.columns.length) return;

    uiState.cardLayout.columns[position.columnIndex].splice(position.cardIndex, 1);
    uiState.cardLayout.columns[targetColumnIndex].unshift(cardId);
    saveUiState();
    renderAll();
  }

  function moveCardWithinColumn(cardId, direction) {
    const position = findCardLayoutPosition(cardId);
    if (!position) return;
    const column = uiState.cardLayout.columns[position.columnIndex];
    const targetIndex = position.cardIndex + direction;
    if (targetIndex < 0 || targetIndex >= column.length) return;
    [column[position.cardIndex], column[targetIndex]] = [column[targetIndex], column[position.cardIndex]];
    saveUiState();
    renderAll();
  }

  function initializeCardReorderControls() {
    document.querySelectorAll('.collapsible-card').forEach((card) => {
      const cardId = card.dataset.cardId;
      const header = card.querySelector('.column-header');
      if (!header || !cardId) return;
      if (header.querySelector('.card-move-controls, [data-card-reorder-group]')) return;

      const toggle = header.querySelector('[data-card-toggle]');
      let headerControls = header.querySelector('.card-header-controls, .column-header-actions');
      if (!headerControls) {
        headerControls = document.createElement('div');
        headerControls.className = 'card-header-controls column-header-actions';
        header.appendChild(headerControls);
      }
      if (toggle && toggle.parentElement !== headerControls) {
        headerControls.appendChild(toggle);
      }

      const group = document.createElement('div');
      group.className = 'card-reorder-controls card-move-controls';
      group.setAttribute('data-card-reorder-group', cardId);
      group.setAttribute('aria-label', 'Reorder card');

      const controls = [
        { action: 'left', symbol: '←', label: 'Move card left' },
        { action: 'right', symbol: '→', label: 'Move card right' },
        { action: 'up', symbol: '↑', label: 'Move card up' },
        { action: 'down', symbol: '↓', label: 'Move card down' },
      ];

      controls.forEach(({ action, symbol, label }) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'card-reorder-btn';
        button.dataset.cardMove = action;
        button.dataset.cardId = cardId;
        button.textContent = symbol;
        button.setAttribute('aria-label', label);
        group.appendChild(button);
      });

      headerControls.appendChild(group);
    });
  }

  function updateCardReorderControls() {
    const isMobile = window.matchMedia('(max-width: 760px)').matches;
    document.querySelectorAll('.collapsible-card').forEach((card) => {
      const cardId = card.dataset.cardId;
      const position = findCardLayoutPosition(cardId);
      if (!position) return;
      const column = uiState.cardLayout.columns[position.columnIndex];
      const buttonMap = {
        left: card.querySelector('[data-card-move="left"]'),
        right: card.querySelector('[data-card-move="right"]'),
        up: card.querySelector('[data-card-move="up"]'),
        down: card.querySelector('[data-card-move="down"]'),
      };
      if (buttonMap.left) buttonMap.left.disabled = isMobile || position.columnIndex === 0;
      if (buttonMap.right) buttonMap.right.disabled = isMobile || position.columnIndex === uiState.cardLayout.columns.length - 1;
      if (buttonMap.up) buttonMap.up.disabled = position.cardIndex === 0;
      if (buttonMap.down) buttonMap.down.disabled = position.cardIndex === column.length - 1;
    });
  }

  function bindCardReorderEvents() {
    document.querySelectorAll('[data-card-reorder-group]').forEach((group) => {
      if (group.dataset.bound === 'true') return;
      group.dataset.bound = 'true';
      group.addEventListener('click', (event) => {
        const button = event.target.closest('[data-card-move]');
        if (!button || button.disabled) return;
        const { cardId } = button.dataset;
        const move = button.dataset.cardMove;
        if (move === 'left') moveCardAcrossColumns(cardId, -1);
        if (move === 'right') moveCardAcrossColumns(cardId, 1);
        if (move === 'up') moveCardWithinColumn(cardId, -1);
        if (move === 'down') moveCardWithinColumn(cardId, 1);
      });
    });
  }

  function renderCardCollapseState() {
    document.querySelectorAll('[data-card-toggle]').forEach((toggle) => {
      const cardId = toggle.dataset.cardToggle;
      const collapsed = Boolean(uiState.collapsedCards[cardId]);
      const body = document.querySelector(`[data-card-body="${cardId}"]`);
      toggle.textContent = collapsed ? '▸' : '▾';
      toggle.setAttribute('aria-expanded', String(!collapsed));
      if (body) body.hidden = collapsed;
    });
  }

  function getCurrentCardLayout() {
    if (!columnsSection) return [];
    return Array.from(columnsSection.querySelectorAll('.column-stack'))
      .map((stack) => Array.from(stack.querySelectorAll('.card[data-card-id]')).map((card) => card.dataset.cardId).filter(Boolean));
  }

  function saveCardLayout() {
    uiState.cardLayout = getCurrentCardLayout();
    saveUiState();
  }

  function applyCardLayout(layout) {
    if (!columnsSection || !Array.isArray(layout) || !layout.length) return;
    const stacks = Array.from(columnsSection.querySelectorAll('.column-stack'));
    const cardsById = new Map(Array.from(columnsSection.querySelectorAll('.card[data-card-id]')).map((card) => [card.dataset.cardId, card]));
    layout.forEach((stackLayout, stackIndex) => {
      const stack = stacks[stackIndex];
      if (!stack || !Array.isArray(stackLayout)) return;
      stackLayout.forEach((cardId) => {
        const card = cardsById.get(cardId);
        if (card && card.parentElement !== stack) stack.appendChild(card);
      });
    });
  }

  function updateCardMoveControlState() {
    if (!columnsSection) return;
    const stacks = Array.from(columnsSection.querySelectorAll('.column-stack'));
    const lastStackIndex = stacks.length - 1;
    stacks.forEach((stack, stackIndex) => {
      const cards = Array.from(stack.querySelectorAll('.card[data-card-id]'));
      const lastCardIndex = cards.length - 1;
      cards.forEach((card, cardIndex) => {
        card.querySelectorAll('[data-card-move]').forEach((btn) => {
          const direction = btn.dataset.direction;
          const disabled = (direction === 'left' && stackIndex === 0)
            || (direction === 'right' && stackIndex === lastStackIndex)
            || (direction === 'up' && cardIndex === 0)
            || (direction === 'down' && cardIndex === lastCardIndex);
          btn.disabled = disabled;
          btn.hidden = disabled;
        });
      });
    });
  }

  function moveCard(cardId, direction) {
    if (!columnsSection || !cardId) return;
    const card = columnsSection.querySelector(`.card[data-card-id="${CSS.escape(cardId)}"]`);
    if (!card) return;
    const currentStack = card.closest('.column-stack');
    if (!currentStack) return;
    const stacks = Array.from(columnsSection.querySelectorAll('.column-stack'));
    const stackIndex = stacks.indexOf(currentStack);
    if (stackIndex < 0) return;

    if (direction === 'up') {
      const prev = card.previousElementSibling;
      if (!prev) return;
      currentStack.insertBefore(card, prev);
    } else if (direction === 'down') {
      const next = card.nextElementSibling;
      if (!next) return;
      currentStack.insertBefore(next, card);
    } else if (direction === 'left' || direction === 'right') {
      const targetIndex = direction === 'left' ? stackIndex - 1 : stackIndex + 1;
      const targetStack = stacks[targetIndex];
      if (!targetStack) return;
      const sourceCards = Array.from(currentStack.querySelectorAll('.card[data-card-id]'));
      const sourcePosition = sourceCards.indexOf(card);
      const targetCards = Array.from(targetStack.querySelectorAll('.card[data-card-id]'));
      const insertBeforeNode = targetCards[sourcePosition] || null;
      targetStack.insertBefore(card, insertBeforeNode);
    } else {
      return;
    }

    saveCardLayout();
    updateCardMoveControlState();
  }


  function getOrdinalSuffix(day) {
    const remainder100 = day % 100;
    if (remainder100 >= 11 && remainder100 <= 13) return 'th';
    const remainder10 = day % 10;
    if (remainder10 === 1) return 'st';
    if (remainder10 === 2) return 'nd';
    if (remainder10 === 3) return 'rd';
    return 'th';
  }

  function renderDashboardHeading() {
    const title = uiState.dashboardTitle || DEFAULT_DASHBOARD_TITLE;
    dashboardTitleEl.textContent = title;
    document.title = title;
    const today = new Date();
    const dayName = today.toLocaleDateString('en-GB', { weekday: 'long' });
    const monthName = today.toLocaleDateString('en-GB', { month: 'long' });
    const day = today.getDate();
    const year = today.getFullYear();
    dashboardDateEl.textContent = `${dayName} ${day}${getOrdinalSuffix(day)} ${monthName} ${year}`;
  }

  function renderCollapseAllButton() {
    const allCollapsed = Object.values(uiState.collapsedCards).every(Boolean);
    cloud.collapseAllBtn.textContent = allCollapsed ? 'Expand' : 'Hide';
    cloud.collapseAllBtn.setAttribute('aria-label', allCollapsed ? 'Expand all cards' : 'Hide all cards');
  }

  function toggleAllCardsCollapse() {
    const allCollapsed = Object.values(uiState.collapsedCards).every(Boolean);
    Object.keys(collapsedCardsDefault).forEach((cardId) => {
      uiState.collapsedCards[cardId] = !allCollapsed;
    });
    saveUiState();
    renderCardCollapseState();
    renderCollapseAllButton();
  }

  function renderBigTicketItems() {
    bigTicket.listEl.innerHTML = '';
    if (!bigTicket.items.length) {
      const empty = document.createElement('li');
      empty.className = 'coming-soon';
      empty.textContent = 'No big ticket items yet.';
      bigTicket.listEl.appendChild(empty);
      return;
    }

    bigTicket.items.forEach((item, index) => {
      const row = document.createElement('li');
      row.className = 'big-ticket-row';
      row.dataset.id = item.id;
      const priorityClass = item.urgencyLevel === 2
        ? 'pri-super'
        : item.urgencyLevel === 1
          ? 'pri-urgent'
          : item.urgencyLevel === URGENCY_LOW
            ? 'pri-low'
            : 'pri-normal';
      row.classList.add(priorityClass);
      if (isBigTicketMoveHighlighted(item.id)) row.classList.add('move-highlight');

      const number = document.createElement('span');
      number.className = 'action-number';
      number.textContent = `${index + 1}.`;

      const summary = document.createElement('button');
      summary.type = 'button';
      summary.className = 'big-ticket-summary';
      summary.innerHTML = privacyMode ? anonymizeInlineHtml(item.text, 'Big ticket', item.id) : (item.html_inline || escapeHtml(item.text));
      summary.addEventListener('click', () => openBigTicketModal(item.id));

      const controls = document.createElement('div');
      controls.className = 'action-controls';

      const urgentBtn = document.createElement('button');
      urgentBtn.type = 'button';
      urgentBtn.className = 'icon-btn urgent-btn';
      urgentBtn.textContent = getUrgencyButtonText(item.urgencyLevel);
      urgentBtn.classList.toggle('active', item.urgencyLevel === 1);
      urgentBtn.classList.toggle('super', item.urgencyLevel === 2);
      urgentBtn.classList.toggle('low', item.urgencyLevel === URGENCY_LOW);
      bindPriorityDirectionControls(urgentBtn, (direction) => {
        item.urgencyLevel = cycleUrgencyLevel(item.urgencyLevel, direction);
        item.updatedAt = Date.now();
        saveBigTicketItems();
        renderBigTicketItems();
      });

      const timeDependentBtn = document.createElement('button');
      timeDependentBtn.type = 'button';
      timeDependentBtn.className = 'icon-btn time-dependent-btn';
      timeDependentBtn.textContent = item.timingFlag || 'T';
      timeDependentBtn.classList.toggle('active', Boolean(item.timingFlag));
      timeDependentBtn.classList.toggle('delegated', item.timingFlag === 'D');
      timeDependentBtn.setAttribute('aria-label', 'Toggle time-dependent');
      timeDependentBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        item.timingFlag = cycleTimingFlag(item.timingFlag || null);
        item.updatedAt = Date.now();
        saveBigTicketItems();
        renderBigTicketItems();
      });

      const upBtn = document.createElement('button');
      upBtn.type = 'button';
      upBtn.className = 'icon-btn';
      upBtn.textContent = '▲';
      upBtn.disabled = index === 0;
      upBtn.setAttribute('aria-label', 'Move up');
      upBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        if (index === 0) return;
        [bigTicket.items[index - 1], bigTicket.items[index]] = [bigTicket.items[index], bigTicket.items[index - 1]];
        item.updatedAt = Date.now();
        saveBigTicketItems();
        renderBigTicketItems();
        highlightBigTicketById(item.id);
      });

      const downBtn = document.createElement('button');
      downBtn.type = 'button';
      downBtn.className = 'icon-btn';
      downBtn.textContent = '▼';
      downBtn.disabled = index === bigTicket.items.length - 1;
      downBtn.setAttribute('aria-label', 'Move down');
      downBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        if (index >= bigTicket.items.length - 1) return;
        [bigTicket.items[index], bigTicket.items[index + 1]] = [bigTicket.items[index + 1], bigTicket.items[index]];
        item.updatedAt = Date.now();
        saveBigTicketItems();
        renderBigTicketItems();
        highlightBigTicketById(item.id);
      });

      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'icon-btn delete-btn';
      del.textContent = 'X';
      del.addEventListener('click', (event) => {
        event.stopPropagation();
        bigTicket.items = bigTicket.items.filter((entry) => entry.id !== item.id);
        if (bigTicket.activeId === item.id) bigTicket.activeId = null;
        saveBigTicketItems();
        renderBigTicketItems();
      });

      controls.append(urgentBtn, timeDependentBtn, upBtn, downBtn, del);
      row.append(number, summary, controls);
      bigTicket.listEl.appendChild(row);
    });
  }


  function getGeneralNoteGroups(items = generalNotes.items) {
    const sorted = [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.createdAt - a.createdAt);
    const map = new Map();
    sorted.forEach((note) => {
      const d = new Date(`${note.date}T00:00:00`);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!map.has(key)) {
        map.set(key, { key, label: d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }), items: [] });
      }
      map.get(key).items.push(note);
    });
    return Array.from(map.values());
  }


  function generalNoteMatchesFilters(note) {
    if (privacyMode) return true;
    const selectedPerson = getSelectedPersonFilter();
    const selectedTag = getSelectedTagFilter();
    const personMatches = selectedPerson === 'All'
      || extractPersonTagsFromGeneralNote(note).some((tag) => tag.toLowerCase() === selectedPerson.toLowerCase());
    const tagMatches = selectedTag === 'All'
      || extractHashTagsFromGeneralNote(note).some((tag) => tag.toLowerCase() === selectedTag.toLowerCase());
    const query = getSearchQuery();
    const searchMatches = textMatchesSearch(`${note.title} ${note.text}`, query);
    return personMatches && tagMatches && searchMatches;
  }

  function getFilteredGeneralNotes() {
    const selectedPerson = getSelectedPersonFilter();
    const selectedTag = getSelectedTagFilter();
    if (selectedPerson === 'All' && selectedTag === 'All' && !getSearchQuery()) return [...generalNotes.items];
    return generalNotes.items.filter((note) => generalNoteMatchesFilters(note));
  }

  function renderGeneralNotes() {
    generalNotes.listEl.innerHTML = '';
    const filteredNotes = getFilteredGeneralNotes();
    const selectedPerson = getSelectedPersonFilter();
    const selectedTag = getSelectedTagFilter();
    if (!filteredNotes.length) {
      const empty = document.createElement('p');
      empty.className = 'meeting-empty';
      empty.textContent = (selectedPerson !== 'All' || selectedTag !== 'All' || getSearchQuery())
        ? 'No general notes match filter.'
        : 'No general notes yet.';
      generalNotes.listEl.appendChild(empty);
      return;
    }

    getGeneralNoteGroups(filteredNotes).forEach((group) => {
      const section = document.createElement('section');
      const headerRow = document.createElement('div');
      headerRow.className = 'general-note-month-row';
      const monthToggle = document.createElement('button');
      monthToggle.type = 'button';
      monthToggle.className = 'collapse-toggle';
      const monthCollapsed = Boolean(uiState.collapsedGeneralNotesMonths[group.key]);
      monthToggle.textContent = monthCollapsed ? '+' : '–';
      monthToggle.addEventListener('click', () => {
        uiState.collapsedGeneralNotesMonths[group.key] = !monthCollapsed;
        generalNotes.uiState.collapsedMonths = uiState.collapsedGeneralNotesMonths;
        saveUiState();
        renderGeneralNotes();
      });
      const header = document.createElement('h4');
      header.className = 'general-note-month-header';
      header.textContent = group.label;
      headerRow.append(monthToggle, header);
      section.appendChild(headerRow);

      const list = document.createElement('ul');
      list.className = 'meeting-items general-note-items';
      list.hidden = monthCollapsed;
      group.items.forEach((note) => {
        const li = document.createElement('li');
        li.className = 'general-note-item';
        const row = document.createElement('div');
        row.className = 'meeting-row';

        const summary = document.createElement('button');
        summary.type = 'button';
        summary.className = 'general-note-summary';
        const day = note.date.split('-').reverse().slice(0, 2).join('/');
        const renderedTitle = privacyMode ? anonymizeText(note.title, 'Note', note.id) : note.title;
        summary.textContent = `${day} — ${renderedTitle}`;
        summary.addEventListener('click', () => {
          generalNotes.expandedId = generalNotes.expandedId === note.id ? null : note.id;
          generalNotes.editingId = null;
          renderGeneralNotes();
        });

        const quickEditBtn = document.createElement('button');
        quickEditBtn.type = 'button';
        quickEditBtn.className = 'row-quick-edit-btn';
        quickEditBtn.title = 'Big edit';
        quickEditBtn.setAttribute('aria-label', `Big edit ${note.title}`);
        quickEditBtn.textContent = '✎';
        quickEditBtn.addEventListener('click', (event) => {
          event.stopPropagation();
          openGeneralNoteBigEdit(note.id);
        });

        if (note.whiteboardDataUrl) {
          const whiteboardIndicator = document.createElement('span');
          whiteboardIndicator.className = 'general-note-whiteboard-indicator';
          whiteboardIndicator.setAttribute('aria-hidden', 'true');
          whiteboardIndicator.textContent = '🖊';
          row.append(summary, whiteboardIndicator, quickEditBtn);
        } else {
          if (item.recorded) {
            const recordedIndicator = document.createElement('span');
            recordedIndicator.className = 'meeting-recorded-indicator';
            recordedIndicator.textContent = 'R';
            recordedIndicator.title = 'Recorded';
            row.append(summary, recordedIndicator, quickEditBtn);
          } else {
            row.append(summary, quickEditBtn);
          }
        }
        li.appendChild(row);

        if (generalNotes.expandedId === note.id) {
          const detail = document.createElement('div');
          detail.className = 'general-note-detail';

          if (generalNotes.editingId === note.id) {
            const form = document.createElement('form');
            form.className = 'meeting-edit-form';
            const d = document.createElement('input'); d.type = 'date'; d.required = true; d.value = note.date;
            const t = document.createElement('input'); t.type = 'text'; t.required = true; t.value = note.title;
            const toolbar = document.createElement('div'); toolbar.className = 'rtf-toolbar';
            const editorId = `gn-edit-${note.id}`; toolbar.dataset.editorTarget = editorId;
            toolbar.innerHTML = '<button type="button" data-command="bold">B</button><button type="button" data-command="italic">I</button><button type="button" data-command="underline">U</button><button type="button" data-command="insertUnorderedList">•</button><button type="button" data-command="insertOrderedList">1.</button>';
            const editor = document.createElement('div'); editor.id = editorId; editor.className = 'modal-editor'; editor.contentEditable = 'true'; editor.innerHTML = note.html;
            const controls = document.createElement('div'); controls.className = 'meeting-detail-controls';
            const save = document.createElement('button'); save.type='submit'; save.className='meeting-link-btn'; save.textContent='Save';
            const cancel = document.createElement('button'); cancel.type='button'; cancel.className='meeting-link-btn'; cancel.textContent='Cancel';
            cancel.addEventListener('click',()=>{generalNotes.editingId=null; renderGeneralNotes();});
            controls.append(save,cancel);
            form.append(d,t,toolbar,editor,controls);
            bindRtfToolbar(toolbar); bindEditorShortcuts(editor);
            form.addEventListener('submit',(e)=>{e.preventDefault(); if (privacyMode) return; const html=sanitizeRichHtml(editor.innerHTML); const text=htmlToPlainText(html); const title=t.value.trim(); if(!title||!d.value||!text)return; note.date=d.value; note.title=title; note.html=html; note.text=text; note.html_inline=richHtmlToInlineHtml(html); note.updatedAt=Date.now(); saveGeneralNotes(); generalNotes.editingId=null; renderGeneralNotes();});
            detail.appendChild(form);
          } else {
            const notes = document.createElement('div'); notes.className = 'meeting-notes-rendered';
            notes.innerHTML = privacyMode ? anonymizeRichHtml(note.text, 'Note text', note.id) : note.html;
            const controls = document.createElement('div'); controls.className = 'meeting-detail-controls';
            const edit = document.createElement('button'); edit.type='button'; edit.className='meeting-link-btn'; edit.textContent='Edit'; edit.addEventListener('click',()=>{ if (privacyMode) return; generalNotes.editingId=note.id; renderGeneralNotes();});
            const big = document.createElement('button'); big.type='button'; big.className='meeting-link-btn'; big.textContent='Big edit'; big.addEventListener('click',()=>openGeneralNoteBigEdit(note.id));
            const del = document.createElement('button'); del.type='button'; del.className='meeting-link-btn delete'; del.textContent='Delete'; del.addEventListener('click',()=>{generalNotes.items=generalNotes.items.filter((n)=>n.id!==note.id); if(generalNotes.expandedId===note.id)generalNotes.expandedId=null; saveGeneralNotes(); renderGeneralNotes();});
            controls.append(edit,big,del);
            detail.append(controls,notes);
          }
          li.appendChild(detail);
        }
        list.appendChild(li);
      });
      section.appendChild(list);
      generalNotes.listEl.appendChild(section);
    });
  }

  function renderAll() {
    renderDashboardHeading();
    if (!isAuthenticated) {
      renderSignedOutState();
      return;
    }
    console.debug('[renderAll]', {
      generalActions: lists.general.actions.length,
      personalActions: lists.personal.actions.length,
      schedulingActions: lists.scheduling.actions.length,
      bigTicketItems: bigTicket.items.length,
      meetingNotes: meeting.items.length,
      generalNotes: generalNotes.items.length,
    });
    renderActionFilterControls();
    renderList(lists.general);
    renderList(lists.personal);
    renderList(lists.scheduling);
    renderBigTicketItems();
    renderMeetings();
    renderGeneralNotes();
    arrangeCardsByLayout();
    initializeCardReorderControls();
    bindCardReorderEvents();
    updateCardReorderControls();
    renderCardCollapseState();
    updateCardMoveControlState();
    renderCollapseAllButton();
  }

  function addAction(list, rawHtml, options = {}) {
    if (privacyMode) return;
    const html = sanitizeRichHtml(rawHtml);
    const text = htmlToPlainText(html);
    if (!text) return;
    const now = Date.now();
    const item = {
      text,
      html,
      html_inline: richHtmlToInlineHtml(html),
      createdAt: now,
      updatedAt: now,
      completed: false,
      deleted: false,
      archived: false,
      urgencyLevel: Math.max(0, Math.min(URGENCY_LOW, Number.isInteger(options.urgencyLevel) ? options.urgencyLevel : 0)),
      timingFlag: options.timingFlag === 'T' || options.timingFlag === 'D' ? options.timingFlag : null,
      completedAt: null,
      deletedAt: null,
    };

    if (list.hideNumber) {
      item.id = `${list.idPrefix || 'pact'}-${now}-${Math.random().toString(16).slice(2)}`;
    } else {
      item.number = nextActionNumber;
      nextActionNumber += 1;
      saveNextNumber();
    }

    list.actions.unshift(item);
    saveList(list);
    queueMovedActionHighlight(list, item);
    renderList(list);
  }

  function addMeeting(titleRaw, dateRaw, timeRaw, notesHtmlRaw, options = {}) {
    if (privacyMode) return null;
    const title = titleRaw.trim();
    const parsed = parseLocalDateTime(dateRaw, timeRaw);
    const notesHtml = sanitizeRichHtml(notesHtmlRaw);
    const notesText = htmlToPlainText(notesHtml);
    if (!title || !parsed) return null;
    if (!options.allowEmptyNotes && !notesText) return null;

    const nowIso = new Date().toISOString();
    const meetingItem = {
      id: `meeting-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title,
      datetime: parsed.toISOString(),
      notesHtml,
      notesText,
      createdAt: nowIso,
      updatedAt: nowIso,
      draft: options.draft === true,
      recorded: options.recorded === true,
    };
    meeting.items.push(meetingItem);
    saveMeetings();
    if (options.autosyncImmediate) requestAutosyncImmediate();
    renderMeetings();
    activeMeetingBigEditDraft = null;
    return meetingItem;
  }


  function addBigTicketItem(rawHtml) {
    if (privacyMode) return false;
    const html = sanitizeRichHtml(rawHtml);
    const text = htmlToPlainText(html);
    if (!text) return false;
    const now = Date.now();
    bigTicket.items.unshift({ id: `ticket-${now}-${Math.random().toString(16).slice(2)}`, html, html_inline: richHtmlToInlineHtml(html), text, urgencyLevel: 0, timingFlag: null, createdAt: now, updatedAt: now });
    saveBigTicketItems();
    renderBigTicketItems();
    return true;
  }

  function openBigTicketModal(id) {
    const item = bigTicket.items.find((entry) => entry.id === id);
    if (!item) return;
    bigTicket.activeId = id;
    bigTicketModalEditor.innerHTML = privacyMode ? anonymizeRichHtml(item.text, 'Big ticket', item.id) : item.html;
    bigTicketModalEditor.contentEditable = privacyMode ? 'false' : 'true';
    bigTicketModal.hidden = false;
    refreshBigEditBlurState();
    bigTicketModalEditor.focus();
  }

  function saveBigTicketModal() {
    if (privacyMode) return false;
    const item = bigTicket.items.find((entry) => entry.id === bigTicket.activeId);
    if (!item) return false;
    const html = sanitizeRichHtml(bigTicketModalEditor.innerHTML);
    const text = htmlToPlainText(html);
    if (!text) return false;
    item.html = html;
    item.text = text;
    item.html_inline = richHtmlToInlineHtml(html);
    item.updatedAt = Date.now();
    saveBigTicketItems();
    renderBigTicketItems();
    return true;
  }

  function closeBigTicketModal(skipSave = false) {
    if (!skipSave && bigTicket.activeId) saveBigTicketModal();
    bigTicketModal.hidden = true;
    bigTicket.activeId = null;
    refreshBigEditBlurState();
  }

  function addGeneralNote(dateRaw, titleRaw, htmlRaw) {
    if (privacyMode) return false;
    const title = titleRaw.trim();
    const html = sanitizeRichHtml(htmlRaw);
    const text = htmlToPlainText(html);
    if (!dateRaw || !title || !text) return false;
    const now = Date.now();
    generalNotes.items.push({ id: `gn-${now}-${Math.random().toString(16).slice(2)}`, date: dateRaw, title, html, html_inline: richHtmlToInlineHtml(html), text, createdAt: now, updatedAt: now, whiteboardDataUrl: null, whiteboardMeta: null, whiteboardImages: [] });
    saveGeneralNotes();
    renderGeneralNotes();
    activeGeneralNoteBigEditDraft = null;
    return true;
  }

  function getGeneralNoteById(id) {
    return generalNotes.items.find((item) => item.id === id) || null;
  }

  function openGeneralNoteBigEdit(id) {
    const item = getGeneralNoteById(id);
    if (!item) return;
    activeGeneralNoteBigEditId = id;
    activeGeneralNoteBigEditDraft = { title: item.title, date: item.date, html: item.html, whiteboardDataUrl: item.whiteboardDataUrl, whiteboardMeta: item.whiteboardMeta, whiteboardImages: cloneWhiteboardImages(item.whiteboardImages || []) };
    generalNoteBigEditTitleInput.value = privacyMode ? anonymizeText(item.title, 'Note', item.id) : item.title;
    generalNoteBigEditDateInput.value = item.date;
    generalNoteBigEditEditor.innerHTML = privacyMode ? anonymizeRichHtml(item.text, 'Note text', item.id) : item.html;
    generalNoteBigEditTitleInput.disabled = privacyMode;
    generalNoteBigEditDateInput.disabled = privacyMode;
    generalNoteBigEditEditor.contentEditable = privacyMode ? 'false' : 'true';
    generalNoteBigEditModal.hidden = false;
    refreshBigEditBlurState();
    setGeneralNoteEditMode('text');
    whiteboardState.undoStack = [];
    whiteboardState.touched = false;
    whiteboardState.hasContent = Boolean(item.whiteboardDataUrl) || Boolean(item.whiteboardImages?.length);
    resizeWhiteboardCanvas();
    loadWhiteboardImage(item.whiteboardDataUrl, { images: item.whiteboardImages || [] });
  }

  function closeGeneralNoteBigEdit() {
    stopDictation();
    if (activeGeneralNoteBigEditDraft) {
      generalNoteBigEditTitleInput.value = activeGeneralNoteBigEditDraft.title;
      generalNoteBigEditDateInput.value = activeGeneralNoteBigEditDraft.date;
      generalNoteBigEditEditor.innerHTML = activeGeneralNoteBigEditDraft.html;
      loadWhiteboardImage(activeGeneralNoteBigEditDraft.whiteboardDataUrl || null, { images: activeGeneralNoteBigEditDraft.whiteboardImages || [] });
    }
    generalNoteBigEditTitleInput.disabled = false;
    generalNoteBigEditDateInput.disabled = false;
    generalNoteBigEditEditor.contentEditable = 'true';
    generalNoteBigEditModal.hidden = true;
    refreshBigEditBlurState();
    activeGeneralNoteBigEditId = null;
    activeGeneralNoteBigEditDraft = null;
  }

  function saveGeneralNoteBigEdit() {
    if (privacyMode) return false;
    const item = getGeneralNoteById(activeGeneralNoteBigEditId);
    if (!item) return false;
    const title = generalNoteBigEditTitleInput.value.trim();
    const date = generalNoteBigEditDateInput.value;
    const html = sanitizeRichHtml(generalNoteBigEditEditor.innerHTML);
    const text = htmlToPlainText(html);
    if (!title || !date || !text) return false;
    item.title = title;
    item.date = date;
    item.html = html;
    item.text = text;
    item.html_inline = richHtmlToInlineHtml(html);
    if (whiteboardState.touched || whiteboardState.hasContent) {
      item.whiteboardDataUrl = whiteboardCanvas ? whiteboardCanvas.toDataURL('image/png') : item.whiteboardDataUrl;
      item.whiteboardImages = cloneWhiteboardImages();
      item.whiteboardMeta = whiteboardCanvas ? { width: whiteboardCanvas.width, height: whiteboardCanvas.height, updatedAt: Date.now() } : item.whiteboardMeta;
    }
    item.updatedAt = Date.now();
    saveGeneralNotes();
    renderGeneralNotes();
    return true;
  }



  function setGeneralNoteEditMode(mode) {
    const nextMode = mode === 'whiteboard' ? 'whiteboard' : 'text';
    whiteboardState.mode = nextMode;
    if (generalNoteTabText) {
      const active = nextMode === 'text';
      generalNoteTabText.classList.toggle('active', active);
      generalNoteTabText.setAttribute('aria-selected', String(active));
    }
    if (generalNoteTabWhiteboard) {
      const active = nextMode === 'whiteboard';
      generalNoteTabWhiteboard.classList.toggle('active', active);
      generalNoteTabWhiteboard.setAttribute('aria-selected', String(active));
    }
    if (generalNoteTextPanel) generalNoteTextPanel.hidden = nextMode !== 'text';
    if (generalNoteWhiteboardPanel) generalNoteWhiteboardPanel.hidden = nextMode !== 'whiteboard';
    if (nextMode === 'whiteboard') {
      const item = getGeneralNoteById(activeGeneralNoteBigEditId);
      resizeWhiteboardCanvas();
      loadWhiteboardImage(item?.whiteboardDataUrl || activeGeneralNoteBigEditDraft?.whiteboardDataUrl || null, { images: item?.whiteboardImages || activeGeneralNoteBigEditDraft?.whiteboardImages || [] });
    }
    updateWhiteboardImageActions();
  }

  function getWhiteboardCtx() {
    if (!whiteboardCanvas) return null;
    return whiteboardCanvas.getContext('2d');
  }

  function cloneWhiteboardImages(images = whiteboardState.images) {
    return (Array.isArray(images) ? images : []).map((img) => ({ ...img }));
  }

  function whiteboardSnapshot() {
    return {
      baseDataUrl: whiteboardCanvas ? whiteboardCanvas.toDataURL('image/png') : null,
      images: cloneWhiteboardImages(),
    };
  }

  function applyWhiteboardSnapshot(snapshot) {
    if (!whiteboardCanvas) return;
    const baseDataUrl = snapshot?.baseDataUrl || null;
    const images = Array.isArray(snapshot?.images) ? snapshot.images : [];
    loadWhiteboardImage(baseDataUrl, { images });
    whiteboardState.selectedImageId = null;
    updateWhiteboardImageActions();
  }

  function fillWhiteboardBackground() {
    const ctx = getWhiteboardCtx();
    if (!ctx || !whiteboardCanvas) return;
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, whiteboardCanvas.width, whiteboardCanvas.height);
    ctx.restore();
  }

  function renderWhiteboardBase(baseDataUrl = null, onDone = null) {
    if (!whiteboardCanvas) return;
    const ctx = getWhiteboardCtx();
    fillWhiteboardBackground();
    if (!baseDataUrl) {
      if (typeof onDone === 'function') onDone();
      return;
    }
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, whiteboardCanvas.width, whiteboardCanvas.height);
      if (typeof onDone === 'function') onDone();
    };
    img.src = baseDataUrl;
  }

  function renderWhiteboardImages() {
    const ctx = getWhiteboardCtx();
    if (!ctx) return;
    whiteboardState.images.forEach((item) => {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, item.x, item.y, item.w, item.h);
        if (whiteboardState.selectedImageId === item.id) drawSelectionOutline(item);
      };
      img.src = item.dataUrl;
    });
  }

  function redrawWhiteboard() {
    const snapshot = whiteboardState.baseSnapshot;
    renderWhiteboardBase(snapshot, () => renderWhiteboardImages());
  }

  function drawSelectionOutline(item) {
    const ctx = getWhiteboardCtx();
    if (!ctx || !item) return;
    ctx.save();
    ctx.strokeStyle = '#2563eb';
    ctx.setLineDash([8, 5]);
    ctx.lineWidth = 2;
    ctx.strokeRect(item.x, item.y, item.w, item.h);
    ctx.restore();
  }

  function updateWhiteboardImageActions() {
    if (!whiteboardImageActions) return;
    const hasSelected = Boolean(whiteboardState.selectedImageId);
    whiteboardImageActions.hidden = !(whiteboardState.tool === 'select' || hasSelected);
    if (whiteboardImageDeleteBtn) whiteboardImageDeleteBtn.disabled = !hasSelected;
    if (whiteboardImageForwardBtn) whiteboardImageForwardBtn.disabled = !hasSelected;
    if (whiteboardImageBackwardBtn) whiteboardImageBackwardBtn.disabled = !hasSelected;
  }

  function pushWhiteboardUndo() {
    if (!whiteboardCanvas) return;
    whiteboardState.undoStack.push(JSON.stringify(whiteboardSnapshot()));
    if (whiteboardState.undoStack.length > 30) whiteboardState.undoStack.shift();
  }

  function loadWhiteboardImage(dataUrl, options = {}) {
    if (!whiteboardCanvas) return;
    whiteboardState.baseSnapshot = dataUrl || null;
    whiteboardState.images = cloneWhiteboardImages(options.images || []);
    whiteboardState.hasContent = Boolean(dataUrl) || whiteboardState.images.length > 0;
    whiteboardState.selectedImageId = null;
    redrawWhiteboard();
    updateWhiteboardImageActions();
  }

  function resizeWhiteboardCanvas() {
    if (!whiteboardCanvas || !generalNoteWhiteboardPanel) return;
    const rect = whiteboardCanvas.getBoundingClientRect();
    const cssWidth = Math.max(300, Math.floor(rect.width || generalNoteWhiteboardPanel.clientWidth || 600));
    const cssHeight = Math.max(240, Math.floor(rect.height || (generalNoteWhiteboardPanel.clientHeight - 10) || 320));
    const dpr = window.devicePixelRatio || 1;
    whiteboardCanvas.width = Math.floor(cssWidth * dpr);
    whiteboardCanvas.height = Math.floor(cssHeight * dpr);
    const ctx = getWhiteboardCtx();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    redrawWhiteboard();
  }

  function whiteboardPoint(event) {
    const rect = whiteboardCanvas.getBoundingClientRect();
    const scaleX = whiteboardCanvas.width / rect.width;
    const scaleY = whiteboardCanvas.height / rect.height;
    return { x: (event.clientX - rect.left) * scaleX, y: (event.clientY - rect.top) * scaleY };
  }

  function hitTestWhiteboardImage(point) {
    for (let i = whiteboardState.images.length - 1; i >= 0; i -= 1) {
      const item = whiteboardState.images[i];
      if (point.x >= item.x && point.x <= item.x + item.w && point.y >= item.y && point.y <= item.y + item.h) return item;
    }
    return null;
  }

  function drawShapePreview(start, end) {
    redrawWhiteboard();
    drawShape(start, end);
  }

  function drawShape(start, end) {
    const ctx = getWhiteboardCtx();
    if (!ctx) return;
    ctx.lineWidth = Number(whiteboardWidthInput?.value || whiteboardState.width || 3);
    ctx.strokeStyle = whiteboardColorInput?.value || whiteboardState.color;
    ctx.globalCompositeOperation = 'source-over';
    if (whiteboardState.tool === 'line') {
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    } else if (whiteboardState.tool === 'rect') {
      ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
    } else if (whiteboardState.tool === 'circle') {
      const rx = (end.x - start.x) / 2;
      const ry = (end.y - start.y) / 2;
      const cx = start.x + rx;
      const cy = start.y + ry;
      ctx.beginPath();
      ctx.ellipse(cx, cy, Math.abs(rx), Math.abs(ry), 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function loadImageFileToWhiteboard(file, preferredPoint = null) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : null;
      if (!dataUrl) return;
      const img = new Image();
      img.onload = () => {
        if (!whiteboardCanvas) return;
        const maxW = whiteboardCanvas.width * 0.7;
        const maxH = whiteboardCanvas.height * 0.7;
        const ratio = Math.min(maxW / img.width, maxH / img.height, 1);
        const w = img.width * ratio;
        const h = img.height * ratio;
        const point = preferredPoint || whiteboardState.lastPointerPosition;
        const x = point ? point.x : (whiteboardCanvas.width - w) / 2;
        const y = point ? point.y : (whiteboardCanvas.height - h) / 2;
        pushWhiteboardUndo();
        const item = { id: `wbi-${Date.now()}-${Math.random().toString(16).slice(2)}`, x, y, w, h, dataUrl };
        whiteboardState.images.push(item);
        whiteboardState.selectedImageId = item.id;
        whiteboardState.touched = true;
        whiteboardState.hasContent = true;
        redrawWhiteboard();
        updateWhiteboardImageActions();
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }



  function setPrivacyMode(next) {
    privacyMode = Boolean(next);
    localStorage.setItem(PRIVACY_MODE_KEY, privacyMode ? '1' : '0');
    if (privacyToggleBtn) {
      privacyToggleBtn.textContent = privacyMode ? 'Privacy On' : 'Privacy';
      privacyToggleBtn.classList.toggle('is-on', privacyMode);
      privacyToggleBtn.setAttribute('aria-pressed', String(privacyMode));
    }
    updateCloudMeta();
    renderAll();
  }

  function fillSettingsForm(themeLike) {
    const themeState = normalizeThemeState(themeLike || uiState.theme);
    const theme = themeState.vars;
    suppressThemePresetSync = true;
    themePresetSelect.value = themeState.presetName;
    dashboardTitleInput.value = uiState.dashboardTitle;
    themeBannerBgInput.value = theme.bannerBg;
    themeBannerFgInput.value = theme.bannerFg;
    themePageBgInput.value = theme.pageBg;
    themeCardHeaderBgInput.value = theme.cardHeaderBg;
    themeCardHeaderFgInput.value = theme.cardHeaderFg;
    suppressThemePresetSync = false;
  }

  function getThemeVarsFromSettingsForm() {
    return normalizeTheme({
      bannerBg: themeBannerBgInput.value,
      bannerFg: themeBannerFgInput.value,
      pageBg: themePageBgInput.value,
      cardHeaderBg: themeCardHeaderBgInput.value,
      cardHeaderFg: themeCardHeaderFgInput.value,
    });
  }

  function getThemeFromSettingsForm() {
    const vars = getThemeVarsFromSettingsForm();
    const selectedPreset = themePresetSelect.value;
    const presetName = selectedPreset === 'Custom' ? 'Custom' : resolveThemePresetName(vars) === selectedPreset ? selectedPreset : 'Custom';
    return normalizeThemeState({ presetName, vars });
  }

  function previewSettingsTheme() {
    settingsThemeDraft = getThemeFromSettingsForm();
    applyTheme(settingsThemeDraft.vars);
  }

  function applyThemePresetFromSettings() {
    if (suppressThemePresetSync) return;
    const preset = themePresetSelect.value;
    if (!THEMES[preset]) {
      previewSettingsTheme();
      return;
    }
    fillSettingsForm({ presetName: preset, vars: THEMES[preset] });
    previewSettingsTheme();
  }

  function onThemeColorInputChange() {
    if (suppressThemePresetSync) return;
    if (themePresetSelect.value !== 'Custom') {
      suppressThemePresetSync = true;
      themePresetSelect.value = 'Custom';
      suppressThemePresetSync = false;
    }
    previewSettingsTheme();
  }

  function openSettingsModal() {
    settingsThemeSavedSnapshot = normalizeThemeState(uiState.theme);
    fillSettingsForm(settingsThemeSavedSnapshot);
    settingsThemeDraft = normalizeThemeState(settingsThemeSavedSnapshot);
    applyTheme(settingsThemeDraft.vars);
    settingsModal.hidden = false;
    themePresetSelect.focus();
  }

  function closeSettingsModal({ revert = true } = {}) {
    if (revert && settingsThemeSavedSnapshot) {
      applyTheme(settingsThemeSavedSnapshot.vars);
    }
    settingsModal.hidden = true;
    settingsThemeDraft = null;
    settingsThemeSavedSnapshot = null;
  }

  function openImportModal() {
    importForm.reset();
    const defaultMode = importForm.querySelector('input[name="import-mode"][value="merge"]');
    if (defaultMode) defaultMode.checked = true;
    importModal.hidden = false;
    importFileInput.focus();
  }

  function closeImportModal() {
    importModal.hidden = true;
    importForm.reset();
    importFileInput.value = '';
  }

  function saveSettingsModal() {
    uiState.theme = settingsThemeDraft ? normalizeThemeState(settingsThemeDraft) : getThemeFromSettingsForm();
    uiState.dashboardTitle = dashboardTitleInput.value.trim() || DEFAULT_DASHBOARD_TITLE;
    applyTheme(uiState.theme.vars);
    saveUiState();
    renderAll();
  }

  function modalStatusText(action) {
    const created = `Created: ${formatLocalDate(action.createdAt)}`;
    const completed = action.completed ? `Completed: ${formatLocalDate(action.completedAt)}` : null;
    const deleted = action.deleted ? `Deleted: ${formatLocalDate(action.deletedAt)}` : null;
    const urgency = getUrgencyLabel(action) !== 'None' ? getUrgencyLabel(action) : null;
    const timing = getTimingFlagLabel(action.timingFlag || null) || null;
    return [deleted || completed || created, created, completed, deleted, urgency, timing].filter(Boolean).join(' • ');
  }

  function findActionForList(list, actionKey) {
    if (list.hideNumber) {
      return list.actions.find((item) => item.id === actionKey) || null;
    }
    return list.actions.find((item) => item.number === actionKey) || null;
  }

  function getActiveModalAction() {
    if (!activeModalContext) return null;
    return findActionForList(activeModalContext.list, activeModalContext.actionKey);
  }

  function openModal(list, actionKey) {
    const action = findActionForList(list, actionKey);
    if (!action) return;
    ensureActionRichContent(action);
    activeModalContext = { list, actionKey };
    modalTitle.textContent = list.hideNumber ? 'Action details' : `${action.number}`;
    modalStatus.textContent = modalStatusText(action);
    modalTextInput.innerHTML = privacyMode ? anonymizeRichHtml(action.text, 'Action', actionKey) : action.html;
    modalTextInput.contentEditable = privacyMode ? 'false' : 'true';
    updateModalUrgencyUI(action);
    updateModalTimeDependentUI(action);
    modal.hidden = false;
    modalTextInput.focus();
  }

  function persistModalChanges() {
    const action = getActiveModalAction();
    if (!action || !activeModalContext) return false;

    const html = sanitizeRichHtml(modalTextInput.innerHTML);
    const text = htmlToPlainText(html);
    if (!text) {
      modalTextInput.focus();
      return false;
    }

    action.html = html;
    action.text = text;
    action.html_inline = richHtmlToInlineHtml(html);
    action.updatedAt = Date.now();
    saveList(activeModalContext.list);
    renderList(activeModalContext.list);
    return true;
  }

  function closeModal(skipPersist = false) {
    stopDictation();
    if (!skipPersist && activeModalContext) {
      persistModalChanges();
    }
    modal.hidden = true;
    activeModalContext = null;
  }

  function execEditorCommand(editorEl, command) {
    editorEl.focus();
    document.execCommand(command, false);
  }

  function getSelectionListItemWithin(editorEl) {
    if (!editorEl) return null;
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return null;
    const anchorNode = selection.anchorNode;
    if (!anchorNode) return null;
    const anchorEl = anchorNode.nodeType === Node.ELEMENT_NODE ? anchorNode : anchorNode.parentElement;
    if (!anchorEl) return null;
    const listItem = anchorEl.closest('li');
    return listItem && editorEl.contains(listItem) ? listItem : null;
  }

  function indentListItemFallback(listItem) {
    const parentList = listItem?.parentElement;
    const prevItem = listItem?.previousElementSibling;
    if (!parentList || !prevItem) return true;
    let nestedList = prevItem.lastElementChild;
    if (!nestedList || !['UL', 'OL'].includes(nestedList.tagName)) {
      nestedList = document.createElement(parentList.tagName === 'OL' ? 'ol' : 'ul');
      prevItem.appendChild(nestedList);
    }
    nestedList.appendChild(listItem);
    return true;
  }

  function outdentListItemFallback(listItem) {
    const parentList = listItem?.parentElement;
    if (!parentList || !['UL', 'OL'].includes(parentList.tagName)) return true;
    const parentListItem = parentList.closest('li');
    if (!parentListItem) return true;
    parentListItem.insertAdjacentElement('afterend', listItem);
    if (!parentList.children.length) parentList.remove();
    return true;
  }

  function handleEditorTabIndent(event, editorEl) {
    if (event.key !== 'Tab') return false;
    const listItem = getSelectionListItemWithin(editorEl);
    if (!listItem) return false;
    event.preventDefault();
    editorEl.focus();
    if (typeof document.execCommand === 'function') {
      document.execCommand(event.shiftKey ? 'outdent' : 'indent', false);
      return true;
    }
    return event.shiftKey ? outdentListItemFallback(listItem) : indentListItemFallback(listItem);
  }

  function getEditorCommandForShortcut(event) {
    if (!(event.ctrlKey || event.metaKey)) return null;
    const key = event.key.toLowerCase();
    if (event.shiftKey && key === '8') return 'insertUnorderedList';
    if (event.shiftKey && key === '7') return 'insertOrderedList';
    if (key === 'b') return 'bold';
    if (key === 'i') return 'italic';
    if (key === 'u') return 'underline';
    return null;
  }

  function bindEditorShortcuts(editorEl) {
    editorEl.addEventListener('keydown', (event) => {
      if (handleEditorTabIndent(event, editorEl)) return;
      const command = getEditorCommandForShortcut(event);
      if (!command) return;
      event.preventDefault();
      execEditorCommand(editorEl, command);
    });
  }

  function getSelectionTextOffsetWithin(root) {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return null;
    const range = selection.getRangeAt(0);
    if (!root.contains(range.endContainer)) return null;
    const prefixRange = range.cloneRange();
    prefixRange.selectNodeContents(root);
    prefixRange.setEnd(range.endContainer, range.endOffset);
    return prefixRange.toString().length;
  }

  function getTextNodePositionAtOffset(root, targetOffset) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let textNode = walker.nextNode();
    let consumed = 0;
    while (textNode) {
      const nodeLength = textNode.textContent.length;
      if (targetOffset <= consumed + nodeLength) {
        return { node: textNode, offset: Math.max(0, targetOffset - consumed) };
      }
      consumed += nodeLength;
      textNode = walker.nextNode();
    }
    return { node: root, offset: root.childNodes.length };
  }

  function removeEditorTextRange(root, startOffset, endOffset) {
    if (!root || !Number.isInteger(startOffset) || !Number.isInteger(endOffset) || endOffset <= startOffset) return false;
    const startPos = getTextNodePositionAtOffset(root, startOffset);
    const endPos = getTextNodePositionAtOffset(root, endOffset);
    const range = document.createRange();
    range.setStart(startPos.node, startPos.offset);
    range.setEnd(endPos.node, endPos.offset);
    range.deleteContents();
    root.normalize();
    return true;
  }

  function findShortcutTokenInPrefix(prefixText) {
    if (!prefixText) return null;
    const matches = Array.from(prefixText.matchAll(ACTION_SHORTCUT_TOKEN_REGEX));
    for (let i = matches.length - 1; i >= 0; i -= 1) {
      const match = matches[i];
      const trailing = prefixText.slice(match.index + match[0].length);
      if (/^[\s.,!?;:)}\]"']*$/.test(trailing)) {
        return { token: match[0], number: Number(match[1]), start: match.index, end: match.index + match[0].length };
      }
    }
    return null;
  }

  function findActionByNumber(number) {
    if (!Number.isInteger(number)) return null;
    const sourceActions = [...appState.generalActions, ...appState.schedulingActions];
    const match = sourceActions.find((action) => Number(action?.number) === number);
    if (!match) return null;
    return { number, text: htmlToPlainText(match.html || match.text || '') };
  }

  function hasExistingActionLine(editorEl, lineText) {
    const normalizedTarget = (lineText || '').trim().toLowerCase();
    if (!normalizedTarget) return false;
    const lines = (editorEl.innerText || '')
      .split(/\n+/)
      .map((line) => line.replace(/\s+/g, ' ').trim().toLowerCase())
      .filter(Boolean);
    return lines.includes(normalizedTarget);
  }

  function prependActionReference(editorEl, actionRef) {
    if (!editorEl || !actionRef) return;
    const linePrefix = `Action ${actionRef.number}`;
    const lineText = `${linePrefix} - ${actionRef.text}`;
    if (hasExistingActionLine(editorEl, lineText)) return;

    const firstElement = Array.from(editorEl.childNodes).find((node) => node.nodeType === Node.ELEMENT_NODE);
    if (firstElement && firstElement.tagName === 'UL') {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${escapeHtml(linePrefix)}</strong>${escapeHtml(` - ${actionRef.text}`)}`;
      firstElement.prepend(li);
      return;
    }

    const ul = document.createElement('ul');
    const li = document.createElement('li');
    li.innerHTML = `<strong>${escapeHtml(linePrefix)}</strong>${escapeHtml(` - ${actionRef.text}`)}`;
    ul.appendChild(li);
    editorEl.prepend(ul);
  }

  function processActionShortcutInEditor(editorEl, options = {}) {
    if (!editorEl || privacyMode) return;
    const caretOffset = options.useCaret !== false ? getSelectionTextOffsetWithin(editorEl) : null;
    const plainText = editorEl.innerText || '';
    const prefix = plainText.slice(0, Number.isInteger(caretOffset) ? caretOffset : plainText.length);
    const tokenMatch = findShortcutTokenInPrefix(prefix);
    if (!tokenMatch) return;

    const actionRef = findActionByNumber(tokenMatch.number);
    if (!actionRef) {
      showTransientStatus(`Action ${tokenMatch.number} not found`, 'warning');
      return;
    }

    const removed = removeEditorTextRange(editorEl, tokenMatch.start, tokenMatch.end);
    if (!removed) return;
    prependActionReference(editorEl, actionRef);
    showTransientStatus(`Action ${tokenMatch.number} inserted`, 'success');
  }

  function bindActionShortcutEditor(editorEl) {
    if (!editorEl) return;
    editorEl.addEventListener('keyup', (event) => {
      if (!event || event.isComposing) return;
      if (event.key !== '%' && event.key !== 'Enter' && !ACTION_SHORTCUT_TRIGGER_KEY_REGEX.test(event.key || '')) return;
      processActionShortcutInEditor(editorEl, { useCaret: true });
    });
    editorEl.addEventListener('blur', () => {
      processActionShortcutInEditor(editorEl, { useCaret: false });
    });
  }

  function resetMeetingEntryAutofillState() {
    meetingUserTouchedDate = false;
    meetingUserTouchedTime = false;
    meetingAutoFilledDateTimeThisEntry = false;
    meetingTitleWasEmpty = !(meeting.titleInput?.value || '').trim();
  }

  function autofillMeetingDateTimeOnFirstTitleChar() {
    const titleIsEmpty = !(meeting.titleInput?.value || '').trim();
    if (meetingTitleWasEmpty && !titleIsEmpty && !meetingAutoFilledDateTimeThisEntry && !meetingUserTouchedDate && !meetingUserTouchedTime) {
      const now = roundToNearestQuarterHour(new Date());
      const roundedMinute = String(now.getMinutes()).padStart(2, '0');
      meeting.dateInput.value = dateToDateValue(now);
      meeting.hourInput.value = String(now.getHours()).padStart(2, '0');
      meeting.minuteInput.value = ALLOWED_MINUTES.includes(roundedMinute) ? roundedMinute : '00';
      meetingAutoFilledDateTimeThisEntry = true;
    }
    meetingTitleWasEmpty = titleIsEmpty;
  }


  function appendDictatedTextToTarget(target, text) {
    if (!target || !text) return;
    target.focus();
    const content = `${text} `;
    if (document.activeElement === target && typeof document.execCommand === 'function') {
      document.execCommand('insertText', false, content);
      return;
    }
    if (target.isContentEditable) {
      target.innerHTML += `${escapeHtml(text)} `;
    } else if ('value' in target) {
      target.value = `${target.value || ''}${content}`;
    }
  }

  function stopDictation() {
    if (!dictationState.recognition) return;
    dictationState.recognition.stop();
  }

  function updateDictationButtonState(button, listening) {
    if (!button) return;
    button.textContent = listening ? 'Stop' : 'Dictate';
    button.classList.toggle('active', listening);
  }

  function startDictation(button, defaultTarget, fallbackTarget) {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      showToast('Dictation not supported in this browser.', 'warning');
      return;
    }

    if (dictationState.button === button && dictationState.recognition) {
      stopDictation();
      return;
    }

    stopDictation();

    const recognition = new Recognition();
    recognition.lang = 'en-GB';
    recognition.continuous = true;
    recognition.interimResults = false;

    dictationState.recognition = recognition;
    dictationState.button = button;
    dictationState.defaultTarget = defaultTarget;
    dictationState.fallbackTarget = fallbackTarget || defaultTarget;
    updateDictationButtonState(button, true);

    recognition.onresult = (event) => {
      const idx = event.resultIndex;
      const transcript = event.results[idx] && event.results[idx][0] ? event.results[idx][0].transcript : '';
      const active = document.activeElement;
      const target = active && active.isContentEditable ? active : dictationState.fallbackTarget;
      appendDictatedTextToTarget(target, transcript.trim());
    };

    recognition.onerror = () => {
      updateDictationButtonState(dictationState.button, false);
      dictationState.recognition = null;
      dictationState.button = null;
    };

    recognition.onend = () => {
      updateDictationButtonState(dictationState.button, false);
      dictationState.recognition = null;
      dictationState.button = null;
    };

    recognition.start();
  }

  function bindRtfToolbar(toolbarEl) {
    toolbarEl.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-command]');
      if (!button) return;
      const editor = document.getElementById(toolbarEl.dataset.editorTarget);
      if (!editor) return;
      execEditorCommand(editor, button.dataset.command);
    });
  }


  function getCreationState(list) {
    if (list.key === GENERAL_STORAGE_KEY) return creationState.general;
    if (list.key === SCHEDULING_STORAGE_KEY) return creationState.scheduling;
    return creationDefaults;
  }

  function renderCreationControls(list) {
    const state = getCreationState(list);
    if (list.createUrgencyBtn) {
      list.createUrgencyBtn.textContent = getUrgencyButtonText(state.urgencyLevel);
      list.createUrgencyBtn.classList.toggle('active', state.urgencyLevel === 1);
      list.createUrgencyBtn.classList.toggle('super', state.urgencyLevel === 2);
      list.createUrgencyBtn.classList.toggle('low', state.urgencyLevel === URGENCY_LOW);
    }
    if (list.createTimingBtn) {
      list.createTimingBtn.textContent = state.timingFlag || 'T';
      list.createTimingBtn.classList.toggle('active', Boolean(state.timingFlag));
      list.createTimingBtn.classList.toggle('delegated', state.timingFlag === 'D');
    }
  }

  function resetCreationState(list) {
    const state = getCreationState(list);
    state.urgencyLevel = 0;
    state.timingFlag = null;
    renderCreationControls(list);
  }

  function bindListEvents(list) {
    list.form.addEventListener('submit', (event) => {
      event.preventDefault();
      const state = getCreationState(list);
      addAction(list, list.input.innerHTML, { urgencyLevel: state.urgencyLevel, timingFlag: state.timingFlag });
      list.input.innerHTML = '';
      resetCreationState(list);
      list.input.focus();
    });

    list.input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        list.form.requestSubmit();
      }
    });

    if (list.createUrgencyBtn) {
      list.createUrgencyBtn.addEventListener('click', () => {
        const state = getCreationState(list);
        state.urgencyLevel = cycleUrgencyLevel(state.urgencyLevel, 'up');
        renderCreationControls(list);
      });
    }

    if (list.createTimingBtn) {
      list.createTimingBtn.addEventListener('click', () => {
        const state = getCreationState(list);
        state.timingFlag = cycleTimingFlag(state.timingFlag);
        renderCreationControls(list);
      });
    }

    renderCreationControls(list);

    list.clearBtn.addEventListener('click', () => {
      const now = Date.now();
      list.actions.forEach((item) => {
        const isCompleted = item.completed || Boolean(item.completedAt) || item.status === 'completed';
        const isDeleted = item.deleted || Boolean(item.deletedAt) || item.status === 'deleted';
        if (!isCompleted && !isDeleted) return;
        item.archived = true;
        item.updatedAt = now;
      });
      saveList(list);
      renderList(list);
    });
  }



  function refreshBigEditBlurState() {
    const shouldBlur = !meetingBigEditModal.hidden || !bigTicketModal.hidden || !generalNoteBigEditModal.hidden;
    document.body.classList.toggle('modal-open-blur', shouldBlur);
  }

  function getMeetingById(id) {
    return meeting.items.find((item) => item.id === id) || null;
  }

  function openMeetingBigEdit(meetingId) {
    const item = getMeetingById(meetingId);
    if (!item) return;
    const date = new Date(item.datetime);
    activeMeetingBigEditId = item.id;
    activeMeetingBigEditDraft = {
      title: item.title,
      date: dateToDateValue(date),
      hour: String(date.getHours()).padStart(2, '0'),
      minute: ALLOWED_MINUTES.includes(String(date.getMinutes()).padStart(2, '0')) ? String(date.getMinutes()).padStart(2, '0') : '00',
      notesHtml: item.notesHtml,
      recorded: item.recorded === true,
    };
    meetingBigEditTitleInput.value = privacyMode ? anonymizeText(item.title, 'Meeting', item.id) : item.title;
    meetingBigEditDateInput.value = dateToDateValue(date);
    meetingBigEditHourInput.value = activeMeetingBigEditDraft.hour;
    meetingBigEditMinuteInput.value = activeMeetingBigEditDraft.minute;
    meetingBigEditNotesEditor.innerHTML = privacyMode ? anonymizeRichHtml(item.notesText, 'Meeting notes', item.id) : activeMeetingBigEditDraft.notesHtml;
    if (meetingBigEditRecordedInput) meetingBigEditRecordedInput.checked = item.recorded === true;
    meetingBigEditTitleInput.disabled = privacyMode;
    meetingBigEditDateInput.disabled = privacyMode;
    meetingBigEditHourInput.disabled = privacyMode;
    meetingBigEditMinuteInput.disabled = privacyMode;
    if (meetingBigEditRecordedInput) meetingBigEditRecordedInput.disabled = privacyMode;
    meetingBigEditNotesEditor.contentEditable = privacyMode ? 'false' : 'true';
    meetingBigEditModal.hidden = false;
    document.body.classList.add('big-edit-open');
    refreshBigEditBlurState();
    document.body.classList.add('big-edit-obscure-background');
    meetingBigEditTitleInput.focus();
  }

  function closeMeetingBigEdit() {
    stopDictation();
    const draftId = activeMeetingBigEditId;
    if (activeMeetingBigEditDraft) {
      meetingBigEditTitleInput.value = activeMeetingBigEditDraft.title;
      meetingBigEditDateInput.value = activeMeetingBigEditDraft.date;
      meetingBigEditHourInput.value = activeMeetingBigEditDraft.hour;
      meetingBigEditMinuteInput.value = activeMeetingBigEditDraft.minute;
      meetingBigEditNotesEditor.innerHTML = activeMeetingBigEditDraft.notesHtml;
      if (meetingBigEditRecordedInput) meetingBigEditRecordedInput.checked = activeMeetingBigEditDraft.recorded === true;
    }
    meetingBigEditTitleInput.disabled = false;
    meetingBigEditDateInput.disabled = false;
    meetingBigEditHourInput.disabled = false;
    meetingBigEditMinuteInput.disabled = false;
    if (meetingBigEditRecordedInput) meetingBigEditRecordedInput.disabled = false;
    meetingBigEditNotesEditor.contentEditable = 'true';
    meetingBigEditModal.hidden = true;
    document.body.classList.remove('big-edit-open', 'big-edit-obscure-background');
    refreshBigEditBlurState();
    activeMeetingBigEditId = null;
    activeMeetingBigEditDraft = null;

    const draftItem = getMeetingById(draftId);
    if (draftItem && draftItem.draft && !draftItem.notesText.trim() && !draftItem.title.trim()) {
      meeting.items = meeting.items.filter((entry) => entry.id !== draftId);
      saveMeetings();
      renderMeetings();
    }
  }

  function saveMeetingBigEdit() {
    if (privacyMode) return false;
    const item = getMeetingById(activeMeetingBigEditId);
    if (!item) return false;
    const title = meetingBigEditTitleInput.value.trim();
    const parsed = parseLocalDateTime(meetingBigEditDateInput.value, buildTimeValue(meetingBigEditHourInput.value, meetingBigEditMinuteInput.value));
    const notesHtml = sanitizeRichHtml(meetingBigEditNotesEditor.innerHTML);
    const notesText = htmlToPlainText(notesHtml);
    if (!title || !parsed || !notesText) return false;

    item.title = title;
    item.datetime = parsed.toISOString();
    item.notesHtml = notesHtml;
    item.notesText = notesText;
    item.recorded = meetingBigEditRecordedInput?.checked === true;
    item.updatedAt = new Date().toISOString();
    item.draft = false;
    saveMeetings();
    renderMeetings();
    return true;
  }


  async function signInWithPassword() {
    if (cloud.busy) return;
    const email = cloud.emailInput.value.trim();
    const password = cloud.passwordInput.value;
    if (!email || !password) {
      setStatus('Sign in failed: Enter email and password first.', 'error');
      return;
    }

    setLoading(true, 'signIn');
    try {
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) {
        setStatus(`Sign in failed: ${error.message}`, 'error');
        return;
      }
      cloud.passwordInput.value = '';
    } finally {
      setLoading(false);
    }
  }

  async function signOutCloud() {
    if (cloud.busy || !cloud.signedInUser) return;
    setLoading(true, 'authSignOut');
    const { error } = await sb.auth.signOut();
    if (error) {
      setStatus(`Sign out failed: ${error.message}`, 'error');
    }
    setLoading(false);
  }

  async function fetchCloudStateRow(userId) {
    const { data, error } = await sb.from('dashboard_state')
      .select('state, updated_at')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      setStatus(`Cloud load failed: ${error.message}`, 'error');
      return null;
    }
    return data || null;
  }

  async function fetchCloudUpdatedAt(userId) {
    const { data, error } = await sb.from('dashboard_state')
      .select('updated_at')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      setStatus(`Sync error: ${error.message}`, 'error');
      return { ok: false, updatedAt: null };
    }
    return { ok: true, updatedAt: data?.updated_at || null };
  }

  function isCloudNewerThanLastKnown(cloudUpdatedAt) {
    if (!cloudUpdatedAt) return false;
    if (!cloud.lastCloudUpdatedAt) return true;
    return new Date(cloudUpdatedAt).getTime() > new Date(cloud.lastCloudUpdatedAt).getTime();
  }

  async function pullCloudState(options = {}) {
    const user = cloud.signedInUser;
    if (!user) {
      setStatus('Please sign in first.', 'error');
      return false;
    }

    const row = await fetchCloudStateRow(user.id);
    if (row === null) {
      if (!options.silentNoData) {
        setStatus('No cloud data found.', 'warning');
      }
      return false;
    }

    if (!row.state) {
      if (!options.silentNoData) {
        setStatus('No cloud data found.', 'warning');
      }
      return false;
    }

    setLocalDashboardState(row.state);
    const syncedAt = new Date().toISOString();
    localStorage.setItem(CLOUD_LAST_PULL_KEY, syncedAt);
    markLastSynced(syncedAt, row.updated_at || syncedAt);
    if (!options.silentSuccess) {
    }
    return true;
  }

  async function pushCloudState(options = {}) {
    const user = cloud.signedInUser;
    if (!user) {
      setStatus('Please sign in first.', 'error');
      return false;
    }

    const meta = await fetchCloudUpdatedAt(user.id);
    if (!meta.ok) return false;

    if (isCloudNewerThanLastKnown(meta.updatedAt)) {
      const recentDirty = localDirtySince && (Date.now() - localDirtySince) < 5 * 60 * 1000;
      showToast(recentDirty
        ? 'Cloud updated elsewhere — reloaded latest to avoid overwriting.'
        : 'Updated from another device', 'warning');
      await pullCloudState({ silentSuccess: true });
      return 'conflict';
    }

    const state = migrateState(getLocalDashboardState());
    const nowIso = new Date().toISOString();
    const { error } = await sb.from('dashboard_state').upsert({
      user_id: user.id,
      state,
      updated_at: nowIso,
    });

    if (error) {
      setStatus(`Sync failed: ${error.message}`, 'error');
      return false;
    }

    localStorage.setItem(CLOUD_LAST_PUSH_KEY, nowIso);
    markLastSynced(nowIso, nowIso);
    clearLocalDirty();
    if (!options.silentSuccess) {
    }
    return true;
  }

  function requestAutosync() {
    if (privacyMode || suppressAutosync || cloud.importInProgress || !isAuthenticated || !cloud.signedInUser) return;
    autosyncPending = true;
    if (autosyncTimer) {
      window.clearTimeout(autosyncTimer);
    }
    autosyncTimer = window.setTimeout(() => {
      autosyncTimer = null;
      runAutosync().catch((error) => {
        setStatus(`Sync failed: ${error.message}`, 'error');
      });
    }, AUTOSYNC_DEBOUNCE_MS);
  }

  function requestAutosyncImmediate() {
    if (privacyMode || suppressAutosync || cloud.importInProgress || !isAuthenticated || !cloud.signedInUser) return;
    autosyncPending = true;
    if (autosyncTimer) {
      window.clearTimeout(autosyncTimer);
      autosyncTimer = null;
    }
    runAutosync().catch((error) => {
      setStatus(`Sync failed: ${error.message}`, 'error');
    });
  }

  async function runAutosync() {
    if (autosyncInFlight || !cloud.signedInUser) return;
    autosyncInFlight = true;
    setSyncIndicator(true);
    try {
      while (autosyncPending) {
        autosyncPending = false;
        const result = await pushCloudState({ silentSuccess: true });
        if (result === 'conflict') {
          continue;
        }
        if (!result) {
          break;
        }
      }
      if (!autosyncPending) {
        }
    } finally {
      autosyncInFlight = false;
      setSyncIndicator(false);
    }
  }

  async function refreshFromCloudIfNewer(options = {}) {
    if (!cloud.signedInUser || cloud.importInProgress || cloud.refreshInFlight) return false;
    cloud.refreshInFlight = true;
    setSyncIndicator(true);
    try {
      const meta = await fetchCloudUpdatedAt(cloud.signedInUser.id);
      if (!meta.ok || !meta.updatedAt) return false;
      if (!isCloudNewerThanLastKnown(meta.updatedAt)) return false;
      const recentDirty = localDirtySince && (Date.now() - localDirtySince) < 5 * 60 * 1000;
      await pullCloudState({ silentSuccess: true });
      showToast(recentDirty
        ? 'Cloud updated elsewhere — reloaded latest to avoid overwriting.'
        : 'Updated from another device', recentDirty ? 'warning' : 'info');
      return true;
    } finally {
      cloud.refreshInFlight = false;
      setSyncIndicator(false);
    }
  }

  function scheduleFocusRefresh() {
    if (!cloud.signedInUser || cloud.importInProgress) return;
    hydrateFromLocalCacheAndRender();
    if (cloud.focusRefreshTimer) window.clearTimeout(cloud.focusRefreshTimer);
    cloud.focusRefreshTimer = window.setTimeout(() => {
      cloud.focusRefreshTimer = null;
      refreshFromCloudIfNewer().catch((error) => {
        setStatus(`Sync error: ${error.message}`, 'error');
      });
    }, FOCUS_SYNC_DEBOUNCE_MS);
  }

  async function exportCloudBackup() {
    if (!cloud.signedInUser || cloud.busy) return;
    setLoading(true, 'export');
    try {
      const row = await fetchCloudStateRow(cloud.signedInUser.id);
      const sourceState = row?.state ? migrateState(row.state) : getLocalDashboardState();
      const payload = {
        exportedAt: new Date().toISOString(),
        stateVersion: sourceState.stateVersion || LATEST_STATE_VERSION,
        state: sourceState,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `dashboard-backup-${new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-')}.json`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setStatus('Backup exported', 'success');
    } finally {
      setLoading(false);
    }
  }

  function extractActionNumber(action) {
    const asNumber = Number(action?.number);
    if (Number.isInteger(asNumber)) return asNumber;
    const idAsNumber = Number(action?.id);
    return Number.isInteger(idAsNumber) ? idAsNumber : null;
  }

  function dedupeActionsByNumber(items) {
    const byNumber = new Map();
    items.forEach((item) => {
      const normalized = normalizeAction(item);
      if (!normalized) return;
      const number = extractActionNumber(normalized);
      if (!Number.isInteger(number)) return;
      normalized.number = number;
      byNumber.set(number, normalized);
    });
    return Array.from(byNumber.values());
  }

  function mergeById(currentItems, importedItems, normalizer) {
    const merged = new Map();
    currentItems.forEach((item) => {
      const normalized = normalizer(item);
      if (normalized?.id) merged.set(normalized.id, normalized);
    });
    importedItems.forEach((item) => {
      const normalized = normalizer(item);
      if (normalized?.id) merged.set(normalized.id, normalized);
    });
    return Array.from(merged.values());
  }

  function computeNextActionNumber(state) {
    const numbers = [
      ...state.generalActions.map((item) => extractActionNumber(item)).filter(Number.isInteger),
      ...state.schedulingActions.map((item) => extractActionNumber(item)).filter(Number.isInteger),
    ];
    const maxNumber = numbers.length ? Math.max(...numbers) : DEFAULT_NEXT_NUMBER - 1;
    return maxNumber + 1;
  }

  function mergeDashboardState(currentState, importedState) {
    const merged = migrateState({
      ...currentState,
      generalActions: dedupeActionsByNumber([...currentState.generalActions, ...importedState.generalActions]),
      schedulingActions: dedupeActionsByNumber([...currentState.schedulingActions, ...importedState.schedulingActions]),
      personalActions: mergeById(currentState.personalActions || [], importedState.personalActions || [], (item) => normalizeAction(item, { requireNumber: false, idPrefix: 'pact' })),
      bigTicketItems: mergeById(currentState.bigTicketItems, importedState.bigTicketItems, normalizeBigTicketItem),
      meetingNotes: mergeById(currentState.meetingNotes, importedState.meetingNotes, normalizeMeeting),
      generalNotes: mergeById(currentState.generalNotes, importedState.generalNotes, normalizeGeneralNote),
      ui: {
        collapsedCards: currentState.ui?.collapsedCards || importedState.ui?.collapsedCards || { ...collapsedCardsDefault },
        collapsedGeneralNotesMonths: currentState.ui?.collapsedGeneralNotesMonths || importedState.ui?.collapsedGeneralNotesMonths || {},
        cardLayout: currentState.ui?.cardLayout || importedState.ui?.cardLayout || structuredClone(cardLayoutDefault),
        theme: currentState.ui?.theme || importedState.ui?.theme || normalizeThemeState(defaultTheme),
        dashboardTitle: currentState.ui?.dashboardTitle || importedState.ui?.dashboardTitle || DEFAULT_DASHBOARD_TITLE,
        personFilter: currentState.ui?.personFilter || importedState.ui?.personFilter || 'All',
        tagFilter: currentState.ui?.tagFilter || importedState.ui?.tagFilter || 'All',
        searchQuery: typeof currentState.ui?.searchQuery === 'string'
          ? currentState.ui.searchQuery
          : (typeof importedState.ui?.searchQuery === 'string' ? importedState.ui.searchQuery : ''),
      },
      meetingNotesUIState: currentState.meetingNotesUIState || importedState.meetingNotesUIState || { collapsedMonths: {}, collapsedWeeks: {} },
      stateVersion: LATEST_STATE_VERSION,
    });
    merged.nextActionNumber = computeNextActionNumber(merged);
    return merged;
  }

  async function importCloudBackup(file, mode) {
    if (!file || !cloud.signedInUser || cloud.busy || !mode) return false;
    setLoading(true, 'import');
    cloud.importInProgress = true;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!parsed || typeof parsed !== 'object' || !parsed.state) {
        setStatus('Import failed: invalid backup format.', 'error');
        return false;
      }

      const importedState = migrateState({
        stateVersion: Number(parsed.stateVersion) || Number(parsed.state?.stateVersion) || 1,
        ...parsed.state,
      });

      let finalState;
      if (mode === 'overwrite') {
        const confirmed = window.confirm('This will replace all current data. Continue?');
        if (!confirmed) return false;
        finalState = migrateState(importedState);
      } else {
        finalState = mergeDashboardState(getLocalDashboardState(), importedState);
      }
      finalState.nextActionNumber = computeNextActionNumber(finalState);

      setLocalDashboardState(finalState, { markDirty: true });
      const result = await pushCloudState({ silentSuccess: true });
      if (!result || result === 'conflict') {
        setStatus(`Imported (${mode}) locally; cloud sync needs retry.`, 'warning');
        return true;
      }
      const verb = mode === 'overwrite' ? 'overwrite' : 'merge';
      setStatus(`Imported (${verb})`, 'success', { toast: false });
      return true;
    } catch (error) {
      setStatus(`Import failed: ${error.message}`, 'error');
      return false;
    } finally {
      cloud.importInProgress = false;
      importFileInput.value = '';
      setLoading(false);
    }
  }

  async function handleAuthStateChange(event, session) {
    cloud.signedInUser = session?.user || null;
    applyAuthUiState({ deferRender: event === 'SIGNED_IN' || event === 'INITIAL_SESSION' });

    if (!cloud.signedInUser) {
      autosyncPending = false;
      if (autosyncTimer) {
        window.clearTimeout(autosyncTimer);
        autosyncTimer = null;
      }
      setLoading(false);
      if (event === 'SIGNED_OUT') {
        setStatus('Signed out', 'info', { toast: false });
      }
      return;
    }

    if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
      hydrateFromLocalCacheAndRender();
      setLoading(false);

      await refreshFromCloudIfNewer({ reason: 'auth' });

      const row = await fetchCloudStateRow(cloud.signedInUser.id);
      if (row && row.state) {
        if (!cloud.lastCloudUpdatedAt || isCloudNewerThanLastKnown(row.updated_at)) {
          setLocalDashboardState(row.state);
        }
        markLastSynced(new Date().toISOString(), row.updated_at || new Date().toISOString());
      } else {
        const defaultState = emptyDashboardState();
        setLocalDashboardState(defaultState);
        await pushCloudState({ silentSuccess: true });
      }
    }
  }

  async function initializeAuth() {
    const { data: { session } } = await sb.auth.getSession();
    await handleAuthStateChange('INITIAL_SESSION', session || null);
  }

  function bindCloudEvents() {
    cloud.signInBtn.addEventListener('click', signInWithPassword);
    cloud.signOutBtn.addEventListener('click', signOutCloud);
    cloud.exportBtn.addEventListener('click', exportCloudBackup);
    cloud.importBtn.addEventListener('click', openImportModal);

    const submitSignIn = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        signInWithPassword();
      }
    };

    cloud.emailInput.addEventListener('keydown', submitSignIn);
    cloud.passwordInput.addEventListener('keydown', submitSignIn);

    sb.auth.onAuthStateChange((event, session) => {
      handleAuthStateChange(event, session).catch((error) => {
        setStatus(`Auth state failed: ${error.message}`, 'error');
      });
    });
  }

  function bindMeetingEvents() {
    resetMeetingEntryAutofillState();

    const markDateTouched = () => {
      meetingUserTouchedDate = true;
    };
    const markTimeTouched = () => {
      meetingUserTouchedTime = true;
    };
    meeting.dateInput.addEventListener('input', markDateTouched);
    meeting.dateInput.addEventListener('change', markDateTouched);
    meeting.hourInput.addEventListener('input', markTimeTouched);
    meeting.hourInput.addEventListener('change', markTimeTouched);
    meeting.minuteInput.addEventListener('input', markTimeTouched);
    meeting.minuteInput.addEventListener('change', markTimeTouched);
    meeting.titleInput.addEventListener('input', autofillMeetingDateTimeOnFirstTitleChar);

    meeting.form.addEventListener('submit', (event) => {
      event.preventDefault();
      const added = addMeeting(meeting.titleInput.value, meeting.dateInput.value, buildTimeValue(meeting.hourInput.value, meeting.minuteInput.value), meeting.notesEditor.innerHTML);
      if (!added) return;
      meeting.form.reset();
      meeting.minuteInput.value = '00';
      meeting.notesEditor.innerHTML = '';
      resetMeetingEntryAutofillState();
      meeting.titleInput.focus();
    });

    if (meeting.bigBtn) {
      meeting.bigBtn.addEventListener('click', () => {
        const title = meeting.titleInput.value.trim();
        if (!title) {
          setStatus('Enter a meeting title first', 'warning');
          meeting.titleInput.focus();
          return;
        }
        const timeValue = buildTimeValue(meeting.hourInput.value, meeting.minuteInput.value);
        const parsed = parseLocalDateTime(meeting.dateInput.value, timeValue);
        if (!parsed) {
          setStatus('Set meeting date and time first', 'warning');
          meeting.dateInput.focus();
          return;
        }
        const created = addMeeting(title, meeting.dateInput.value, timeValue, meeting.notesEditor.innerHTML, { allowEmptyNotes: true, draft: true, autosyncImmediate: true });
        if (!created) return;
        meeting.form.reset();
        meeting.minuteInput.value = '00';
        meeting.notesEditor.innerHTML = '';
        resetMeetingEntryAutofillState();
        openMeetingBigEdit(created.id);
      });
    }

    meeting.form.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        meeting.form.requestSubmit();
      }
    });
  }

  function bindCardToggleEvents() {
    document.querySelectorAll('[data-card-toggle]').forEach((toggle) => {
      toggle.addEventListener('click', () => {
        const cardId = toggle.dataset.cardToggle;
        uiState.collapsedCards[cardId] = !uiState.collapsedCards[cardId];
        saveUiState();
        renderCardCollapseState();
        renderCollapseAllButton();
      });
    });
  }

  function bindCardMoveEvents() {
    document.querySelectorAll('[data-card-move]').forEach((button) => {
      button.addEventListener('click', () => {
        moveCard(button.dataset.cardMove, button.dataset.direction);
      });
    });
  }

  function bindBigTicketEvents() {
    bigTicket.form.addEventListener('submit', (event) => {
      event.preventDefault();
      const added = addBigTicketItem(bigTicket.input.innerHTML);
      if (!added) return;
      bigTicket.input.innerHTML = '';
      bigTicket.input.focus();
    });

    bigTicket.input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        bigTicket.form.requestSubmit();
      }
    });
  }

  function bindGeneralNotesEvents() {
    generalNotes.form.addEventListener('submit', (event) => {
      event.preventDefault();
      const added = addGeneralNote(generalNotes.dateInput.value, generalNotes.titleInput.value, generalNotes.editor.innerHTML);
      if (!added) return;
      generalNotes.form.reset();
      generalNotes.editor.innerHTML = '';
      generalNotes.dateInput.focus();
    });
  }


  populateHourOptions(meeting.hourInput);
  populateHourOptions(meetingBigEditHourInput);
  meeting.minuteInput.value = '00';

  document.querySelectorAll('.rtf-toolbar').forEach(bindRtfToolbar);
  bindEditorShortcuts(modalTextInput);
  bindEditorShortcuts(lists.general.input);
  bindEditorShortcuts(lists.personal.input);
  bindEditorShortcuts(lists.scheduling.input);
  bindEditorShortcuts(meeting.notesEditor);
  bindEditorShortcuts(meetingBigEditNotesEditor);
  bindEditorShortcuts(bigTicket.input);
  bindEditorShortcuts(bigTicketModalEditor);
  bindEditorShortcuts(generalNotes.editor);
  bindEditorShortcuts(generalNoteBigEditEditor);

  bindActionShortcutEditor(meeting.notesEditor);
  bindActionShortcutEditor(meetingBigEditNotesEditor);
  bindActionShortcutEditor(generalNotes.editor);
  bindActionShortcutEditor(generalNoteBigEditEditor);

  modalSaveBtn.addEventListener('click', () => {
    if (persistModalChanges()) closeModal(true);
  });

  bindPriorityDirectionControls(modalUrgencyBtn, (direction) => {
    const action = getActiveModalAction();
    if (!action || !activeModalContext || action.deleted) return;
    cycleUrgency(action, direction);
    queueMovedActionHighlight(activeModalContext.list, action);
    saveList(activeModalContext.list);
    modalStatus.textContent = modalStatusText(action);
    updateModalUrgencyUI(action);
    updateModalTimeDependentUI(action);
    renderList(activeModalContext.list);
  });

  if (modalTimeDependentBtn) {
    modalTimeDependentBtn.addEventListener('click', () => {
      const action = getActiveModalAction();
      if (!action || !activeModalContext || action.deleted) return;
      action.timingFlag = cycleTimingFlag(action.timingFlag || null);
      action.updatedAt = Date.now();
      queueMovedActionHighlight(activeModalContext.list, action);
      saveList(activeModalContext.list);
      modalStatus.textContent = modalStatusText(action);
      updateModalTimeDependentUI(action);
      renderList(activeModalContext.list);
    });
  }


  if (modalDictateBtn) {
    modalDictateBtn.addEventListener('click', () => startDictation(modalDictateBtn, modalTextInput, modalTextInput));
  }

  if (meetingBigEditDictateBtn) {
    meetingBigEditDictateBtn.addEventListener('click', () => startDictation(meetingBigEditDictateBtn, meetingBigEditNotesEditor, meetingBigEditNotesEditor));
  }

  if (generalNoteBigEditDictateBtn) {
    generalNoteBigEditDictateBtn.addEventListener('click', () => startDictation(generalNoteBigEditDictateBtn, generalNoteBigEditEditor, generalNoteBigEditEditor));
  }

  meetingBigEditForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (saveMeetingBigEdit()) closeMeetingBigEdit();
  });

  meetingBigEditClose.addEventListener('click', closeMeetingBigEdit);
  meetingBigEditCancel.addEventListener('click', closeMeetingBigEdit);
  meetingBigEditBackdrop.addEventListener('click', closeMeetingBigEdit);

  bigTicketModalSave.addEventListener('click', () => {
    if (saveBigTicketModal()) closeBigTicketModal(true);
  });
  bigTicketModalClose.addEventListener('click', () => closeBigTicketModal());
  bigTicketModalBackdrop.addEventListener('click', () => closeBigTicketModal());

  generalNoteBigEditForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (saveGeneralNoteBigEdit()) closeGeneralNoteBigEdit();
  });
  generalNoteBigEditClose.addEventListener('click', closeGeneralNoteBigEdit);
  generalNoteBigEditCancel.addEventListener('click', closeGeneralNoteBigEdit);
  generalNoteBigEditBackdrop.addEventListener('click', closeGeneralNoteBigEdit);

  modalCloseBtn.addEventListener('click', () => closeModal());
  if (modalCancelBtn) modalCancelBtn.addEventListener('click', () => closeModal());

  settingsBtn.addEventListener('click', openSettingsModal);
  cloud.collapseAllBtn.addEventListener('click', toggleAllCardsCollapse);
  settingsForm.addEventListener('submit', (event) => {
    event.preventDefault();
    previewSettingsTheme();
    saveSettingsModal();
    closeSettingsModal({ revert: false });
  });
  themePresetSelect.addEventListener('change', applyThemePresetFromSettings);
  [themeBannerBgInput, themeBannerFgInput, themePageBgInput, themeCardHeaderBgInput, themeCardHeaderFgInput]
    .forEach((input) => input.addEventListener('input', onThemeColorInputChange));
  settingsCancelBtn.addEventListener('click', () => closeSettingsModal());
  settingsModalClose.addEventListener('click', () => closeSettingsModal());
  settingsModalBackdrop.addEventListener('click', () => closeSettingsModal());
  importForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const [file] = importFileInput.files || [];
    const modeInput = importForm.querySelector('input[name="import-mode"]:checked');
    if (!file || !modeInput?.value) {
      setStatus('Select a file and import mode first.', 'warning');
      return;
    }
    const imported = await importCloudBackup(file, modeInput.value);
    if (imported) closeImportModal();
  });
  importCancelBtn.addEventListener('click', closeImportModal);
  importModalClose.addEventListener('click', closeImportModal);
  importModalBackdrop.addEventListener('click', closeImportModal);
  modalBackdrop.addEventListener('click', () => closeModal());
  window.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (!importModal.hidden) {
      closeImportModal();
      return;
    }
    if (!settingsModal.hidden) {
      closeSettingsModal();
      return;
    }
    if (!generalNoteBigEditModal.hidden) {
      closeGeneralNoteBigEdit();
      return;
    }
    if (!bigTicketModal.hidden) {
      closeBigTicketModal();
      return;
    }
    if (!meetingBigEditModal.hidden) {
      closeMeetingBigEdit();
      return;
    }
    if (!modal.hidden) closeModal();
  });

  window.addEventListener('resize', () => {
    document.querySelectorAll('.action-item').forEach((row) => updateRowTruncation(row));
  });

  window.addEventListener('focus', scheduleFocusRefresh);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') scheduleFocusRefresh();
  });

  if (globalPersonFilterSelect) {
    globalPersonFilterSelect.addEventListener('change', (event) => {
      setPersonFilter(event.target.value || 'All');
    });
  }

  if (globalTagFilterSelect) {
    globalTagFilterSelect.addEventListener('change', (event) => {
      setTagFilter(event.target.value || 'All');
    });
  }

  let searchDebounceTimer = null;
  if (globalSearchFilterInput) {
    globalSearchFilterInput.value = typeof uiState.searchQuery === 'string' ? uiState.searchQuery : '';
    globalSearchFilterInput.addEventListener('input', (event) => {
      window.clearTimeout(searchDebounceTimer);
      const value = event.target.value || '';
      searchDebounceTimer = window.setTimeout(() => {
        setSearchQuery(value);
      }, 200);
    });
  }

  if (globalFilterClearBtn) {
    globalFilterClearBtn.addEventListener('click', () => {
      uiState.personFilter = 'All';
      uiState.tagFilter = 'All';
      uiState.searchQuery = '';
      persistViewFilters();
      renderAll();
    });
  }

  if (privacyToggleBtn) {
    privacyToggleBtn.addEventListener('click', () => setPrivacyMode(!privacyMode));
    setPrivacyMode(privacyMode);
  }

  if (generalNoteTabText) generalNoteTabText.addEventListener('click', () => setGeneralNoteEditMode('text'));
  if (generalNoteTabWhiteboard) generalNoteTabWhiteboard.addEventListener('click', () => setGeneralNoteEditMode('whiteboard'));

  document.querySelectorAll('.whiteboard-tool-btn[data-whiteboard-tool]').forEach((btn) => {
    if ((btn.dataset.whiteboardTool || 'pen') === whiteboardState.tool) btn.classList.add('active');
    btn.addEventListener('click', () => {
      whiteboardState.tool = btn.dataset.whiteboardTool || 'pen';
      if (whiteboardState.tool !== 'select') whiteboardState.selectedImageId = null;
      document.querySelectorAll('.whiteboard-tool-btn[data-whiteboard-tool]').forEach((n) => n.classList.toggle('active', n === btn));
      redrawWhiteboard();
      updateWhiteboardImageActions();
    });
  });

  if (whiteboardUndoBtn) {
    whiteboardUndoBtn.addEventListener('click', () => {
      if (!whiteboardCanvas || !whiteboardState.undoStack.length) return;
      const previous = whiteboardState.undoStack.pop();
      try {
        applyWhiteboardSnapshot(JSON.parse(previous));
      } catch (_error) {
        loadWhiteboardImage(previous || null, { images: [] });
      }
      whiteboardState.touched = true;
      whiteboardState.hasContent = Boolean(whiteboardState.baseSnapshot) || whiteboardState.images.length > 0;
    });
  }

  if (whiteboardClearBtn) {
    whiteboardClearBtn.addEventListener('click', () => {
      pushWhiteboardUndo();
      whiteboardState.baseSnapshot = null;
      whiteboardState.images = [];
      whiteboardState.selectedImageId = null;
      fillWhiteboardBackground();
      whiteboardState.hasContent = false;
      whiteboardState.touched = true;
      updateWhiteboardImageActions();
    });
  }

  if (whiteboardImageDeleteBtn) {
    whiteboardImageDeleteBtn.addEventListener('click', () => {
      if (!whiteboardState.selectedImageId) return;
      pushWhiteboardUndo();
      whiteboardState.images = whiteboardState.images.filter((item) => item.id !== whiteboardState.selectedImageId);
      whiteboardState.selectedImageId = null;
      whiteboardState.touched = true;
      whiteboardState.hasContent = Boolean(whiteboardState.baseSnapshot) || whiteboardState.images.length > 0;
      redrawWhiteboard();
      updateWhiteboardImageActions();
    });
  }

  if (whiteboardImageForwardBtn) {
    whiteboardImageForwardBtn.addEventListener('click', () => {
      const selected = whiteboardState.selectedImageId;
      if (!selected) return;
      const idx = whiteboardState.images.findIndex((img) => img.id === selected);
      if (idx < 0 || idx === whiteboardState.images.length - 1) return;
      pushWhiteboardUndo();
      const [img] = whiteboardState.images.splice(idx, 1);
      whiteboardState.images.splice(idx + 1, 0, img);
      whiteboardState.touched = true;
      redrawWhiteboard();
    });
  }

  if (whiteboardImageBackwardBtn) {
    whiteboardImageBackwardBtn.addEventListener('click', () => {
      const selected = whiteboardState.selectedImageId;
      if (!selected) return;
      const idx = whiteboardState.images.findIndex((img) => img.id === selected);
      if (idx <= 0) return;
      pushWhiteboardUndo();
      const [img] = whiteboardState.images.splice(idx, 1);
      whiteboardState.images.splice(idx - 1, 0, img);
      whiteboardState.touched = true;
      redrawWhiteboard();
    });
  }

  document.addEventListener('paste', (event) => {
    if (generalNoteBigEditModal.hidden || whiteboardState.mode !== 'whiteboard') return;
    const items = Array.from(event.clipboardData?.items || []);
    const imageItem = items.find((item) => item.type === 'image/png' || item.type === 'image/jpeg');
    if (!imageItem) return;
    const file = imageItem.getAsFile();
    if (!file) return;
    event.preventDefault();
    loadImageFileToWhiteboard(file);
  });

  if (whiteboardCanvasWrap) {
    whiteboardCanvasWrap.addEventListener('dragover', (event) => {
      if (generalNoteBigEditModal.hidden || whiteboardState.mode !== 'whiteboard') return;
      event.preventDefault();
    });
    whiteboardCanvasWrap.addEventListener('drop', (event) => {
      if (generalNoteBigEditModal.hidden || whiteboardState.mode !== 'whiteboard') return;
      const files = Array.from(event.dataTransfer?.files || []).filter((file) => file.type.startsWith('image/'));
      if (!files.length) return;
      event.preventDefault();
      const point = whiteboardPoint(event);
      whiteboardState.lastPointerPosition = point;
      loadImageFileToWhiteboard(files[0], point);
    });
  }

  if (whiteboardCanvas) {
    const onPointerDown = (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      const point = whiteboardPoint(event);
      whiteboardState.lastPointerPosition = point;
      if (whiteboardState.tool === 'select') {
        const hit = hitTestWhiteboardImage(point);
        whiteboardState.selectedImageId = hit?.id || null;
        if (hit) {
          whiteboardState.draggingImageId = hit.id;
          whiteboardState.dragOffset = { x: point.x - hit.x, y: point.y - hit.y };
          pushWhiteboardUndo();
          whiteboardCanvas.setPointerCapture(event.pointerId);
        }
        redrawWhiteboard();
        updateWhiteboardImageActions();
        return;
      }
      if (whiteboardState.tool === 'text') {
        const text = window.prompt('Enter text');
        if (!text) return;
        pushWhiteboardUndo();
        const ctx = getWhiteboardCtx();
        if (!ctx) return;
        ctx.save();
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = whiteboardColorInput?.value || '#1f2937';
        ctx.font = '16px sans-serif';
        ctx.textBaseline = 'top';
        ctx.fillText(text, point.x, point.y);
        ctx.restore();
        whiteboardState.baseSnapshot = whiteboardCanvas.toDataURL('image/png');
        redrawWhiteboard();
        whiteboardState.touched = true;
        whiteboardState.hasContent = true;
        return;
      }
      whiteboardCanvas.setPointerCapture(event.pointerId);
      event.preventDefault();
      pushWhiteboardUndo();
      whiteboardState.baseSnapshot = whiteboardCanvas.toDataURL('image/png');
      renderWhiteboardBase(whiteboardState.baseSnapshot);
      whiteboardState.drawing = true;
      whiteboardState.start = point;
      const ctx = getWhiteboardCtx();
      if (!ctx) return;
      if (whiteboardState.tool === 'pen' || whiteboardState.tool === 'eraser') {
        ctx.beginPath();
        ctx.moveTo(whiteboardState.start.x, whiteboardState.start.y);
      }
    };
    const onPointerMove = (event) => {
      const point = whiteboardPoint(event);
      whiteboardState.lastPointerPosition = point;
      if (whiteboardState.tool === 'select' && whiteboardState.draggingImageId) {
        const image = whiteboardState.images.find((item) => item.id === whiteboardState.draggingImageId);
        if (!image) return;
        image.x = point.x - whiteboardState.dragOffset.x;
        image.y = point.y - whiteboardState.dragOffset.y;
        redrawWhiteboard();
        return;
      }
      if (!whiteboardState.drawing) return;
      const ctx = getWhiteboardCtx();
      if (!ctx) return;
      if (whiteboardState.tool === 'pen' || whiteboardState.tool === 'eraser') {
        ctx.lineWidth = Number(whiteboardWidthInput?.value || 3);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalCompositeOperation = whiteboardState.tool === 'eraser' ? 'destination-out' : 'source-over';
        ctx.strokeStyle = whiteboardColorInput?.value || '#1f2937';
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
        ctx.globalCompositeOperation = 'source-over';
      } else {
        drawShapePreview(whiteboardState.start, point);
      }
    };
    const onPointerUp = (event) => {
      if (whiteboardState.tool === 'select' && whiteboardState.draggingImageId) {
        if (whiteboardCanvas.hasPointerCapture(event.pointerId)) whiteboardCanvas.releasePointerCapture(event.pointerId);
        whiteboardState.draggingImageId = null;
        whiteboardState.touched = true;
        whiteboardState.hasContent = Boolean(whiteboardState.baseSnapshot) || whiteboardState.images.length > 0;
        updateWhiteboardImageActions();
        return;
      }
      if (!whiteboardState.drawing) return;
      if (whiteboardState.tool === 'line' || whiteboardState.tool === 'rect' || whiteboardState.tool === 'circle') {
        drawShape(whiteboardState.start, whiteboardPoint(event));
      }
      if (whiteboardCanvas.hasPointerCapture(event.pointerId)) {
        whiteboardCanvas.releasePointerCapture(event.pointerId);
      }
      whiteboardState.baseSnapshot = whiteboardCanvas.toDataURL('image/png');
      redrawWhiteboard();
      whiteboardState.drawing = false;
      whiteboardState.touched = true;
      whiteboardState.hasContent = true;
    };
    whiteboardCanvas.addEventListener('pointerdown', onPointerDown);
    whiteboardCanvas.addEventListener('pointermove', onPointerMove);
    whiteboardCanvas.addEventListener('pointerup', onPointerUp);
    whiteboardCanvas.addEventListener('pointercancel', onPointerUp);
  }


  window.addEventListener('resize', () => {
    resizeWhiteboardCanvas();
  });

  bindListEvents(lists.general);
  bindListEvents(lists.personal);
  bindListEvents(lists.scheduling);
  bindMeetingEvents();
  bindBigTicketEvents();
  bindGeneralNotesEvents();
  applyTheme(defaultTheme);
  bindCardToggleEvents();
  bindCloudEvents();
  loadData();
  renderAll();
  initializeAuth().catch((error) => {
    setStatus(`Auth check failed: ${error.message}`, 'error');
  });
})();
