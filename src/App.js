import * as React from 'react';
import './App.css';
import { LoginWidget, CreditStringContext, useCheckCredits } from './useGpt';
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
import MetaTextbook from './Pages/MetaTextbook/MetaTextbook'; // Import MetaTextbook

import { TutorRoutes } from './Tutor';

import authorsData from './data/authors'; // Import the authors JSON
import DynamicAvatar from './Components/DynamicAvatar';
import { Card, CardContent, CardHeader, CssBaseline, Typography, Container} from '@mui/material';


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

          <Container maxWidth="sm">
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

let AppCards = () => {
  return <>
    <AppCard
      authors={["stephen-foster"]}
      title="Bots for your students"
      description="Make automated tutors for your students."
      link="/bots"
    />
    <AppCard
      authors={["stephen-foster"]}
      title="Textbook"
      description="My work-in-progress demonstration of an AI-powered textbook"
      link="/book" />
  </>
}

let AppCard = ({ authors, title, description, link }) => {
  return (
    <Link to={link} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Card style={{marginBottom: 20}}>
        <CardHeader
          title={
            <Typography variant="h5" gutterBottom>
              {title}
            </Typography>
          }
          subheader={
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          }
          avatar={
            <DynamicAvatar avatarInfo={authorsData.filter((a) => authors.includes(a.slug)).map((a) => a.avatar).filter(x => x)} />
          }
        />
      </Card>
    </Link>
  );
};

export default App;
