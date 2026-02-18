import { useMemo, useState } from 'react';
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
  const [selectedDrawingIds, setSelectedDrawingIds] = useState<string[]>([]);
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);

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

  const allSelectedDrawingObjs = useMemo(() => {
    if (!processedData || selectedDrawingIds.length === 0) return [];
    return selectedDrawingIds
      .map((id) => processedData.drawings.find((drawing) => drawing.id === id))
      .filter((drawing): drawing is AppDrawing => drawing !== undefined);
  }, [processedData, selectedDrawingIds]);

  const handleToggleCompareMode = () => {
    setIsCompareMode((prev) => {
      // If turning off compare mode, reset the comparison drawings to only the first one
      if (prev) {
        setSelectedDrawingIds((currentIds) => currentIds.slice(0, 1));
      }
      return !prev;
    });
  };

  if (!processedData) return <div>Loading metadata...</div>;

  const primaryDrawing = allSelectedDrawingObjs[0] || null;

  return (
    <div style={{ width: '100%' }}>
      <ContextHeader
        discipline={primaryDrawing?.discipline ?? null}
        drawingName={primaryDrawing?.name ?? null}
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
                setSelectedDrawingIds([]); // Clear selections when discipline changes
              }}
            />
          </div>

          {/* Drawing List Section (scrollable) */}
          <div style={{ flex: 1, padding: 16, paddingTop: 0, overflowY: 'auto' }}> {/* Bottom padding, scrollable */}
            <DrawingList
              drawings={filteredDrawings}
              selectedIds={selectedDrawingIds}
              isCompareMode={isCompareMode}
              onSelect={(drawing) => {
                setSelectedDrawingIds((currentIds) => {
                  if (isCompareMode) {
                    const isAlreadySelected = currentIds.includes(drawing.id);
                    if (isAlreadySelected) {
                      // Remove if already selected
                      return currentIds.filter((id) => id !== drawing.id);
                    } else {
                      // Add if not selected, up to max 4
                      if (currentIds.length < 4) {
                        return [...currentIds, drawing.id];
                      }
                      // If already 4, replace the last one
                      return [...currentIds.slice(1), drawing.id];
                    }
                  } else {
                    // Not in compare mode, only one selection allowed
                    return [drawing.id];
                  }
                });
              }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}> {/* Corrected: Main drawing viewer area with scroll, and padding */}
          <DrawingViewer
            drawings={allSelectedDrawingObjs}
            isCompareMode={isCompareMode}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
