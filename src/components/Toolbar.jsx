import { 
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

export default function Toolbar({
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
    <div className="toolbar">
      <div className="toolbar-group">
        <div className="toolbar-dropdown">
          <button className="btn-toolbar" title="Headings">
            <FiType size={16} />
            <span className="toolbar-label">Heading</span>
          </button>
          <div className="toolbar-dropdown-menu">
            <button onClick={() => onInsertHeading(1)}>
              <span className="heading-preview h1">H1</span> Heading 1
            </button>
            <button onClick={() => onInsertHeading(2)}>
              <span className="heading-preview h2">H2</span> Heading 2
            </button>
            <button onClick={() => onInsertHeading(3)}>
              <span className="heading-preview h3">H3</span> Heading 3
            </button>
            <button onClick={() => onInsertHeading(4)}>
              <span className="heading-preview h4">H4</span> Heading 4
            </button>
            <button onClick={() => onInsertHeading(5)}>
              <span className="heading-preview h5">H5</span> Heading 5
            </button>
            <button onClick={() => onInsertHeading(6)}>
              <span className="heading-preview h6">H6</span> Heading 6
            </button>
          </div>
        </div>
      </div>

      <div className="toolbar-divider"></div>

      <div className="toolbar-group">
        <button className="btn-toolbar" onClick={onInsertBold} title="Bold (Ctrl+B)">
          <FiBold size={16} />
        </button>
        <button className="btn-toolbar" onClick={onInsertItalic} title="Italic (Ctrl+I)">
          <FiItalic size={16} />
        </button>
        <button className="btn-toolbar" onClick={onInsertStrikethrough} title="Strikethrough">
          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>S</span>
        </button>
      </div>

      <div className="toolbar-divider"></div>

      <div className="toolbar-group">
        <button className="btn-toolbar" onClick={onInsertLink} title="Insert Link">
          <FiLink size={16} />
        </button>
        <button className="btn-toolbar" onClick={onInsertImage} title="Insert Image">
          <FiImage size={16} />
        </button>
      </div>

      <div className="toolbar-divider"></div>

      <div className="toolbar-group">
        <button className="btn-toolbar" onClick={onInsertCode} title="Inline Code">
          <FiCode size={16} />
        </button>
        <button className="btn-toolbar" onClick={onInsertCodeBlock} title="Code Block">
          <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{'{}'}</span>
        </button>
      </div>

      <div className="toolbar-divider"></div>

      <div className="toolbar-group">
        <button className="btn-toolbar" onClick={onInsertUnorderedList} title="Bullet List">
          <FiList size={16} />
        </button>
        <button className="btn-toolbar" onClick={onInsertOrderedList} title="Numbered List">
          <span style={{ fontSize: '14px', fontWeight: 'bold' }}>1.</span>
        </button>
        <button className="btn-toolbar" onClick={onInsertQuote} title="Quote">
          <FiAlignLeft size={16} />
        </button>
      </div>

      <div className="toolbar-divider"></div>

      <div className="toolbar-group">
        <button className="btn-toolbar" onClick={onInsertTable} title="Insert Table">
          <span style={{ fontSize: '14px', fontWeight: 'bold' }}>⊞</span>
        </button>
        <button className="btn-toolbar" onClick={onInsertHorizontalRule} title="Horizontal Rule">
          <FiMinus size={16} />
        </button>
      </div>
    </div>
  );
}
