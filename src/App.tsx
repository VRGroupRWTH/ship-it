import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { createTheme } from '@mui/material';
import { Box, ThemeProvider } from '@mui/system';
import { configUpdated } from './features/config/config-slice';
import AppBar from './AppBar';
import { useNonInitialEffect } from './hooks/useNonInitialEffect';
import Viewport from './Viewport';

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
   <ThemeProvider theme={darkMode ? darkTheme: lightTheme}>
      <Box
        component="div"
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
          component="div"
          sx={{
            flexGrow: 1,
          }}
        >
          <Viewport />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
