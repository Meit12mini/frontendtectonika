// src/services/geminiService.ts
import type { Answers, GeminiResponse } from '../types';

export const processLead = async (answers: Answers, phone: string): Promise<GeminiResponse> => {
  try {
    const response = await fetch('https://tektonika-server-developer.site/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, phone })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Ошибка сервера');
    }

    const data = await response.json();
    return data as GeminiResponse;

  } catch (error: any) {
    console.error('Ошибка при отправке заявки на бэк:', error);
    throw new Error(error.message || 'Не удалось обработать заявку');
  }
};


