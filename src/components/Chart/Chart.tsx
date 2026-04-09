import { BsFillCaretUpFill, BsFillCaretDownFill } from 'react-icons/bs';
import './Chart.scss';

interface Props {
  history: number[];
}

const Chart = ({ history }: Props) => {
  if (!history || history.length === 0) return null;

  const min = Math.min(...history);
  const max = Math.max(...history);

  const firstPrice = history[0];
  const lastPrice = history[history.length - 1];
  const isTrendingUp = lastPrice >= firstPrice;

  const barColor = isTrendingUp ? '#00e5a0' : '#ff4d6d';

  return (
    <div className="chart">
      <p className="chart-status" style={{ color: barColor }}>
        {isTrendingUp ? (
          <>
            <BsFillCaretUpFill className="icon" /> Trending Up
          </>
        ) : (
          <>
            <BsFillCaretDownFill className="icon" /> Trending Down
          </>
        )}
      </p>
      <div className="chart-bars">
        {history.map((price, index) => {
          const heightPx = ((price - min) / (max - min)) * 80 || 6;
          return (
            <div key={index} className="bar-item">
              <div className="bar" style={{ height: heightPx, backgroundColor: barColor }} />
              <span className="label">T{index + 1}</span>
            </div>
          );
        })}
      </div>
      <div className="chart-footer">
        <span>Low: {min}</span>
        <span>High: {max}</span>
      </div>
    </div>
  );
};

export default Chart;
