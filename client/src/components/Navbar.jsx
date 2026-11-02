export default function Navbar({ onReset }) {
  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="logo">
          <span className="logo-mark">§</span> ClauseCheck
        </div>
        {onReset && (
          <button className="btn btn-ghost" onClick={onReset}>
            + New document
          </button>
        )}
      </div>
    </header>
  );
}