import { useSelector, useDispatch } from 'react-redux';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { BsFillCaretUpFill, BsFillCaretDownFill } from 'react-icons/bs';
import type { RootState } from '../../store/store';
import { removeFromWatchlist } from '../../store/watchlistSlice';
import './Watchlist.scss';

const Watchlist = () => {
  const dispatch = useDispatch();
  const items = useSelector((s: RootState) => s.watchlist.items);

  if (items.length === 0) {
    return (
      <div className="watchlist">
        <h3 className="section-title">
          <FaStar /> Watchlist
        </h3>
        <p className="watchlist-empty">
          No instruments added yet. Click <FaRegStar /> to track one.
        </p>
      </div>
    );
  }

  return (
    <div className="watchlist">
      <h3 className="section-title">
        <FaStar /> Watchlist <span className="count-badge">{items.length}</span>
      </h3>
      <div className="watchlist-items">
        {items.map((item) => {
          const isPositive = item.change >= 0;
          return (
            <div key={item.id} className="watchlist-item">
              <div className="wl-left">
                <span className="ticker-badge small">{item.id}</span>
                <span className="wl-name">{item.name}</span>
              </div>
              <div className="wl-right">
                <span className="wl-price">
                  {item.currency} {item.price.toLocaleString()}
                </span>
                <span className={`wl-change ${isPositive ? 'positive' : 'negative'}`}>
                  {isPositive ? <BsFillCaretUpFill /> : <BsFillCaretDownFill />} {Math.abs(item.change).toFixed(2)}%
                </span>
                <button className="remove-btn" onClick={() => dispatch(removeFromWatchlist(item.id))} title="Remove">
                  <IoClose size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Watchlist;
