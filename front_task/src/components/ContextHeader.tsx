interface Props {
  discipline: string | null;
  drawingName: string | null;
}

export const ContextHeader = ({ discipline, drawingName }: Props) => {
  return (
    <header
      style={{
        padding: '12px 16px',
        background: '#111',
        color: '#fff',
      }}
    >
      현재 선택:
      {' '}
      {discipline || '공종 미선택'}
      {' / '}
      {drawingName || '도면 미선택'}
    </header>
  );
};
