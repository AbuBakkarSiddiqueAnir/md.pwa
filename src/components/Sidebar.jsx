import { 
  FiFile, 
  FiTrash2, 
  FiFileText,
  FiFolder,
  FiFolderPlus,
  FiChevronRight,
  FiChevronDown,
  FiMenu,
  FiPlus
} from 'react-icons/fi';

export default function Sidebar({
  files,
  folders,
  currentFile,
  isSidebarCollapsed,
  expandedFolders,
  onToggleSidebar,
  onNewFolder,
  onNewFile,
  onSelectFile,
  onDeleteFile,
  onToggleFolder,
  onDeleteFolder,
  onAddFileToFolder,
  getFilesByFolder,
  getFilesWithoutFolder
}) {
  return (
    <div className={`file-list ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="file-list-header">
        <div className="file-list-title">
          <button 
            className="btn-icon-sm"
            onClick={onToggleSidebar}
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <FiMenu size={16} />
          </button>
        </div>
        {!isSidebarCollapsed && (
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button 
              className="btn btn-icon"
              onClick={onNewFolder}
              style={{ padding: '0.25rem' }}
              title="New Folder"
            >
              <FiFolderPlus size={16} />
            </button>
            <button 
              className="btn btn-icon"
              onClick={() => onNewFile(null)}
              style={{ padding: '0.25rem' }}
              title="New File"
            >
              <FiPlus size={16} />
            </button>
          </div>
        )}
      </div>
      
      {!isSidebarCollapsed && (
        <div className="file-items">
          {files.length === 0 && folders.length === 0 ? (
            <div className="empty-state">
              <FiFileText className="empty-state-icon" />
              <div className="empty-state-text">
                No files yet.<br />Create your first project!
              </div>
            </div>
          ) : (
            <>
              {/* Folders */}
              {folders.map(folder => {
                const folderFiles = getFilesByFolder(folder.id);
                const isExpanded = expandedFolders.has(folder.id);
                
                return (
                  <div key={folder.id} className="folder-container">
                    <div className="folder-item">
                      <button
                        className="folder-toggle"
                        onClick={() => onToggleFolder(folder.id)}
                      >
                        {isExpanded ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
                      </button>
                      <FiFolder className="folder-icon" />
                      <div className="folder-name">{folder.name}</div>
                      <div className="folder-actions">
                        <button
                          className="folder-action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddFileToFolder(folder);
                          }}
                          title="Add file to folder"
                        >
                          <FiPlus size={12} />
                        </button>
                        <button
                          className="folder-action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Delete folder "${folder.name}" and all its files?`)) {
                              onDeleteFolder(folder.id);
                            }
                          }}
                          title="Delete folder"
                        >
                          <FiTrash2 size={12} />
                        </button>
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div className="folder-files">
                        {folderFiles.length === 0 ? (
                          <div className="folder-empty">No files in this folder</div>
                        ) : (
                          folderFiles.map(file => (
                            <div
                              key={file.id}
                              className={`file-item nested ${currentFile?.id === file.id ? 'active' : ''}`}
                              onClick={() => onSelectFile(file)}
                            >
                              <FiFile className="file-item-icon" />
                              <div className="file-item-name">{file.name}</div>
                              <button
                                className="file-item-delete"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm(`Delete ${file.name}?`)) {
                                    onDeleteFile(file.id);
                                  }
                                }}
                              >
                                <FiTrash2 size={14} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              
              {/* Files without folder */}
              {getFilesWithoutFolder().map(file => (
                <div
                  key={file.id}
                  className={`file-item ${currentFile?.id === file.id ? 'active' : ''}`}
                  onClick={() => onSelectFile(file)}
                >
                  <FiFile className="file-item-icon" />
                  <div className="file-item-name">{file.name}</div>
                  <button
                    className="file-item-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete ${file.name}?`)) {
                        onDeleteFile(file.id);
                      }
                    }}
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
