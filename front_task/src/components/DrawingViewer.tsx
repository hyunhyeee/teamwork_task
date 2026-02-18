import type { AppDrawing } from '../types/drawing';

interface Props {
  drawing: AppDrawing | null;
  compareDrawing?: AppDrawing | null;
  isCompareMode: boolean;
}

export const DrawingViewer = ({ drawing, compareDrawing, isCompareMode }: Props) => {
  if (!drawing && !compareDrawing) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        도면을 선택하세요.
      </div>
    );
  }

  const renderDrawing = (d: AppDrawing) => {
    const imageUrl = `/data/drawings/${d.imageFile}`;
    console.log('Displaying image:', imageUrl);
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

  if (isCompareMode && drawing && compareDrawing) {
    return (
      <div style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden' }}>
        {renderDrawing(drawing)}
        <div style={{ width: '1px', backgroundColor: '#ddd', height: '100%' }} />
        {renderDrawing(compareDrawing)}
      </div>
    );
  } else if (drawing) {
    return (
      <div style={{ width: '100%', height: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {renderDrawing(drawing)}
      </div>
    );
  } else {
    return <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>도면을 선택하세요.</div>;
  }
};