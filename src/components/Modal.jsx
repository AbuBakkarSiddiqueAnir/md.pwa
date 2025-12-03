export default function Modal({ 
  isOpen, 
  title, 
  placeholder,
  value,
  onChange,
  onClose,
  onSubmit,
  submitLabel = "Create"
}) {
  if (!isOpen) return null;

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{title}</h2>
        <input
          type="text"
          className="modal-input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          autoFocus
        />
        <div className="modal-actions">
          <button 
            className="btn btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary"
            onClick={onSubmit}
            disabled={!value.trim()}
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
