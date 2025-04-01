import React from 'react';
import { Stack, Chip } from '@mui/material';

export default function PostTagRenderer({ resource }) {
  return <Stack direction="row" spacing={1}>
        {resource.tags.map((tag, index) => (
            <Chip key={index} label={tag} variant="outlined" />
        ))}
    </Stack>
}