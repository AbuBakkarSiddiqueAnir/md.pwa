import { useState, useEffect } from 'react';
import { marked } from 'marked';
import { 
  FiFile, 
  FiSave, 
  FiPlus, 
  FiTrash2, 
  FiDownload,
  FiEdit3,
  FiEye,
  FiFileText,
  FiSmartphone,
  FiRefreshCw,
  FiX,
  FiBold,
  FiItalic,
  FiLink,
  FiImage,
  FiCode,
  FiList,
  FiAlignLeft,
  FiMinus,
  FiType
} from 'react-icons/fi';
import { useRegisterSW } from 'virtual:pwa-register/react';
import './App.css';

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true,
});

function App() {
  const [files, setFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [content, setContent] = useState('');
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  // PWA update handler
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered:', r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  // Load files from localStorage on mount
  useEffect(() => {
    const savedFiles = localStorage.getItem('markdown-files');
    if (savedFiles) {
      const parsedFiles = JSON.parse(savedFiles);
      setFiles(parsedFiles);
      if (parsedFiles.length > 0) {
        setCurrentFile(parsedFiles[0]);
        setContent(parsedFiles[0].content);
      }
    }
  }, []);

  // Handle PWA install prompt
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  // Save files to localStorage whenever they change
  useEffect(() => {
    if (files.length > 0) {
      localStorage.setItem('markdown-files', JSON.stringify(files));
    }
  }, [files]);

  // Update current file content
  useEffect(() => {
    if (currentFile) {
      const updatedFiles = files.map(file =>
        file.id === currentFile.id ? { ...file, content, updatedAt: new Date().toISOString() } : file
      );
      setFiles(updatedFiles);
    }
  }, [content]);

  const createNewFile = () => {
    if (!newFileName.trim()) return;

    const newFile = {
      id: Date.now(),
      name: newFileName.endsWith('.md') ? newFileName : `${newFileName}.md`,
      content: '# Welcome to Markdown Preview\n\nStart writing your markdown here...\n\n## Features\n\n- **Live Preview**: See your markdown rendered in real-time\n- **Save Files**: Your files are automatically saved\n- **Multiple Files**: Create and manage multiple markdown files\n- **Export**: Download your markdown files\n\n## Markdown Syntax\n\n### Headers\n\n```markdown\n# H1\n## H2\n### H3\n```\n\n### Emphasis\n\n*italic* or _italic_\n**bold** or __bold__\n\n### Lists\n\n- Item 1\n- Item 2\n  - Nested item\n\n### Code\n\nInline `code` or:\n\n```javascript\nconst greeting = "Hello, World!";\nconsole.log(greeting);\n```\n\n### Links\n\n[Link text](https://example.com)\n\n### Blockquotes\n\n> This is a blockquote\n\n### Tables\n\n| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n\nHappy writing! 🚀',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setFiles([...files, newFile]);
    setCurrentFile(newFile);
    setContent(newFile.content);
    setNewFileName('');
    setShowNewFileModal(false);
  };

  const deleteFile = (fileId) => {
    const updatedFiles = files.filter(file => file.id !== fileId);
    setFiles(updatedFiles);
    
    if (currentFile?.id === fileId) {
      if (updatedFiles.length > 0) {
        setCurrentFile(updatedFiles[0]);
        setContent(updatedFiles[0].content);
      } else {
        setCurrentFile(null);
        setContent('');
      }
    }

    if (updatedFiles.length === 0) {
      localStorage.removeItem('markdown-files');
    }
  };

  const selectFile = (file) => {
    setCurrentFile(file);
    setContent(file.content);
  };

  const downloadFile = () => {
    if (!currentFile) return;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getPreviewHtml = () => {
    return { __html: marked(content) };
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  // Markdown formatting helpers
  const insertMarkdown = (before, after = '', placeholder = '') => {
    const textarea = document.querySelector('.editor');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    const newContent = 
      content.substring(0, start) + 
      before + textToInsert + after + 
      content.substring(end);
    
    setContent(newContent);
    
    // Set cursor position after insertion
    setTimeout(() => {
      const newCursorPos = start + before.length + textToInsert.length;
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const insertHeading = (level) => {
    const prefix = '#'.repeat(level) + ' ';
    insertMarkdown(prefix, '', 'Heading');
  };

  const insertBold = () => {
    insertMarkdown('**', '**', 'bold text');
  };

  const insertItalic = () => {
    insertMarkdown('*', '*', 'italic text');
  };

  const insertStrikethrough = () => {
    insertMarkdown('~~', '~~', 'strikethrough text');
  };

  const insertLink = () => {
    const url = prompt('Enter URL:', 'https://');
    if (url) {
      insertMarkdown('[', `](${url})`, 'link text');
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:', 'https://');
    if (url) {
      insertMarkdown('![', `](${url})`, 'alt text');
    }
  };

  const insertCode = () => {
    insertMarkdown('`', '`', 'code');
  };

  const insertCodeBlock = () => {
    insertMarkdown('```\n', '\n```', 'code block');
  };

  const insertQuote = () => {
    insertMarkdown('> ', '', 'quote');
  };

  const insertUnorderedList = () => {
    insertMarkdown('- ', '', 'list item');
  };

  const insertOrderedList = () => {
    insertMarkdown('1. ', '', 'list item');
  };

  const insertTable = () => {
    const table = '\n| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |\n';
    const textarea = document.querySelector('.editor');
    const start = textarea.selectionStart;
    const newContent = content.substring(0, start) + table + content.substring(start);
    setContent(newContent);
  };

  const insertHorizontalRule = () => {
    const textarea = document.querySelector('.editor');
    const start = textarea.selectionStart;
    const newContent = content.substring(0, start) + '\n---\n' + content.substring(start);
    setContent(newContent);
  };

  return (
    <div className="app">
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
            onClick={() => setShowNewFileModal(true)}
            title="New File"
          >
            <FiPlus size={18} />
            New File
          </button>
          {currentFile && (
            <>
              <button 
                className="btn btn-icon"
                onClick={downloadFile}
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

      <div className="main-content">
        <div className="file-list">
          <div className="file-list-header">
            <div className="file-list-title">Files</div>
            <button 
              className="btn btn-icon"
              onClick={() => setShowNewFileModal(true)}
              style={{ padding: '0.25rem' }}
            >
              <FiPlus size={16} />
            </button>
          </div>
          <div className="file-items">
            {files.length === 0 ? (
              <div className="empty-state">
                <FiFileText className="empty-state-icon" />
                <div className="empty-state-text">
                  No files yet.<br />Create your first markdown file!
                </div>
              </div>
            ) : (
              files.map(file => (
                <div
                  key={file.id}
                  className={`file-item ${currentFile?.id === file.id ? 'active' : ''}`}
                  onClick={() => selectFile(file)}
                >
                  <FiFile className="file-item-icon" />
                  <div className="file-item-name">{file.name}</div>
                  <button
                    className="file-item-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete ${file.name}?`)) {
                        deleteFile(file.id);
                      }
                    }}
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="editor-container">
          <div className="panel-header">
            <div className="panel-title">
              <FiEdit3 size={16} />
              Editor
            </div>
          </div>
          
          {/* Markdown Toolbar */}
          <div className="toolbar">
            <div className="toolbar-group">
              <div className="toolbar-dropdown">
                <button className="btn-toolbar" title="Headings">
                  <FiType size={16} />
                  <span className="toolbar-label">Heading</span>
                </button>
                <div className="toolbar-dropdown-menu">
                  <button onClick={() => insertHeading(1)}>
                    <span className="heading-preview h1">H1</span> Heading 1
                  </button>
                  <button onClick={() => insertHeading(2)}>
                    <span className="heading-preview h2">H2</span> Heading 2
                  </button>
                  <button onClick={() => insertHeading(3)}>
                    <span className="heading-preview h3">H3</span> Heading 3
                  </button>
                  <button onClick={() => insertHeading(4)}>
                    <span className="heading-preview h4">H4</span> Heading 4
                  </button>
                  <button onClick={() => insertHeading(5)}>
                    <span className="heading-preview h5">H5</span> Heading 5
                  </button>
                  <button onClick={() => insertHeading(6)}>
                    <span className="heading-preview h6">H6</span> Heading 6
                  </button>
                </div>
              </div>
            </div>

            <div className="toolbar-divider"></div>

            <div className="toolbar-group">
              <button className="btn-toolbar" onClick={insertBold} title="Bold (Ctrl+B)">
                <FiBold size={16} />
              </button>
              <button className="btn-toolbar" onClick={insertItalic} title="Italic (Ctrl+I)">
                <FiItalic size={16} />
              </button>
              <button className="btn-toolbar" onClick={insertStrikethrough} title="Strikethrough">
                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>S</span>
              </button>
            </div>

            <div className="toolbar-divider"></div>

            <div className="toolbar-group">
              <button className="btn-toolbar" onClick={insertLink} title="Insert Link">
                <FiLink size={16} />
              </button>
              <button className="btn-toolbar" onClick={insertImage} title="Insert Image">
                <FiImage size={16} />
              </button>
            </div>

            <div className="toolbar-divider"></div>

            <div className="toolbar-group">
              <button className="btn-toolbar" onClick={insertCode} title="Inline Code">
                <FiCode size={16} />
              </button>
              <button className="btn-toolbar" onClick={insertCodeBlock} title="Code Block">
                <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{'{}'}</span>
              </button>
            </div>

            <div className="toolbar-divider"></div>

            <div className="toolbar-group">
              <button className="btn-toolbar" onClick={insertUnorderedList} title="Bullet List">
                <FiList size={16} />
              </button>
              <button className="btn-toolbar" onClick={insertOrderedList} title="Numbered List">
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>1.</span>
              </button>
              <button className="btn-toolbar" onClick={insertQuote} title="Quote">
                <FiAlignLeft size={16} />
              </button>
            </div>

            <div className="toolbar-divider"></div>

            <div className="toolbar-group">
              <button className="btn-toolbar" onClick={insertTable} title="Insert Table">
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>⊞</span>
              </button>
              <button className="btn-toolbar" onClick={insertHorizontalRule} title="Horizontal Rule">
                <FiMinus size={16} />
              </button>
            </div>
          </div>

          <div className="editor-wrapper">
            <textarea
              className="editor"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your markdown here..."
              spellCheck="false"
            />
          </div>
        </div>

        <div className="preview-container">
          <div className="panel-header">
            <div className="panel-title">
              <FiEye size={16} />
              Preview
            </div>
          </div>
          <div className="preview-wrapper">
            <div 
              className="markdown-preview"
              dangerouslySetInnerHTML={getPreviewHtml()}
            />
          </div>
        </div>
      </div>

      {showNewFileModal && (
        <div className="modal-overlay" onClick={() => setShowNewFileModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Create New File</h2>
            <input
              type="text"
              className="modal-input"
              placeholder="Enter file name..."
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  createNewFile();
                }
              }}
              autoFocus
            />
            <div className="modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setShowNewFileModal(false);
                  setNewFileName('');
                }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={createNewFile}
                disabled={!newFileName.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PWA Update Notification */}
      {needRefresh && (
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
              onClick={() => setNeedRefresh(false)}
            >
              Later
            </button>
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => updateServiceWorker(true)}
            >
              Update Now
            </button>
          </div>
        </div>
      )}

      {/* PWA Install Prompt */}
      {showInstallPrompt && (
        <div className="toast toast-install">
          <button 
            className="toast-close"
            onClick={() => setShowInstallPrompt(false)}
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
            onClick={handleInstallClick}
          >
            Install
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
