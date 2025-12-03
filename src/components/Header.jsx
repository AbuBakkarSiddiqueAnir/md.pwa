import { FiFile, FiSave, FiPlus, FiDownload, FiFileText } from 'react-icons/fi';

export default function Header({ currentFile, onNewFile, onDownload }) {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <FiFileText className="logo-icon" />
          <span>Markdown Preview</span>
        </div>
        {currentFile && (
          <div style={{ 
            fontSize: '0.875rem', 
            color: 'var(--text-tertiary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <FiFile size={14} />
            {currentFile.name}
          </div>
        )}
      </div>
      <div className="header-actions">
        <button 
          className="btn btn-secondary"
          onClick={onNewFile}
          title="New File"
        >
          <FiPlus size={18} />
          New File
        </button>
        {currentFile && (
          <>
            <button 
              className="btn btn-icon"
              onClick={onDownload}
              title="Download"
            >
              <FiDownload size={18} />
            </button>
            <button 
              className="btn btn-primary"
              title="Auto-saved"
            >
              <FiSave size={18} />
              Saved
            </button>
          </>
        )}
      </div>
    </header>
  );
}
