import { 
  HashRouter as Router,
  Routes,
  Route,
  Link,
  useParams
} from 'react-router-dom';

import authorsData from '../data/authors'; // Import the authors JSON
import DynamicAvatar from '../Components/DynamicAvatar';
import { Card, CardHeader, Typography } from '@mui/material';

export let AppCards = () => {
  return <>
    <BotsForYourStudentsAppCard />
    <MetaTextbookAppCard />
  </>
}

export let BotsForYourStudentsAppCard = () => {
  return <AppCard
      authors={["stephen-foster"]}
      title="Bots for your students"
      description="Make automated tutors for your students."
      link="/bots"
    />
}

export let MetaTextbookAppCard = () => {
  return <AppCard
        authors={["stephen-foster"]}
        title="Textbook"
        description="My work-in-progress demonstration of an AI-powered textbook"
        link="/book" />
}

export let AppCard = ({ authors, title, description, link }) => {
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
            <DynamicAvatar authorInfos={authorsData.filter((a) => authors.includes(a.slug))} />
          }
        />
      </Card>
    </Link>
  );
};