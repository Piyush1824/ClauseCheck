import { useRef, useState } from 'react';

export default function UploadCard({ onFile, loading, step, error }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  function pick(file) {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('Please choose a PDF file.');
      return;
    }
    onFile(file);
  }

  return (
    <section className="hero">
      <span className="pill">AI contract review</span>
      <h1>Understand what you're signing, in plain English</h1>
      <p className="sub">
        Upload a rental agreement, offer letter, or freelance contract. We flag risky
        clauses and translate the legal jargon.
      </p>

      <div
        className={`dropzone ${dragging ? 'drag' : ''} ${loading ? 'busy' : ''}`}
        onClick={() => !loading && inputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!loading) pick(e.dataTransfer.files[0]);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          hidden
          onChange={(e) => pick(e.target.files[0])}
        />
        {loading ? (
          <>
            <div className="spinner" />
            <p className="drop-title">{step}</p>
            <p className="muted">This can take 10-20 seconds</p>
          </>
        ) : (
          <>
            <div className="drop-icon">📄</div>
            <p className="drop-title">Drop your PDF here, or click to browse</p>
            <p className="muted">Text-based PDFs only, up to 10 MB</p>
          </>
        )}
      </div>

      {error && <div className="error">⚠️ {error}</div>}
    </section>
  );
}