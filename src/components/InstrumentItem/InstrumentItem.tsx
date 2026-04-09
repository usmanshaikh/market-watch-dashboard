import React, { memo } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { BsFillCaretUpFill, BsFillCaretDownFill } from 'react-icons/bs';
import type { Instrument } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { addToWatchlist, removeFromWatchlist } from '../../store/watchlistSlice';
import type { RootState } from '../../store/store';
import './InstrumentItem.scss';

interface Props {
  instrument: Instrument;
  isSelected: boolean;
  onClick: (id: string) => void;
}

const InstrumentItem = ({ instrument, isSelected, onClick }: Props) => {
  const dispatch = useDispatch();
  const watchlist = useSelector((s: RootState) => s.watchlist.items);
  const inWatchlist = watchlist.some((i) => i.id === instrument.id);

  const handleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWatchlist) {
      dispatch(removeFromWatchlist(instrument.id));
    } else {
      dispatch(addToWatchlist(instrument));
    }
  };

  const isPositive = instrument.change >= 0;

  return (
    <tr className={`instrument-row ${isSelected ? 'selected' : ''}`} onClick={() => onClick(instrument.id)}>
      <td>
        <span className="ticker-badge">{instrument.id}</span>
      </td>
      <td>
        <div className="name-cell">
          <span className="name">{instrument.name}</span>
          <span className="sector-tag">{instrument.sector}</span>
        </div>
      </td>
      <td className="price-cell">
        {instrument.currency} {instrument.price.toLocaleString()}
      </td>
      <td className={`change-cell ${isPositive ? 'positive' : 'negative'}`}>
        {isPositive ? <BsFillCaretUpFill size={15} /> : <BsFillCaretDownFill size={15} />}{' '}
        {Math.abs(instrument.change).toFixed(2)}%
      </td>
      <td>
        <span className={`status-dot ${instrument.marketStatus.toLowerCase()}`}>{instrument.marketStatus}</span>
      </td>
      <td>
        <button
          className={`watchlist-btn ${inWatchlist ? 'added' : ''}`}
          onClick={handleWatchlist}
          title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}>
          {inWatchlist ? <FaStar /> : <FaRegStar />}
        </button>
      </td>
    </tr>
  );
};

export default memo(InstrumentItem);
