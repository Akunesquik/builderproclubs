import { useLanguage } from '../../../i18n/context.jsx'

/** Affichage ★★★☆☆ pour les gestes techniques et le mauvais pied. */
export default function Etoiles({ valeur, max }) {
  const { t } = useLanguage()

  return (
    <span
      className="etoiles"
      aria-label={
        t.attributes?.starsOf
          ? t.attributes.starsOf(valeur, max)
          : `${valeur} étoiles sur ${max}`
      }
    >
      {Array.from(
        { length: 5 },
        (_, i) => (
          <span
            key={i}
            className={
              i < valeur
                ? 'text-yellow-400'
                : i < max
                  ? 'text-gray-400'
                  : 'text-gray-700'
            }
          >
            ★
          </span>
        )
      )}
    </span>
  )
}