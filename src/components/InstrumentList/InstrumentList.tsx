import { TbReportSearch } from 'react-icons/tb';
import type { Instrument } from '../../types';
import { InstrumentItem } from '../';
import './InstrumentList.scss';

interface Props {
  instruments: Instrument[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isLoading: boolean;
}

const InstrumentList = ({ instruments, selectedId, onSelect, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="state-box">
        <div className="spinner" />
        <p>Loading market data...</p>
      </div>
    );
  }

  if (instruments.length === 0) {
    return (
      <div className="state-box empty">
        <TbReportSearch size={40} />
        <p>No instruments match your search.</p>
        <small>Try a different keyword or reset filters.</small>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="instrument-table">
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Name / Sector</th>
            <th>Price</th>
            <th>Change</th>
            <th>Status</th>
            <th>Watch</th>
          </tr>
        </thead>
        <tbody>
          {instruments.map((inst) => (
            <InstrumentItem key={inst.id} instrument={inst} isSelected={selectedId === inst.id} onClick={onSelect} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InstrumentList;
