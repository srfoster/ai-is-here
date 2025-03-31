import React from 'react';
import { TextField, Button, Stack } from '@mui/material';

export default function ChatInput({ value, onChange, onSend, disabled }) {
  const handleKeyDown = (e) => {
    // Send message on Enter unless Shift is held
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim()) {
        onSend();
      }
    }
  };

  return (
    /*
    //Fullscreen mode
    <div
      style = {{position: "fixed", bottom: 0, left: 0, width: "100%", textAlign: "center", borderTop: "1px solid gray", backgroundColor: "rgba(255,255,255, 0.9)"}}>
        <div style={{width: "50%", margin: "auto"}}>
    */
    <Stack direction="row" spacing={1} alignItems="center" sx={{ width: "100%" }}>
      <TextField
        fullWidth
        multiline
        maxRows={4}
        placeholder="Type here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={onSend}
        disabled={disabled || !value.trim()}
      >
        Send
      </Button>
    </Stack>
  );
}