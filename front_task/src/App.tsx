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
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const [selectedDrawingForComparisonId, setSelectedDrawingForComparisonId] =
    useState<string | null>(null);

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

  const selectedDrawingForComparisonObj = useMemo(() => {
    if (!processedData || !selectedDrawingForComparisonId) return null;
    const foundDrawing = processedData.drawings.find(
      (drawing) => drawing.id === selectedDrawingForComparisonId,
    );
    return foundDrawing === undefined ? null : foundDrawing;
  }, [processedData, selectedDrawingForComparisonId]);

  const handleToggleCompareMode = () => {
    setIsCompareMode((prev) => {
      // If turning off compare mode, reset the comparison drawing
      if (prev) {
        setSelectedDrawingForComparisonId(null);
      }
      return !prev;
    });
  };

  if (!processedData) return <div>Loading metadata...</div>;

  return (
    <div style={{ width: '100%' }}>
      <ContextHeader
        discipline={selectedDrawingObj?.discipline ?? null}
        drawingName={selectedDrawingObj?.name ?? null}
        isCompareMode={isCompareMode}
        onToggleCompareMode={handleToggleCompareMode}
      />

      <div style={{
        marginTop: '60px', // Corrected: Space for the fixed header
        height: 'calc(100vh - 60px)', // Added: Remaining height
        display: 'flex',
      }}>
        <div style={{ // This is the overall sidebar container
          width: 250, // Corrected: Fixed width for the sidebar, as discussed
          borderRight: '1px solid #ddd',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Discipline Selector Section */}
          <div style={{ padding: 16, paddingBottom: 0 }}> {/* Top padding */}
            <DisciplineSelector
              disciplines={disciplines}
              selected={selectedDiscipline}
              onSelect={(name) => {
                setSelectedDiscipline(name);
              }}
            />
          </div>

          {/* Drawing List Section (scrollable) */}
          <div style={{ flex: 1, padding: 16, paddingTop: 0, overflowY: 'auto' }}> {/* Bottom padding, scrollable */}
            <DrawingList
              drawings={filteredDrawings}
              selectedId={selectedDrawingId}
              selectedCompareId={selectedDrawingForComparisonId}
              isCompareMode={isCompareMode}
              onSelect={(drawing) => {
                if (isCompareMode) {
                  // If compare mode is active
                  if (selectedDrawingId === null || selectedDrawingId === drawing.id) {
                    setSelectedDrawingId(drawing.id);
                    setSelectedDrawingForComparisonId(null);
                  } else if (selectedDrawingForComparisonId === drawing.id) {
                    setSelectedDrawingForComparisonId(null);
                  } else if (drawing.id !== selectedDrawingId) {
                    setSelectedDrawingForComparisonId(drawing.id);
                  }
                } else {
                  setSelectedDrawingId(drawing.id);
                  setSelectedDrawingForComparisonId(null);
                }
              }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}> {/* Corrected: Main drawing viewer area with scroll, and padding */}
          <DrawingViewer
            drawing={selectedDrawingObj}
            compareDrawing={selectedDrawingForComparisonObj}
            isCompareMode={isCompareMode}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
