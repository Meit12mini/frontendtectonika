
import React from 'react';
import Icon from './Icon';

interface HeroProps {
  scrollToQuiz: () => void;
}

const Hero: React.FC<HeroProps> = ({ scrollToQuiz }) => {
  return (
    <div className="relative h-screen min-h-[600px] flex items-center justify-center text-white text-center px-4">
      <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
      <img 
        src="/images/photo_2025-08-17_23-19-30.webp" 
        alt="Красивый загородный дом" 
        className="absolute inset-0 w-full h-full object-cover object-right 2xl:object-left "
      />
      <div className="relative z-20 max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 shadow-lg">
          Строительство домов в Чите по честной цене — <br/> от 35 000 ₽ за м²
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mb-8 font-light sm:m-0">
          Пройдите тест за 3 минуты и получите точную смету, каталог проектов!
        </p>
            <div class="arrow 2xl:h-32 sm:h-16">
        <span class='sm:max-w-6 sm:max-h-6'></span>
        <span class='sm:max-w-6 sm:max-h-6'></span>
        <span class='sm:max-w-6 sm:max-h-6'></span>
    </div>

        <button
          onClick={scrollToQuiz}
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-xl flex items-center gap-2"
        >
          <Icon type="calculator" />
          РАССЧИТАТЬ СТОИМОСТЬ
        </button>
      </div>
    </div>
  );
};

export default Hero;
