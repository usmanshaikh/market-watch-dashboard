import { memo } from 'react';
import { IoClose, IoSearch } from 'react-icons/io5';
import './SearchBar.scss';

interface Props {
  value: string;
  onChange: (val: string) => void;
}

const SearchBar = ({ value, onChange }: Props) => {
  return (
    <div className="search-bar">
      <span className="search-icon">
        <IoSearch size={15} />
      </span>
      <input
        type="text"
        placeholder="Search by name, ticker, sector, tag..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="search-input"
      />
      {value && (
        <button className="clear-btn" onClick={() => onChange('')}>
          <IoClose size={20} />
        </button>
      )}
    </div>
  );
};

export default memo(SearchBar);
