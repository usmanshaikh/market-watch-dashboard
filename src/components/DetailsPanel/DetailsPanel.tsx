import { IoClose } from 'react-icons/io5';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { BsFillCaretUpFill, BsFillCaretDownFill } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import type { Instrument } from '../../types';
import { addToWatchlist, removeFromWatchlist } from '../../store/watchlistSlice';
import type { RootState } from '../../store/store';
import { RecursiveViewer, Chart } from '../';
import './DetailsPanel.scss';

interface Props {
  instrument: Instrument | null;
  onClose: () => void;
}

const DetailsPanel = ({ instrument, onClose }: Props) => {
  const dispatch = useDispatch();
  const watchlist = useSelector((s: RootState) => s.watchlist.items);

  if (!instrument) {
    return (
      <div className="details-panel empty-panel">
        <p className="select-hint">Select an instrument to view details</p>
      </div>
    );
  }

  const inWatchlist = watchlist.some((i) => i.id === instrument.id);
  const isPositive = instrument.change >= 0;

  const handleWatchlist = () => {
    if (inWatchlist) {
      dispatch(removeFromWatchlist(instrument.id));
    } else {
      dispatch(addToWatchlist(instrument));
    }
  };

  return (
    <div className="details-panel">
      <div className="details-header">
        <div>
          <span className="details-ticker">{instrument.id}</span>
          <h2 className="details-name">{instrument.name}</h2>
        </div>
        <div className="details-header-actions">
          <button className={`watchlist-btn-lg ${inWatchlist ? 'added' : ''}`} onClick={handleWatchlist}>
            {inWatchlist ? (
              <FaStar />
            ) : (
              <>
                <FaRegStar /> Watch
              </>
            )}
          </button>
          <button className="close-btn" onClick={onClose}>
            <IoClose size={15} />
          </button>
        </div>
      </div>

      <div className="details-price-row">
        <span className="details-price">
          {instrument.currency} {instrument.price.toLocaleString()}
        </span>
        <span className={`details-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? <BsFillCaretUpFill /> : <BsFillCaretDownFill />} {Math.abs(instrument.change).toFixed(2)}%
        </span>
      </div>

      <div className="details-meta">
        <span className="detail-badge">{instrument.sector}</span>
        <span className={`status-dot ${instrument.marketStatus.toLowerCase()}`}>{instrument.marketStatus}</span>
        {instrument.tags.map((tag) => (
          <span key={tag} className="tag-pill">
            {tag}
          </span>
        ))}
      </div>

      <div className="details-section">
        <h3>Price History</h3>
        <Chart history={instrument.history} />
      </div>

      <div className="details-section">
        <h3>Metrics</h3>
        <div className="metrics-grid">
          <div className="metric-item">
            <span className="metric-label">Market Cap</span>
            <span className="metric-value">{instrument.metrics.marketCap}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">P/E Ratio</span>
            <span className="metric-value">{instrument.metrics.peRatio ?? 'N/A'}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Volume</span>
            <span className="metric-value">{instrument.metrics.volume.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="details-section raw-section">
        <h3>Raw Metrics Explorer</h3>
        <div className="rv-container">
          <RecursiveViewer
            data={{
              metrics: instrument.metrics,
              tags: instrument.tags,
              history: instrument.history,
            }}
            depth={0}
          />
        </div>
      </div>
    </div>
  );
};

export default DetailsPanel;
