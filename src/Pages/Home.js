import { Card, CardContent, CardHeader, Container, Stack, Chip, Typography } from '@mui/material';

import { Link } from 'react-router-dom';
import { motion, Reorder, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';

import resourcesData from '../data/resources'; // Import the resources JSON
import authorsData from '../data/authors'; // Import the authors JSON
import MarkdownRenderer from '../Components/MarkdownRenderer';
import DynamicAvatar from '../Components/DynamicAvatar';
import BlogPostCard from '../Components/BlogPostCard';

export function Home() {
  const [resources, setResources] = useState([]);
  const [authors, setAuthors] = useState({});

  useEffect(() => {
    // Simulate fetching resources and authors (you can replace this with API calls if needed)
    setResources(resourcesData.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)));
    setAuthors(authorsData);
  }, []);

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Blog
      </Typography>

      {resources.map((resource, i) => {
        const authorInfos = authors.filter((a) => resource.author.includes(a.slug));
        return (
          <AnimatedSection key={i}>
            <BlogPostCard resource={resource} authors={authors} authorInfos={authorInfos} />
          </AnimatedSection>
        );
      })}

    </>
  );
}


function AnimatedSection({ children }) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.5, triggerOnce: true }); 

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

