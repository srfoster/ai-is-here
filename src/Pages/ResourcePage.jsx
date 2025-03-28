
import { Container, Typography } from '@mui/material';
import { 
  useParams
} from 'react-router-dom';

import resourcesData from '../data/resources';
import authorsData from '../data/authors';
import MarkdownRenderer from '../Components/MarkdownRenderer';

export default function ResourcePage() {
  const { slug } = useParams();
  const resource = resourcesData.find((res) => res.slug === slug);

  if (!resource) {
    return <p>Resource not found.</p>;
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4">{resource.title}</Typography>
      <Typography variant="subtitle1">{resource.description}</Typography>
      <MarkdownRenderer>{resource.content}</MarkdownRenderer>
    </Container>
  );
}