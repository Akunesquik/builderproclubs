import {
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react'

import {
  translations,
  getInitialLanguage,
} from './index.js'

const LanguageContext =
  createContext(null)

export function LanguageProvider({
  children,
}) {
  const [langue, setLangueState] =
    useState(getInitialLanguage)

  const setLangue = (
    nouvelleLangue
  ) => {
    if (
      nouvelleLangue !== 'fr' &&
      nouvelleLangue !== 'en'
    ) {
      return
    }

    setLangueState(nouvelleLangue)

    localStorage.setItem(
      'fc27-language',
      nouvelleLangue
    )
  }

  const value = useMemo(
    () => ({
      langue,
      setLangue,
      t: translations[langue],
    }),
    [langue]
  )

  return (
    <LanguageContext.Provider
      value={value}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context =
    useContext(LanguageContext)

  if (!context) {
    throw new Error(
      'useLanguage doit être utilisé à l’intérieur de LanguageProvider'
    )
  }

  return context
}