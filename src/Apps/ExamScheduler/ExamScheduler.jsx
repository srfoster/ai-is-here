import React from "react";
import ExamDashboard from "./ExamDashboard";
import ExamManagePage from "./ExamManagePage";

// Placeholder data structure for exams
const mockExams = [
	{
		id: 1,
		name: "Math 101 Final",
		slots: [
			{
				start: "2025-06-01T09:00",
				end: "2025-06-01T11:00",
				capacity: 10,
				signups: ["a@x.com", "b@x.com"],
			},
			{
				start: "2025-06-01T12:00",
				end: "2025-06-01T14:00",
				capacity: 8,
				signups: ["c@x.com"],
			},
		],
		rosters: [["a@x.com", "b@x.com", "c@x.com", "d@x.com"]],
	},
	{
		id: 2,
		name: "Physics 201 Final",
		slots: [
			{
				start: "2025-06-02T10:00",
				end: "2025-06-02T12:00",
				capacity: 12,
				signups: [],
			},
		],
		rosters: [["e@x.com", "f@x.com"]],
	},
];

const ExamScheduler = () => {
	const [exams, setExams] = React.useState(mockExams);
	const [selectedExamId, setSelectedExamId] = React.useState(null);

	const updateExam = (updatedExam) => {
		setExams((exams) =>
			exams.map((e) => (e.id === updatedExam.id ? updatedExam : e))
		);
	};

	const handleSelectExam = (id) => setSelectedExamId(id);
	const handleBackToDashboard = () => setSelectedExamId(null);

	const selectedExam = exams.find((e) => e.id === selectedExamId);

	return (
		<>
			{selectedExamId == null ? (
				<ExamDashboard
					exams={exams}
					updateExam={updateExam}
					onSelectExam={handleSelectExam}
				/>
			) : (
				<ExamManagePage
					exam={selectedExam}
					updateExam={updateExam}
					onBack={handleBackToDashboard}
				/>
			)}
		</>
	);
};

export default ExamScheduler;
