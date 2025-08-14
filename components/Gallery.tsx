
import React from 'react';
import { GALLERY_IMAGES } from '../constants';

const Gallery: React.FC = () => {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Наша Галерея Работ</h2>
          <p className="mt-4 text-lg text-gray-600">Посмотрите на дома, которые мы уже построили</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {GALLERY_IMAGES.map((src, index) => (
            <div key={index} className="group relative overflow-hidden rounded-lg shadow-lg">
              <img 
                src={src} 
                alt={`Готовый объект ${index + 1}`} 
                className="w-full h-64 object-cover transform transition-transform duration-500 ease-in-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
