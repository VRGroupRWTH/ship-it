import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type CameraControls = 'orbit' | 'first-person';

interface CameraSliceState {
  controls: CameraControls;
}

const initialState: CameraSliceState = {
  controls: 'orbit',
}

const cameraSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    controlsChanged(state, action: PayloadAction<CameraControls>) {
      state.controls = action.payload;
    },
  }
});

export const { controlsChanged } = cameraSlice.actions;
export default cameraSlice.reducer;
