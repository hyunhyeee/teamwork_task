// 도면 메타데이터 구조를 타입으로 정의
export interface Project {
  name: string;
  unit: string;
}

export interface DisciplineMeta {
  name: string;
}

export interface ImageTransform {
  relativeTo?: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface Polygon {
  vertices: number[][];
  polygonTransform?: ImageTransform;
}

export interface Revision {
  version: string;
  image: string;
  date: string;
  description: string;
  changes: string[];
  imageTransform?: ImageTransform;
  polygon?: Polygon;
}

export interface Region {
  polygon?: Polygon;
  revisions?: Revision[];
}

export interface DisciplineData {
  image?: string;
  imageTransform?: ImageTransform;
  polygon?: Polygon;
  revisions?: Revision[];
  regions?: {
    [key: string]: Region;
  };
}

export interface DrawingMeta {
  id: string;
  name: string;
  image?: string;
  parent: string | null;
  position?: {
    vertices: number[][];
    imageTransform: ImageTransform;
  };
  disciplines?: {
    [key: string]: DisciplineData;
  };
}

export interface Metadata {
  project: Project;
  disciplines: DisciplineMeta[];
  drawings: {
    [key: string]: DrawingMeta;
  };
}

export interface AppDrawing {
  id: string;
  drawingId: string;
  name: string
  discipline: string;
  imageFile: string;
  regionKey?: string;
}

export interface ProcessedData {
  disciplines: string[];
  drawings: AppDrawing[];
}