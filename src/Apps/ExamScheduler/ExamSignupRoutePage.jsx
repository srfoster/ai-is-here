import React from "react";
import { useParams } from "react-router-dom";
import ExamSignupPage from "./ExamSignupPage";

export default function ExamSignupRoutePage() {
  const params = useParams();
  return <ExamSignupPage examId={params.examId} uuid={params.uuid} />;
}
