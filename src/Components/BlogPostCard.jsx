import { Card, CardActions, CardHeader, CardContent, Stack, Chip, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import DynamicAvatar from './DynamicAvatar';
import authors from '../data/authors'; // Import the authors JSON
import ByLine from './ByLine';
import PostBodyRenderer from './PostBodyRenderer';
import PostTagRenderer from './PostTagRenderer';

export default function BlogPostCard({ hideContent, resource }) {
    return <Card>
        <CardHeader
            title={
                <Link to={`/pages/${resource.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {resource.title}
                </Link>
            }
            subheader={
                <ByLine resource={resource} />
            }

            avatar={
                <DynamicAvatar authorInfos={authors.filter((a) => {
                    return resource.author.includes(a.slug)
                })} />
            }
        />
        {!hideContent && <CardContent>
            <PostBodyRenderer resource={resource} />
            <Divider sx={{mb:2}} />
            <Stack spacing={1} direction="row" alignItems="center">
                <span>Tags: </span><PostTagRenderer resource={resource} />
            </Stack>
        </CardContent>}
    </Card>
}