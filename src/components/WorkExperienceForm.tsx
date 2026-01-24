import React, { useState } from 'react';
import { useResumeStore } from '../store/useResumeStore';

const WorkExperienceForm = () => {
  const { workExperience, addWorkExperience, updateWorkExperience, deleteWorkExperience } = useResumeStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
  });

  const handleAdd = () => {
    if (!formData.company || !formData.position) return;
    
    addWorkExperience(formData);
    setFormData({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    });
    setShowForm(false);
  };

  const handleUpdate = (id: string, field: string, value: any) => {
    updateWorkExperience(id, { [field]: value });
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Work Experience</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Cancel' : '+ Add Experience'}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Company *</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Company name"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Position *</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  placeholder="Job title"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Start Date</label>
                <input
                  type="month"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">End Date</label>
                <input
                  type="month"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  disabled={formData.current}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.current}
                  onChange={(e) => setFormData({ ...formData, current: e.target.checked })}
                  className="mr-2"
                />
                I currently work here
              </label>
            </div>

            <div>
              <label className="label">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your responsibilities and achievements..."
                className="input-field h-32 resize-none"
              />
            </div>

            <button onClick={handleAdd} className="btn-primary w-full">
              Add Experience
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {workExperience.map((exp) => (
          <div key={exp.id} className="p-4 border rounded-lg hover:shadow-md transition">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Company</label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => handleUpdate(exp.id, 'company', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Position</label>
                <input
                  type="text"
                  value={exp.position}
                  onChange={(e) => handleUpdate(exp.id, 'position', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Start Date</label>
                <input
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => handleUpdate(exp.id, 'startDate', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">End Date</label>
                <input
                  type="month"
                  value={exp.endDate}
                  onChange={(e) => handleUpdate(exp.id, 'endDate', e.target.value)}
                  disabled={exp.current}
                  className="input-field"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) => handleUpdate(exp.id, 'current', e.target.checked)}
                  className="mr-2"
                />
                I currently work here
              </label>
            </div>

            <div className="mt-4">
              <label className="label">Description</label>
              <textarea
                value={exp.description}
                onChange={(e) => handleUpdate(exp.id, 'description', e.target.value)}
                className="input-field h-24 resize-none"
              />
            </div>

            <button
              onClick={() => deleteWorkExperience(exp.id)}
              className="mt-4 text-red-600 hover:text-red-800 font-medium"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkExperienceForm;
