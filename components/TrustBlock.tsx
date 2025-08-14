
import React from 'react';
import Icon from './Icon';

const TrustItem: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="flex flex-col items-center text-center p-4">
        <div className="bg-amber-100 text-amber-600 rounded-full p-4 mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

const TrustBlock: React.FC = () => {
    return (
        <section className="bg-white py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <TrustItem
                        icon={<Icon type="price" />}
                        title="Честная цена"
                        description="Фиксируем стоимость в договоре. Никаких скрытых платежей и доплат."
                    />
                    <TrustItem
                        icon={<Icon type="experience" />}
                        title="Опыт 10+ лет"
                        description="Построили более 150 домов. Знаем все тонкости и нюансы строительства."
                    />
                    <TrustItem
                        icon={<Icon type="guarantee" />}
                        title="Гарантия 5 лет"
                        description="Даем официальную гарантию на все выполненные работы и материалы."
                    />
                </div>
            </div>
        </section>
    );
};

export default TrustBlock;
