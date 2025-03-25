import { Card, CardContent, CardHeader, Container } from '@mui/material';
import { OutOfCreditsIfOutOfCredits } from '../useGpt';
import { Link } from 'react-router-dom';
import Logo from '../Components/Logo'; // Import the Logo component

export function Home() {
  return (
    <Container maxWidth="sm">
      <Logo />

      <WelcomeTile />

      {false && 
        <>
          <OutOfCreditsIfOutOfCredits afterRefresh={() => { window.location.reload(); }} />

          <HomePageTile title="Automated Tutor">
            <p>Configurable AI tutoring bots.
              Click <Link to="/bots">here</Link>.
            </p>
          </HomePageTile>

          <HomePageTile title="Book">
            <p>I've written part of a sample textbook. 
              Click <Link to="/book">here</Link> to start reading.
            </p>
          </HomePageTile>
        </>
      }
    </Container>
  );
}

function HomePageTile({ title, children }) {
  return (
    <Card>
      <CardHeader title={title}></CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}

function WelcomeTile() {
  return (
    <Card>
      <CardHeader title="Welcome"></CardHeader>
      <CardContent>
        <p>Welcome to the website for Olympic College's public resources related to the use of AI in education.</p>
      </CardContent>
    </Card>
  );
}