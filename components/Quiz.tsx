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
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [status, setStatus] = useState("");

  const handleSubmit = async () => {
    if (!executeRecaptcha) return;

    setStatus("Получаем токен...");
    const token = await executeRecaptcha("quiz_submit");

    const res = await fetch("https://backendtectonika.onrender.com/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const data = await res.json();
    setStatus(data.success ? "reCAPTCHA пройдена!" : `Ошибка: ${data.error}`);
  };

  return (
    <div>
      <button onClick={handleSubmit}>Отправить квиз</button>
      <p>{status}</p>
    </div>
  );
};

export default Quiz;