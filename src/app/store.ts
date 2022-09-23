import { configureStore } from '@reduxjs/toolkit';
import configReducer from '../features/config/config-slice';
import cameraReducer from '../features/camera/camera-slice';

export const store = configureStore({ 
  reducer: {
    config: configReducer,
    camera: cameraReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
