import { useState } from 'react';
import RiskGauge from './RiskGauge';
import ClauseCard from './ClauseCard';
import ChatPanel from './ChatPanel';

const FILTERS = ['all', 'high', 'medium', 'low'];

export default function Results({ doc, analysis }) {
  const [filter, setFilter] = useState('all');
  const clauses = analysis.clauses.filter(
    (c) => filter === 'all' || c.riskLevel === filter
  );
  const count = (level) => analysis.clauses.filter((c) => c.riskLevel === level).length;

  return (
    <div className="results">
      <div className="results-main">
        <section className="card summary">
          <RiskGauge score={analysis.riskScore} />
          <div className="summary-text">
            <p className="muted">
              {analysis.contractType} · {doc.fileName} · {doc.pageCount} page(s)
            </p>
            <h2>Summary</h2>
            <p>{analysis.summary}</p>
            <div className="stats">
              <span className="badge high">{count('high')} high</span>
              <span className="badge medium">{count('medium')} medium</span>
              <span className="badge low">{count('low')} low</span>
            </div>
          </div>
        </section>

        <div className="clauses-head">
          <h2>Flagged clauses</h2>
          <div className="tabs">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {clauses.length === 0 && <p className="muted">No clauses in this category.</p>}
        {clauses.map((c, i) => (
          <ClauseCard key={i} clause={c} />
        ))}
      </div>

      <ChatPanel docId={doc.id} />
    </div>
  );
}