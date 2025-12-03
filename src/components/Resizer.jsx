export default function Resizer({ isResizing, onMouseDown }) {
  return (
    <div 
      className={`resizer ${isResizing ? 'resizing' : ''}`}
      onMouseDown={onMouseDown}
    >
      <div className="resizer-line"></div>
    </div>
  );
}
