import type { AppDrawing } from '../types/drawing';

interface Props {
  drawings: AppDrawing[];
  selectedId: string | null;
  onSelect: (drawing: AppDrawing) => void;
}

export const DrawingList = ({ drawings, selectedId, onSelect }: Props) => {
  return (
    <div>
      <h3>도면 목록</h3>
      {drawings.map((drawing) => (
        <button
          key={drawing.id}
          onClick={() => onSelect(drawing)}
          style={{
            display: 'block',
            marginBottom: 8,
            background: selectedId === drawing.id ? '#444' : '#ddd',
            color: selectedId === drawing.id ? '#fff' : '#000',
            width: '100%', // Make buttons full width
            textAlign: 'left', // Align text to the left
            padding: '8px 12px', // Add some padding
            border: 'none', // Remove default button border
            cursor: 'pointer', // Indicate it's clickable
          }}
        >
          {drawing.name}
        </button>
      ))}
    </div>
  );
};