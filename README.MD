# FC 27 — Constructeur de build Clubs Pro

Site statique en React (Vite) pour composer un build Clubs Pro FC 27 : on choisit un
archétype, on dépense ses points d'attribut, et le prix du point suivant se met à jour
en direct. Hébergeable tel quel sur GitHub Pages.

Toutes les données du jeu vivent dans **un seul fichier Excel**, `data/fc27-data.xlsx`.
Le site ne lit jamais l'Excel directement : un script le convertit en JSON.

## Démarrer

```bash
npm install
npm run data     # data/fc27-data.xlsx -> src/data/fc27.json
npm run dev
```

## Le fichier Excel

Ne remplis que les cellules jaunes. Un onglet « Lisez-moi » rappelle le rôle de chacun.

| Onglet | Contenu |
| --- | --- |
| `Archetypes` | Les 13 archétypes : id, nom, groupe (GK/DEF/MID/ATT), poste, PlayStyle signature, description. |
| `Attributs` | La liste des attributs et leur catégorie. L'ordre des lignes = l'ordre affiché. |
| `StatsBase` | Valeur de départ de chaque attribut, par archétype. Une ligne par archétype, une colonne par attribut. |
| `StatsMax` | Plafond de chaque attribut. Mets la même valeur que la base pour masquer l'attribut. |
| `CoutsAP` | **Le tableau des prix.** Une ligne par palier : `valeur_min`, `valeur_max`, `cout_par_point`. |
| `CoutsRemises` | Multiplicateur de prix par archétype et par attribut. `0,6` = attribut clé, 40 % moins cher. |
| `Niveaux` | AP gagnés à chaque niveau et budget cumulé. |
| `PlayStyles` | Jusqu'à trois seuils d'attributs par PlayStyle. |

### Comment le prix est calculé

`CoutsAP` donne le coût pour passer de la valeur `v` à `v + 1`. Avec les paliers livrés,
monter Finition de 84 à 85 coûte 5 AP, de 85 à 86 en coûte 8. Si l'attribut figure dans
`CoutsRemises` pour cet archétype, le coût est multiplié puis arrondi, avec un minimum de
1 AP. Le total dépensé est la somme de tous les points achetés depuis la valeur de base.

L'`id` d'un archétype ne doit jamais changer : il est encodé dans les liens de partage.

> Les chiffres livrés sont des estimations de départ. Remplace-les par tes relevés en jeu :
> c'est la seule partie du projet qui demande du travail manuel.

## Mettre en ligne sur GitHub Pages

1. Pousse le dépôt sur GitHub.
2. Dans *Settings → Pages*, choisis **GitHub Actions** comme source.
3. Le workflow `.github/workflows/deploy.yml` régénère le JSON depuis l'Excel, construit
   le site et le publie à chaque push sur `main`.

`vite.config.js` lit `VITE_BASE` ; le workflow le règle automatiquement sur le nom du
dépôt. En local, la valeur par défaut est `/fc27-builder/`.

## Démo sans build

`npm run demo` assemble `dist-demo/index.html` : un fichier HTML autonome qui contient le
même code, React chargé depuis un CDN. Pratique pour montrer le site à quelqu'un.

## Partage de build

L'état complet est encodé dans l'URL (`#/b/…`) : archétype, niveau, et l'écart de chaque
attribut par rapport à sa base. Aucun serveur, aucune base de données.

## Structure

```
data/fc27-data.xlsx      la base de données
scripts/build-data.mjs   Excel -> src/data/fc27.json
scripts/make-preview.mjs génère la démo autonome
src/App.jsx              toute l'application
src/styles.css           les styles
```

## Pistes pour la suite

- Masteries et Amps de FC 27 (bonus permanents et temporaires).
- Spécialisations par archétype.
- Builds prédéfinis à charger en un clic.
- Comparaison de deux builds côte à côte.
- Répartition automatique des AP selon un profil choisi.

Site non affilié à EA Sports.
