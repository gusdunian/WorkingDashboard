import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import type { StylePack } from '../theme/createAppTheme'

type UiSettingsContextValue = {
  stylePack: StylePack
  setStylePack: (nextPack: StylePack) => void
}

const STORAGE_KEY = 'ui.stylePack'
const DEFAULT_STYLE_PACK: StylePack = 'enterprise'

const UiSettingsContext = createContext<UiSettingsContextValue | undefined>(undefined)

const allowedStylePacks: StylePack[] = ['gmail', 'saas', 'enterprise', 'minimal']

function getInitialStylePack(): StylePack {
  if (typeof window === 'undefined') {
    return DEFAULT_STYLE_PACK
  }

  const storedValue = window.localStorage.getItem(STORAGE_KEY)
  if (storedValue && allowedStylePacks.includes(storedValue as StylePack)) {
    return storedValue as StylePack
  }

  return DEFAULT_STYLE_PACK
}

export function UiSettingsProvider({ children }: PropsWithChildren) {
  const [stylePack, setStylePack] = useState<StylePack>(getInitialStylePack)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, stylePack)
  }, [stylePack])

  const value = useMemo(
    () => ({
      stylePack,
      setStylePack,
    }),
    [stylePack],
  )

  return <UiSettingsContext.Provider value={value}>{children}</UiSettingsContext.Provider>
}

export function useUiSettings() {
  const context = useContext(UiSettingsContext)

  if (!context) {
    throw new Error('useUiSettings must be used within UiSettingsProvider')
  }

  return context
}
