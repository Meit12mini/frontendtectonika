
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">«Тектоника»</h3>
            <p className="text-gray-400">Тектоника - фундамент вашего будущего</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Контакты</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="tel:+79245056655" className="hover:text-amber-400">+7 (924) 505-66-55</a></li>
                          <li>г. Чита, ул.Трактовая, 7а</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Информация</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-amber-400">Политика конфиденциальности</a></li>
              <li><a href="#" className="hover:text-amber-400">Условия использования</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} ООО «Тектоника». Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
