import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import {
  DASHBOARD_STATE_STORAGE_KEY,
  defaultDashboardState,
  getPersistedDashboardState,
  type WorkingDashboardState,
} from '../lib/dashboardState'

type DashboardStateContextValue = {
  currentUserId: string | null
  state: WorkingDashboardState
  cloudLoadedState: WorkingDashboardState | null
  setQuickFilter: (value: string) => void
}

const DashboardStateContext = createContext<DashboardStateContextValue | undefined>(undefined)

function getInitialDashboardState() {
  return getPersistedDashboardState() ?? defaultDashboardState
}

export function DashboardStateProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<WorkingDashboardState>(getInitialDashboardState)
  const [cloudLoadedState] = useState<WorkingDashboardState | null>(null)
  const [currentUserId] = useState<string | null>(null)

  useEffect(() => {
    window.localStorage.setItem(DASHBOARD_STATE_STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const value = useMemo(
    () => ({
      currentUserId,
      state,
      cloudLoadedState,
      setQuickFilter: (value: string) => {
        setState((currentState) => ({
          ...currentState,
          ui: {
            ...currentState.ui,
            quickFilter: value,
          },
        }))
      },
    }),
    [cloudLoadedState, currentUserId, state],
  )

  return <DashboardStateContext.Provider value={value}>{children}</DashboardStateContext.Provider>
}

export function useDashboardState() {
  const context = useContext(DashboardStateContext)

  if (!context) {
    throw new Error('useDashboardState must be used within DashboardStateProvider')
  }

  return context
}
