import React, { useState } from 'react';
import { aiApi } from '../services/api';

const TranslationTool = () => {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState<'en' | 'zh'>('zh');
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState('');

  const handleTranslate = async () => {
    if (!text.trim()) {
      setError('Please enter text to translate');
      return;
    }

    setTranslating(true);
    setError('');

    try {
      const targetLang = sourceLang === 'en' ? 'zh' : 'en';
      const response = await aiApi.translateText({
        text,
        sourceLang,
        targetLang,
      });
      setTranslatedText(response.translatedText);
    } catch (err) {
      setError('Translation failed. Please try again.');
      console.error(err);
    } finally {
      setTranslating(false);
    }
  };

  const handleSwap = () => {
    setSourceLang(sourceLang === 'en' ? 'zh' : 'en');
    setText('');
    setTranslatedText('');
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">Resume Translation</h2>
      <p className="text-gray-600 mb-6">
        Translate your resume content between Chinese and English for cross-border job applications
      </p>

      <div className="flex items-center justify-center mb-4 gap-4">
        <select
          value={sourceLang}
          onChange={(e) => setSourceLang(e.target.value as 'en' | 'zh')}
          className="input-field w-32 text-center"
        >
          <option value="zh">中文</option>
          <option value="en">English</option>
        </select>

        <button
          onClick={handleSwap}
          className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>

        <select
          value={sourceLang === 'en' ? 'zh' : 'en'}
          disabled
          className="input-field w-32 text-center bg-gray-100"
        >
          <option value="zh">中文</option>
          <option value="en">English</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Source Text ({sourceLang === 'zh' ? '中文' : 'English'})</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={sourceLang === 'zh' ? '输入要翻译的中文内容...' : 'Enter English text to translate...'}
            className="input-field h-48 resize-none"
          />
        </div>

        <div>
          <label className="label">Translation ({sourceLang === 'zh' ? 'English' : '中文'})</label>
          <div className="w-full h-48 p-4 border border-gray-300 rounded-lg bg-gray-50 overflow-auto">
            {translatedText || (
              <span className="text-gray-400">Translation will appear here...</span>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <button
        onClick={handleTranslate}
        disabled={translating}
        className="btn-primary w-full mt-4"
      >
        {translating ? 'Translating...' : 'Translate'}
      </button>

      {translatedText && (
        <button
          onClick={() => {
            navigator.clipboard.writeText(translatedText);
            alert('Copied to clipboard!');
          }}
          className="btn-secondary w-full mt-2"
        >
          Copy Translation
        </button>
      )}
    </div>
  );
};

export default TranslationTool;
