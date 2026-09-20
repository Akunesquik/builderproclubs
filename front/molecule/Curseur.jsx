export default function Curseur({ label, unite = '', valeur, min, max, onChange }) {
  return (
    <label className="champ">
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
      />
    </label>
  )
}
