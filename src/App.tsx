import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { createTheme } from '@mui/material';
import { Box, ThemeProvider } from '@mui/system';
import { configUpdated } from './features/config/config-slice';
import AppBar from './AppBar';
import { useNonInitialEffect } from './hooks/useNonInitialEffect';
import RosbridgeConnections from './RosbridgeConnections';

// import { Buffer } from 'buffer';
// Buffer.from('anything','base64');
// window.Buffer = window.Buffer || require("buffer").Buffer;

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  const config = useAppSelector(state => state.config);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const configString = queryParams.get('config');
    if (configString) {
      try {
        const decodedConfig = atob(configString);
        const config = JSON.parse(decodedConfig);
        dispatch(configUpdated(config));
      } catch (error) {
        console.error('Invalid config');
      }
    }
  }, []);

  useNonInitialEffect(() => {
    navigate(`?config=${btoa(JSON.stringify(config))}`);
  }, [config]);

  return (
   <RosbridgeConnections>
     <ThemeProvider theme={darkMode ? darkTheme: lightTheme}>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <AppBar
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
          <Box
            sx={{
              flexGrow: 1,
            }}
          >
            <canvas
              width={100}
              height={100}
            >
              Please update your browser!
            </canvas>
          </Box>
        </Box>
      </ThemeProvider>
    </RosbridgeConnections>
  );
}

export default App;
