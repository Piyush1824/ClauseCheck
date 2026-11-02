export default function RiskGauge({ score }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const level = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
  const label = { high: 'High risk', medium: 'Moderate risk', low: 'Low risk' }[level];

  return (
    <div className="gauge">
      <svg viewBox="0 0 140 140" width="140" height="140">
        <circle cx="70" cy="70" r={radius} className="gauge-track" />
        <circle
          cx="70"
          cy="70"
          r={radius}
          className={`gauge-bar ${level}`}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 70 70)"
        />
      </svg>
      <div className="gauge-text">
        <strong>{score}</strong>
        <span>/ 100</span>
      </div>
      <div className={`badge ${level}`}>{label}</div>
    </div>
  );
}