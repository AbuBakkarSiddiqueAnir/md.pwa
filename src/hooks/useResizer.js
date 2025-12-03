import { useState, useEffect } from 'react';

export function useResizer(initialWidth = 50) {
  const [editorWidth, setEditorWidth] = useState(initialWidth);
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleMouseMove = (e) => {
    if (!isResizing) return;

    const container = document.querySelector('.main-content');
    const containerRect = container.getBoundingClientRect();
    const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

    // Constrain between 20% and 80%
    if (newWidth >= 20 && newWidth <= 80) {
      setEditorWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return {
    editorWidth,
    isResizing,
    handleMouseDown
  };
}
