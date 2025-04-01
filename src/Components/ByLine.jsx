import React from 'react';
import { Link } from 'react-router-dom';
import authors from '../data/authors'; // Import the authors JSON

export default function ByLine({ resource }) {
    return <>
    By{ ' ' }
    {
        resource.author.map((authorSlug) =>
            <Link key={authorSlug} to={`/authors/${authorSlug}`} style={{ textDecoration: 'underline', color: 'cyan' }}>
                {authors.find((a) => a.slug === authorSlug)?.name || authorSlug}
            </Link>
        ).reduce((prev, curr) => [prev, ', ', curr])
    }
    { ' ' }on { new Date(resource.dateCreated).toLocaleDateString() }
    </>
}