// front_task/src/components/RevisionHistory.tsx
import type { Revision, AppDrawing } from '../types/drawing';

interface Props {
  revisions: Revision[];
  primaryDrawing: AppDrawing | null;
}

export const RevisionHistory = ({ revisions, primaryDrawing }: Props) => {
  if (!primaryDrawing) {
    return (
      <div style={{ padding: 16, borderLeft: '1px solid #ddd' }}>
        <h3>도면을 선택해주세요.</h3>
      </div>
    );
  }

  if (!revisions || revisions.length === 0) {
    return (
      <div style={{ padding: 16, borderLeft: '1px solid #ddd' }}>
        <h3>변경 이력 없음</h3>
      </div>
    );
  }

  return (
    <div style={{ padding: 15, borderLeft: '1px solid #ddd', overflowY: 'auto', flex: '1 1 auto' }}>
      <h3>{primaryDrawing.name} 변경 이력</h3>
      {revisions.map((rev, index) => (
        <div key={rev.version + index} style={{ marginBottom: 20, borderBottom: '1px dashed #eee', paddingBottom: 10 }}>
          <h4>{rev.version} ({rev.date})</h4>
          <p><strong>설명:</strong> {rev.description}</p>
          {rev.changes && rev.changes.length > 0 && (
            <div>
              <strong>변경 내용:</strong>
              <ul>
                {rev.changes.map((change, i) => (
                  <li key={i}>{change}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
