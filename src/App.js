import * as React from 'react';
import './App.css';
import { 
  HashRouter as Router,
  Routes,
  Route,
  Link,
  useParams
} from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { useLocalStorage } from 'react-use';

import { Home } from './Pages/Home';
import Logo from './Components/Logo'; // Import the Logo component

import AuthorPage from './Pages/AuthorPage';
import ResourcePage from './Pages/ResourcePage';
import MetaTextbook from './Apps/MetaTextbook/MetaTextbook'; // Import MetaTextbook

import { TutorRoutes } from './Apps/BotsForYourStudents/Tutor';

import { CssBaseline, Typography, Container} from '@mui/material';

import { AppCards } from './Apps/AppCards'; 
import { LoginWidget, CreditStringContext, useCheckCredits } from './Hooks/useGpt';


// Create a dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9', // Light blue
    },
    secondary: {
      main: '#f48fb1', // Pink
    },
    background: {
      default: '#121212', // Dark background
      paper: '#1e1e1e', // Slightly lighter for cards
    },
    text: {
      primary: '#ffffff', // White text
      secondary: '#b0bec5', // Light gray text
    },
  },
});


function App() {
  let [creditString, setCreditString] = useLocalStorage("credit-string", "");

  let { remainingCredits, refreshCredits } = useCheckCredits(creditString);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <CreditStringContext.Provider value={{
        creditString,
        setCreditString,
        remainingCredits,
        refreshCredits
      }}>
        <Router>
          <br />

          <Container maxWidth="md">
            <Logo />
          <br/>

          <Routes>
            <Route path="/book" element={<MetaTextbook />} />
            { TutorRoutes()}

            <Route path="/login"
              element={
                <Container maxWidth="sm" >
                  <LoginWidget loggedInContent={<>
                    <Typography variant="h5" mt={2}  gutterBottom>
                      Apps
                    </Typography>
                    <AppCards />
                  </>} />
                </Container>
              }
            >
            </Route>

            <Route path="/pages/:slug" element={<ResourcePage />} />
            <Route path="/authors/:slug" element={<AuthorPage />} />
            <Route path="*" element={
              <Home />
            }>
            </Route>
          </Routes>
          </Container>
        </Router>
      </CreditStringContext.Provider>
    </ThemeProvider>
  );
}


export default App;
