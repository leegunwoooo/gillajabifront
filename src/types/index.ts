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

export type Achievement = 'A' | 'B' | 'C' | 'D' | 'E';
export type Certificate =
  | 'INFORMATION_PROCESSING'
  | 'INFORMATION_DEVICE_OPERATION'
  | 'ELECTRONIC_COMPUTER'
  | 'COMPUTER_USAGE_1'
  | 'COMPUTER_USAGE_2'
  | 'COMPUTER_USAGE_3'
  | 'NONE';

export interface SubjectScore {
  subjectName: string;
  achievement: Achievement;
  mathSubject: boolean;
}

export interface AdmissionScoreRequest {
  grade2Semester1: SubjectScore[];
  grade2Semester2: SubjectScore[];
  grade3Semester1: SubjectScore[];
  unauthorizedAbsenceDays: number;
  unauthorizedTardyCount: number;
  unauthorizedEarlyLeaveCount: number;
  unauthorizedMissedClassCount: number;
  volunteerHours: number;
  certificate: Certificate;
}

export interface ScoreBreakdown {
  subjectScore: number;
  maxSubjectScore: number;
  attendanceScore: number;
  maxAttendanceScore: number;
  volunteerScore: number;
  maxVolunteerScore: number;
  bonusScore: number;
  maxBonusScore: number;
}

export interface AdmissionScoreResponse {
  schoolName: string;
  admissionType: string;
  breakdown: ScoreBreakdown;
  totalScore: number;
  maxTotalScore: number;
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
