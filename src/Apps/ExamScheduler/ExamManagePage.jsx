import React from "react";
import { Typography, Box, Tabs, Tab, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, InputAdornment } from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { format, parseISO } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import debounce from 'lodash.debounce';

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
  const [slotForm, setSlotForm] = React.useState({ start: '', end: '', seatCapacity: 1 });
  const [name, setName] = React.useState(exam.name);

  React.useEffect(() => {
    if (exam) setSlots(exam.slots);
  }, [exam]);

  React.useEffect(() => {
    if (exam && slots !== exam.slots) {
      updateExam({ ...exam, slots });
    }
    // eslint-disable-next-line
  }, [slots]);

  // Ensure every email in every roster has a UUID
  React.useEffect(() => {
    let changed = false;
    const newRosters = exam.rosters.map(roster =>
      roster.map(entry => {
        if (typeof entry === 'string') {
          changed = true;
          return { email: entry, uuid: uuidv4() };
        } else if (!entry.uuid) {
          changed = true;
          return { ...entry, uuid: uuidv4() };
        }
        return entry;
      })
    );
    if (changed) {
      updateExam({ ...exam, rosters: newRosters });
    }
    // eslint-disable-next-line
  }, [exam]);

  const handleOpenDialog = (slot = { start: '', end: '', seatCapacity: 1 }, index = null) => {
    // Split start and end into date and time for the form
    let startDate = '', startTime = '', endDate = '', endTime = '';
    if (slot.start) {
      [startDate, startTime] = slot.start.split('T');
    }
    if (slot.end) {
      [endDate, endTime] = slot.end.split('T');
    }
    setSlotForm({
      startDate: startDate || '',
      startTime: startTime || '',
      endDate: endDate || '',
      endTime: endTime || '',
      seatCapacity: slot.seatCapacity || 1,
    });
    setEditIndex(index);
    setDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSlotForm({ start: '', end: '', seatCapacity: 1 });
    setEditIndex(null);
  };
  const handleSaveSlot = () => {
    // Combine date and time fields into ISO strings
    const start = slotForm.startDate && slotForm.startTime ? `${slotForm.startDate}T${slotForm.startTime}` : '';
    const end = slotForm.endDate && slotForm.endTime ? `${slotForm.endDate}T${slotForm.endTime}` : '';
    if (editIndex === null) {
      setSlots([...slots, { start, end, seatCapacity: slotForm.seatCapacity, signups: [] }]);
    } else {
      setSlots(slots.map((s, i) => i === editIndex ? { start, end, seatCapacity: slotForm.seatCapacity, signups: s.signups || [] } : s));
    }
    handleCloseDialog();
  };
  const handleDeleteSlot = (index) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  function generateHourOptions() {
    const hours = [];
    for (let i = 5; i <= 23; i++) {
      const hour = i < 10 ? `0${i}:00` : `${i}:00`;
      hours.push(hour);
    }
    return hours;
  }

  const hourOptions = generateHourOptions();

  function HourDropdown({ label, value, onChange }) {
    return (
      <TextField
        select
        label={label}
        value={value}
        onChange={onChange}
        fullWidth
        margin="dense"
        SelectProps={{ native: true }}
      >
        {hourOptions.map((hour) => (
          <option key={hour} value={hour}>{hour}</option>
        ))}
      </TextField>
    );
  }

  const handleNameChange = (e) => {
    setName(e.target.value); // Update the local state immediately
    debouncedUpdateName(e.target.value); // Debounced update to the backend
  };

  const debouncedUpdateName = debounce((newName) => {
    updateExam({ ...exam, name: newName });
  }, 300); // Debounce with a 300ms delay

  if (!exam) {
    return <Box p={3}><Typography>Exam not found.</Typography></Box>;
  }

  return (
    <Box p={3}>
      <Button onClick={onBack} sx={{ mb: 2 }}>&larr; Back to Dashboard</Button>
      <Typography variant="h4" gutterBottom>
        Manage Exam: 
        <TextField
          value={name}
          onChange={handleNameChange}
          variant="outlined"
          size="small"
          sx={{ ml: 2 }}
        />
      </Typography>
      <Typography variant="subtitle1" gutterBottom>Exam ID: {exam.id}</Typography>
      <Paper sx={{ mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} aria-label="exam management tabs">
          <Tab label="Slots" {...a11yProps(0)} />
          <Tab label="Rosters" {...a11yProps(1)} />
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
                    <TableCell>{slot.seatCapacity}</TableCell>
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
              <Box display="flex" gap={1}>
                <TextField
                  label="Start Date"
                  type="date"
                  fullWidth
                  margin="dense"
                  value={slotForm.startDate || ''}
                  onChange={e => setSlotForm(f => ({ ...f, startDate: e.target.value, endDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                />
                <HourDropdown
                  label="Start Time"
                  value={slotForm.startTime || ''}
                  onChange={(e) => setSlotForm(f => ({ ...f, startTime: e.target.value, endTime: f.endTime || e.target.value }))}
                />
              </Box>
              <Box display="flex" gap={1}>
                <HourDropdown
                  label="End Time"
                  value={slotForm.endTime || ''}
                  onChange={(e) => setSlotForm(f => ({ ...f, endTime: e.target.value }))}
                />
              </Box>
              <TextField
                label="Capacity"
                type="number"
                fullWidth
                margin="dense"
                value={slotForm.seatCapacity}
                onChange={e => setSlotForm(f => ({ ...f, seatCapacity: Number(e.target.value) }))}
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
          <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => setDialogOpen('add-roster')}>+ Add Roster</Button>
          {exam.rosters.map((roster, rIdx) => (
            <Paper key={rIdx} sx={{ p: 2, mb: 2 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle1">Roster {rIdx + 1}</Typography>
                <Button color="error" size="small" onClick={() => {
                  const newRosters = exam.rosters.filter((_, i) => i !== rIdx);
                  updateExam({ ...exam, rosters: newRosters });
                }}>Delete Roster</Button>
              </Box>
              <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell>Signup Link</TableCell>
                      <TableCell>Signed Up Slot</TableCell>
                      <TableCell>Assign to Slot</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {roster.map((entry, eIdx) => {
                      const email = typeof entry === 'string' ? entry : entry.email;
                      const uuid = typeof entry === 'string' ? '' : entry.uuid;
                      let slotIdx = null;
                      let slotLabel = '';
                      exam.slots.forEach((slot, idx) => {
                        if (slot.signups && slot.signups.includes(uuid)) {
                          slotIdx = idx;
                          slotLabel = `${format(parseISO(slot.start), 'PPpp')} - ${format(parseISO(slot.end), 'PPpp')}`;
                        }
                      });
                      // Always use the uuid for exam.id
                      const signupUrl = `${window.location.origin}/#/exam-signup/${exam.id}/${uuid}`;
                      return (
                        <TableRow key={eIdx}>
                          <TableCell>{email}</TableCell>
                          <TableCell>
                            {uuid && (
                              <Button size="small" onClick={() => {
                                navigator.clipboard.writeText(signupUrl);
                              }}>Copy Link</Button>
                            )}
                          </TableCell>
                          <TableCell>{slotIdx !== null ? slotLabel : <em>Not signed up</em>}</TableCell>
                          <TableCell>
                            <select
                              value={slotIdx !== null ? slotIdx : ''}
                              onChange={e => {
                                const newSlots = exam.slots.map((slot, idx) => {
                                  let signups = slot.signups ? [...slot.signups] : [];
                                  // Remove from all slots first
                                  signups = signups.filter(s => s !== email);
                                  // Add to selected slot
                                  if (String(idx) === e.target.value) {
                                    signups.push(email);
                                  }
                                  return { ...slot, signups };
                                });
                                updateExam({ ...exam, slots: newSlots });
                              }}
                            >
                              <option value="">Not signed up</option>
                              {exam.slots.map((slot, idx) => (
                                <option key={idx} value={idx}>
                                  {format(parseISO(slot.start), 'PPpp')} - {format(parseISO(slot.end), 'PPpp')}
                                </option>
                              ))}
                            </select>
                          </TableCell>
                          <TableCell align="right">
                            <Button size="small" color="error" onClick={() => {
                              const newRoster = roster.filter((_, i) => i !== eIdx);
                              const newRosters = exam.rosters.map((r, i) => i === rIdx ? newRoster : r);
                              updateExam({ ...exam, rosters: newRosters });
                            }}>Delete</Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Box display="flex" gap={1} alignItems="center">
                          <TextField
                            label="Add Email"
                            size="small"
                            value={slotForm.addEmailInput && slotForm.addEmailRosterIdx === rIdx ? slotForm.addEmailInput : ''}
                            onChange={e => setSlotForm(f => ({ ...f, addEmailInput: e.target.value, addEmailRosterIdx: rIdx }))}
                            onKeyDown={e => {
                              if (e.key === 'Enter' && slotForm.addEmailInput && slotForm.addEmailRosterIdx === rIdx) {
                                const email = slotForm.addEmailInput.trim();
                                if (email && !roster.includes(email)) {
                                  const newRoster = [...roster, email];
                                  const newRosters = exam.rosters.map((r, i) => i === rIdx ? newRoster : r);
                                  updateExam({ ...exam, rosters: newRosters });
                                }
                                setSlotForm(f => ({ ...f, addEmailInput: '', addEmailRosterIdx: null }));
                              }
                            }}
                          />
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              const email = slotForm.addEmailInput?.trim();
                              if (email && !roster.includes(email)) {
                                const newRoster = [...roster, email];
                                const newRosters = exam.rosters.map((r, i) => i === rIdx ? newRoster : r);
                                updateExam({ ...exam, rosters: newRosters });
                              }
                              setSlotForm(f => ({ ...f, addEmailInput: '', addEmailRosterIdx: null }));
                            }}
                            disabled={!slotForm.addEmailInput || slotForm.addEmailRosterIdx !== rIdx}
                          >Add</Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          ))}
          <Dialog open={dialogOpen === 'add-roster'} onClose={() => setDialogOpen(false)}>
            <DialogTitle>Add Roster</DialogTitle>
            <DialogContent>
              <TextField
                label="Paste emails (comma, space, or newline separated)"
                multiline
                minRows={4}
                fullWidth
                margin="dense"
                value={slotForm.rosterInput || ''}
                onChange={e => setSlotForm(f => ({ ...f, rosterInput: e.target.value }))}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => {
                const emails = (slotForm.rosterInput || '').split(/\s|,|;/).map(s => s.trim()).filter(Boolean);
                updateExam({ ...exam, rosters: [...exam.rosters, emails] });
                setSlotForm(f => ({ ...f, rosterInput: '' }));
                setDialogOpen(false);
              }} variant="contained">Add</Button>
            </DialogActions>
          </Dialog>
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
