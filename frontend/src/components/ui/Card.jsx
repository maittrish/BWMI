import './Card.css';

export default function Card({ children, className = '', onClick, hoverable = false, glowing = false, ...props }) {
  return (
    <div
      className={`card glass ${hoverable ? 'card-hoverable' : ''} ${glowing ? 'card-glowing' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  );
}
