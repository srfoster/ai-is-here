import React from "react";
import { Box, Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert } from "@mui/material";
import { format, parseISO } from "date-fns";
import { getExamById, getExamByStudentUUID, updateExam, signup } from "./ExamSchedulerService";

const ExamSignupPage = ({ uuid, examId }) => {
  const [exam, setExam] = React.useState(null);
  const [student, setStudent] = React.useState(null);
  const [slotIdx, setSlotIdx] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getExamByStudentUUID(examId, uuid).then(examData => {
      setExam(examData);
      console.log("Exam Data", examData);
      if (examData) {
        let found = null;

        if (examData.rosters.length > 0) {
          const studentRoster = examData.rosters.find(roster => roster.find(re=>re.uuid==uuid));
          if (studentRoster) {
            setStudent(studentRoster.find(re=>re.uuid === uuid));
          }
        }

        examData.slots.forEach((slot, idx) => {
          if (slot.signups.includes(uuid)) {
            setSlotIdx(idx);
          }
        });
        if (found) {
        }
      }
      setLoading(false);
    });
  }, [uuid, examId]);

  const handleSignup = async (slotIdxToSignup) => {
    if (!exam || !student) return;
    await signup(exam.id, slotIdxToSignup, uuid);
    const updatedExam = { ...exam };
    updatedExam.slots = updatedExam.slots.map((slot, idx) => {
      let signups = slot.signups.filter(e => e !== student.email);
      if (idx === slotIdxToSignup) {
        signups.push(student.email);
      }
      return { ...slot, signups };
    });
    setExam(updatedExam);
    setSlotIdx(slotIdxToSignup);
  };

  if (loading) return <Box p={3}><Typography>Loading...</Typography></Box>;
  if (!exam) return <Box p={3}><Alert severity="error">Exam not found.</Alert></Box>;
  if (!student) return <Box p={3}><Alert severity="error">Invalid or expired signup link.</Alert></Box>;
  const email = student.email;

  return (
    <Box p={3} maxWidth={600} mx="auto">
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>Sign Up for {exam.name}</Typography>
        <Typography variant="subtitle1" gutterBottom>Student: <b>{email}</b></Typography>
        <Typography variant="subtitle2" gutterBottom>Exam ID: {exam.id}</Typography>
      </Paper>
      {slotIdx !== null ? (
        <Alert severity="success" sx={{ mb: 3 }}>
          You are signed up for:
          <br />
          <b>{format(parseISO(exam.slots[slotIdx].start), 'PPpp')} - {format(parseISO(exam.slots[slotIdx].end), 'PPpp')}</b>
        </Alert>
      ) : (
        <Alert severity="info" sx={{ mb: 3 }}>
          You have not signed up for a slot yet. Please select one below.
        </Alert>
      )}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Slot</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Signed Up</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exam.slots.map((slot, idx) => {
              const isFull = slot.signups.length >= slot.seatCapacity;
              const isSignedUp = slotIdx === idx;
              return (
                <TableRow key={idx} selected={isSignedUp}>
                  <TableCell>
                    {format(parseISO(slot.start), 'PPpp')}<br />
                    to<br />
                    {format(parseISO(slot.end), 'PPpp')}
                  </TableCell>
                  <TableCell>{slot.seatCapacity}</TableCell>
                  <TableCell>{slot.signups.length}</TableCell>
                  <TableCell>
                    {isSignedUp ? (
                      <Button variant="contained" color="success" disabled>Signed Up</Button>
                    ) : (
                      <Button variant="contained" disabled={isFull} onClick={() => handleSignup(idx)}>
                        {isFull ? "Full" : "Sign Up"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ExamSignupPage;
