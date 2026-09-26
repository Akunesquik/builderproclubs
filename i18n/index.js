import fr from './fr.js'
import en from './en.js'

export const translations = {
  fr,
  en,
}

export const DEFAULT_LANGUAGE = 'fr'

export const getInitialLanguage = () => {
  const savedLanguage =
    localStorage.getItem('fc27-language')

  if (
    savedLanguage === 'fr' ||
    savedLanguage === 'en'
  ) {
    return savedLanguage
  }

  const browserLanguage =
    navigator.language?.toLowerCase() || ''

  if (
    browserLanguage.startsWith('en')
  ) {
    return 'en'
  }

  return DEFAULT_LANGUAGE
}

export { fr, en }