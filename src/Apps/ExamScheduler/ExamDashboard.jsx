import React from "react";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import ExamManagePage from "./ExamManagePage";

function getExamStats(exam) {
  const numSlots = exam.slots.length;
  const maxCapacity = exam.slots.reduce((sum, slot) => sum + slot.capacity, 0);
  const allRosterEmails = exam.rosters.flat();
  const signedUpEmails = new Set(exam.slots.flatMap(slot => slot.signups));
  const numSignedUp = allRosterEmails.filter(email => signedUpEmails.has(email)).length;
  const numNotSignedUp = allRosterEmails.length - numSignedUp;
  return { numSlots, maxCapacity, numSignedUp, numNotSignedUp };
}

const ExamDashboard = ({ exams, updateExam, onSelectExam }) => {
  return (
    <Box p={3}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Exam Scheduler Dashboard</Typography>
        <Button variant="contained" color="primary">+ Create</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Exam Name</TableCell>
              <TableCell align="right"># Slots</TableCell>
              <TableCell align="right">Max Capacity</TableCell>
              <TableCell align="right"># Signed Up</TableCell>
              <TableCell align="right"># Not Signed Up</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exams.map((exam) => {
              const stats = getExamStats(exam);
              return (
                <TableRow key={exam.id} hover style={{ cursor: 'pointer' }} onClick={() => onSelectExam(exam.id)}>
                  <TableCell>
                    <span style={{ textDecoration: 'underline', color: '#1976d2' }}>{exam.name}</span>
                  </TableCell>
                  <TableCell align="right">{stats.numSlots}</TableCell>
                  <TableCell align="right">{stats.maxCapacity}</TableCell>
                  <TableCell align="right">{stats.numSignedUp}</TableCell>
                  <TableCell align="right">{stats.numNotSignedUp}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Nested route for exam management, passing exam and updateExam as props */}
      <Routes>
        <Route path=":examId" element={<ExamManagePage exams={exams} updateExam={updateExam} key={exams.map(e=>e.id).join('-')} />} />
      </Routes>
    </Box>
  );
};

export default ExamDashboard;
