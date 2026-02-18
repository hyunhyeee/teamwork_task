import React, { useState } from 'react';
import type { AppDrawing } from '../types/drawing';

interface Props {
  drawings: AppDrawing[];
  selectedId: string | null;
  selectedCompareId: string | null; // New prop for the comparison drawing
  isCompareMode: boolean; // New prop to indicate if compare mode is active
  onSelect: (drawing: AppDrawing) => void;
}

export const DrawingList = ({ drawings, selectedId, selectedCompareId, isCompareMode, onSelect }: Props) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div>
      <h3 style={{ display: 'flex', alignItems: 'center' }}>
        도면 목록
        <button
          onClick={toggleCollapse}
          style={{ marginLeft: 8, cursor: 'pointer', background: 'none', border: 'none', fontSize: '1em' }}
        >
          {isCollapsed ? '▶' : '▼'}
        </button>
      </h3>
      {!isCollapsed && (
        <div>
          {drawings.map((drawing) => {
            let backgroundColor = '#ddd';
            let color = '#000';

            if (isCompareMode) {
              if (selectedId === drawing.id) {
                backgroundColor = '#4CAF50'; // Green for primary selected in compare mode
                color = '#fff';
              } else if (selectedCompareId === drawing.id) {
                backgroundColor = '#2196F3'; // Blue for comparison selected
                color = '#fff';
              }
            } else {
              if (selectedId === drawing.id) {
                backgroundColor = '#444'; // Original selected color
                color = '#fff';
              }
            }

            return (
              <button
                key={drawing.id}
                onClick={() => onSelect(drawing)}
                style={{
                  display: 'block',
                  marginBottom: 8,
                  background: backgroundColor,
                  color: color,
                  width: '100%', // Make buttons full width
                  textAlign: 'left', // Align text to the left
                  padding: '8px 12px', // Add some padding
                  border: 'none', // Remove default button border
                  cursor: 'pointer', // Indicate it's clickable
                }}
              >
                {drawing.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};