import React, { useState } from 'react'; // Removed useMemo
import type { AppDrawing } from '../types/drawing'; // Removed Revision, Metadata, DrawingMeta, DisciplineData
// Removed RevisionHistory import as it's no longer used internally

interface Props {
  drawings: AppDrawing[];
  isCompareMode: boolean;
  // Removed primaryDrawing prop
  // Removed rawMetadata prop
}

export const DrawingViewer = ({ drawings, isCompareMode }: Props) => { // Removed primaryDrawing, rawMetadata from destructuring
  const [zoomLevel, setZoomLevel] = useState(1); // Global zoom level for the viewer

  const toggleGlobalZoom = () => {
    setZoomLevel((prevZoom) => (prevZoom === 1 ? 1.5 : 1)); // Toggle between 1x and 1.5x zoom
  };

  if (drawings.length === 0) { // Removed !primaryDrawing check
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        도면을 선택하세요.
      </div>
    );
  }

  // renderDrawing function accepts displayWidth
  const renderDrawing = (d: AppDrawing, displayWidth: string = '100%') => {
    const imageUrl = `/data/drawings/${d.imageFile}`;
    return (
      <div
        style={{
          flex: 'none', // Prevent flex: 1 from expanding indefinitely
          width: displayWidth, // Explicitly set width
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden', // Main container for the drawing
        }}
      >
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

  // Main drawing content area
  let drawingAreaContent;
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

    drawingAreaContent = (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex', flex: 1, width: '100%', height: rowHeight, overflow: 'hidden', justifyContent: 'center' }}>
            {row.map((d, colIndex) => {
              const drawingWidth = row.length === 1 ? '100%' : '50%';
              return (
                <React.Fragment key={d.id}>
                  {renderDrawing(d, drawingWidth)}
                  {colIndex < row.length - 1 && <div style={{ width: '1px', backgroundColor: '#ddd', height: '100%' }} />}
                </React.Fragment>
              );
            })}
          </div>
        ))}
      </div>
    );
  } else if (drawings.length > 0) {
    drawingAreaContent = (
      <div style={{ width: '100%', height: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {renderDrawing(drawings[0], '100%')}
      </div>
    );
  } else {
    drawingAreaContent = null;
  }

  return (
    <div // Removed outer flex container for main content + sidebar
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
          height: '100%',
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'top left',
          transition: 'transform 0.2s ease-in-out',
          display: 'flex',
          flexDirection: 'column',
          minWidth: zoomLevel === 1 ? 'initial' : `${zoomLevel * 100}%`,
          minHeight: zoomLevel === 1 ? 'initial' : `${zoomLevel * 100}%`,
        }}
      >
        {drawingAreaContent}
      </div>
    </div>
  );
};