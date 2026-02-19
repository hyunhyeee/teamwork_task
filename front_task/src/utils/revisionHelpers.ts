
import type { AppDrawing, Revision, Metadata, DrawingMeta } from '../types/drawing';

// 특정 AppDrawing에 대한 revision 이력을 추출하는 헬퍼 함수
export const getRevisionHistoryForDrawing = (
  drawing: AppDrawing | null,
  rawMetadata: Metadata | null
): Revision[] => {
  if (!rawMetadata || !drawing) return [];

  const fullDrawingMeta: DrawingMeta | undefined = rawMetadata.drawings[drawing.drawingId]; // Directly access by key

  if (!fullDrawingMeta || !fullDrawingMeta.disciplines) return [];

  const disciplineData = fullDrawingMeta.disciplines[drawing.discipline];
  if (!disciplineData) return [];

  if (disciplineData.revisions) {
    return disciplineData.revisions;
  }

  // region을 확인
  const appDrawingIdParts = drawing.id.split('-');
  const regionKeyIndex = appDrawingIdParts.indexOf('region');
  
  if (regionKeyIndex > -1 && disciplineData.regions) {
      const regionKey = appDrawingIdParts[regionKeyIndex + 1];
      const region = disciplineData.regions[regionKey];
      if (region && region.revisions) {
          return region.revisions;
      }
  }

  return [];
};
