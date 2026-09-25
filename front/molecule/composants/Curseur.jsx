export default function Curseur({ label, unite = '', valeur, min, max, onChange }) {
  return (
    <label className="champ mt-4 w-full block">
      <span className="champ-label">
        {label}{' '}
        <strong>
          {valeur}
          {unite ? ' ' + unite : ''}
        </strong>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={valeur}
        onChange={(e) => onChange(Number(e.target.value))}
        className="!font-bold w-full"
      />
    </label>
  )
}