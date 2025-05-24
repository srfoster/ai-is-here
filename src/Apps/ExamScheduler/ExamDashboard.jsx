import React, { useContext } from "react";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import ExamManagePage from "./ExamManagePage";
import { createExam, deleteExam } from "./ExamSchedulerService";
import { CreditStringContext } from "../../Hooks/useGpt";

function getExamStats(exam) {
  const numSlots = exam.slots.length;
  const maxCapacity = exam.slots.reduce((sum, slot) => sum + slot.seatCapacity, 0);
  const allRosterEmails = exam.rosters.flat();
  const numSignedUp = exam.slots.reduce((sum, slot) => sum + (slot.signups || []).length, 0);
  const numNotSignedUp = allRosterEmails.length - numSignedUp;
  return { numSlots, maxCapacity, numSignedUp, numNotSignedUp };
}

const ExamDashboard = ({ exams, updateExam, onSelectExam, setExams }) => {
  const { creditString: accessKey } = useContext(CreditStringContext);

  const handleCreateExam = () => {
    const newExam = {
      name: "New Exam",
      slots: [],
      rosters: []
    };
    createExam(newExam, accessKey)
      .then((createdExam) => {
        setExams((prevExams) => [...prevExams, createdExam]);
        onSelectExam(createdExam.id);
      })
      .catch((error) => {
        console.error("Error creating exam:", error);
      });
  };

  const handleDeleteExam = (examId) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      console.log(exams)
      deleteExam(examId, accessKey)
        .then(() => {
          setExams((prevExams) => prevExams.filter((exam) => exam.id !== examId));
        })
        .catch((error) => {
          console.error("Error deleting exam:", error);
        });
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Exam Scheduler Dashboard</Typography>
        <Button variant="contained" color="primary" onClick={handleCreateExam}>+ Create</Button>
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
              <TableCell align="right">Actions</TableCell>
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
                  <TableCell align="right">
                    <Button size="small" color="error" onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteExam(exam.id);
                    }}>Delete</Button>
                  </TableCell>
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
