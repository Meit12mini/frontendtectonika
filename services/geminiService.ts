// src/services/geminiService.ts
import type { Answers, GeminiResponse } from '../types';

export const processLead = async (answers: Answers, phone: string): Promise<GeminiResponse> => {
  try {
    const response = await fetch('https://backendtectonika.onrender.com/api/lead', {
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


// import { GoogleGenAI, Type } from "@google/genai";
// import type { Answers, GeminiResponse } from '../types';

// const responseSchema = {
//     type: Type.OBJECT,
//     properties: {
//         leadStatus: {
//             type: Type.STRING,
//             description: "Статус лида: '🔥 ГОРЯЧИЙ', '👍 ТЕПЛЫЙ', или '❄️ ХОЛОДНЫЙ'",
//             enum: ['🔥 ГОРЯЧИЙ', '👍 ТЕПЛЫЙ', '❄️ ХОЛОДНЫЙ'],
//         },
//         telegramMessage: {
//             type: Type.STRING,
//             description: "Отформатированное сообщение для Telegram-чата отдела продаж. Должно включать все ответы на квиз и присвоенный статус.",
//         },
//         clientMessage: {
//             type: Type.STRING,
//             description: "Автоматическое сообщение для клиента в WhatsApp в зависимости от статуса.",
//         },
//         googleSheetRow: {
//             type: Type.ARRAY,
//             items: { type: Type.STRING },
//             description: "Массив строк для записи в Google Sheets: [Дата, Телефон, Статус, Ответ1, Ответ2, ..., UTM Source]",
//         },
//     },
//     required: ["leadStatus", "telegramMessage", "clientMessage", "googleSheetRow"],
// };

// const getSystemInstruction = () => {
//   return `Ты — ИИ-ассистент строительной компании «Тектоника». Твоя задача — обработать новую заявку с квиз-сайта.

//   Вот твои шаги:
//   1.  **Проанализируй ответы**: Внимательно изучи ответы клиента на вопросы о бюджете и сроках.
//   2.  **Квалифицируй лида**:
//       *   Присвой статус "🔥 ГОРЯЧИЙ", если бюджет > 5 млн ₽ ИЛИ сроки "В ближайший месяц".
//       *   Присвой статус "👍 ТЕПЛЫЙ", если бюджет средний (3-5 млн ₽) ИЛИ сроки средние (3-6 месяцев).
//       *   Присвой статус "❄️ ХОЛОДНЫЙ" во всех остальных случаях.
//   3.  **Сформируй сообщение для Telegram**: Создай четкое, хорошо отформатированное сообщение для внутреннего чата "Новые Заявки | Тектоника". Оно должно содержать статус лида и все ответы клиента. Используй Markdown для форматирования.
//   4.  **Сгенерируй сообщение для клиента**:
//       *   Для "🔥 ГОРЯЧИЙ": "Здравствуйте! Ваша заявка получила VIP-статус. Наш лучший специалист уже изучает ваши ответы и свяжется с вами в течение 15 минут для детального обсуждения проекта. Ваш персональный каталог и скидка уже формируются! С уважением, команда «Тектоника»."
//       *   Для "👍 ТЕПЛЫЙ" и "❄️ ХОЛОДНЫЙ": "Здравствуйте! Мы получили вашу заявку, спасибо за интерес к нашей компании! Наш менеджер свяжется с вами в ближайшее рабочее время для консультации. А пока мы готовим для вас смету и каталог проектов. С уважением, команда «Тектоника»."
//   5.  **Подготовь данные для Google Sheets**: Сформируй массив строк для записи в таблицу.
  
//   Выходные данные должны быть строго в формате JSON согласно предоставленной схеме.`;
// };


// export const processLead = async (answers: Answers, phone: string): Promise<GeminiResponse> => {
//     if (!process.env.API_KEY) {
//       throw new Error("API_KEY environment variable is not set.");
//     }
//     const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

//     const prompt = `
//     Новая заявка на расчет стоимости дома.
//     Данные клиента:
//     - Телефон: ${phone}
//     - UTM-метки: (не указаны)

//     Ответы на квиз:
//     1. Для кого строить: ${answers[1]}
//     2. Наличие участка: ${answers[2]}
//     3. Площадь дома: ${answers[3]}
//     4. Материал стен: ${answers[4]}
//     5. Бюджет: ${answers[5]}
//     6. Сроки начала строительства: ${answers[6]}

//     Обработай эту заявку согласно инструкциям.
//     `;

//     try {
//         const response = await ai.models.generateContent({
//             model: "gemini-2.5-flash",
//             contents: prompt,
//             config: {
//                 systemInstruction: getSystemInstruction(),
//                 responseMimeType: "application/json",
//                 responseSchema: responseSchema,
//             },
//         });

//         const jsonText = response.text.trim();
//         const result = JSON.parse(jsonText) as GeminiResponse;
//         return result;

//     } catch (error) {
//         console.error("Error processing lead with Gemini:", error);
//         throw new Error("Не удалось обработать заявку. Пожалуйста, попробуйте еще раз.");
//     }
// };