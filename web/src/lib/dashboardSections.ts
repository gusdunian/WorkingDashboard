import type { DashboardState } from './dashboardStateModel';


export type DashboardItemSummary = {
  id: string;
  primary: string;
  secondary?: string;
  date?: string;
};

export type DashboardSection = {
  key: string;
  title: string;
  items: DashboardItemSummary[];
};

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  return value !== null && typeof value === 'object' ? (value as UnknownRecord) : null;
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function firstLine(value: unknown): string {
  const text = asString(value).trim();
  if (!text) return '';
  return text.split(/\r?\n/, 1)[0].trim();
}

function parseItemsArray(state: DashboardState, key: string): UnknownRecord[] {
  const value = state[key];
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => asRecord(item))
    .filter((item): item is UnknownRecord => item !== null);
}

function formatMaybeDate(value: unknown): string | undefined {
  if (typeof value !== 'string' || !value.trim()) {
    return undefined;
  }

  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) {
    return undefined;
  }

  return date.toLocaleDateString();
}

function mapActionItems(items: UnknownRecord[]): DashboardItemSummary[] {
  return items.map((item, index) => {
    const number = item.number;
    const idCandidate = typeof number === 'number' ? `#${number}` : undefined;
    const primaryText = firstLine(item.text) || firstLine(item.html_inline) || firstLine(item.html);
    const primary = primaryText || idCandidate || `Action ${index + 1}`;
    const secondary = idCandidate && idCandidate !== primary ? idCandidate : undefined;

    return {
      id: asString(item.id) || idCandidate || `action-${index}`,
      primary,
      secondary,
      date: formatMaybeDate(item.updatedAt) ?? formatMaybeDate(item.createdAt),
    };
  });
}

function mapMeetingNotes(items: UnknownRecord[]): DashboardItemSummary[] {
  return items.map((item, index) => ({
    id: asString(item.id) || `meeting-${index}`,
    primary: firstLine(item.title) || firstLine(item.notesText) || `Meeting note ${index + 1}`,
    secondary: firstLine(item.notesText) || undefined,
    date: formatMaybeDate(item.datetime) ?? formatMaybeDate(item.updatedAt) ?? formatMaybeDate(item.createdAt),
  }));
}

function mapGeneralNotes(items: UnknownRecord[]): DashboardItemSummary[] {
  return items.map((item, index) => ({
    id: asString(item.id) || `note-${index}`,
    primary: firstLine(item.title) || firstLine(item.text) || `General note ${index + 1}`,
    secondary: firstLine(item.text) || undefined,
    date: formatMaybeDate(item.date) ?? formatMaybeDate(item.updatedAt) ?? formatMaybeDate(item.createdAt),
  }));
}

export function buildDashboardSections(state: DashboardState): DashboardSection[] {
  return [
    {
      key: 'generalActions',
      title: 'General actions',
      items: mapActionItems(parseItemsArray(state, 'generalActions')),
    },
    {
      key: 'personalActions',
      title: 'Personal actions',
      items: mapActionItems(parseItemsArray(state, 'personalActions')),
    },
    {
      key: 'bigTicketItems',
      title: 'Big ticket items',
      items: mapActionItems(parseItemsArray(state, 'bigTicketItems')),
    },
    {
      key: 'schedulingActions',
      title: 'Scheduling actions',
      items: mapActionItems(parseItemsArray(state, 'schedulingActions')),
    },
    {
      key: 'meetingNotes',
      title: 'Meeting notes',
      items: mapMeetingNotes(parseItemsArray(state, 'meetingNotes')),
    },
    {
      key: 'generalNotes',
      title: 'General notes',
      items: mapGeneralNotes(parseItemsArray(state, 'generalNotes')),
    },
  ];
}
