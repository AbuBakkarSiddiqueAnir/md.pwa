export const insertMarkdown = (content, setContent, before, after = '', placeholder = '') => {
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

export const insertHeading = (content, setContent, level) => {
  const prefix = '#'.repeat(level) + ' ';
  insertMarkdown(content, setContent, prefix, '', 'Heading');
};

export const insertBold = (content, setContent) => {
  insertMarkdown(content, setContent, '**', '**', 'bold text');
};

export const insertItalic = (content, setContent) => {
  insertMarkdown(content, setContent, '*', '*', 'italic text');
};

export const insertStrikethrough = (content, setContent) => {
  insertMarkdown(content, setContent, '~~', '~~', 'strikethrough text');
};

export const insertLink = (content, setContent) => {
  const url = prompt('Enter URL:', 'https://');
  if (url) {
    insertMarkdown(content, setContent, '[', `](${url})`, 'link text');
  }
};

export const insertImage = (content, setContent) => {
  const url = prompt('Enter image URL:', 'https://');
  if (url) {
    insertMarkdown(content, setContent, '![', `](${url})`, 'alt text');
  }
};

export const insertCode = (content, setContent) => {
  insertMarkdown(content, setContent, '`', '`', 'code');
};

export const insertCodeBlock = (content, setContent) => {
  insertMarkdown(content, setContent, '```\n', '\n```', 'code block');
};

export const insertQuote = (content, setContent) => {
  insertMarkdown(content, setContent, '> ', '', 'quote');
};

export const insertUnorderedList = (content, setContent) => {
  insertMarkdown(content, setContent, '- ', '', 'list item');
};

export const insertOrderedList = (content, setContent) => {
  insertMarkdown(content, setContent, '1. ', '', 'list item');
};

export const insertTable = (content, setContent) => {
  const table = '\n| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |\n';
  const textarea = document.querySelector('.editor');
  const start = textarea.selectionStart;
  const newContent = content.substring(0, start) + table + content.substring(start);
  setContent(newContent);
};

export const insertHorizontalRule = (content, setContent) => {
  const textarea = document.querySelector('.editor');
  const start = textarea.selectionStart;
  const newContent = content.substring(0, start) + '\n---\n' + content.substring(start);
  setContent(newContent);
};
