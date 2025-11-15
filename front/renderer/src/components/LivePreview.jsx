// src/components/LivePreview.jsx
import React from 'react';

const LivePreview = () => {
  return (
    <div className="live-preview-container">
      <div className="preview-header">
        <span className="live-badge"></span>
        LIVE
      </div>
      <div className="preview-screen">
        <p>直播画面预览</p>
        <span>(Live Preview)</span>
      </div>
    </div>
  );
};

export default LivePreview;