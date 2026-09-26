import { useLanguage } from '../../../i18n/context.jsx'
import Curseur from './Curseur.jsx'

export default function JaugePoints({
  depenses,
  budget,
  niveau,
  onNiveau
}) {
  const { t } = useLanguage()

  const pct = budget
    ? Math.min(
        100,
        (depenses / budget) * 100
      )
    : 0

  const restant = budget - depenses

  return (
    <div className="jauge px-3 py-4">
      <div className="jauge-chiffre flex justify-between">
        <div className="flex gap-2">
          <strong
            className={
              restant < 0
                ? 'negatif'
                : ''
            }
          >
            {restant}
          </strong>

          <span>
            {t.jauge?.remainingAp ??
              'AP restants'}
          </span>
        </div>

        <div className="jauge-legende mb-2 text-right">
          <span>
            {depenses} / {budget}
          </span>
        </div>
      </div>

      <div
        className="jauge-piste"
        role="progressbar"
        aria-valuenow={depenses}
        aria-valuemin={0}
        aria-valuemax={budget}
      >
        <div
          className={
            'jauge-remplissage' +
            (restant < 0
              ? ' depasse'
              : '')
          }
          style={{
            width: pct + '%'
          }}
        />
      </div>

      <Curseur
        label={
          t.jauge?.archetypeLevel ??
          "Niveau d'archétype"
        }
        valeur={niveau}
        min={1}
        max={40}
        onChange={onNiveau}
      />
    </div>
  )
}