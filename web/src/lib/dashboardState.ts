export type DashboardUiState = {
  quickFilter: string
  activeView: 'team'
  status: 'active'
}

export type WorkingDashboardState = {
  ui: DashboardUiState
  generalNotes: string[]
  meetingNotes: string[]
  generalActions: string[]
  bigTicketItems: string[]
  scheduling: {
    workspace: string
  }
}

export type DashboardMigrationExport = {
  schema: 'work_dashboard_migration_v1'
  sourceApp: 'WorkingDashboard'
  exportedAt: string
  sourceUserId: string | null
  state: WorkingDashboardState
}

export const DASHBOARD_STATE_STORAGE_KEY = 'workingDashboard.state'

export const defaultDashboardState: WorkingDashboardState = {
  ui: {
    quickFilter: '',
    activeView: 'team',
    status: 'active',
  },
  generalNotes: [],
  meetingNotes: [],
  generalActions: [],
  bigTicketItems: [],
  scheduling: {
    workspace: 'Angus Working Dashboard',
  },
}

export function isWorkingDashboardState(value: unknown): value is WorkingDashboardState {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false
  }

  const candidate = value as Partial<WorkingDashboardState>

  return (
    !!candidate.ui &&
    typeof candidate.ui === 'object' &&
    !Array.isArray(candidate.ui) &&
    Array.isArray(candidate.generalNotes) &&
    Array.isArray(candidate.meetingNotes) &&
    Array.isArray(candidate.generalActions) &&
    Array.isArray(candidate.bigTicketItems) &&
    !!candidate.scheduling &&
    typeof candidate.scheduling === 'object' &&
    !Array.isArray(candidate.scheduling)
  )
}

export function getPersistedDashboardState(): WorkingDashboardState | null {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = window.localStorage.getItem(DASHBOARD_STATE_STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    const parsed: unknown = JSON.parse(raw)
    return isWorkingDashboardState(parsed) ? parsed : null
  } catch {
    return null
  }
}

function formatTimestampForFilename(value: string): string {
  return value.replace(/[:T]/g, '-').replace(/\.\d{3}Z$/, '').replace(/Z$/, '')
}


export function resolveFreshestDashboardState(params: {
  inMemoryState?: WorkingDashboardState | null
  persistedState?: WorkingDashboardState | null
  cloudLoadedState?: WorkingDashboardState | null
}): WorkingDashboardState {
  return params.inMemoryState ?? params.persistedState ?? params.cloudLoadedState ?? defaultDashboardState
}

export function buildMigrationExport(params: {
  state: WorkingDashboardState
  sourceUserId: string | null
  exportedAt?: string
}): DashboardMigrationExport {
  const exportedAt = params.exportedAt ?? new Date().toISOString()

  return {
    schema: 'work_dashboard_migration_v1',
    sourceApp: 'WorkingDashboard',
    exportedAt,
    sourceUserId: params.sourceUserId,
    state: params.state,
  }
}

export function buildMigrationFilename(exportedAt: string): string {
  return `working-dashboard-migration-${formatTimestampForFilename(exportedAt)}.json`
}

export function downloadJsonFile(filename: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = window.URL.createObjectURL(blob)
  const anchor = window.document.createElement('a')

  anchor.href = url
  anchor.download = filename
  anchor.click()

  window.URL.revokeObjectURL(url)
}
