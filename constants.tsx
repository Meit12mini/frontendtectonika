
import React from 'react';
import type { QuizQuestion, FaqItem } from './types';
import Icon from './components/Icon';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Для кого вы планируете строить?",
    type: 'icon',
    options: [
      { text: "Для себя", icon: <Icon type="user" /> },
      { text: "Для семьи", icon: <Icon type="family" /> },
      { text: "Для продажи", icon: <Icon type="sale" /> },
      { text: "Для родителей", icon: <Icon type="parents" /> },
    ],
  },
  {
    id: 2,
    question: "У вас уже есть земельный участок?",
    type: 'text',
    options: [
      { text: "Да, есть в собственности" },
      { text: "Нахожусь в процессе покупки" },
      { text: "Нет, нужна помощь с подбором" },
    ],
  },
  {
    id: 3,
    question: "Какой примерной площади дом вам нужен?",
    type: 'text',
    options: [
      { text: "До 100 м²" },
      { text: "100-150 м²" },
      { text: "150-200 м²" },
      { text: "Более 200 м²" },
    ],
  },
  {
    id: 4,
    question: "Из какого материала предпочитаете строить?",
    type: 'image',
    options: [
      { text: "Газобетон", image: "https://picsum.photos/id/106/400/300", tooltip: "Теплый и доступный материал" },
      { text: "Кирпич", image: "https://picsum.photos/id/107/400/300", tooltip: "Надежность и долговечность" },
      { text: "Каркасный дом", image: "https://picsum.photos/id/108/400/300", tooltip: "Быстрое и экономичное строительство" },
      { text: "Клееный брус", image: "https://picsum.photos/id/109/400/300", tooltip: "Экологичность и эстетика" },
    ],
  },
  {
    id: 5,
    question: "На какой ориентировочный бюджет рассчитываете?",
    type: 'text',
    options: [
      { text: "До 3 млн ₽" },
      { text: "3-5 млн ₽" },
      { text: "5-8 млн ₽" },
      { text: "Более 8 млн ₽" },
    ],
  },
  {
    id: 6,
    question: "Когда планируете начать строительство?",
    type: 'text',
    options: [
      { text: "В ближайший месяц" },
      { text: "В течение 3-6 месяцев" },
      { text: "В следующем году" },
      { text: "Пока не определился" },
    ],
  },
];

export const GALLERY_IMAGES = [
  "/public/project_img/photo_2025-08-17_14-55-07.webp",
  "/public/project_img/photo_2025-08-17_14-55-24.webp",
  "/public/project_img/photo_2025-08-17_14-55-29.webp",
  "/public/project_img/photo_2025-08-17_14-55-34.webp",
  "/public/project_img/photo_2025-08-17_14-55-38.webp",
  "/public/project_img/photo_2025-08-17_14-55-41.webp",
  "/public/project_img/photo_2025-08-17_14-55-45.webp",
  "/public/project_img/photo_2025-08-17_14-55-53.webp",
];

export const FAQ_ITEMS: FaqItem[] = [
    {
        question: "Сколько времени занимает строительство дома?",
        answer: "В среднем, строительство дома из газобетона занимает от 4 до 6 месяцев, в зависимости от сложности проекта и погодных условий. Каркасные дома строятся быстрее, около 2-3 месяцев."
    },
    {
        question: "Входит ли в стоимость проектирование?",
        answer: "Да, при заказе строительства у нас, мы предоставляем типовой проект бесплатно. Если вам нужен индивидуальный проект, его стоимость рассчитывается отдельно, но вы получаете на него скидку."
    },
    {
        question: "Даете ли вы гарантию на свои работы?",
        answer: "Безусловно. Мы предоставляем комплексную гарантию на все виды работ до 5 лет. Все гарантийные обязательства прописываются в договоре."
    },
    {
        question: "Можно ли использовать материнский капитал?",
        answer: "Да, мы работаем с материнским капиталом, а также помогаем с оформлением ипотеки на строительство. Наши специалисты проконсультируют вас по всем вопросам."
    }
];
