import React, { useState } from 'react';
import type { AppDrawing } from '../types/drawing';

interface Props {
  drawings: AppDrawing[];
  isCompareMode: boolean;
}

export const DrawingViewer = ({ drawings, isCompareMode }: Props) => {
  const [zoomLevel, setZoomLevel] = useState(1); // Global zoom level for the viewer

  const toggleGlobalZoom = () => {
    setZoomLevel((prevZoom) => (prevZoom === 1 ? 1.2 : 1)); // Toggle between 1x and 1.5x zoom
  };

  if (drawings.length === 0) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        도면을 선택하세요.
      </div>
    );
  }

  const renderDrawing = (d: AppDrawing) => {
    const imageUrl = `/data/drawings/${d.imageFile}`;
    return (
      <div style={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <h3 style={{ margin: '10px 0' }}>{d.name}</h3>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: 'calc(100% - 50px)', overflow: 'hidden' }}>
            <img
              src={imageUrl}
              alt={d.name}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
        </div>
      </div>
    );
  };

  // Content to be zoomed
  let contentToZoom;
  if (isCompareMode && drawings.length > 0) {
    const rows = [];
    let currentRow = [];
    for (let i = 0; i < drawings.length; i++) {
      currentRow.push(drawings[i]);
      if (currentRow.length === 2 || i === drawings.length - 1) {
        rows.push(currentRow);
        currentRow = [];
      }
    }

    const rowHeight = rows.length === 1 ? '100%' : '50%';

    contentToZoom = (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex', flex: 1, width: '100%', height: rowHeight, overflow: 'hidden' }}>
            {row.map((d, colIndex) => (
              <React.Fragment key={d.id}>
                {renderDrawing(d)}
                {colIndex < row.length - 1 && <div style={{ width: '1px', backgroundColor: '#ddd', height: '100%' }} />}
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    );
  } else if (drawings.length > 0) {
    contentToZoom = (
      <div style={{ width: '100%', height: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
        {renderDrawing(drawings[0])}
      </div>
    );
  } else {
    contentToZoom = null; // Should be handled by initial check, but for safety
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflow: 'auto', // Allow panning when zoomed
        cursor: zoomLevel === 1 ? 'zoom-in' : 'zoom-out', // Indicate zoomable state
      }}
      onDoubleClick={toggleGlobalZoom}
    >
      <div
        style={{
          width: '100%',
          height: '100%', // This will be stretched by minWidth/minHeight
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'top left', // Zoom from top-left corner for consistent panning
          transition: 'transform 0.2s ease-in-out', // Smooth zoom transition
          display: 'flex', // Ensure content inside also uses flex layout
          flexDirection: 'column',
          // These ensure the transformed content's container expands to allow proper overflow
          minWidth: zoomLevel === 1 ? 'initial' : `${zoomLevel * 100}%`,
          minHeight: zoomLevel === 1 ? 'initial' : `${zoomLevel * 100}%`,
        }}
      >
        {contentToZoom}
      </div>
    </div>
  );
};