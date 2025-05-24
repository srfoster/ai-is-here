import gptProxyData from '../../gptProxyData.json';

export const USE_MOCK_EXAMS = false; // Set to false to use the REST API
const API_BASE = gptProxyData.exam_scheduler 

// --- MOCK DATA ---
/*
let mockExams = [
  {
    id: "b6e2e2e2-1234-4cde-8a2b-abcdefabcdef", // example uuid
    name: "Final Exam - Math 101",
    slots: [
      {
        start: "2025-06-01T09:00",
        end: "2025-06-01T10:00",
        seatCapacity: 3,
        signups: ["alice@example.com", "bob@example.com"]
      },
      {
        start: "2025-06-01T10:30",
        end: "2025-06-01T11:30",
        seatCapacity: 2,
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
*/

// --- SERVICE FUNCTIONS ---

export function getExams(accessKey) {
  return fetch(`${API_BASE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operation: 'list', accessKey})
  }).then(r => r.json())
  .then(data => JSON.parse(data.body))
}

export function getExamById(examId, accessKey) {
  return fetch(`${API_BASE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operation: 'read', accessKey, examId })
  }).then(r => r.json())
  .then(data => JSON.parse(data.body))
}

export function getExamByStudentUUID(examId, studentUUID) {
  return fetch(`${API_BASE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operation: 'read', studentUUID, examId })
  }).then(r => r.json())
  .then(data => JSON.parse(data.body))
}

export function createExam(exam, accessKey) {
  return fetch(`${API_BASE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operation: 'create', accessKey, ...exam })
  }).then(r => r.json())
  .then(data => JSON.parse(data.body))
}

export function updateExam(updatedExam, accessKey) {
  return fetch(`${API_BASE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operation: 'update', accessKey, ...updatedExam })
  }).then(r => r.json())
  .then(data => JSON.parse(data.body))
}

export function deleteExam(examId, accessKey) {
  return fetch(`${API_BASE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operation: 'delete', accessKey, examId })
  }).then(() => {})
}

export function signup(examId, slotIndex, uuid) {
  return fetch(`${API_BASE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operation: 'signup', examId, slotIndex, uuid })
  }).then(r => r.json());
}
