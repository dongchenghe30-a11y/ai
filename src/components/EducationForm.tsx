import React, { useState } from 'react';
import { useResumeStore } from '../store/useResumeStore';

const EducationForm = () => {
  const { education, addEducation, updateEducation, deleteEducation } = useResumeStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    field: '',
    graduationYear: '',
    gpa: '',
  });

  const handleAdd = () => {
    if (!formData.institution || !formData.degree) return;
    
    addEducation(formData);
    setFormData({
      institution: '',
      degree: '',
      field: '',
      graduationYear: '',
      gpa: '',
    });
    setShowForm(false);
  };

  const handleUpdate = (id: string, field: string, value: string) => {
    updateEducation(id, { [field]: value });
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Education</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Cancel' : '+ Add Education'}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Institution *</label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  placeholder="e.g., Harvard University"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Degree *</label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  placeholder="e.g., Bachelor of Science"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Field of Study</label>
                <input
                  type="text"
                  value={formData.field}
                  onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                  placeholder="e.g., Computer Science"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Graduation Year</label>
                <input
                  type="text"
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                  placeholder="e.g., 2020"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">GPA (Optional)</label>
                <input
                  type="text"
                  value={formData.gpa}
                  onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                  placeholder="e.g., 3.8"
                  className="input-field"
                />
              </div>
            </div>

            <button onClick={handleAdd} className="btn-primary w-full">
              Add Education
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {education.map((edu) => (
          <div key={edu.id} className="p-4 border rounded-lg hover:shadow-md transition">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Institution</label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => handleUpdate(edu.id, 'institution', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Degree</label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => handleUpdate(edu.id, 'degree', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Field of Study</label>
                <input
                  type="text"
                  value={edu.field}
                  onChange={(e) => handleUpdate(edu.id, 'field', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Graduation Year</label>
                <input
                  type="text"
                  value={edu.graduationYear}
                  onChange={(e) => handleUpdate(edu.id, 'graduationYear', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">GPA</label>
                <input
                  type="text"
                  value={edu.gpa || ''}
                  onChange={(e) => handleUpdate(edu.id, 'gpa', e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <button
              onClick={() => deleteEducation(edu.id)}
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

export default EducationForm;
