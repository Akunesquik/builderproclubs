export default function JaugePoints({ depenses, budget }) {
  const pct = budget ? Math.min(100, (depenses / budget) * 100) : 0
  const restant = budget - depenses
  return (
    <div className="jauge my-4">
      <div className="jauge-chiffre">
        <strong className={restant < 0 ? 'negatif' : ''}>{restant}</strong>
        <span>AP restants</span>
      </div>
      <div className="jauge-piste" role="progressbar" aria-valuenow={depenses} aria-valuemin={0} aria-valuemax={budget}>
        <div className={'jauge-remplissage' + (restant < 0 ? ' depasse' : '')} style={{ width: pct + '%' }} />
      </div>
      <div className="jauge-legende">
        <span>{depenses} dépensés</span>
        <span>{budget} au total</span>
      </div>
      <p className="jauge-aide">Le chiffre sous le + est le prix du point suivant. Il monte par paliers.</p>
    </div>
  )
}