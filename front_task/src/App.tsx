import { useMemo, useState } from 'react';
import { useMetadata } from './hooks/useMetadata';
import { DisciplineSelector } from './components/DisciplineSelector';
import { DrawingList } from './components/DrawingList';
import { DrawingViewer } from './components/DrawingViewer';
import { ContextHeader } from './components/ContextHeader';
import type { AppDrawing, DrawingMeta, DisciplineData } from './types/drawing';

const ALL_DISCIPLINES = '전체';

function App() {
  const processedData = useMetadata();

  const [selectedDiscipline, setSelectedDiscipline] =
    useState<string>(ALL_DISCIPLINES);
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

  const primaryDrawing = allSelectedDrawingObjs[0] || null;

  const revisionHistory = useMemo(() => {
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

  const handleToggleCompareMode = () => {
    setIsCompareMode((prev) => {
      if (prev) {
        setSelectedDrawingIds((currentIds) => currentIds.slice(0, 1));
      }
      return !prev;
    });
  };

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
                setSelectedDrawingIds([]);
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

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <DrawingViewer
            drawings={allSelectedDrawingObjs}
            isCompareMode={isCompareMode}
            revisionHistory={revisionHistory}
            primaryDrawing={primaryDrawing} // Pass primaryDrawing
          />
        </div>
      </div>
    </div>
  );
}

export default App;
