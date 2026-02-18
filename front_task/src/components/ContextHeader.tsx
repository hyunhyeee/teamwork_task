interface Props {
  discipline: string | null;
  drawingName: string | null;
  isCompareMode: boolean;
  onToggleCompareMode: () => void;
}

export const ContextHeader = ({
  discipline,
  drawingName,
  isCompareMode,
  onToggleCompareMode,
}: Props) => {
  return (
    <header
      style={{
        padding: '12px 15px',
        background: '#111',
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '60px',
        zIndex: 100,
      }}
    >
      <div>
        현재 선택: {discipline || '공종 미선택'} / {drawingName || '도면 미선택'}
      </div>
      <button onClick={onToggleCompareMode} style={{
        background: isCompareMode ? '#555' : '#333',
        color: '#fff',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
      }}>
        {isCompareMode ? '비교 모드 종료' : '도면 비교'}
      </button>
    </header>
  );
};
