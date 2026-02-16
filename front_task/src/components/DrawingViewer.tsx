import type { AppDrawing } from '../types/drawing';

interface Props {
  drawing: AppDrawing | null;
}

export const DrawingViewer = ({ drawing }: Props) => {
  if (!drawing) {
    return <div>도면을 선택하세요.</div>;
  }

  const imageUrl = `/data/drawings/${drawing.imageFile}`;

  console.log('Displaying image:', imageUrl);

  return (
    <div>
      <h3>
        {drawing.name}
      </h3>
      <img
        src={imageUrl}
        alt={drawing.name}
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );
};