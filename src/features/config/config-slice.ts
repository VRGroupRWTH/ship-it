import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ConnectionConfig {
  url: string;
}

interface ConfigState {
  connections: {[key: string]: ConnectionConfig};
}

const initialState: ConfigState = {
  connections: {},
}

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    configUpdated(_state, action: PayloadAction<ConfigState>) {
      return action.payload
    },
    connectionAdded(state, action: PayloadAction<{name: string, config: ConnectionConfig}>) {
      if (!(action.payload.name in state.connections)) {
        state.connections[action.payload.name] = action.payload.config;
      }
    },
    connectionRemoved(state, action: PayloadAction<string>) {
      delete state.connections[action.payload];
    },
  }
});

export const { connectionAdded, connectionRemoved, configUpdated } = configSlice.actions;
export default configSlice.reducer;
