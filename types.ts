
export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
  type: 'icon' | 'text' | 'image';
}

export interface QuizOption {
  text: string;
  icon?: React.ReactNode;
  image?: string;
  tooltip?: string;
}

export interface Answers {
  [key: number]: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface GeminiResponse {
  leadStatus: '🔥 ГОРЯЧИЙ' | '👍 ТЕПЛЫЙ' | '❄️ ХОЛОДНЫЙ';
  telegramMessage: string;
  clientMessage: string;
  googleSheetRow: string[];
}
