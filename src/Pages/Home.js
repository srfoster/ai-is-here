import { Card, CardContent, CardHeader, Container, Stack, Chip } from '@mui/material';
import { OutOfCreditsIfOutOfCredits } from '../useGpt';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';
import resourcesData from '../data/resources.json'; // Import the resources JSON
import authorsData from '../data/authors.json'; // Import the authors JSON
import Avatar, { genConfig } from 'react-nice-avatar';

export function Home() {
  const [resources, setResources] = useState([]);
  const [authors, setAuthors] = useState({});

  useEffect(() => {
    // Simulate fetching resources and authors (you can replace this with API calls if needed)
    setResources(resourcesData);
    setAuthors(authorsData);
  }, []);

  return (
    <Container maxWidth="sm">

      {resources.map((resource, i) => {
        const authorSlug = resource.author[0].toLowerCase().replace(/\s+/g, '-'); // Match author key
        const authorInfo = authors.find((a) => a.slug === authorSlug);
        return (
          <AnimatedSection key={i}>
            <Card>
              <CardHeader
                title={
                  <Link to={`/pages/${resource.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {resource.title}
                  </Link>
                }
                subheader={
                  <>
                    By{' '}
                    <Link to={`/authors/${authorSlug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {authorInfo?.name || resource.author.join(', ')}
                    </Link>{' '}
                    on {new Date(resource.dateCreated).toLocaleDateString()}
                  </>
                }
                avatar={
                  <DynamicAvatar avatarInfo={authorInfo?.avatar} />
                }
              />
              <CardContent>
                <p>{resource.description}</p>
                {authorInfo && <p><strong>About the Author:</strong> {authorInfo.bio}</p>}
                <Stack direction="row" spacing={1}>
                  {resource.tags.map((tag, index) => (
                    <Chip key={index} label={tag} variant="outlined" />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </AnimatedSection>
        );
      })}

      {false && 
        <>
          <OutOfCreditsIfOutOfCredits afterRefresh={() => { window.location.reload(); }} />

          <AnimatedSection>
            <HomePageTile title="Automated Tutor">
              <p>Configurable AI tutoring bots.
                Click <Link to="/bots">here</Link>.
              </p>
            </HomePageTile>
          </AnimatedSection>


          <AnimatedSection>
            <HomePageTile title="Book">
              <p>I've written part of a sample textbook. 
                Click <Link to="/book">here</Link> to start reading.
              </p>
            </HomePageTile>
          </AnimatedSection>
        </>
      }
    </Container>
  );
}

function DynamicAvatar({ avatarInfo }) {
  if (avatarInfo == undefined || avatarInfo.length == 0) {
    return null
  }

  return <Avatar style={{width: 50, height: 50}} {...genConfig(avatarInfo[1])} />
}

function AnimatedSection({ children }) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.75 }); 

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [controls, inView]);

  const variants = {
    hidden: { opacity: 0.1 }, 
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }, 
  };

return (
  <motion.div ref={ref} initial="hidden" animate={controls} variants={variants}
    style={{ marginBottom: '1em' }}
  >
      {children}
    </motion.div>
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
      <CardContent>
        <p>Welcome to Olympic College's resources for AI in higher ed.</p>
      </CardContent>
    </Card>
  );
}