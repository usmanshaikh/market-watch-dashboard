import { memo } from 'react';
import type { SortField, SortOrder } from '../../types';
import './Filters.scss';

interface Props {
  sectors: string[];
  selectedSector: string;
  onSectorChange: (s: string) => void;
  selectedStatus: string;
  onStatusChange: (s: string) => void;
  sortField: SortField | '';
  onSortFieldChange: (f: SortField | '') => void;
  sortOrder: SortOrder;
  onSortOrderChange: (o: SortOrder) => void;
}

const Filters = ({
  sectors,
  selectedSector,
  onSectorChange,
  selectedStatus,
  onStatusChange,
  sortField,
  onSortFieldChange,
  sortOrder,
  onSortOrderChange,
}: Props) => {
  return (
    <div className="filters-bar">
      <div className="filter-group">
        <label>Sector</label>
        <select value={selectedSector} onChange={(e) => onSectorChange(e.target.value)}>
          <option value="">All Sectors</option>
          {sectors.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-group">
        <label>Status</label>
        <select value={selectedStatus} onChange={(e) => onStatusChange(e.target.value)}>
          <option value="">All</option>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>
      </div>
      <div className="filter-group">
        <label>Sort By</label>
        <select value={sortField} onChange={(e) => onSortFieldChange(e.target.value as SortField | '')}>
          <option value="">Default</option>
          <option value="price">Price</option>
          <option value="change">Change %</option>
          <option value="volume">Volume</option>
        </select>
      </div>
      {sortField && (
        <div className="filter-group">
          <label>Order</label>
          <select value={sortOrder} onChange={(e) => onSortOrderChange(e.target.value as SortOrder)}>
            <option value="asc">&uarr; Asc</option>
            <option value="desc">&darr; Desc</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default memo(Filters);
