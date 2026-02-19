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
  image?: string; // Top-level image for the drawing
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

// --- Types for processed data in the application ---

export interface AppDrawing {
  id: string; // Unique ID for each displayable drawing (e.g., drawingId-disciplineName-version)
  drawingId: string; // Original drawing ID from metadata
  name: string; // Display name (e.g., "101동 지상1층 평면도 (건축 REV1)")
  discipline: string; // Discipline name (e.g., "건축")
  imageFile: string; // The actual image file name (e.g., "02_101동 지상1층 평면도_건축_REV1.jpeg")
  regionKey?: string; // Optional: The key of the region if the drawing is region-specific
}

export interface ProcessedData {
  disciplines: string[]; // List of unique discipline names, including "전체"
  drawings: AppDrawing[]; // Flattened list of all displayable drawings
}