import { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import './App.css';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Preview from './components/Preview';
import Resizer from './components/Resizer';
import Modal from './components/Modal';
import { UpdateToast, InstallToast } from './components/PWAToasts';

// Hooks
import { useLocalStorage } from './hooks/useLocalStorage';
import { useResizer } from './hooks/useResizer';
import { usePWA } from './hooks/usePWA';

// Utils
import * as mdHelpers from './utils/markdownHelpers';

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true,
});

function App() {
  // State
  const [files, setFiles] = useLocalStorage('markdown-files', []);
  const [folders, setFolders] = useLocalStorage('markdown-folders', []);
  const [content, setContent] = useState('');
  const [currentFile, setCurrentFile] = useState(null);
  const [currentFolder, setCurrentFolder] = useState(null);
  
  // UI State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [isScrollSyncEnabled, setIsScrollSyncEnabled] = useState(true);

  // Refs for scroll sync
  const editorRef = useRef(null);
  const previewRef = useRef(null);
  const isScrollingRef = useRef(false);

  // Scroll Sync Logic
  useEffect(() => {
    const editor = editorRef.current;
    const preview = previewRef.current;

    if (!editor || !preview || !isScrollSyncEnabled) return;

    const handleEditorScroll = () => {
      if (isScrollingRef.current) return;
      isScrollingRef.current = true;
      
      const editorMaxScroll = editor.scrollHeight - editor.clientHeight;
      const previewMaxScroll = preview.scrollHeight - preview.clientHeight;

      if (editorMaxScroll > 0) {
        const percentage = editor.scrollTop / editorMaxScroll;
        preview.scrollTop = percentage * previewMaxScroll;
      }
      
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 10);
    };

    const handlePreviewScroll = () => {
      if (isScrollingRef.current) return;
      isScrollingRef.current = true;

      const editorMaxScroll = editor.scrollHeight - editor.clientHeight;
      const previewMaxScroll = preview.scrollHeight - preview.clientHeight;

      if (previewMaxScroll > 0) {
        const percentage = preview.scrollTop / previewMaxScroll;
        editor.scrollTop = percentage * editorMaxScroll;
      }

      setTimeout(() => {
        isScrollingRef.current = false;
      }, 10);
    };

    editor.addEventListener('scroll', handleEditorScroll);
    preview.addEventListener('scroll', handlePreviewScroll);

    return () => {
      editor.removeEventListener('scroll', handleEditorScroll);
      preview.removeEventListener('scroll', handlePreviewScroll);
    };
  }, [isScrollSyncEnabled]); // Re-attach only when enabled/disabled

  // Custom Hooks
  const { editorWidth, isResizing, handleMouseDown } = useResizer(50);
  const { 
    needRefresh, 
    setNeedRefresh, 
    updateServiceWorker, 
    showInstallPrompt, 
    setShowInstallPrompt, 
    handleInstallClick 
  } = usePWA();

  // Load initial file
  useEffect(() => {
    if (files.length > 0 && !currentFile) {
      setCurrentFile(files[0]);
      setContent(files[0].content);
    }
  }, [files]);

  // Update current file content
  useEffect(() => {
    if (currentFile) {
      const updatedFiles = files.map(file =>
        file.id === currentFile.id ? { ...file, content, updatedAt: new Date().toISOString() } : file
      );
      // Only update if content actually changed to avoid infinite loops
      if (currentFile.content !== content) {
        setFiles(updatedFiles);
      }
    }
  }, [content]);

  // File Management
  const createNewFile = () => {
    if (!newFileName.trim()) return;

    const newFile = {
      id: Date.now(),
      name: newFileName.endsWith('.md') ? newFileName : `${newFileName}.md`,
      folderId: currentFolder?.id || null,
      content: '# Welcome to Markdown Preview\n\nStart writing your markdown here...',
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
      const remainingFiles = updatedFiles;
      if (remainingFiles.length > 0) {
        setCurrentFile(remainingFiles[0]);
        setContent(remainingFiles[0].content);
      } else {
        setCurrentFile(null);
        setContent('');
      }
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

  // Folder Management
  const createNewFolder = () => {
    if (!newFolderName.trim()) return;

    const newFolder = {
      id: Date.now(),
      name: newFolderName,
      createdAt: new Date().toISOString(),
    };

    setFolders([...folders, newFolder]);
    setExpandedFolders(new Set([...expandedFolders, newFolder.id]));
    setNewFolderName('');
    setShowNewFolderModal(false);
  };

  const deleteFolder = (folderId) => {
    const updatedFiles = files.filter(file => file.folderId !== folderId);
    setFiles(updatedFiles);
    
    const updatedFolders = folders.filter(folder => folder.id !== folderId);
    setFolders(updatedFolders);
    
    const newExpanded = new Set(expandedFolders);
    newExpanded.delete(folderId);
    setExpandedFolders(newExpanded);

    if (currentFile && currentFile.folderId === folderId) {
      setCurrentFile(null);
      setContent('');
    }
  };

  const toggleFolder = (folderId) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const getFilesByFolder = (folderId) => files.filter(file => file.folderId === folderId);
  const getFilesWithoutFolder = () => files.filter(file => !file.folderId);

  // Markdown Helpers Wrappers
  const handleInsertMarkdown = (helper, ...args) => {
    helper(content, setContent, ...args);
  };

  const getPreviewHtml = () => {
    return marked(content);
  };

  return (
    <div className="app">
      <Header 
        currentFile={currentFile} 
        onNewFile={() => {
          setCurrentFolder(null);
          setShowNewFileModal(true);
        }}
        onDownload={downloadFile}
        isScrollSyncEnabled={isScrollSyncEnabled}
        onToggleScrollSync={() => setIsScrollSyncEnabled(!isScrollSyncEnabled)}
      />

      <div className="main-content">
        <Sidebar 
          files={files}
          folders={folders}
          currentFile={currentFile}
          isSidebarCollapsed={isSidebarCollapsed}
          expandedFolders={expandedFolders}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onNewFolder={() => setShowNewFolderModal(true)}
          onNewFile={(folder) => {
            setCurrentFolder(folder);
            setShowNewFileModal(true);
          }}
          onSelectFile={selectFile}
          onDeleteFile={deleteFile}
          onToggleFolder={toggleFolder}
          onDeleteFolder={deleteFolder}
          onAddFileToFolder={(folder) => {
            setCurrentFolder(folder);
            setShowNewFileModal(true);
          }}
          getFilesByFolder={getFilesByFolder}
          getFilesWithoutFolder={getFilesWithoutFolder}
        />

        <Editor 
          content={content}
          editorWidth={editorWidth}
          onContentChange={setContent}
          onInsertHeading={(level) => handleInsertMarkdown(mdHelpers.insertHeading, level)}
          onInsertBold={() => handleInsertMarkdown(mdHelpers.insertBold)}
          onInsertItalic={() => handleInsertMarkdown(mdHelpers.insertItalic)}
          onInsertStrikethrough={() => handleInsertMarkdown(mdHelpers.insertStrikethrough)}
          onInsertLink={() => handleInsertMarkdown(mdHelpers.insertLink)}
          onInsertImage={() => handleInsertMarkdown(mdHelpers.insertImage)}
          onInsertCode={() => handleInsertMarkdown(mdHelpers.insertCode)}
          onInsertCodeBlock={() => handleInsertMarkdown(mdHelpers.insertCodeBlock)}
          onInsertUnorderedList={() => handleInsertMarkdown(mdHelpers.insertUnorderedList)}
          onInsertOrderedList={() => handleInsertMarkdown(mdHelpers.insertOrderedList)}
          onInsertQuote={() => handleInsertMarkdown(mdHelpers.insertQuote)}
          onInsertTable={() => handleInsertMarkdown(mdHelpers.insertTable)}
          onInsertHorizontalRule={() => handleInsertMarkdown(mdHelpers.insertHorizontalRule)}
          editorRef={editorRef}
        />

        <Resizer 
          isResizing={isResizing} 
          onMouseDown={handleMouseDown} 
        />

        <Preview 
          htmlContent={getPreviewHtml()} 
          previewWidth={100 - editorWidth} 
          previewRef={previewRef}
        />
      </div>

      <Modal
        isOpen={showNewFileModal}
        title="Create New File"
        placeholder="Enter file name..."
        value={newFileName}
        onChange={setNewFileName}
        onClose={() => setShowNewFileModal(false)}
        onSubmit={createNewFile}
        submitLabel="Create"
      />

      <Modal
        isOpen={showNewFolderModal}
        title="Create New Folder"
        placeholder="Enter folder name..."
        value={newFolderName}
        onChange={setNewFolderName}
        onClose={() => setShowNewFolderModal(false)}
        onSubmit={createNewFolder}
        submitLabel="Create"
      />

      {needRefresh && (
        <UpdateToast 
          onUpdate={() => updateServiceWorker(true)} 
          onDismiss={() => setNeedRefresh(false)} 
        />
      )}

      {showInstallPrompt && (
        <InstallToast 
          onInstall={handleInstallClick} 
          onDismiss={() => setShowInstallPrompt(false)} 
        />
      )}
    </div>
  );
}

export default App;
