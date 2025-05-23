import { v4 as uuidv4 } from 'uuid';
import gptProxyData from '../../gptProxyData.json';

export const USE_MOCK_EXAMS = false; // Set to false to use the REST API
const API_BASE = gptProxyData.exam_scheduler 

// --- MOCK DATA ---
let mockExams = [
  {
    id: "b6e2e2e2-1234-4cde-8a2b-abcdefabcdef", // example uuid
    name: "Final Exam - Math 101",
    slots: [
      {
        start: "2025-06-01T09:00",
        end: "2025-06-01T10:00",
        capacity: 3,
        signups: ["alice@example.com", "bob@example.com"]
      },
      {
        start: "2025-06-01T10:30",
        end: "2025-06-01T11:30",
        capacity: 2,
        signups: []
      }
    ],
    rosters: [
      [
        { email: "alice@example.com", uuid: "uuid-alice" },
        { email: "bob@example.com", uuid: "uuid-bob" },
        { email: "carol@example.com", uuid: "uuid-carol" }
      ]
    ]
  }
];

// --- SERVICE FUNCTIONS ---

export function getExams(accessKey) {
  if (USE_MOCK_EXAMS) {
    return Promise.resolve([...mockExams]);
  }
  return fetch(`${API_BASE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operation: 'list', accessKey })
  }).then(r => r.json());
}

export function getExamById(examId, accessKey) {
  if (USE_MOCK_EXAMS) {
    return Promise.resolve(mockExams.find(e => e.id === examId) || null);
  }
  return fetch(`${API_BASE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operation: 'read', accessKey, examId })
  }).then(r => r.json());
}

export function createExam(exam, accessKey) {
  if (USE_MOCK_EXAMS) {
    if (!exam.id) exam.id = uuidv4();
    mockExams.push(exam);
    return Promise.resolve(exam);
  }
  return fetch(`${API_BASE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operation: 'create', accessKey, ...exam })
  }).then(r => r.json());
}

export function updateExam(updatedExam, accessKey) {
  if (USE_MOCK_EXAMS) {
    mockExams = mockExams.map(e => e.id === updatedExam.id ? updatedExam : e);
    return Promise.resolve(updatedExam);
  }
  return fetch(`${API_BASE}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operation: 'update', accessKey, ...updatedExam })
  }).then(r => r.json());
}

export function deleteExam(examId, accessKey) {
  if (USE_MOCK_EXAMS) {
    mockExams = mockExams.filter(e => e.id !== examId);
    return Promise.resolve();
  }
  return fetch(`${API_BASE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operation: 'delete', accessKey, examId })
  }).then(() => {});
}
