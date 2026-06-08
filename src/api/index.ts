import type {
  AptitudeAnswerRequest,
  AptitudeResultResponse,
  QuestionResponse,
  SchoolCompareResponse,
  SchoolDetailResponse,
  SchoolRecommendResponse,
  SchoolSummaryResponse,
} from '../types';

const BASE_URL = 'http://localhost:8080';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function requestEmpty(path: string, options?: RequestInit): Promise<void> {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
}

export const api = {
  getQuestions: () =>
    request<QuestionResponse[]>('/api/aptitude/questions'),

  analyze: (body: AptitudeAnswerRequest) =>
    request<AptitudeResultResponse>('/api/aptitude/analyze', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  getProgress: () =>
    request<Record<string, number>>('/api/aptitude/progress'),

  saveProgress: (body: AptitudeAnswerRequest) =>
    requestEmpty('/api/aptitude/progress', {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  clearProgress: () =>
    requestEmpty('/api/aptitude/progress', { method: 'DELETE' }),

  getResult: () =>
    request<AptitudeResultResponse>('/api/aptitude/result'),

  clearResult: () =>
    requestEmpty('/api/aptitude/result', { method: 'DELETE' }),

  getAllSchools: () =>
    request<SchoolSummaryResponse[]>('/api/schools'),

  getSchoolDetail: (schoolId: string) =>
    request<SchoolDetailResponse>(`/api/schools/${schoolId}`),

  recommendSchools: (jobId: string) =>
    request<SchoolRecommendResponse[]>(`/api/schools/recommend/${jobId}`),

  compareSchools: (school1: string, school2: string) =>
    request<SchoolCompareResponse>(
      `/api/schools/compare?school1=${encodeURIComponent(school1)}&school2=${encodeURIComponent(school2)}`
    ),
};
