
import React, { useEffect } from "react";
import type { GeminiResponse } from "../types";
import Icon from "./Icon";

interface SummaryProps {
    isLoading: boolean;
    error: string | null;
    result: GeminiResponse | null;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center">
        <svg className="animate-spin -ml-1 mr-3 h-12 w-12 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none"
             viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h2 className="text-2xl font-bold mt-4">Обрабатываем вашу заявку...</h2>
        <p className="text-gray-600 mt-2">Наш искусственный интеллект анализирует ваши ответы.</p>
    </div>
);

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center text-red-600">
        <h2 className="text-2xl font-bold mb-4">Произошла ошибка</h2>
        <p>{message}</p>
        <p className="mt-2 text-sm text-gray-500">Пожалуйста, попробуйте обновить страницу и отправить форму еще раз.</p>
    </div>
);

const SuccessDisplay: React.FC<{ result: GeminiResponse }> = ({ result }) => {
    useEffect(() => {
        // Яндекс Метрика
        if (typeof window !== "undefined" && (window as any).ym) {
            (window as any).ym(103774008, "reachGoal", "quiz_finished");
        }

        // Google Analytics 4 (если подключен через gtag)
        if (typeof window !== "undefined" && (window as any).gtag) {
            (window as any).gtag("event", "quiz_finished", {
                event_category: "quiz",
                event_label: "Форма успешно отправлена",
            });
        }
    }, []);

    return (
    <div className="text-center max-w-2xl mx-auto">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
             <Icon type="check" className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Спасибо! Ваша заявка принята!</h2>
        <p className="text-lg text-gray-600 mt-2">Мы уже начали готовить для вас расчет. Скоро с вами свяжемся!</p>

       
    </div>
);
};

const Summary: React.FC<SummaryProps> = ({ isLoading, error, result }) => {
    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorDisplay message={error} />;
    }

    if (result) {
        return <SuccessDisplay result={result} />;
    }

    return null;
};

export default Summary;
