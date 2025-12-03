import { FiFile, FiSave, FiPlus, FiDownload, FiFileText, FiLink } from 'react-icons/fi';

export default function Header({ currentFile, onNewFile, onDownload, isScrollSyncEnabled, onToggleScrollSync }) {
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
          className={`btn btn-icon ${isScrollSyncEnabled ? 'active' : ''}`}
          onClick={onToggleScrollSync}
          title={isScrollSyncEnabled ? "Disable Scroll Sync" : "Enable Scroll Sync"}
          style={{ 
            color: isScrollSyncEnabled ? 'var(--color-primary)' : 'inherit',
            borderColor: isScrollSyncEnabled ? 'var(--color-primary)' : 'var(--border-primary)',
            background: isScrollSyncEnabled ? 'var(--bg-elevated)' : 'transparent'
          }}
        >
          <FiLink size={18} />
        </button>
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
