import { useMemo, useState, useEffect } from 'react';
import { useMetadata } from './hooks/useMetadata';
import { DisciplineSelector } from './components/DisciplineSelector';
import { DrawingList } from './components/DrawingList';
import { DrawingViewer } from './components/DrawingViewer';
import { ContextHeader } from './components/ContextHeader';
import type { AppDrawing } from './types/drawing';

const ALL_DISCIPLINES = '전체';

function App() {
  const processedData = useMetadata();

  const [selectedDiscipline, setSelectedDiscipline] =
    useState<string>(ALL_DISCIPLINES); // Default to "전체"
  const [selectedDrawingId, setSelectedDrawingId] =
    useState<string | null>(null);

  // Reset selected drawing when discipline changes
  useEffect(() => {
    setSelectedDrawingId(null);
  }, [selectedDiscipline]);

  const disciplines = useMemo(() => {
    return processedData?.disciplines || [ALL_DISCIPLINES];
  }, [processedData]);

  const filteredDrawings = useMemo(() => {
    if (!processedData) return [];
    if (selectedDiscipline === ALL_DISCIPLINES) {
      return processedData.drawings;
    }
    return processedData.drawings.filter(
      (drawing) => drawing.discipline === selectedDiscipline,
    );
  }, [processedData, selectedDiscipline]);

  const selectedDrawingObj = useMemo(() => {
    if (!processedData || !selectedDrawingId) return null;
    const foundDrawing = processedData.drawings.find(
      (drawing) => drawing.id === selectedDrawingId,
    );
    return foundDrawing === undefined ? null : foundDrawing;
  }, [processedData, selectedDrawingId]);

  if (!processedData) return <div>Loading metadata...</div>;

  return (
    <div>
      <ContextHeader
        discipline={selectedDrawingObj?.discipline ?? null}
        drawingName={selectedDrawingObj?.name ?? null}
      />

      <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
        <div style={{ width: 250, padding: 16, borderRight: '1px solid #ddd' }}>
          <DisciplineSelector
            disciplines={disciplines}
            selected={selectedDiscipline}
            onSelect={(name) => {
              setSelectedDiscipline(name);
            }}
          />

          <DrawingList
            drawings={filteredDrawings}
            selectedId={selectedDrawingId}
            onSelect={(drawing) => setSelectedDrawingId(drawing.id)}
          />
        </div>

        <div style={{ flex: 1, padding: 16 }}>
          <DrawingViewer
            drawing={selectedDrawingObj}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
