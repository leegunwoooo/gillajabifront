export interface QuestionResponse {
  id: number;
  text: string;
}

export interface AptitudeAnswerRequest {
  answers: Record<string, number>;
}

export interface JobRecommendResponse {
  jobId: string;
  jobName: string;
  field: string;
  icon: string;
  score: number;
  matchRate: number;
}

export interface AptitudeResultResponse {
  categoryScores: Record<string, number>;
  categoryRates: Record<string, number>;
  recommendedJobs: JobRecommendResponse[];
}

export interface SchoolRecommendResponse {
  schoolId: string;
  schoolName: string;
  location: string;
  industryField: string;
}
