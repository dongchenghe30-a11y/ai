import React, { useState } from 'react';
import { useResumeStore } from '../store/useResumeStore';

const SkillsForm = () => {
  const { skills, addSkill, updateSkill, deleteSkill } = useResumeStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    level: 'Intermediate' as const,
  });

  const handleAdd = () => {
    if (!formData.name) return;
    
    addSkill(formData);
    setFormData({ name: '', level: 'Intermediate' });
    setShowForm(false);
  };

  const handleUpdate = (id: string, field: string, value: string) => {
    updateSkill(id, { [field]: value });
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Skills</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Cancel' : '+ Add Skill'}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-4">
            <div>
              <label className="label">Skill Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., JavaScript, Project Management"
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Proficiency Level</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                className="input-field"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
            <button onClick={handleAdd} className="btn-primary w-full">
              Add Skill
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {skills.map((skill) => (
          <div key={skill.id} className="flex items-center gap-4 p-3 border rounded-lg hover:shadow-md transition">
            <input
              type="text"
              value={skill.name}
              onChange={(e) => handleUpdate(skill.id, 'name', e.target.value)}
              className="flex-1 input-field"
            />
            <select
              value={skill.level}
              onChange={(e) => handleUpdate(skill.id, 'level', e.target.value)}
              className="input-field w-32"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
            <button
              onClick={() => deleteSkill(skill.id)}
              className="text-red-600 hover:text-red-800 font-medium px-2"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsForm;
