import { configureStore } from '@reduxjs/toolkit';
import labReducer from './labSlice';

const store = configureStore({
  reducer: {
    labs: labReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;