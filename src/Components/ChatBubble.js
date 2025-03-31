import React from 'react';
import { Box, Typography, Paper, Stack } from '@mui/material';

export default function ChatBubble({ position = "left", title, text }) {
  const isLeft = position === "left";

  return (
    <Stack
      direction="row"
      justifyContent={isLeft ? "flex-start" : "flex-end"}
      alignItems="flex-start"
      spacing={1}
      sx={{ marginBottom: 2 }}
    >
      {isLeft && (
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
          }}
        />
      )}
      <Paper
        elevation={3}
        sx={{
          padding: 2,
          maxWidth: "70%",
          borderRadius: 2,
          borderTopLeftRadius: isLeft ? 0 : 2,
          borderTopRightRadius: isLeft ? 2 : 0,
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: "bold", marginBottom: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="body1">{text}</Typography>
      </Paper>
      {!isLeft && (
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
          }}
        />
      )}
    </Stack>
  );
}