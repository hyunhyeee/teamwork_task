import React, { useState, useRef } from 'react'; // Added useRef
import type { AppDrawing } from '../types/drawing';

interface Props {
  drawings: AppDrawing[];
  isCompareMode: boolean;
}

export const DrawingViewer = ({ drawings, isCompareMode }: Props) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const viewerRef = useRef<HTMLDivElement>(null); // Ref for the scrollable container
  
  // States for dragging
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const toggleGlobalZoom = () => {
    setZoomLevel((prevZoom) => (prevZoom === 1 ? 1.5 : 1));
  };

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel === 1 || !viewerRef.current) return;
    
    setIsDragging(true);
    setStartX(e.pageX - viewerRef.current.offsetLeft);
    setStartY(e.pageY - viewerRef.current.offsetTop);
    setScrollLeft(viewerRef.current.scrollLeft);
    setScrollTop(viewerRef.current.scrollTop);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !viewerRef.current) return;
    
    e.preventDefault();
    const x = e.pageX - viewerRef.current.offsetLeft;
    const y = e.pageY - viewerRef.current.offsetTop;
    const walkX = (x - startX) * 1.5; // Scroll speed multiplier
    const walkY = (y - startY) * 1.5;
    
    viewerRef.current.scrollLeft = scrollLeft - walkX;
    viewerRef.current.scrollTop = scrollTop - walkY;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  if (drawings.length === 0) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        도면을 선택하세요.
      </div>
    );
  }

  const renderDrawing = (d: AppDrawing, displayWidth: string = '100%') => {
    const imageUrl = `/data/drawings/${d.imageFile}`;
    return (
      <div
        style={{
          flex: 'none',
          width: displayWidth,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
          userSelect: 'none', // Prevent text selection while dragging
        }}
      >
        <h3 style={{ margin: '10px 0' }}>{d.name}</h3>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: 'calc(100% - 50px)', overflow: 'hidden' }}>
            <img
              src={imageUrl}
              alt={d.name}
              draggable={false} // Prevent default ghost image dragging
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
    <div
      ref={viewerRef}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'auto', // native scrollbars will appear
        cursor: zoomLevel === 1 ? 'zoom-in' : (isDragging ? 'grabbing' : 'grab'),
        userSelect: 'none',
        backgroundColor: '#f5f5f5'
      }}
      onDoubleClick={toggleGlobalZoom}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div
        style={{
          width: zoomLevel === 1 ? '100%' : '150%', // increase size to trigger scroll
          height: zoomLevel === 1 ? '100%' : '150%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.2s ease, height 0.2s ease',
        }}
      >
        <div style={{ flex: 1, display: 'flex', width: '100%', height: '100%' }}>
          {drawingAreaContent}
        </div>
      </div>
    </div>
  );
};