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
  aiComment?: string;
}

export interface SchoolSummaryResponse {
  schoolId: string;
  schoolName: string;
  location: string;
  industryField: string;
  icon: string;
  website: string;
  hasDormitory: boolean;
  capacity: number;
  competitionRate: string;
}

export interface SchoolDetailResponse {
  schoolId: string;
  schoolName: string;
  location: string;
  industryField: string;
  icon: string;
  website: string;
  hasDormitory: boolean;
  capacity: number;
  competitionRate: string;
  mainJobs: string[];
  jobFields: string[];
}

export interface SchoolRecommendResponse {
  schoolId: string;
  schoolName: string;
  location: string;
  industryField: string;
  icon: string;
  website: string;
  hasDormitory: boolean;
  capacity: number;
  competitionRate: string;
}

export interface SchoolDetail {
  schoolId: string;
  schoolName: string;
  location: string;
  industryField: string;
  icon: string;
  hasDormitory: boolean;
  capacity: number;
  competitionRate: string;
  mainJobs: string[];
  jobFields: string[];
}

export interface SchoolChatRequest {
  query: string;
}

export interface SchoolChatResponse {
  answer: string;
}

export interface SchoolCompareResponse {
  school1: SchoolDetail;
  school2: SchoolDetail;
  aiSummary?: string;
}
