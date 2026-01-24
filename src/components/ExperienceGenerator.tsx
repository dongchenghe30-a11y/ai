import React, { useState } from 'react';
import { aiApi } from '../services/api';
import { useResumeStore } from '../store/useResumeStore';

const ExperienceGenerator = () => {
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [error, setError] = useState('');

  const { addWorkExperience } = useResumeStore();

  const handleGenerate = async () => {
    if (!company || !position || !keyPoints.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setGenerating(true);
    setError('');

    try {
      const response = await aiApi.generateExperience({
        company,
        position,
        keyPoints: keyPoints.split('\n').filter(p => p.trim()),
      });
      setGeneratedDescription(response.description);
    } catch (err) {
      setError('Failed to generate description. Please try again.');
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleAddExperience = () => {
    if (!generatedDescription) return;

    addWorkExperience({
      company,
      position,
      startDate: '',
      endDate: '',
      current: false,
      description: generatedDescription,
      aiGenerated: true,
    });

    setCompany('');
    setPosition('');
    setKeyPoints('');
    setGeneratedDescription('');
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">AI Experience Generator</h2>
      <p className="text-gray-600 mb-4">
        Enter your job details and key achievements. AI will craft a professional description optimized for ATS.
      </p>
      
      <div className="space-y-4">
        <div>
          <label className="label">Company</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g., Google, Microsoft"
            className="input-field"
          />
        </div>

        <div>
          <label className="label">Position</label>
          <input
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="e.g., Senior Software Engineer"
            className="input-field"
          />
        </div>

        <div>
          <label className="label">Key Points (one per line)</label>
          <textarea
            value={keyPoints}
            onChange={(e) => setKeyPoints(e.target.value)}
            placeholder="Led a team of 5 developers&#10;Improved system performance by 40%&#10;Implemented CI/CD pipeline"
            className="input-field h-32 resize-none"
          />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="btn-primary w-full"
        >
          {generating ? 'Generating...' : 'Generate Description'}
        </button>

        {generatedDescription && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Generated Description:</h3>
            <p className="text-gray-700 mb-4">{generatedDescription}</p>
            <button
              onClick={handleAddExperience}
              className="btn-primary w-full"
            >
              Add to Resume
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperienceGenerator;
