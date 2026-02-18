import { useState } from 'react';

interface Props {
  disciplines: string[];
  selected: string | null;
  onSelect: (name: string) => void;
}

export const DisciplineSelector = ({
  disciplines,
  selected,
  onSelect,
}: Props) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
        
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div>
      <h3 style={{ display: 'flex', alignItems: 'center' }}>
        공종 선택
        <button
          onClick={toggleCollapse}
          style={{ marginLeft: 8, cursor: 'pointer', background: 'none', border: 'none', fontSize: '1em' }}
        >
          {isCollapsed ? '▶' : '▼'}
        </button>
      </h3>
      {!isCollapsed && (
        <div>
          {disciplines.map((name) => (
            <button
              key={name}
              onClick={() => onSelect(name)}
              style={{
                display: 'block',
                width: '100%', // Added for uniform width
                marginBottom: 8,
                background: selected === name ? '#333' : '#eee',
                color: selected === name ? '#fff' : '#000',
              }}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
