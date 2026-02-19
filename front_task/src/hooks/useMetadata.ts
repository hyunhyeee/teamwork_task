import { useEffect, useState } from 'react';
import type { Metadata, DrawingMeta, AppDrawing, ProcessedData } from '../types/drawing';

const ALL_DISCIPLINES = '전체';

// Helper function to normalize filenames
const normalizeFilename = (filename: string): string => {
  // Apply NFD normalization to handle decomposed Unicode characters (like Korean jamo)
  return filename.normalize('NFD');
};

// Update the return type to include raw metadata
type UseMetadataResult = (ProcessedData & { rawMetadata: Metadata }) | null;

export const useMetadata = (): UseMetadataResult => {
  const [processedData, setProcessedData] = useState<UseMetadataResult>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/metadata.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const metadata: Metadata = await response.json();
        
        const uniqueDisciplines = new Set<string>();
        uniqueDisciplines.add(ALL_DISCIPLINES); // Add "전체" as the first discipline

        const drawings: AppDrawing[] = [];

        for (const dwgId in metadata.drawings) {
          const dwg: DrawingMeta = metadata.drawings[dwgId];

          // Handle top-level drawing image if no specific disciplines are defined or if it's a general drawing
          if (dwg.image && !dwg.disciplines) {
            drawings.push({
              id: `${dwg.id}-base`,
              drawingId: dwg.id,
              name: dwg.name,
              discipline: ALL_DISCIPLINES, // Assign to "전체" or a generic discipline
              imageFile: normalizeFilename(dwg.image), // Apply normalization
            });
          }

          if (dwg.disciplines) {
            for (const disciplineName in dwg.disciplines) {
              uniqueDisciplines.add(disciplineName);
              const discData = dwg.disciplines[disciplineName];

              // Handle discipline-specific base image
              if (discData?.image) {
                drawings.push({
                  id: `${dwg.id}-${disciplineName}-base`,
                  drawingId: dwg.id,
                  name: `${dwg.name} (${disciplineName})`,
                  discipline: disciplineName,
                  imageFile: normalizeFilename(discData.image), // Apply normalization
                });
              }

              // Handle revisions within a discipline
              if (discData?.revisions) {
                for (const rev of discData.revisions) {
                  drawings.push({
                    id: `${dwg.id}-${disciplineName}-${rev.version}`,
                    drawingId: dwg.id,
                    name: `${dwg.name} (${disciplineName} ${rev.version})`,
                    discipline: disciplineName,
                    imageFile: normalizeFilename(rev.image), // Apply normalization
                  });
                }
              }

              // Handle regions within a discipline and their revisions
              if (discData?.regions) {
                for (const regionKey in discData.regions) {
                  const region = discData.regions[regionKey];
                  if (region?.revisions) {
                    for (const rev of region.revisions) {
                      drawings.push({
                        id: `${dwg.id}-${disciplineName}-region${regionKey}-${rev.version}`,
                        drawingId: dwg.id,
                        name: `${dwg.name} (${disciplineName} ${regionKey} ${rev.version})`,
                        discipline: disciplineName,
                        imageFile: normalizeFilename(rev.image), // Apply normalization
                        regionKey: regionKey, // Added regionKey
                      });
                    }
                  }
                }
              }
            }
          }
        }
        
        // Sort disciplines alphabetically, keeping "전체" at the top
        const sortedDisciplines = Array.from(uniqueDisciplines).sort((a, b) => {
          if (a === ALL_DISCIPLINES) return -1;
          if (b === ALL_DISCIPLINES) return 1;
          return a.localeCompare(b);
        });

        setProcessedData({ disciplines: sortedDisciplines, drawings, rawMetadata: metadata });
      } catch (error) {
        console.error("Failed to load or process metadata:", error);
        setProcessedData({ disciplines: [ALL_DISCIPLINES], drawings: [], rawMetadata: { project: { name: '', unit: '' }, disciplines: [], drawings: {} } }); // Provide a minimal fallback
      }
    };

    fetchData();
  }, []);

  return processedData;
};