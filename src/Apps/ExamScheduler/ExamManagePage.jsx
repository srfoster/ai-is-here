import React from "react";
import { Typography, Box, Tabs, Tab, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

function a11yProps(index) {
  return {
    id: `exam-tab-${index}`,
    'aria-controls': `exam-tabpanel-${index}`,
  };
}

const ExamManagePage = ({ exam, updateExam, onBack }) => {
  const [tab, setTab] = React.useState(0);
  const [slots, setSlots] = React.useState(exam ? exam.slots : []);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editIndex, setEditIndex] = React.useState(null);
  const [slotForm, setSlotForm] = React.useState({ start: '', end: '', capacity: 1 });

  React.useEffect(() => {
    if (exam) setSlots(exam.slots);
  }, [exam]);

  React.useEffect(() => {
    if (exam && slots !== exam.slots) {
      updateExam({ ...exam, slots });
    }
    // eslint-disable-next-line
  }, [slots]);

  const handleOpenDialog = (slot = { start: '', end: '', capacity: 1 }, index = null) => {
    setSlotForm(slot);
    setEditIndex(index);
    setDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSlotForm({ start: '', end: '', capacity: 1 });
    setEditIndex(null);
  };
  const handleSaveSlot = () => {
    if (editIndex === null) {
      setSlots([...slots, { ...slotForm, signups: [] }]);
    } else {
      setSlots(slots.map((s, i) => i === editIndex ? { ...slotForm, signups: s.signups || [] } : s));
    }
    handleCloseDialog();
  };
  const handleDeleteSlot = (index) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  if (!exam) {
    return <Box p={3}><Typography>Exam not found.</Typography></Box>;
  }

  return (
    <Box p={3}>
      <Button onClick={onBack} sx={{ mb: 2 }}>&larr; Back to Dashboard</Button>
      <Typography variant="h4" gutterBottom>Manage Exam: {exam.name}</Typography>
      <Typography variant="subtitle1" gutterBottom>Exam ID: {exam.id}</Typography>
      <Paper sx={{ mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} aria-label="exam management tabs">
          <Tab label="Slots" {...a11yProps(0)} />
          <Tab label="Rosters" {...a11yProps(1)} />
          <Tab label="Signups" {...a11yProps(2)} />
        </Tabs>
      </Paper>
      {tab === 0 && (
        <Box>
          <Typography variant="h6">Slots</Typography>
          <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => handleOpenDialog()}>+ Add Slot</Button>
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Start Time</TableCell>
                  <TableCell>End Time</TableCell>
                  <TableCell>Capacity</TableCell>
                  <TableCell>Signups</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {slots.map((slot, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{slot.start}</TableCell>
                    <TableCell>{slot.end}</TableCell>
                    <TableCell>{slot.capacity}</TableCell>
                    <TableCell>{slot.signups ? slot.signups.length : 0}</TableCell>
                    <TableCell align="right">
                      <Button size="small" onClick={() => handleOpenDialog(slot, idx)}>Edit</Button>
                      <Button size="small" color="error" onClick={() => handleDeleteSlot(idx)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Dialog open={dialogOpen} onClose={handleCloseDialog}>
            <DialogTitle>{editIndex === null ? 'Add Slot' : 'Edit Slot'}</DialogTitle>
            <DialogContent>
              <TextField
                label="Start Time"
                type="datetime-local"
                fullWidth
                margin="dense"
                value={slotForm.start}
                onChange={e => setSlotForm(f => ({ ...f, start: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="End Time"
                type="datetime-local"
                fullWidth
                margin="dense"
                value={slotForm.end}
                onChange={e => setSlotForm(f => ({ ...f, end: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Capacity"
                type="number"
                fullWidth
                margin="dense"
                value={slotForm.capacity}
                onChange={e => setSlotForm(f => ({ ...f, capacity: Number(e.target.value) }))}
                inputProps={{ min: 1 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={handleSaveSlot} variant="contained">Save</Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
      {tab === 1 && (
        <Box>
          <Typography variant="h6">Rosters</Typography>
          {/* TODO: Add UI for pasting/editing rosters, adding/removing emails */}
          <pre>{JSON.stringify(exam.rosters, null, 2)}</pre>
        </Box>
      )}
      {tab === 2 && (
        <Box>
          <Typography variant="h6">Signups</Typography>
          {/* TODO: Add UI for seeing who is signed up for which slot */}
          <pre>{JSON.stringify(exam.slots.map(s => ({...s, signups: s.signups})), null, 2)}</pre>
        </Box>
      )}
    </Box>
  );
};

export default ExamManagePage;
