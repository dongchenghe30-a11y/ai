export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  summary: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  aiGenerated?: boolean;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationYear: string;
  gpa?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface KeywordSuggestion {
  keyword: string;
  category: string;
  importance: 'high' | 'medium' | 'low';
  suggestion: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  keywords?: KeywordSuggestion[];
}

export type TemplateType = 'modern' | 'classic' | 'creative';

export interface ATSAnalysis {
  score: number;
  keywords: KeywordSuggestion[];
  suggestions: string[];
  missingKeywords: string[];
}
