import { useState, useEffect, useMemo, useCallback } from 'react';
import { BiSolidError } from 'react-icons/bi';
import { useDispatch } from 'react-redux';
import { initialInstruments } from './data/instruments';
import type { Instrument, SortField, SortOrder } from './types';
import { updateWatchlistPrices } from './store/watchlistSlice';
import { Watchlist, DetailsPanel, InstrumentList, Filters, SearchBar } from './components';
import './App.scss';

const App = () => {
  const dispatch = useDispatch();

  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError] = useState(false);

  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState<SortField | ''>('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  useEffect(() => {
    const timer = setTimeout(() => {
      setInstruments(initialInstruments);
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const interval = setInterval(() => {
      setInstruments((prevInstruments) =>
        prevInstruments.map((inst) => {
          // skip closed markets — no price updates
          if (inst.marketStatus === 'Closed') return inst;

          // decide direction and size of price movement
          const randomDirection = Math.random() > 0.5 ? 1 : -1; // up or down
          const smallAmount = inst.price * 0.005; // 0.5% of current price
          const delta = randomDirection * smallAmount;

          // apply movement and keep price above zero
          let newPrice = inst.price + delta;
          newPrice = Math.round(newPrice * 100) / 100; // round to 2 decimals
          if (newPrice < 0.01) newPrice = 0.01; // floor — price never goes negative

          // slightly drift the change % up or down
          const smallDrift = (Math.random() - 0.5) * 0.1;
          let newChange = inst.change + smallDrift;
          newChange = Math.round(newChange * 100) / 100; // round to 2 decimals

          // sliding window: drop oldest price, add new one
          // always keeps last 5 prices for the chart
          const newHistory = inst.history.slice(-4); // grab last 4
          newHistory.push(newPrice);

          return { ...inst, price: newPrice, change: newChange, history: newHistory };
        }),
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    if (instruments.length > 0) {
      dispatch(updateWatchlistPrices(instruments));
    }
  }, [instruments, dispatch]);

  const selectedInstrument = useMemo(() => instruments.find((i) => i.id === selectedId) ?? null, [instruments, selectedId]);

  const sectors = useMemo(() => {
    const allSectors = instruments.map((i) => i.sector);
    const unique = [...new Set(allSectors)];
    return unique;
  }, [instruments]);

  const handleSelect = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const handleCloseDetails = useCallback(() => setSelectedId(null), []);

  const filtered = useMemo(() => {
    let result = [...instruments];
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter((inst) => {
        const matchesBasic =
          inst.id.toLowerCase().includes(query) ||
          inst.name.toLowerCase().includes(query) ||
          inst.sector.toLowerCase().includes(query);
        const matchesTag = inst.tags.some((tag) => tag.toLowerCase().includes(query));
        return matchesBasic || matchesTag;
      });
    }

    if (sectorFilter) {
      result = result.filter((inst) => inst.sector === sectorFilter);
    }

    if (statusFilter) {
      result = result.filter((inst) => inst.marketStatus === statusFilter);
    }

    if (sortField) {
      result.sort((a, b) => {
        let aVal: number, bVal: number;
        if (sortField === 'price') {
          aVal = a.price;
          bVal = b.price;
        } else if (sortField === 'change') {
          aVal = a.change;
          bVal = b.change;
        } else {
          aVal = a.metrics.volume;
          bVal = b.metrics.volume;
        }
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      });
    }

    return result;
  }, [instruments, search, sectorFilter, statusFilter, sortField, sortOrder]);

  if (hasError) {
    return (
      <div className="error-screen">
        <BiSolidError color="red" size={80} />
        <h2>Something went wrong</h2>
        <p>Could not load market data. Please refresh.</p>
        <button onClick={() => window.location.reload()}>Reload</button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-brand">
          <span className="brand-dot" />
          <span className="brand-name">Market Watch</span>
          <span className="brand-sub">Real-Time Dashboard</span>
        </div>
        <div className="header-right">
          <span className="live-indicator">
            <span className="pulse" />
            LIVE
          </span>
        </div>
      </header>
      <main className="app-main">
        <div className="left-col">
          <Watchlist />
        </div>
        <div className="center-col">
          <div className="toolbar">
            <SearchBar value={search} onChange={setSearch} />
            <Filters
              sectors={sectors}
              selectedSector={sectorFilter}
              onSectorChange={setSectorFilter}
              selectedStatus={statusFilter}
              onStatusChange={setStatusFilter}
              sortField={sortField}
              onSortFieldChange={setSortField}
              sortOrder={sortOrder}
              onSortOrderChange={setSortOrder}
            />
          </div>
          <InstrumentList instruments={filtered} selectedId={selectedId} onSelect={handleSelect} isLoading={isLoading} />
        </div>
        <div className="right-col">
          <DetailsPanel instrument={selectedInstrument} onClose={handleCloseDetails} />
        </div>
      </main>
    </div>
  );
};

export default App;
