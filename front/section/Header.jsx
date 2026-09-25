import { useState } from 'react'

export default function Header({ajustementsAffiches, setAjustementsAffiches, reinitialiser, lien }) {

    const [copie, setCopie] = useState(false)
    function copierLien() {
        const url = window.location.origin + window.location.pathname + lien
        navigator.clipboard.writeText(url).then(() => {
            setCopie(true)
            setTimeout(() => setCopie(false), 2000)
        })
    }

  return (
    <header className="app-header mt-2">
        <div>
          <div className="marque">
            <span className="marque-jeu">FC 27</span>
            <h1>Constructeur de build Clubs Pro</h1>
          </div>

          <p className="accroche">
            Choisis un archétype, dépense tes points d'attribut, vois le prix du point suivant
            monter en temps réel.
          </p>

        </div>

        <div className="actions">
          <button className="bouton" onClick={copierLien}>
            {copie ? 'Lien copié' : 'Copier le lien du build'}
          </button>
          <button className="bouton fantome" onClick={reinitialiser}>
            Tout remettre à zéro
          </button>
          <button
            type="button"
            onClick={() => setAjustementsAffiches((v) => !v)}
            className={
              'bouton fantome' +
              (ajustementsAffiches ? ' actif' : '')
            }
          >
            {ajustementsAffiches ? '↺ Masquer les ajustements' : '+/− Afficher les ajustements'}
          </button>
        </div>

      </header>
  )
}