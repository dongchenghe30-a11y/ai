import { create } from 'zustand';
import { ResumeData, TemplateType } from '../types';

interface ResumeStore extends ResumeData {
  template: TemplateType;
  setPersonalInfo: (info: Partial<ResumeData['personalInfo']>) => void;
  addWorkExperience: (experience: Omit<ResumeData['workExperience'][0], 'id'>) => void;
  updateWorkExperience: (id: string, experience: Partial<ResumeData['workExperience'][0]>) => void;
  deleteWorkExperience: (id: string) => void;
  addEducation: (education: Omit<ResumeData['education'][0], 'id'>) => void;
  updateEducation: (id: string, education: Partial<ResumeData['education'][0]>) => void;
  deleteEducation: (id: string) => void;
  addSkill: (skill: Omit<ResumeData['skills'][0], 'id'>) => void;
  updateSkill: (id: string, skill: Partial<ResumeData['skills'][0]>) => void;
  deleteSkill: (id: string) => void;
  setTemplate: (template: TemplateType) => void;
  setKeywords: (keywords: ResumeData['keywords']) => void;
  reset: () => void;
}

const initialState = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    summary: '',
  },
  workExperience: [],
  education: [],
  skills: [],
  keywords: [],
  template: 'modern' as TemplateType,
};

export const useResumeStore = create<ResumeStore>((set) => ({
  ...initialState,
  template: 'modern',
  
  setPersonalInfo: (info) =>
    set((state) => ({
      personalInfo: { ...state.personalInfo, ...info },
    })),
  
  addWorkExperience: (experience) =>
    set((state) => ({
      workExperience: [
        ...state.workExperience,
        { ...experience, id: Date.now().toString() },
      ],
    })),
  
  updateWorkExperience: (id, experience) =>
    set((state) => ({
      workExperience: state.workExperience.map((exp) =>
        exp.id === id ? { ...exp, ...experience } : exp
      ),
    })),
  
  deleteWorkExperience: (id) =>
    set((state) => ({
      workExperience: state.workExperience.filter((exp) => exp.id !== id),
    })),
  
  addEducation: (education) =>
    set((state) => ({
      education: [
        ...state.education,
        { ...education, id: Date.now().toString() },
      ],
    })),
  
  updateEducation: (id, education) =>
    set((state) => ({
      education: state.education.map((edu) =>
        edu.id === id ? { ...edu, ...education } : edu
      ),
    })),
  
  deleteEducation: (id) =>
    set((state) => ({
      education: state.education.filter((edu) => edu.id !== id),
    })),
  
  addSkill: (skill) =>
    set((state) => ({
      skills: [...state.skills, { ...skill, id: Date.now().toString() }],
    })),
  
  updateSkill: (id, skill) =>
    set((state) => ({
      skills: state.skills.map((s) => (s.id === id ? { ...s, ...skill } : s)),
    })),
  
  deleteSkill: (id) =>
    set((state) => ({
      skills: state.skills.filter((s) => s.id !== id),
    })),
  
  setTemplate: (template) => set({ template }),
  
  setKeywords: (keywords) => set({ keywords }),
  
  reset: () => set(initialState),
}));
