import React, { useState, useEffect } from 'react';
import Chat from './Chat';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function App() {
  // Retrieve the theme mode from local storage or default to 'light'
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // Apply the theme mode class to the body element
  useEffect(() => {
    document.body.className = themeMode;
  }, [themeMode]);

  // Create a theme instance with the current mode
  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: "#C12033"
      }
    }
  });

  // Function to toggle theme mode and store it in local storage
  const toggleThemeMode = () => {
    const newThemeMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newThemeMode);
    localStorage.setItem('theme', newThemeMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <Chat toggleTheme={toggleThemeMode} themeMode={themeMode} />
    </ThemeProvider>
  );
}

export default App;
