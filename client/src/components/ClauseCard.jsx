export default function ClauseCard({ clause }) {
  return (
    <article className={`clause ${clause.riskLevel}`}>
      <div className="clause-head">
        <h3>{clause.title}</h3>
        <span className={`badge ${clause.riskLevel}`}>{clause.riskLevel}</span>
      </div>

      <blockquote>{clause.originalText}</blockquote>

      <p className="why">
        <strong>Why it matters: </strong>
        {clause.explanation}
      </p>

      <div className="plain">
        <span className="plain-label">💡 In plain English</span>
        <p>{clause.plainEnglish}</p>
      </div>
    </article>
  );
}