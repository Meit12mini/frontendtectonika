
import React, { useState } from 'react';
import { FAQ_ITEMS } from '../constants';
import Icon from './Icon';

interface FaqItemProps {
  question: string;
  answer: string;
}

const FaqItemComponent: React.FC<FaqItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left"
      >
        <h3 className="text-lg font-medium text-gray-900">{question}</h3>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <Icon type="chevron-down" />
        </span>
      </button>
      <div
        className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
             <p className="mt-2 text-gray-600">{answer}</p>
        </div>
      </div>
    </div>
  );
};

const Faq: React.FC = () => {
  return (
    <section className="bg-gray-50 py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Часто Задаваемые Вопросы</h2>
          <p className="mt-4 text-lg text-gray-600">Ответы на популярные вопросы о строительстве с нами</p>
        </div>
        <div>
          {FAQ_ITEMS.map((item, index) => (
            <FaqItemComponent key={index} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
