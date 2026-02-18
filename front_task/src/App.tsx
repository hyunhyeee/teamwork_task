import { useMemo, useState, useEffect } from 'react'; // Import useEffect
import { useMetadata } from './hooks/useMetadata';
import { DisciplineSelector } from './components/DisciplineSelector';
import { DrawingList } from './components/DrawingList';
import { DrawingViewer } from './components/DrawingViewer';
import { ContextHeader } from './components/ContextHeader';
import { RevisionHistory } from './components/RevisionHistory'; // Import RevisionHistory
import type { AppDrawing, DrawingMeta, DisciplineData } from './types/drawing';

const ALL_DISCIPLINES = '전체';

function App() {
  const processedData = useMetadata(); // Hook 1

  const [selectedDiscipline, setSelectedDiscipline] =
    useState<string>(ALL_DISCIPLINES); // Hook 2
  const [selectedDrawingIds, setSelectedDrawingIds] = useState<string[]>([]); // Hook 3
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false); // Hook 4

  const disciplines = useMemo(() => { // Hook 5
    return processedData?.disciplines || [ALL_DISCIPLINES];
  }, [processedData]);

  const filteredDrawings = useMemo(() => { // Hook 6
    if (!processedData) return []; // Handle null processedData gracefully
    if (selectedDiscipline === ALL_DISCIPLINES) {
      return processedData.drawings;
    }
    return processedData.drawings.filter(
      (drawing) => drawing.discipline === selectedDiscipline,
    );
  }, [processedData, selectedDiscipline]);

  // Effect to filter selectedDrawingIds when filteredDrawings changes
  useEffect(() => {
    setSelectedDrawingIds((currentIds) => {
      // Keep only those IDs that are still present in the current filteredDrawings
      const validIds = currentIds.filter(id =>
        filteredDrawings.some(drawing => drawing.id === id)
      );
      // If no drawings are selected but there are filtered drawings, select the first one by default
      if (validIds.length === 0 && filteredDrawings.length > 0) {
        return [filteredDrawings[0].id];
      }
      return validIds;
    });
  }, [filteredDrawings]); // Rerun when filteredDrawings changes

  const allSelectedDrawingObjs = useMemo(() => { // Hook 7
    if (!processedData || selectedDrawingIds.length === 0) return []; // Handle null processedData or empty selection
    return selectedDrawingIds
      .map((id) => processedData.drawings.find((drawing) => drawing.id === id))
      .filter((drawing): drawing is AppDrawing => drawing !== undefined);
  }, [processedData, selectedDrawingIds]);

  const primaryDrawing = allSelectedDrawingObjs[0] || null; // Not a hook, derived state

  // Re-introduced revisionHistory useMemo
  const revisionHistory = useMemo(() => { // Hook 8
    if (!processedData || !primaryDrawing || !processedData.rawMetadata) return [];

    const rawDrawings = processedData.rawMetadata.drawings;
    const fullDrawingMeta: DrawingMeta | undefined = Object.values(rawDrawings).find(
      (d: DrawingMeta) => d.id === primaryDrawing.drawingId
    );

    if (fullDrawingMeta && fullDrawingMeta.disciplines) {
      const disciplineData: DisciplineData | undefined = fullDrawingMeta.disciplines[primaryDrawing.discipline];
      if (disciplineData && disciplineData.revisions) {
        return disciplineData.revisions;
      }
      if (disciplineData && disciplineData.regions) {
        for (const regionKey in disciplineData.regions) {
          const region = disciplineData.regions[regionKey];
          if (region && region.revisions) {
            return region.revisions;
          }
        }
      }
    }
    return [];
  }, [processedData, primaryDrawing]);

  const handleToggleCompareMode = () => { // Not a hook, event handler
    setIsCompareMode((prev) => {
      if (prev) {
        setSelectedDrawingIds((currentIds) => currentIds.slice(0, 1));
      }
      return !prev;
    });
  };

  // Conditional rendering MUST come after all hooks are called unconditionally
  if (!processedData) return <div>Loading metadata...</div>;

  return (
    <div style={{ width: '100%' }}>
      <ContextHeader
        discipline={primaryDrawing?.discipline ?? null}
        drawingName={primaryDrawing?.name ?? null}
        isCompareMode={isCompareMode}
        onToggleCompareMode={handleToggleCompareMode}
      />

      <div style={{
        marginTop: '60px',
        height: 'calc(100vh - 60px)',
        display: 'flex',
      }}>
        {/* Left Sidebar */}
        <div style={{
          width: 250,
          borderRight: '1px solid #ddd',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{ padding: 16, paddingBottom: 0 }}>
            <DisciplineSelector
              disciplines={disciplines}
              selected={selectedDiscipline}
              onSelect={(name) => {
                setSelectedDiscipline(name);
                // setSelectedDrawingIds([]); // Removed: maintain selections
              }}
            />
          </div>

          <div style={{ flex: 1, padding: 16, paddingTop: 0, overflowY: 'auto' }}>
            <DrawingList
              drawings={filteredDrawings}
              selectedIds={selectedDrawingIds}
              isCompareMode={isCompareMode}
              onSelect={(drawing) => {
                setSelectedDrawingIds((currentIds) => {
                  if (isCompareMode) {
                    const isAlreadySelected = currentIds.includes(drawing.id);
                    if (isAlreadySelected) {
                      return currentIds.filter((id) => id !== drawing.id);
                    } else {
                      if (currentIds.length < 4) {
                        return [...currentIds, drawing.id];
                      }
                      return [...currentIds.slice(1), drawing.id];
                    }
                  } else {
                    return [drawing.id];
                  }
                });
              }}
            />
          </div>
        </div>

        {/* Middle Drawing Viewer Area */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <DrawingViewer
            drawings={allSelectedDrawingObjs}
            isCompareMode={isCompareMode}
            // rawMetadata is no longer passed to DrawingViewer
            // primaryDrawing is no longer passed to DrawingViewer
          />
        </div>

        {/* Right Revision History Sidebar */}
        <div style={{ flex: '0 0 300px', height: '100%', borderLeft: '1px solid #ddd', overflowY: 'auto' }}>
          <RevisionHistory revisions={revisionHistory} primaryDrawing={primaryDrawing} />
        </div>
      </div>
    </div>
  );
}

export default App;
