import './Loader.css';

export default function Loader({ size = 'md', text = '' }) {
  return (
    <div className={`loader-container loader-${size}`}>
      <div className="loader">
        <div className="loader-ring" />
        <div className="loader-ring" />
        <div className="loader-ring" />
        <span className="loader-emoji">🤝</span>
      </div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
}
