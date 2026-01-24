import React from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { exportToPDF, exportToWord } from '../utils/export';

const ResumePreview = () => {
  const resumeData = useResumeStore();

  const handleExportPDF = async () => {
    try {
      await exportToPDF('resume-preview', `${resumeData.personalInfo.fullName || 'resume'}.pdf`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  const handleExportWord = async () => {
    try {
      await exportToWord(resumeData, `${resumeData.personalInfo.fullName || 'resume'}.docx`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export Word document. Please try again.');
    }
  };

  const getTemplateClasses = () => {
    switch (resumeData.template) {
      case 'modern':
        return 'bg-white shadow-2xl';
      case 'classic':
        return 'bg-white border-2 border-gray-800 shadow-2xl';
      case 'creative':
        return 'bg-gradient-to-br from-white to-blue-50 shadow-2xl border-l-8 border-primary';
      default:
        return 'bg-white shadow-2xl';
    }
  };

  return (
    <div className="lg:col-span-2">
      <div className="card mb-6">
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={handleExportPDF}
            className="btn-primary flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export as PDF
          </button>
          <button
            onClick={handleExportWord}
            className="btn-secondary flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export as Word
          </button>
        </div>
      </div>

      <div id="resume-preview" className={`${getTemplateClasses()} p-8 md:p-12 min-h-screen`}>
        {resumeData.template === 'modern' ? (
          <ModernTemplate data={resumeData} />
        ) : resumeData.template === 'classic' ? (
          <ClassicTemplate data={resumeData} />
        ) : (
          <CreativeTemplate data={resumeData} />
        )}
      </div>
    </div>
  );
};

const ModernTemplate = ({ data }: { data: any }) => (
  <div>
    <header className="text-center mb-8 pb-6 border-b-2 border-primary">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">{data.personalInfo.fullName}</h1>
      <p className="text-lg text-gray-600">
        {data.personalInfo.email} | {data.personalInfo.phone} | {data.personalInfo.location}
      </p>
      {(data.personalInfo.linkedin || data.personalInfo.website) && (
        <p className="text-sm text-primary mt-2">
          {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
          {data.personalInfo.linkedin && data.personalInfo.website && ' | '}
          {data.personalInfo.website && <span>{data.personalInfo.website}</span>}
        </p>
      )}
    </header>

    {data.personalInfo.summary && (
      <section className="mb-8">
        <h2 className="text-xl font-bold text-primary mb-3 uppercase tracking-wider">Professional Summary</h2>
        <p className="text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
      </section>
    )}

    {data.workExperience.length > 0 && (
      <section className="mb-8">
        <h2 className="text-xl font-bold text-primary mb-4 uppercase tracking-wider">Work Experience</h2>
        {data.workExperience.map((exp: any) => (
          <div key={exp.id} className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                <p className="text-primary font-medium">{exp.company}</p>
              </div>
              <span className="text-sm text-gray-600 whitespace-nowrap">
                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed">{exp.description}</p>
          </div>
        ))}
      </section>
    )}

    {data.education.length > 0 && (
      <section className="mb-8">
        <h2 className="text-xl font-bold text-primary mb-4 uppercase tracking-wider">Education</h2>
        {data.education.map((edu: any) => (
          <div key={edu.id} className="mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                <p className="text-gray-700">{edu.institution}</p>
                {edu.field && <p className="text-gray-600">{edu.field}</p>}
              </div>
              <span className="text-sm text-gray-600 whitespace-nowrap">{edu.graduationYear}</span>
            </div>
          </div>
        ))}
      </section>
    )}

    {data.skills.length > 0 && (
      <section>
        <h2 className="text-xl font-bold text-primary mb-4 uppercase tracking-wider">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill: any) => (
            <span key={skill.id} className="px-3 py-1 bg-blue-100 text-primary rounded-full text-sm">
              {skill.name}
            </span>
          ))}
        </div>
      </section>
    )}
  </div>
);

const ClassicTemplate = ({ data }: { data: any }) => (
  <div>
    <header className="text-center mb-8 pb-6 border-b-2 border-gray-800">
      <h1 className="text-4xl font-bold text-gray-900 mb-2 uppercase">{data.personalInfo.fullName}</h1>
      <p className="text-base text-gray-700">
        {data.personalInfo.email} • {data.personalInfo.phone} • {data.personalInfo.location}
      </p>
      {(data.personalInfo.linkedin || data.personalInfo.website) && (
        <p className="text-sm text-gray-600 mt-2">
          {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
          {data.personalInfo.linkedin && data.personalInfo.website && ' • '}
          {data.personalInfo.website && <span>{data.personalInfo.website}</span>}
        </p>
      )}
    </header>

    {data.personalInfo.summary && (
      <section className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase border-b border-gray-300 pb-1">Summary</h2>
        <p className="text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
      </section>
    )}

    {data.workExperience.length > 0 && (
      <section className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase border-b border-gray-300 pb-1">Experience</h2>
        {data.workExperience.map((exp: any) => (
          <div key={exp.id} className="mb-6">
            <div className="flex justify-between items-start mb-1">
              <div>
                <h3 className="text-base font-bold text-gray-900 uppercase">{exp.position}</h3>
                <p className="text-gray-700 font-medium">{exp.company}</p>
              </div>
              <span className="text-sm text-gray-600 whitespace-nowrap">
                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed text-sm">{exp.description}</p>
          </div>
        ))}
      </section>
    )}

    {data.education.length > 0 && (
      <section className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase border-b border-gray-300 pb-1">Education</h2>
        {data.education.map((edu: any) => (
          <div key={edu.id} className="mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-gray-900 uppercase">{edu.degree}</h3>
                <p className="text-gray-700">{edu.institution}</p>
                {edu.field && <p className="text-gray-600 text-sm">{edu.field}</p>}
              </div>
              <span className="text-sm text-gray-600 whitespace-nowrap">{edu.graduationYear}</span>
            </div>
          </div>
        ))}
      </section>
    )}

    {data.skills.length > 0 && (
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase border-b border-gray-300 pb-1">Skills</h2>
        <p className="text-gray-700">
          {data.skills.map((skill: any) => skill.name).join(' • ')}
        </p>
      </section>
    )}
  </div>
);

const CreativeTemplate = ({ data }: { data: any }) => (
  <div>
    <header className="mb-10 pb-6" style={{ borderBottom: '4px solid #7c3aed' }}>
      <h1 className="text-5xl font-bold mb-3" style={{ color: '#7c3aed' }}>{data.personalInfo.fullName}</h1>
      <div className="flex flex-wrap gap-4 text-sm text-gray-700">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {data.personalInfo.email}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          {data.personalInfo.phone}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {data.personalInfo.location}
        </span>
        {data.personalInfo.linkedin && (
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            {data.personalInfo.linkedin}
          </span>
        )}
      </div>
    </header>

    {data.personalInfo.summary && (
      <section className="mb-10 p-6 bg-purple-50 rounded-lg">
        <h2 className="text-2xl font-bold mb-3" style={{ color: '#7c3aed' }}>About Me</h2>
        <p className="text-gray-700 leading-relaxed text-lg">{data.personalInfo.summary}</p>
      </section>
    )}

    {data.workExperience.length > 0 && (
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6" style={{ color: '#7c3aed' }}>Professional Journey</h2>
        {data.workExperience.map((exp: any, index: number) => (
          <div key={exp.id} className="relative pl-8 pb-8 border-l-2 border-purple-200" style={{ marginLeft: '10px' }}>
            <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-purple-500" style={{ transform: 'translateX(-50%)' }}></div>
            <div className="mb-2">
              <h3 className="text-xl font-bold text-gray-900">{exp.position}</h3>
              <p className="text-primary font-medium text-lg">{exp.company}</p>
              <span className="text-sm text-gray-500 italic">
                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed">{exp.description}</p>
          </div>
        ))}
      </section>
    )}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {data.education.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#7c3aed' }}>Education</h2>
          {data.education.map((edu: any) => (
            <div key={edu.id} className="mb-6 p-4 bg-white rounded-lg shadow-sm">
              <h3 className="font-bold text-gray-900">{edu.degree}</h3>
              <p className="text-gray-700">{edu.institution}</p>
              {edu.field && <p className="text-gray-600 text-sm">{edu.field}</p>}
              <p className="text-sm text-primary">{edu.graduationYear}</p>
            </div>
          ))}
        </section>
      )}

      {data.skills.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#7c3aed' }}>Expertise</h2>
          <div className="space-y-3">
            {data.skills.map((skill: any) => (
              <div key={skill.id} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span className="text-gray-700">{skill.name}</span>
                <span className="ml-auto text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">{skill.level}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  </div>
);

export default ResumePreview;
