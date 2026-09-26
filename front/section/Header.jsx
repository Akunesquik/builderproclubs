import { useState } from 'react'
import { useLanguage } from '../../i18n/context.jsx'

export default function Header({
  ajustementsAffiches,
  setAjustementsAffiches,
  reinitialiser,
  lien,
}) {
  const [copie, setCopie] = useState(false)
  const { t, langue, setLangue } = useLanguage()

  function copierLien() {
    const url =
      window.location.origin +
      window.location.pathname +
      lien

    navigator.clipboard.writeText(url).then(() => {
      setCopie(true)
      setTimeout(() => setCopie(false), 2000)
    })
  }

  function changerLangue() {
    setLangue(langue === 'fr' ? 'en' : 'fr')
  }

  return (
    <header className="app-header mt-2">
      <div>
        <div className="marque">
          <span className="marque-jeu">FC 27</span>

          <h1>{t.app.title}</h1>
        </div>

        <p className="accroche">
          {t.header.tagline}
        </p>
      </div>

      <div className="actions">
        <button
          className="bouton"
          onClick={copierLien}
        >
          {copie
            ? t.actions.copied
            : t.actions.copy}
        </button>

        <button
          className="bouton fantome"
          onClick={reinitialiser}
        >
          {t.actions.reset}
        </button>

        <button
          type="button"
          onClick={() =>
            setAjustementsAffiches(
              (v) => !v
            )
          }
          className={
            'bouton fantome' +
            (ajustementsAffiches
              ? ' actif'
              : '')
          }
        >
          {ajustementsAffiches
            ? `↺ ${t.header.adjustments.hide}`
            : `+/− ${t.header.adjustments.show}`}
        </button>

        {/* Toggle langue */}
        <button
          type="button"
          onClick={changerLangue}
          className="bouton fantome !px-2 shrink-0"
          aria-label={
            langue === 'fr'
              ? t.language.english
              : t.language.french
          }
          title={
            langue === 'fr'
              ? t.language.english
              : t.language.french
          }
        >
          <span className="flex items-center gap-1.5">
            <span
              className={
                langue === 'fr'
                  ? 'opacity-100'
                  : 'opacity-40'
              }
              style={{
                fontSize: '1.25rem',
                lineHeight: 1,
              }}
            >
              <svg
                width="24"
                height="18"
                viewBox="0 0 24 18"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect
                  width="8"
                  height="18"
                  fill="#0055A4"
                />
                <rect
                  x="8"
                  width="8"
                  height="18"
                  fill="#FFFFFF"
                />
                <rect
                  x="16"
                  width="8"
                  height="18"
                  fill="#EF4135"
                />
              </svg>
            </span>

            <span
              className="opacity-40"
              style={{
                fontSize: '0.9rem',
              }}
            >
              /
            </span>

            <span
              className={
                langue === 'en'
                  ? 'opacity-100'
                  : 'opacity-40'
              }
              style={{
                fontSize: '1.25rem',
                lineHeight: 1,
              }}
            >
              <svg
                width="24"
                height="18"
                viewBox="0 0 24 18"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect
                  width="24"
                  height="18"
                  fill="#012169"
                />

                <path
                  d="M0 0L24 18M24 0L0 18"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                />

                <path
                  d="M0 0L24 18M24 0L0 18"
                  stroke="#C8102E"
                  strokeWidth="2"
                />

                <path
                  d="M12 0V18M0 9H24"
                  stroke="#FFFFFF"
                  strokeWidth="6"
                />

                <path
                  d="M12 0V18M0 9H24"
                  stroke="#C8102E"
                  strokeWidth="3"
                />
              </svg>
            </span>
          </span>
        </button>
      </div>
    </header>
  )
}