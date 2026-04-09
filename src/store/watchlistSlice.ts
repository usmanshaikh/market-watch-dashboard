import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Instrument } from '../types';

interface WatchlistState {
  items: Instrument[];
}

const loadFromStorage = (): Instrument[] => {
  try {
    const raw = localStorage.getItem('watchlist');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const initialState: WatchlistState = {
  items: loadFromStorage(),
};

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    addToWatchlist(state, action: PayloadAction<Instrument>) {
      const exists = state.items.find((i) => i.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
        localStorage.setItem('watchlist', JSON.stringify(state.items));
      }
    },
    removeFromWatchlist(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
      localStorage.setItem('watchlist', JSON.stringify(state.items));
    },
    updateWatchlistPrices(state, action: PayloadAction<Instrument[]>) {
      state.items = state.items.map((item) => {
        const updated = action.payload.find((i) => i.id === item.id);
        if (updated) {
          return {
            ...item,
            price: updated.price,
            change: updated.change,
          };
        }
        return item;
      });
      localStorage.setItem('watchlist', JSON.stringify(state.items));
    },
  },
});

export const { addToWatchlist, removeFromWatchlist, updateWatchlistPrices } = watchlistSlice.actions;
export default watchlistSlice.reducer;
