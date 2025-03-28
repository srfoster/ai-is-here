import { Container, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { Link, useParams } from 'react-router-dom';

import resourcesData from '../data/resources';
import authorsData from '../data/authors';

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
    <Container maxWidth="sm">
      <Typography variant="h4">{author.name}</Typography>
      <img
        src={author.avatar}
        alt={author.name}
        style={{ width: '100px', height: '100px', borderRadius: '50%' }}
      />
      <Typography variant="body1">{author.bio}</Typography>
      {author.homepageContent && (
        <Typography variant="body2">{author.homepageContent}</Typography>
      )}

      <Typography variant="h5" style={{ marginTop: '20px' }}>
        Authored Resources
      </Typography>
      <Grid container spacing={2} style={{ marginTop: '10px' }}>
        {authoredResources.map((resource) => (
          <Grid item xs={12} sm={6} md={4} key={resource.slug}>
            <Card>
              <CardContent>
                <Typography variant="h6">{resource.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {resource.tags.join(', ')}
                </Typography>
                <Typography variant="body2" style={{ marginTop: '10px' }}>
                  <Link to={`/pages/${resource.slug}`} style={{ textDecoration: 'none', color: 'lime' }}>
                    See more
                  </Link>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}