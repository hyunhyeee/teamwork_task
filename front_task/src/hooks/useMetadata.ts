import { useEffect, useState } from 'react';
import type { Metadata, DrawingMeta, AppDrawing, ProcessedData } from '../types/drawing';

const ALL_DISCIPLINES = '전체';

// 파일명 정규화를 위한 헬퍼 함수
const normalizeFilename = (filename: string): string => {
  return filename.normalize('NFD');
};

// raw metadata를 포함하도록 반환 타입 확장
type UseMetadataResult = (ProcessedData & { rawMetadata: Metadata }) | null;

export const useMetadata = (): UseMetadataResult => {
  const [processedData, setProcessedData] = useState<UseMetadataResult>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/metadata.json'); // 메타데이터 파일 요청
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const metadata: Metadata = await response.json();
        
        const uniqueDisciplines = new Set<string>();
        uniqueDisciplines.add(ALL_DISCIPLINES);

        const drawings: AppDrawing[] = [];

        for (const dwgId in metadata.drawings) {
          const dwg: DrawingMeta = metadata.drawings[dwgId];

          if (dwg.image && !dwg.disciplines) {
            drawings.push({
              id: `${dwg.id}-base`,
              drawingId: dwg.id,
              name: dwg.name,
              discipline: ALL_DISCIPLINES,
              imageFile: normalizeFilename(dwg.image),
            });
          }

          if (dwg.disciplines) {
            for (const disciplineName in dwg.disciplines) {
              uniqueDisciplines.add(disciplineName);
              const discData = dwg.disciplines[disciplineName];

              // 공종별 기본(base) 이미지 처리
              if (discData?.image) {
                drawings.push({
                  id: `${dwg.id}-${disciplineName}-base`,
                  drawingId: dwg.id,
                  name: `${dwg.name} (${disciplineName})`,
                  discipline: disciplineName,
                  imageFile: normalizeFilename(discData.image),
                });
              }

              // 공종 내부에 존재하는 revision(버전) 처리
              if (discData?.revisions) {
                for (const rev of discData.revisions) {
                  drawings.push({
                    id: `${dwg.id}-${disciplineName}-${rev.version}`,
                    drawingId: dwg.id,
                    name: `${dwg.name} (${disciplineName} ${rev.version})`,
                    discipline: disciplineName,
                    imageFile: normalizeFilename(rev.image),
                  });
                }
              }

              // 공종 내부의 region(구역) 및 해당 구역의 revision 처리
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
                        imageFile: normalizeFilename(rev.image),
                        regionKey: regionKey,
                      });
                    }
                  }
                }
              }
            }
          }
        }
        
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