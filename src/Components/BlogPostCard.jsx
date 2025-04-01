import { Card, CardHeader, CardContent, Stack, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import MarkdownRenderer from './MarkdownRenderer';
import DynamicAvatar from './DynamicAvatar';
import authors from '../data/authors'; // Import the authors JSON

export default function BlogPostCard({ hideContent, resource }) {
    return <Card>
        <CardHeader
            title={
                <Link to={`/pages/${resource.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {resource.title}
                </Link>
            }
            subheader={
                <>
                    By{' '}
                    {resource.author.map((authorSlug) =>
                        <Link key={authorSlug} to={`/authors/${authorSlug}`} style={{ textDecoration: 'underline', color: 'cyan' }}>
                            {authors.find((a) => a.slug === authorSlug)?.name || authorSlug}
                        </Link>
                    ).reduce((prev, curr) => [prev, ', ', curr])}
                    {' '}on {new Date(resource.dateCreated).toLocaleDateString()}
                </>
            }

            avatar={
                <DynamicAvatar authorInfos={authors.filter((a) => {
                    return resource.author.includes(a.slug)
                })} />
            }
        />
        {!hideContent && <CardContent>
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
        </CardContent>}
    </Card>
}