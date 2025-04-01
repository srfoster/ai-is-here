
import { Container, Divider, Stack, Typography } from '@mui/material';
import { 
  useParams
} from 'react-router-dom';

import resourcesData from '../data/resources';
import authorsData from '../data/authors';
import ByLine from '../Components/ByLine';
import DynamicAvatar from '../Components/DynamicAvatar';
import PostBodyRenderer from '../Components/PostBodyRenderer';
import PostTagRenderer from '../Components/PostTagRenderer';

export default function ResourcePage() {
  const { slug } = useParams();
  const resource = resourcesData.find((res) => res.slug === slug);

  if (!resource) {
    return <p>Resource not found.</p>;
  }

  return (
    <Container maxWidth="sm" sx={{ mb: 4}}>
      <Typography variant="h4">{resource.title}</Typography>
      <Stack direction="row" spacing={2} alignItems={"center"} sx={{ mb: 2 }}>
        <DynamicAvatar authorInfos={authorsData.filter((a) => resource.author.includes(a.slug))} />
        <Typography variant="subtitle1"><ByLine resource={resource} /></Typography>
      </Stack>
      <PostBodyRenderer resource={resource} />
      <Divider sx={{ mb: 2 }} />
      <PostTagRenderer resource={resource} />
    </Container>
  );
}