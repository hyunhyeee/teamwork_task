import { useMemo, useState, useEffect } from 'react';
import { useMetadata } from './hooks/useMetadata';
import { DisciplineSelector } from './components/DisciplineSelector';
import { DrawingList } from './components/DrawingList';
import { DrawingViewer } from './components/DrawingViewer';
import { ContextHeader } from './components/ContextHeader';
import { RevisionHistory } from './components/RevisionHistory';
import type { AppDrawing, DrawingMeta, DisciplineData } from './types/drawing';

const ALL_DISCIPLINES = '전체';

function App() {
  const processedData = useMetadata(); // 메타데이터 불러오기

  const [selectedDiscipline, setSelectedDiscipline] =
    useState<string>(ALL_DISCIPLINES); // 현재 선택한 공종
  const [selectedDrawingIds, setSelectedDrawingIds] = useState<string[]>([]); // 현재 선택된 도면id
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false); // 비교모드 on/off

  const disciplines = useMemo(() => { // 공종 목록
    return processedData?.disciplines || [ALL_DISCIPLINES];
  }, [processedData]);

  const filteredDrawings = useMemo(() => { // 도면 필터링
    if (!processedData) return [];
    if (selectedDiscipline === ALL_DISCIPLINES) {
      return processedData.drawings;
    }
    return processedData.drawings.filter(
      (drawing) => drawing.discipline === selectedDiscipline,
    );
  }, [processedData, selectedDiscipline]);

  // 공종 바뀌어도 기존 선택한 도면 화면에 유지
  useEffect(() => {
    setSelectedDrawingIds((currentIds) => {
      const validIds = currentIds.filter(id =>
        filteredDrawings.some(drawing => drawing.id === id)
      );
      if (validIds.length === 0 && filteredDrawings.length > 0) {
        return [filteredDrawings[0].id];
      }
      return validIds;
    });
  }, [filteredDrawings]);

  // 선택한 도면을 따라 실제 도면 반환
  const allSelectedDrawingObjs = useMemo(() => {
    if (!processedData || selectedDrawingIds.length === 0) return [];
    return selectedDrawingIds
      .map((id) => processedData.drawings.find((drawing) => drawing.id === id))
      .filter((drawing): drawing is AppDrawing => drawing !== undefined);
  }, [processedData, selectedDrawingIds]);

  const primaryDrawing = allSelectedDrawingObjs[0] || null;

  // 도면 데이터가 없다면 빈 배열 반환
  const revisionHistory = useMemo(() => {
    if (!processedData || !primaryDrawing || !processedData.rawMetadata) return [];

    const rawDrawings = processedData.rawMetadata.drawings;
    const fullDrawingMeta: DrawingMeta | undefined = Object.values(rawDrawings).find(
      (d: DrawingMeta) => d.id === primaryDrawing.drawingId
    );

    if (fullDrawingMeta && fullDrawingMeta.disciplines) {
      const disciplineData: DisciplineData | undefined = fullDrawingMeta.disciplines[primaryDrawing.discipline];
      
      if (!disciplineData) return [];

      // 1. 특정 region이 있으면 반환
      if (primaryDrawing.regionKey && disciplineData.regions?.[primaryDrawing.regionKey]) {
        return disciplineData.regions[primaryDrawing.regionKey].revisions || [];
      }

      // 2. discipline 레벨 수집
      const revisions = [...(disciplineData.revisions || [])];

      // 3.discipline 레벨도 없는 경우 모든 region의 revision을 하나로 모아서 반환
      if (revisions.length === 0 && disciplineData.regions) {
        Object.values(disciplineData.regions).forEach(region => {
          if (region.revisions) {
            revisions.push(...region.revisions);
          }
        });
        return revisions;
      }

      return revisions;
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

  return (
    <div style={{ 
      width: '100%', 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <ContextHeader
        discipline={primaryDrawing?.discipline ?? null}
        drawingName={primaryDrawing?.name ?? null}
        isCompareMode={isCompareMode}
        onToggleCompareMode={handleToggleCompareMode}
      />

      <div style={{
        marginTop: '60px',
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
        width: '100%'
      }}>
        {/* 왼쪽 선택 사이드바 조정 */}
        <div style={{
          width: '300px',
          flex: '0 0 300px',
          borderRight: '1px solid #ddd',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fff',
        }}>
          <div style={{ padding: 16, paddingBottom: 0 }}>
            <DisciplineSelector
              disciplines={disciplines}
              selected={selectedDiscipline}
              onSelect={(name) => {
                setSelectedDiscipline(name);
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

        {/* 중앙 도면 사진 조정 */}
        <div style={{ 
          flex: 1,
          height: '100%',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <DrawingViewer
            drawings={allSelectedDrawingObjs}
            isCompareMode={isCompareMode}
          />
        </div>

        {/* 오른쪽 변경이력 사이드바 조정 */}
        <div style={{
          width: '300px',
          flex: '0 0 400px',
          height: '100%',
          borderLeft: '1px solid #ddd',
          overflowY: 'auto',
          backgroundColor: '#fff',
        }}>
          <RevisionHistory revisions={revisionHistory} primaryDrawing={primaryDrawing} />
        </div>
      </div>
    </div>
  );
}

export default App;
