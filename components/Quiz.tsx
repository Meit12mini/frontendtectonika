
import React, { useState, useCallback } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import type { Answers, QuizQuestion, QuizOption, GeminiResponse } from '../types';
import ProgressBar from './ProgressBar';
import Summary from './Summary';
import { processLead } from '../services/geminiService';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const QuizStep: React.FC<{ question: QuizQuestion; onAnswer: (answer: string) => void }> = ({ question, onAnswer }) => {
  
  const getOptionClass = (type: string) => {
    switch(type) {
      case 'icon':
        return "flex flex-col items-center justify-center p-4 md:p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:border-amber-500 hover:bg-amber-50 hover:shadow-md h-32 md:h-40";
      case 'image':
        return "relative border-2 rounded-lg cursor-pointer transition-all duration-200 hover:border-amber-500 hover:shadow-md overflow-hidden group";
      case 'text':
      default:
        return "w-full text-left p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:border-amber-500 hover:bg-amber-50";
    }
  };

  const renderOption = (option: QuizOption) => {
    switch (question.type) {
      case 'icon':
        return (
          <>
            <div className="text-amber-600 mb-2">{option.icon}</div>
            <span className="font-semibold text-center">{option.text}</span>
          </>
        );
      case 'image':
        return (
          <>
            <img src={option.image} alt={option.text} className="w-full h-32 md:h-40 object-cover transform group-hover:scale-110 transition-transform duration-300"/>
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white p-2">
              <span className="font-bold text-lg">{option.text}</span>
              {option.tooltip && <span className="text-xs text-center hidden md:block mt-1">{option.tooltip}</span>}
            </div>
          </>
        );
      default:
        return <span className="font-medium">{option.text}</span>;
    }
  };

  const gridClass = question.type === 'icon' ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2';

  return (
    <div className="w-full">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{question.question}</h2>
      <div className={`grid ${gridClass} gap-4`}>
        {question.options.map((option, index) => (
          <div key={index} className={getOptionClass(question.type)} onClick={() => onAnswer(option.text)}>
            {renderOption(option)}
          </div>
        ))}
      </div>
    </div>
  );
};

const FinalStep: React.FC<{ onSubmit: (phone: string) => void }> = ({ onSubmit }) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
    if (phoneRegex.test(phone)) {
      setError('');
      onSubmit(phone);
    } else {
      setError('Пожалуйста, введите корректный номер телефона.');
    }
  };
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, '');
    if (input.startsWith('7') || input.startsWith('8')) {
        input = input.substring(1);
    }
    let formattedPhone = '+7 (';
    if (input.length > 0) {
        formattedPhone += input.substring(0, 3);
    }
    if (input.length >= 4) {
        formattedPhone += ') ' + input.substring(3, 6);
    }
    if (input.length >= 7) {
        formattedPhone += '-' + input.substring(6, 8);
    }
    if (input.length >= 9) {
        formattedPhone += '-' + input.substring(8, 10);
    }
    setPhone(formattedPhone);
  };


  return (
    <div className="text-center max-w-lg mx-auto">
      <h2 className="text-3xl font-bold mb-2">Отлично! Ваш расчет почти готов!</h2>
      <p className="text-gray-600 mb-6">Оставьте ваш номер телефона, и мы отправим вам в WhatsApp/Telegram точную смету, каталог и скидку.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="tel"
          value={phone}
          onChange={handlePhoneChange}
          placeholder="+7 (___) ___-__-__"
          className="w-full p-4 border-2 rounded-lg mb-4 text-center text-lg focus:outline-none focus:border-amber-500"
          maxLength={18}
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          ПОЛУЧИТЬ РАСЧЕТ И ПОДАРКИ
        </button>
      </form>
      <p className="text-xs text-gray-500 mt-4">
        Нажимая на кнопку, вы даете согласие на обработку персональных данных и соглашаетесь с нашей <a href="#" className="underline">политикой конфиденциальности</a>.
      </p>
    </div>
  );
};


const Quiz: React.FC = () => {
  const {executeRecaptcha } = useGoogleReCaptcha();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Answers>({});
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [geminiResult, setGeminiResult] = useState<GeminiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = QUIZ_QUESTIONS.length;

  const handleAnswer = useCallback((answer: string) => {
    setAnswers(prev => ({ ...prev, [step]: answer }));
    if (step < totalSteps) {
      setStep(s => s + 1);
    } else {
      setStep(s => s + 1); // Move to final step
    }
  }, [step, totalSteps]);

  const handleBack = () => {
    if (step > 1) {
      setStep(s => s - 1);
    }
  };

//   const handleSubmit = async (phone: string) => {
//   setIsLoading(true);
//   setError(null);
//   try {
//     // 1. Обработка квиза через Gemini (AI)
//     const result = await processLead(answers, phone);
//     setGeminiResult(result);

//     // 2. Отправка на твой backend
//     const recaptchaToken = await executeRecaptcha("quiz_submit"); // если используешь reCAPTCHA v3
//     const res = await fetch("http://localhost:3001/api/lead", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ ...result, token: recaptchaToken })
//     });

//     if (!res.ok) {
//       const errorData = await res.json();
//       throw new Error(errorData.error || "Ошибка отправки на сервер");
//     }

//   } catch (err: any) {
//     setError(err.message || "Произошла неизвестная ошибка.");
//   } finally {
//     setIsLoading(false);
//     setIsFinished(true);
//   }
// };

const handleSubmit = async (phone: string) => {
  setIsLoading(true);
  setError(null);

  try {
    // Симуляция ответа от бэка
    const fakeResult: GeminiResponse = {
      leadStatus: "🔥 ГОРЯЧИЙ",
      telegramMessage: "Тестовое сообщение для Telegram",
      clientMessage: "Тестовое сообщение для клиента",
      googleSheetRow: ["Дата", phone, "🔥 ГОРЯЧИЙ", "Ответ1", "Ответ2", "Ответ3", "Ответ4", "Ответ5", "Ответ6", "UTM"]
    };

    setGeminiResult(fakeResult);

    // Тестовый fetch на бэк (можно закомментировать, если бэк ещё не работает)
    /*
    const token = await executeRecaptcha("quiz_submit");
    await fetch("http://localhost:3001/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...fakeResult, token })
    });
    */

  } catch (err: any) {
    setError(err.message || "Произошла неизвестная ошибка.");
  } finally {
    setIsLoading(false);
    setIsFinished(true);
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
                  <button onClick={handleBack} className="self-start mb-4 text-gray-600 hover:text-gray-900 flex items-center gap-2">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                     Назад
                  </button>
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
