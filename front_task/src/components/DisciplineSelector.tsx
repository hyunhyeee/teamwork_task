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
  return (
    <div>
      <h3>공종 선택</h3>
      {disciplines.map((name) => (
        <button
          key={name}
          onClick={() => onSelect(name)}
          style={{
            display: 'block',
            marginBottom: 8,
            background: selected === name ? '#333' : '#eee',
            color: selected === name ? '#fff' : '#000',
          }}
        >
          {name}
        </button>
      ))}
    </div>
  );
};
