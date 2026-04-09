import './RecursiveViewer.scss';

interface Props {
  data: unknown;
  label?: string;
  depth?: number;
}

const RecursiveViewer = ({ data, label, depth = 0 }: Props) => {
  const indent = depth * 16;

  if (data === null || data === undefined) {
    return (
      <div className="rv-row" style={{ paddingLeft: indent }}>
        {label && <span className="rv-key">{label}:</span>}
        <span className="rv-null">null</span>
      </div>
    );
  }

  if (Array.isArray(data)) {
    return (
      <div className="rv-block" style={{ paddingLeft: indent }}>
        {label && <span className="rv-key">{label}: </span>}
        <span className="rv-bracket">[</span>
        <div className="rv-children">
          {data.map((item, i) => (
            <RecursiveViewer key={i} data={item} label={`${i}`} depth={depth + 1} />
          ))}
        </div>
        <span className="rv-bracket">]</span>
      </div>
    );
  }

  if (typeof data === 'object') {
    return (
      <div className="rv-block" style={{ paddingLeft: indent }}>
        {label && <span className="rv-key">{label}: </span>}
        <span className="rv-bracket">{'{'}</span>
        <div className="rv-children">
          {Object.entries(data as Record<string, unknown>).map(([k, v]) => (
            <RecursiveViewer key={k} data={v} label={k} depth={depth + 1} />
          ))}
        </div>
        <span className="rv-bracket">{'}'}</span>
      </div>
    );
  }

  return (
    <div className="rv-row" style={{ paddingLeft: indent }}>
      {label && <span className="rv-key">{label}:</span>}
      <span className={`rv-value rv-${typeof data}`}>{String(data)}</span>
    </div>
  );
};

export default RecursiveViewer;
