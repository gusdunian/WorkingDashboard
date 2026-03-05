export type UnknownRecord = Record<string, unknown>;

export type GeneralActionItem = UnknownRecord & {
  id?: string;
  number?: number;
  text?: string;
  body?: string;
  completed?: boolean;
  deleted?: boolean;
  archived?: boolean;
};

export type DashboardState = UnknownRecord & {
  generalActions?: GeneralActionItem[];
  nextActionNumber?: number;
};

function asRecord(value: unknown): UnknownRecord | null {
  return value !== null && typeof value === 'object' ? (value as UnknownRecord) : null;
}

export function normalizeDashboardState(value: unknown): DashboardState {
  const base = asRecord(value) ?? {};
  const actions = Array.isArray(base.generalActions)
    ? base.generalActions.filter((item): item is GeneralActionItem => asRecord(item) !== null)
    : [];

  return {
    ...base,
    generalActions: actions,
  };
}

export function getActionText(action: GeneralActionItem): string {
  if (typeof action.text === 'string') return action.text;
  if (typeof action.body === 'string') return action.body;
  return '';
}

function nextNumberFromActions(actions: GeneralActionItem[]): number {
  const maxNumber = actions.reduce((max, action) => {
    const value = action.number;
    return typeof value === 'number' && Number.isFinite(value) ? Math.max(max, value) : max;
  }, 0);

  return maxNumber + 1;
}

function buildActionId(number: number): string {
  return `action-${number}-${Date.now()}`;
}

export function addGeneralAction(state: DashboardState, text: string): DashboardState {
  const trimmed = text.trim();
  if (!trimmed) return state;

  const actions = Array.isArray(state.generalActions) ? state.generalActions : [];
  const nextNumber =
    typeof state.nextActionNumber === 'number' && Number.isFinite(state.nextActionNumber)
      ? state.nextActionNumber
      : nextNumberFromActions(actions);

  const newAction: GeneralActionItem = {
    id: buildActionId(nextNumber),
    number: nextNumber,
    text: trimmed,
    completed: false,
    deleted: false,
  };

  return {
    ...state,
    generalActions: [...actions, newAction],
    nextActionNumber: nextNumber + 1,
  };
}

export function updateGeneralActionText(state: DashboardState, id: string, text: string): DashboardState {
  const actions = (state.generalActions ?? []).map((action) => {
    const actionId = String(action.id ?? action.number ?? '');
    if (actionId !== id) return action;

    if (typeof action.text === 'string' || typeof action.body !== 'string') {
      return {
        ...action,
        text,
      };
    }

    return {
      ...action,
      body: text,
    };
  });

  return {
    ...state,
    generalActions: actions,
  };
}

export function markGeneralActionFlag(
  state: DashboardState,
  id: string,
  flag: 'completed' | 'deleted',
): DashboardState {
  const actions = (state.generalActions ?? []).map((action) => {
    const actionId = String(action.id ?? action.number ?? '');
    if (actionId !== id) return action;

    return {
      ...action,
      [flag]: true,
    };
  });

  return {
    ...state,
    generalActions: actions,
  };
}

export function getGeneralActionKey(action: GeneralActionItem, index: number): string {
  return String(action.id ?? action.number ?? `action-${index}`);
}
