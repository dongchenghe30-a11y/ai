import React, { useState } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import PersonalInfoForm from './PersonalInfoForm';
import WorkExperienceForm from './WorkExperienceForm';
import EducationForm from './EducationForm';
import SkillsForm from './SkillsForm';
import TemplateSelector from './TemplateSelector';
import JobAnalyzer from './JobAnalyzer';
import ExperienceGenerator from './ExperienceGenerator';
import ResumePreview from './ResumePreview';
import TranslationTool from './TranslationTool';

const ResumeBuilder = () => {
  const [activeTab, setActiveTab] = useState<'builder' | 'tools'>('builder');

  return (
    <section id="builder" className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Build Your Resume
          </h2>
          <p className="text-xl text-gray-600">
            Create a professional resume in minutes
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg bg-gray-200 p-1">
            <button
              onClick={() => setActiveTab('builder')}
              className={`px-6 py-2 rounded-md font-medium transition ${
                activeTab === 'builder'
                  ? 'bg-white text-primary shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Resume Builder
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`px-6 py-2 rounded-md font-medium transition ${
                activeTab === 'tools'
                  ? 'bg-white text-primary shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              AI Tools
            </button>
          </div>
        </div>

        {activeTab === 'builder' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <TemplateSelector />
              <PersonalInfoForm />
              <WorkExperienceForm />
              <EducationForm />
              <SkillsForm />
            </div>
            <ResumePreview />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <JobAnalyzer />
              <TranslationTool />
            </div>
            <div className="space-y-6">
              <ExperienceGenerator />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ResumeBuilder;
