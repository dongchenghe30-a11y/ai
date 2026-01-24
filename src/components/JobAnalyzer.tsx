import React, { useState } from 'react';
import { aiApi } from '../services/api';
import { KeywordSuggestion } from '../types';

const JobAnalyzer = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<KeywordSuggestion[] | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    setAnalyzing(true);
    setError('');

    try {
      const response = await aiApi.analyzeJobDescription({
        jobDescription,
      });
      setAnalysis(response.keywords);
    } catch (err: any) {
      console.error('Analysis error:', err);
      // 更详细的错误提示
      if (err.message?.includes('API endpoint not found')) {
        setError('API not configured. Please check VITE_API_URL environment variable.');
      } else if (err.message?.includes('Network error')) {
        setError('Network error. Please check your connection and try again.');
      } else if (err.response?.status === 404) {
        setError('API endpoint not found. Please contact support.');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError('Failed to analyze job description. Please try again.');
      }
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">Job Description Analyzer</h2>
      <p className="text-gray-600 mb-4">
        Paste the job description below to get AI-powered keyword suggestions and optimize your resume.
      </p>
      
      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste job description here..."
        className="input-field h-48 resize-none mb-4"
      />
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <button
        onClick={handleAnalyze}
        disabled={analyzing}
        className="btn-primary w-full"
      >
        {analyzing ? 'Analyzing...' : 'Analyze & Get Keywords'}
      </button>

      {analysis && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Keyword Suggestions</h3>
          <div className="space-y-3">
            {analysis.map((item, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg hover:border-primary transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-primary">{item.keyword}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    item.importance === 'high' ? 'bg-red-100 text-red-800' :
                    item.importance === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {item.importance} importance
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Category:</span> {item.category}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Suggestion:</span> {item.suggestion}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobAnalyzer;
