import { FiRefreshCw, FiSmartphone, FiX } from 'react-icons/fi';

export function UpdateToast({ onUpdate, onDismiss }) {
  return (
    <div className="toast toast-update">
      <div className="toast-content">
        <FiRefreshCw size={20} />
        <div>
          <div className="toast-title">Update Available</div>
          <div className="toast-message">A new version is ready to install</div>
        </div>
      </div>
      <div className="toast-actions">
        <button 
          className="btn btn-secondary btn-sm"
          onClick={onDismiss}
        >
          Later
        </button>
        <button 
          className="btn btn-primary btn-sm"
          onClick={onUpdate}
        >
          Update Now
        </button>
      </div>
    </div>
  );
}

export function InstallToast({ onInstall, onDismiss }) {
  return (
    <div className="toast toast-install">
      <button 
        className="toast-close"
        onClick={onDismiss}
      >
        <FiX size={18} />
      </button>
      <div className="toast-content">
        <FiSmartphone size={20} />
        <div>
          <div className="toast-title">Install App</div>
          <div className="toast-message">Install Markdown Preview for quick access</div>
        </div>
      </div>
      <button 
        className="btn btn-primary btn-sm"
        onClick={onInstall}
      >
        Install
      </button>
    </div>
  );
}
