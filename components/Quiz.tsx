import React, { useState, useCallback } from 'react';

import { QUIZ_QUESTIONS } from '../constants';
import type { Answers, QuizQuestion, QuizOption, GeminiResponse } from '../types';
import ProgressBar from './ProgressBar';
import Summary from './Summary';
import { processLead } from '../services/geminiService';

// Один шаг квиза
const QuizStep: React.FC<{ question: QuizQuestion; onAnswer: (answer: string) => void }> = ({ question, onAnswer }) => {
  const getOptionClass = (type: string) => {
    switch(type) {
      case 'icon': return "flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer hover:border-amber-500 hover:bg-amber-50 h-32";
      case 'image': return "relative border-2 rounded-lg cursor-pointer overflow-hidden group";
      default: return "w-full text-left p-4 border-2 rounded-lg cursor-pointer hover:border-amber-500 hover:bg-amber-50";
    }
  };

  const renderOption = (option: QuizOption) => {
    switch (question.type) {
      case 'icon': return <><div className="text-amber-600 mb-2">{option.icon}</div><span className="font-semibold text-center">{option.text}</span></>;
      case 'image': return <img src={option.image} alt={option.text} className="w-full h-32 object-cover"/>;
      default: return <span>{option.text}</span>;
    }
  };

  const gridClass = question.type === 'icon' ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2';

  return (
    <div className="w-full">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{question.question}</h2>
      <div className={`grid ${gridClass} gap-4`}>
        {question.options.map((option, idx) => (
          <div key={idx} className={getOptionClass(question.type)} onClick={() => onAnswer(option.text)}>
            {renderOption(option)}
          </div>
        ))}
      </div>
    </div>
  );
};

// Финальный шаг — ввод телефона
const FinalStep: React.FC<{ onSubmit: (phone: string) => void }> = ({ onSubmit }) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
    if (phoneRegex.test(phone)) {
      setError('');
      onSubmit(phone);
    } else setError('Введите корректный номер телефона.');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, '');
    if (input.startsWith('7') || input.startsWith('8')) input = input.substring(1);
    let formatted = '+7 (';
    if (input.length >= 1) formatted += input.substring(0,3);
    if (input.length >= 4) formatted += ') ' + input.substring(3,6);
    if (input.length >= 7) formatted += '-' + input.substring(6,8);
    if (input.length >= 9) formatted += '-' + input.substring(8,10);
    setPhone(formatted);
  };

  return (
    <form onSubmit={handleSubmit} className="text-center max-w-lg mx-auto">
      <input type="tel" value={phone} onChange={handlePhoneChange} placeholder="+7 (___) ___-__-__"
        className="w-full p-4 border-2 rounded-lg mb-4 text-center text-lg focus:outline-none focus:border-amber-500"
        maxLength={18} />
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-lg">ПОЛУЧИТЬ РАСЧЕТ</button>
    </form>
  );
};

// Главный компонент квиза
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
const Quiz: React.FC = () => {
  
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Answers>({});
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [geminiResult, setGeminiResult] = useState<GeminiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = QUIZ_QUESTIONS.length;

  const handleAnswer = useCallback((answer: string) => {
    setAnswers(prev => ({ ...prev, [step]: answer }));
    setStep(s => s + 1);
  }, [step]);

  const handleBack = () => { if (step > 1) setStep(s => s - 1); };
  const { executeRecaptcha } = useGoogleReCaptcha();
  // наверху файла можно (по желанию) завести константы
const VERIFY_URL = "https://backendtectonika.onrender.com/api/lead";
const VERIF = "https://backendtectonika.onrender.com/api/verify-captcha";

// ^^^ замените на ваш реальный эндпоинт для приёма данных.
// Если отдельного эндпоинта пока нет — временно поставьте сюда тот же VERIFY_URL и передавайте token ещё раз.

const handleSubmit = async (phone: string) => {
  if (!executeRecaptcha) {
    setError("reCAPTCHA не инициализирована");
    return;
  }

  setIsLoading(true);
  setError(null);

  try {
    // 1) Получаем токен
    const token = await executeRecaptcha("quiz_submit");
    if (!token) throw new Error("Не удалось получить токен reCAPTCHA");

    // 2) Проверяем токен на сервере (только { token })
    const verifyRes = await fetch(VERIF, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const verifyData = await verifyRes.json();

    if (!verifyRes.ok || !verifyData.success) {
      throw new Error(verifyData.error || "Проверка reCAPTCHA не пройдена");
    }

    // 3) Капча пройдена — теперь обрабатываем лид
    const result = await processLead(answers, phone);
    setGeminiResult(result);

    // 4) Отправляем данные формы на ваш эндпоинт сохранения
    const submitRes = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result), // здесь уже без token, если вашему бэку он не нужен
    });

    if (!submitRes.ok) {
      const data = await submitRes.json().catch(() => ({}));
      throw new Error(data.error || "Ошибка отправки данных");
    }

    setIsFinished(true);

  } catch (err: any) {
    setError(err.message || "Произошла неизвестная ошибка.");
    setIsFinished(true);
  } finally {
    setIsLoading(false);
  }
};

  const currentQuestion = QUIZ_QUESTIONS[step - 1];

  return (
    <section className="bg-gray-50 py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl min-h-[500px] flex flex-col justify-center items-center">
          {isFinished ? (
            <Summary isLoading={isLoading} error={error} result={geminiResult} />
          ) : (
            <>
              <ProgressBar currentStep={step} totalSteps={totalSteps + 1} />
              {step > 1 && step <= totalSteps + 1 && (
                <button onClick={handleBack} className="self-start mb-4 text-gray-600 hover:text-gray-900">Назад</button>
              )}
              <div className="w-full flex-grow flex items-center">
                {currentQuestion ? (
                  <QuizStep question={currentQuestion} onAnswer={handleAnswer} />
                ) : (
                  <FinalStep onSubmit={handleSubmit} />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Quiz;