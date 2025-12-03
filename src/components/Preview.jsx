import { FiEye } from 'react-icons/fi';

export default function Preview({ htmlContent, previewWidth }) {
  return (
    <div className="preview-container" style={{ width: `${previewWidth}%` }}>
      <div className="panel-header">
        <div className="panel-title">
          <FiEye size={16} />
          Preview
        </div>
      </div>
      <div className="preview-wrapper">
        <div 
          className="markdown-preview"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
}
