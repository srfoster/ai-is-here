import React from "react";
import ExamDashboard from "./ExamDashboard";
import ExamManagePage from "./ExamManagePage";
import { getExams, updateExam } from "./ExamSchedulerService";
import { CreditStringContext } from "../../Hooks/useGpt";

const ExamScheduler = () => {
	const [exams, setExams] = React.useState([]);
	const [selectedExamId, setSelectedExamId] = React.useState(null);
	const [loading, setLoading] = React.useState(true);
	const { creditString: accessKey } = React.useContext(CreditStringContext);

	console.log("Exams", exams);

	React.useEffect(() => {
		if (!accessKey) return;
		getExams(accessKey).then((data) => {
			setExams(data);
			setLoading(false);
		});
	}, [accessKey]);

	const handleUpdateExam = (updatedExam) => {
		updateExam(updatedExam, accessKey).then(() => {
			setExams((prev) => prev.map((e) => (e.id === updatedExam.id ? updatedExam : e)));
		});
	};

	const handleSelectExam = (id) => setSelectedExamId(id);
	const handleBackToDashboard = () => setSelectedExamId(null);

	const selectedExam = exams.find((e) => e.id === selectedExamId);

	if (loading) return <div>Loading...</div>;

	return (
		<>
			{selectedExamId == null ? (
				<ExamDashboard
					exams={exams}
					updateExam={handleUpdateExam}
					onSelectExam={handleSelectExam}
					setExams={setExams} // Pass setExams as a prop
				/>
			) : (
				<ExamManagePage
					exam={selectedExam}
					updateExam={handleUpdateExam}
					onBack={handleBackToDashboard}
				/>
			)}
		</>
	);
};

export default ExamScheduler;
