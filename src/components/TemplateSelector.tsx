import React from 'react';
import { useResumeStore, TemplateType } from '../store/useResumeStore';

const templates: { id: TemplateType; name: string; description: string; color: string }[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary design with bold accents',
    color: 'bg-blue-500',
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional professional layout',
    color: 'bg-gray-700',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Unique design for creative professionals',
    color: 'bg-purple-500',
  },
];

const TemplateSelector = () => {
  const { template, setTemplate } = useResumeStore();

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">Select Template</h2>
      <p className="text-gray-600 mb-6">
        Choose a template that best represents your professional style
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((t) => (
          <button
            key={t.id}
            onClick={() => setTemplate(t.id)}
            className={`p-6 rounded-lg border-2 transition-all ${
              template === t.id
                ? 'border-primary shadow-lg scale-105'
                : 'border-gray-200 hover:border-primary'
            }`}
          >
            <div className={`${t.color} w-full h-32 rounded-lg mb-4 flex items-center justify-center`}>
              <span className="text-white text-4xl font-bold">{t.name[0]}</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">{t.name}</h3>
            <p className="text-sm text-gray-600">{t.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
