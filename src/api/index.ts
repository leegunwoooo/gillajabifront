import type {
  AptitudeAnswerRequest,
  AptitudeResultResponse,
  QuestionResponse,
  SchoolRecommendResponse,
} from '../types';

const BASE_URL = 'http://localhost:8080';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  getQuestions: () =>
    request<QuestionResponse[]>('/api/aptitude/questions'),

  analyze: (body: AptitudeAnswerRequest) =>
    request<AptitudeResultResponse>('/api/aptitude/analyze', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  recommendSchools: (jobId: string) =>
    request<SchoolRecommendResponse[]>(`/api/schools/recommend/${jobId}`),
};
