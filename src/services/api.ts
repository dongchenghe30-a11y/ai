import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// 直接使用后端 URL，不使用环境变量
const API_BASE_URL = 'https://ai-resume-builder.dongchenghe30.workers.dev';

export interface AIAnalysisRequest {
  jobDescription: string;
  currentResume?: string;
}

export interface AIAnalysisResponse {
  keywords: Array<{
    keyword: string;
    category: string;
    importance: 'high' | 'medium' | 'low';
    suggestion: string;
  }>;
  suggestions: string[];
  summary: string;
}

export interface ExperienceGenerationRequest {
  jobTitle: string;
  company: string;
  keyPoints: string[];
}

export interface ExperienceGenerationResponse {
  description: string;
  improvements: string[];
}

export interface TranslationRequest {
  text: string;
  sourceLang: 'en' | 'zh';
  targetLang: 'en' | 'zh';
}

export interface TranslationResponse {
  translatedText: string;
}

// 构建完整 URL 的辅助函数
const buildUrl = (path: string): string => {
  // 去除 path 的前导斜杠，避免双斜杠
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${API_BASE_URL}/${cleanPath}`;
};

export const api = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30秒超时
});

// 添加日志以便调试
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  console.log('API Request:', config.baseURL + config.url, config.data);
  return config;
});

// 响应拦截器 - 统一错误处理
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    console.error('API Error:', error.message, error.config?.url);

    // 404 错误特殊处理
    if (error.response?.status === 404) {
      console.error('API endpoint not found:', error.config?.url);
      return Promise.reject(new Error('API endpoint not found. Please check the API URL configuration.'));
    }

    // 网络错误
    if (!error.response) {
      console.error('Network error or timeout');
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    return Promise.reject(error);
  }
);

// 请求重试函数 - 改进版
const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  let lastError: Error | undefined;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      const axiosError = error as AxiosError;
      console.warn(`Retry ${i + 1}/${maxRetries} failed:`, error);

      // 对于 4xx 错误（客户端错误），不重试
      if (axiosError.response?.status && axiosError.response.status >= 400 && axiosError.response.status < 500) {
        console.error('Client error, not retrying:', axiosError.response.status);
        throw error; // 直接抛出，不重试
      }

      // 对于 5xx 错误（服务器错误）或网络错误，重试
      if (i === maxRetries - 1) {
        break;
      }

      // 指数退避
      const waitTime = delay * Math.pow(2, i);
      console.log(`Waiting ${waitTime}ms before retry ${i + 2}...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw lastError || new Error('Request failed after retries');
};

export const aiApi = {
  analyzeJobDescription: async (data: AIAnalysisRequest): Promise<AIAnalysisResponse> => {
    const response = await withRetry(() =>
      api.post(buildUrl('api/ai/analyze'), data)
    );
    return response.data;
  },

  generateExperience: async (data: ExperienceGenerationRequest): Promise<ExperienceGenerationResponse> => {
    const response = await withRetry(() =>
      api.post(buildUrl('api/ai/generate-experience'), data)
    );
    return response.data;
  },

  translateText: async (data: TranslationRequest): Promise<TranslationResponse> => {
    const response = await withRetry(() =>
      api.post(buildUrl('api/ai/translate'), data)
    );
    return response.data;
  },

  optimizeResume: async (resumeData: any): Promise<any> => {
    const response = await withRetry(() =>
      api.post(buildUrl('api/ai/optimize'), resumeData)
    );
    return response.data;
  },
};
