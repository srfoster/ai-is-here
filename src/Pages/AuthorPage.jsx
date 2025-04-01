import { Stack, Typography, Grid, Card, CardContent, CardHeader } from '@mui/material';
import { Link, useParams } from 'react-router-dom';

import resourcesData from '../data/resources';
import authorsData from '../data/authors';
import BlogPostCard from '../Components/BlogPostCard';

export default function AuthorPage() {
  const { slug } = useParams();
  const author = authorsData.find((auth) => auth.slug === slug);

  if (!author) {
    return <p>Author not found.</p>;
  }

  // Filter resources authored by the current author
  const authoredResources = resourcesData.filter((resource) =>
    resource.author.includes(slug)
  );

  return (
    <>
      <Stack direction="row" spacing={2} alignItems={"center"} style={{ marginTop: '10px' }}>
        <img
          src={author.avatar}
          alt={author.name}
          style={{ width: '100px', height: '100px', borderRadius: '50%' }}
        />
        <Stack spacing={1}>
          <Typography variant="h4">{author.name}</Typography>
          <Typography variant="body1">{author.bio}</Typography>
          {author.homepageContent && (
            <Typography variant="body2">{author.homepageContent}</Typography>
          )}
        </Stack>
      </Stack>

      <Typography variant="h5" style={{ marginTop: '20px' }}>
        Authored Resources
      </Typography>
        {authoredResources.map((resource) => (
          <div style={{ marginBottom: '20px' }} key={resource.slug}>
            <BlogPostCard
              hideContent={true}
              resource={resource}
              authors={authorsData}
            />
          </div>
        ))}
    </>
  );
}