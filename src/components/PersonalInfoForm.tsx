import React from 'react';
import { useResumeStore } from '../store/useResumeStore';

const PersonalInfoForm = () => {
  const { personalInfo, setPersonalInfo } = useResumeStore();

  const handleChange = (field: keyof typeof personalInfo, value: string) => {
    setPersonalInfo({ [field]: value });
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Full Name *</label>
            <input
              type="text"
              value={personalInfo.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="John Doe"
              className="input-field"
            />
          </div>

          <div>
            <label className="label">Email *</label>
            <input
              type="email"
              value={personalInfo.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="john@example.com"
              className="input-field"
            />
          </div>

          <div>
            <label className="label">Phone *</label>
            <input
              type="tel"
              value={personalInfo.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="input-field"
            />
          </div>

          <div>
            <label className="label">Location *</label>
            <input
              type="text"
              value={personalInfo.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="New York, NY"
              className="input-field"
            />
          </div>

          <div>
            <label className="label">LinkedIn</label>
            <input
              type="url"
              value={personalInfo.linkedin || ''}
              onChange={(e) => handleChange('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
              className="input-field"
            />
          </div>

          <div>
            <label className="label">Website</label>
            <input
              type="url"
              value={personalInfo.website || ''}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="https://yourportfolio.com"
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="label">Professional Summary</label>
          <textarea
            value={personalInfo.summary}
            onChange={(e) => handleChange('summary', e.target.value)}
            placeholder="Write a compelling 2-3 sentence summary of your professional background and key achievements..."
            className="input-field h-32 resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
