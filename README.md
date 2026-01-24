# AI Resume Builder

Free AI Resume Builder - ATS-Friendly CV Maker Online with Keyword Optimization 2026

## Features

- **Job Description Analysis**: AI-powered keyword extraction and optimization suggestions
- **Experience Generator**: Transform bullet points into professional descriptions
- **One-Click Resume Generation**: Create complete resumes from your information
- **Multiple Templates**: Modern, Classic, and Creative designs
- **ATS Optimization**: Improve your resume's pass rate through applicant tracking systems
- **PDF & Word Export**: Download in professional formats
- **Bilingual Translation**: Translate between Chinese and English

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Cloudflare Workers with AI
- **AI Model**: Cloudflare AI (Llama 3.1 8B)
- **Deployment**: Cloudflare Pages

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Deployment

### Cloudflare Pages Deployment

1. Connect your GitHub repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set output directory: `dist`

### Cloudflare Workers for Backend

1. Install Wrangler CLI:
```bash
npm install -g wrangler
```

2. Login to Cloudflare:
```bash
wrangler login
```

3. Deploy the worker:
```bash
wrangler deploy
```

## Environment Variables

Create a `.env` file:

```
VITE_API_URL=https://your-worker-url.workers.dev/api
```

## Project Structure

```
src/
├── components/      # React components
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── Features.tsx
│   ├── JobAnalyzer.tsx
│   ├── ExperienceGenerator.tsx
│   ├── PersonalInfoForm.tsx
│   ├── WorkExperienceForm.tsx
│   ├── EducationForm.tsx
│   ├── SkillsForm.tsx
│   ├── TemplateSelector.tsx
│   ├── ResumePreview.tsx
│   ├── TranslationTool.tsx
│   └── ResumeBuilder.tsx
├── services/        # API services
│   └── api.ts
├── store/          # State management
│   └── useResumeStore.ts
├── types/          # TypeScript types
│   └── index.ts
├── utils/          # Utility functions
│   └── export.ts
├── worker/         # Cloudflare Worker backend
│   └── index.ts
├── App.tsx
├── main.tsx
└── index.css
```

## API Endpoints

### POST /api/ai/analyze
Analyze job description for keywords and suggestions.

**Request:**
```json
{
  "jobDescription": "string"
}
```

### POST /api/ai/generate-experience
Generate professional job description from key points.

**Request:**
```json
{
  "jobTitle": "string",
  "company": "string",
  "keyPoints": ["string"]
}
```

### POST /api/ai/translate
Translate text between Chinese and English.

**Request:**
```json
{
  "text": "string",
  "sourceLang": "en" | "zh",
  "targetLang": "en" | "zh"
}
```

### POST /api/ai/optimize
Optimize resume for ATS systems.

**Request:**
```json
{
  "personalInfo": {},
  "workExperience": [],
  "education": [],
  "skills": []
}
```

## License

MIT
