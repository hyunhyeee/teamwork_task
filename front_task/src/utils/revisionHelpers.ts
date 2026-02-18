// front_task/src/utils/revisionHelpers.ts
import type { AppDrawing, Revision, Metadata, DrawingMeta, DisciplineData } from '../types/drawing';

// Helper function to extract revisions for a given AppDrawing
export const getRevisionHistoryForDrawing = (
  drawing: AppDrawing | null, // Can be null
  rawMetadata: Metadata | null
): Revision[] => {
  if (!rawMetadata || !drawing) return [];

  const fullDrawingMeta: DrawingMeta | undefined = rawMetadata.drawings[drawing.drawingId]; // Directly access by key

  if (!fullDrawingMeta || !fullDrawingMeta.disciplines) return [];

  const disciplineData = fullDrawingMeta.disciplines[drawing.discipline];
  if (!disciplineData) return [];

  // Prioritize revisions directly under the discipline
  if (disciplineData.revisions) {
    return disciplineData.revisions;
  }

  // If not found, check regions. We need to parse primaryDrawing.id
  // Example AppDrawing.id: "01-구조-regionB-REV2B"
  const appDrawingIdParts = drawing.id.split('-');
  const regionKeyIndex = appDrawingIdParts.indexOf('region');
  
  if (regionKeyIndex > -1 && disciplineData.regions) {
      const regionKey = appDrawingIdParts[regionKeyIndex + 1]; // e.g., 'B' for 'regionB'
      const region = disciplineData.regions[regionKey];
      if (region && region.revisions) {
          return region.revisions;
      }
  }

  return [];
};
