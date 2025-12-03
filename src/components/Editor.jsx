import { FiEdit3 } from 'react-icons/fi';
import Toolbar from './Toolbar';

export default function Editor({ 
  content, 
  editorWidth,
  onContentChange,
  onInsertHeading,
  onInsertBold,
  onInsertItalic,
  onInsertStrikethrough,
  onInsertLink,
  onInsertImage,
  onInsertCode,
  onInsertCodeBlock,
  onInsertUnorderedList,
  onInsertOrderedList,
  onInsertQuote,
  onInsertTable,
  onInsertHorizontalRule
}) {
  return (
    <div className="editor-container" style={{ width: `${editorWidth}%` }}>
      <div className="panel-header">
        <div className="panel-title">
          <FiEdit3 size={16} />
          Editor
        </div>
      </div>
      
      <Toolbar
        onInsertHeading={onInsertHeading}
        onInsertBold={onInsertBold}
        onInsertItalic={onInsertItalic}
        onInsertStrikethrough={onInsertStrikethrough}
        onInsertLink={onInsertLink}
        onInsertImage={onInsertImage}
        onInsertCode={onInsertCode}
        onInsertCodeBlock={onInsertCodeBlock}
        onInsertUnorderedList={onInsertUnorderedList}
        onInsertOrderedList={onInsertOrderedList}
        onInsertQuote={onInsertQuote}
        onInsertTable={onInsertTable}
        onInsertHorizontalRule={onInsertHorizontalRule}
      />

      <div className="editor-wrapper">
        <textarea
          className="editor"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Start writing your markdown here..."
          spellCheck="false"
        />
      </div>
    </div>
  );
}
