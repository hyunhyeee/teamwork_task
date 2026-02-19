// 왼쪽 사이드바에서 도면 목록 선택 영역

import { useState } from 'react';
import type { AppDrawing } from '../types/drawing';

interface Props {
  drawings: AppDrawing[];
  selectedIds: string[];
  isCompareMode: boolean;
  onSelect: (drawing: AppDrawing) => void;
}

export const DrawingList = ({ drawings, selectedIds, isCompareMode, onSelect }: Props) => {
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

            const isSelected = selectedIds.includes(drawing.id);
            const isPrimarySelected = selectedIds[0] === drawing.id;

            if (isCompareMode && isSelected) {
              if (isPrimarySelected) {
                backgroundColor = '#4CAF50'; // 비교모드에서 기본 값
                color = '#fff';
              } else {
                backgroundColor = '#2196F3'; // 비교보드에서 비교 값
                color = '#fff';
              }
            } else if (!isCompareMode && isPrimarySelected) {
              backgroundColor = '#444'; // 일반모드에서 기본 값
              color = '#fff';
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
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 12px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: isSelected ? 'bold' : 'normal',
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