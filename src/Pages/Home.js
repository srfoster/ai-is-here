import { Card, CardContent, CardHeader, Container, Stack, Chip } from '@mui/material';
import { OutOfCreditsIfOutOfCredits } from '../useGpt';
import { Link } from 'react-router-dom';
import { motion, Reorder, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';
import resourcesData from '../data/resources'; // Import the resources JSON
import authorsData from '../data/authors'; // Import the authors JSON
import MarkdownRenderer from '../Components/MarkdownRenderer';
import DynamicAvatar from '../Components/DynamicAvatar';

export function Home() {
  const [resources, setResources] = useState([]);
  const [authors, setAuthors] = useState({});

  useEffect(() => {
    // Simulate fetching resources and authors (you can replace this with API calls if needed)
    setResources(resourcesData.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)));
    setAuthors(authorsData);
  }, []);

  return (
    <Container maxWidth="sm">

      {resources.map((resource, i) => {
        const authorInfos = authors.filter((a) => resource.author.includes(a.slug));
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
                    { resource.author.map((authorSlug) =>
                      <Link key={authorSlug} to={`/authors/${authorSlug}`} style={{ textDecoration: 'underline', color: 'cyan' }}>
                        {authors.find((a) => a.slug === authorSlug)?.name || authorSlug }
                      </Link>
                    ).reduce((prev, curr) => [prev, ', ', curr])}
                    {' '}on {new Date(resource.dateCreated).toLocaleDateString()}
                  </>
                }
                avatar={
                  <DynamicAvatar avatarInfo={ authorInfos.map((a) => a.avatar).filter(x=>x)} />
                }
              />
              <CardContent>
                {
                  typeof (resource.content) == "string" ?
                  <MarkdownRenderer>{resource.content}</MarkdownRenderer>
                    : (
                      (typeof (resource.content) == "function") 
                      ? <resource.content /> : resource.content
                    )
                }

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


function AnimatedSection({ children }) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.5 }); 

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
