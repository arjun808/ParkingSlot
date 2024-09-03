// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import lengthReducer from './lengthSlice';

const store = configureStore({
    reducer: {
        length: lengthReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
