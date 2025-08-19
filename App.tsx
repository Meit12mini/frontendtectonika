
import React, { useRef } from 'react';
import Hero from './components/Hero';
import TrustBlock from './components/TrustBlock';
import Quiz from './components/Quiz';
import Gallery from './components/Gallery';
import Faq from './components/Faq';
import Footer from './components/Footer';

declare const ym: (
  counterId: number,
  method: string,
  goalName: string,
  params?: any
) => void;

const App: React.FC = () => {
  const quizRef = useRef<HTMLDivElement>(null);

  const scrollToQuiz = () => {
     if (typeof ym !== 'undefined') { // Проверка, что Метрика загружена
    ym(103774008, 'reachGoal', 'quiz_start');
  }
    quizRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Hero scrollToQuiz={scrollToQuiz} />
        <TrustBlock />
        <div id="quiz-section" ref={quizRef}>
          <Quiz />
        </div>
        <Gallery />
        <Faq />
      </main>
      <Footer />
    </div>
  );
};

export default App;
