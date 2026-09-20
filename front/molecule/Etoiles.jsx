/** Affichage ★★★☆☆ pour les gestes techniques et le mauvais pied. */
export default function Etoiles({ valeur, max }) {
  return (
    <span className="etoiles" aria-label={`${valeur} étoiles sur ${max}`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < valeur ? 'etoile pleine' : 'etoile'}>
          ★
        </span>
      ))}
    </span>
  )
}
