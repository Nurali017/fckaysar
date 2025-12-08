/**
 * Mock data for FC Kaisar shop
 */

export interface Product {
  id: string;
  name: string;
  nameKz: string;
  nameEn: string;
  description: string;
  descriptionKz: string;
  descriptionEn: string;
  price: number; // Price in KZT (Tenge)
  originalPrice?: number; // Original price if on sale
  category: ProductCategory;
  image: string;
  sizes?: string[];
  isNew?: boolean;
  isSale?: boolean;
  inStock: boolean;
}

export type ProductCategory = 'jerseys' | 'training' | 'accessories' | 'kids';

export const categoryLabels: Record<ProductCategory, { ru: string; kk: string; en: string }> = {
  jerseys: { ru: 'Форма', kk: 'Форма', en: 'Jerseys' },
  training: { ru: 'Тренировочная', kk: 'Жаттығу', en: 'Training' },
  accessories: { ru: 'Аксессуары', kk: 'Аксессуарлар', en: 'Accessories' },
  kids: { ru: 'Детская', kk: 'Балаларға', en: 'Kids' },
};

// Generate placeholder image for products
const generateProductImage = (text: string, bgColor: string = '#DC2626'): string => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
      <rect width="400" height="500" fill="${bgColor}"/>
      <rect x="50" y="100" width="300" height="300" rx="20" fill="#1a1a1a" opacity="0.3"/>
      <text x="200" y="260" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle">${text}</text>
      <text x="200" y="320" font-family="Arial, sans-serif" font-size="16" fill="white" opacity="0.7" text-anchor="middle">FC KAISAR</text>
    </svg>
  `.trim();

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

export const mockProducts: Product[] = [
  // Jerseys
  {
    id: 'jersey-home-2025',
    name: 'Домашняя форма 2024/25',
    nameKz: 'Үй формасы 2024/25',
    nameEn: 'Home Jersey 2024/25',
    description: 'Официальная домашняя форма ФК Кайсар сезона 2024/25',
    descriptionKz: 'ФК Қайсар 2024/25 маусымының ресми үй формасы',
    descriptionEn: 'Official FC Kaisar home jersey for 2024/25 season',
    price: 25000,
    category: 'jerseys',
    image: generateProductImage('HOME', '#DC2626'),
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    isNew: true,
    inStock: true,
  },
  {
    id: 'jersey-away-2025',
    name: 'Гостевая форма 2024/25',
    nameKz: 'Қонақ формасы 2024/25',
    nameEn: 'Away Jersey 2024/25',
    description: 'Официальная гостевая форма ФК Кайсар сезона 2024/25',
    descriptionKz: 'ФК Қайсар 2024/25 маусымының ресми қонақ формасы',
    descriptionEn: 'Official FC Kaisar away jersey for 2024/25 season',
    price: 25000,
    category: 'jerseys',
    image: generateProductImage('AWAY', '#1F2937'),
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    isNew: true,
    inStock: true,
  },
  {
    id: 'jersey-gk-2025',
    name: 'Форма вратаря 2024/25',
    nameKz: 'Қақпашы формасы 2024/25',
    nameEn: 'Goalkeeper Jersey 2024/25',
    description: 'Официальная форма вратаря ФК Кайсар',
    descriptionKz: 'ФК Қайсар қақпашысының ресми формасы',
    descriptionEn: 'Official FC Kaisar goalkeeper jersey',
    price: 28000,
    category: 'jerseys',
    image: generateProductImage('GK', '#15803D'),
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
  },

  // Training
  {
    id: 'training-jacket',
    name: 'Тренировочная куртка',
    nameKz: 'Жаттығу күртесі',
    nameEn: 'Training Jacket',
    description: 'Легкая тренировочная куртка с символикой клуба',
    descriptionKz: 'Клуб символикасы бар жеңіл жаттығу күртесі',
    descriptionEn: 'Lightweight training jacket with club branding',
    price: 18000,
    originalPrice: 22000,
    category: 'training',
    image: generateProductImage('JKT', '#374151'),
    sizes: ['S', 'M', 'L', 'XL'],
    isSale: true,
    inStock: true,
  },
  {
    id: 'training-pants',
    name: 'Тренировочные штаны',
    nameKz: 'Жаттығу шалбары',
    nameEn: 'Training Pants',
    description: 'Удобные тренировочные штаны',
    descriptionKz: 'Ыңғайлы жаттығу шалбары',
    descriptionEn: 'Comfortable training pants',
    price: 12000,
    category: 'training',
    image: generateProductImage('PNT', '#1F2937'),
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
  },
  {
    id: 'training-tshirt',
    name: 'Тренировочная футболка',
    nameKz: 'Жаттығу футболкасы',
    nameEn: 'Training T-Shirt',
    description: 'Дышащая тренировочная футболка',
    descriptionKz: 'Тыныс алатын жаттығу футболкасы',
    descriptionEn: 'Breathable training t-shirt',
    price: 8000,
    category: 'training',
    image: generateProductImage('TEE', '#DC2626'),
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
  },

  // Accessories
  {
    id: 'scarf-official',
    name: 'Фанатский шарф',
    nameKz: 'Жанкүйер шарфы',
    nameEn: 'Fan Scarf',
    description: 'Официальный шарф болельщика ФК Кайсар',
    descriptionKz: 'ФК Қайсар жанкүйерінің ресми шарфы',
    descriptionEn: 'Official FC Kaisar fan scarf',
    price: 5000,
    category: 'accessories',
    image: generateProductImage('SCRF', '#DC2626'),
    isNew: true,
    inStock: true,
  },
  {
    id: 'cap-kaisar',
    name: 'Бейсболка FC Kaisar',
    nameKz: 'FC Kaisar бейсболкасы',
    nameEn: 'FC Kaisar Cap',
    description: 'Стильная бейсболка с логотипом клуба',
    descriptionKz: 'Клуб логотипі бар сәнді бейсболка',
    descriptionEn: 'Stylish cap with club logo',
    price: 4500,
    category: 'accessories',
    image: generateProductImage('CAP', '#1F2937'),
    inStock: true,
  },
  {
    id: 'ball-official',
    name: 'Футбольный мяч',
    nameKz: 'Футбол допы',
    nameEn: 'Football',
    description: 'Официальный мяч с символикой ФК Кайсар',
    descriptionKz: 'ФК Қайсар символикасы бар ресми доп',
    descriptionEn: 'Official ball with FC Kaisar branding',
    price: 15000,
    category: 'accessories',
    image: generateProductImage('BALL', '#374151'),
    inStock: true,
  },
  {
    id: 'backpack',
    name: 'Рюкзак FC Kaisar',
    nameKz: 'FC Kaisar рюкзагы',
    nameEn: 'FC Kaisar Backpack',
    description: 'Вместительный рюкзак с логотипом клуба',
    descriptionKz: 'Клуб логотипі бар сыйымды рюкзак',
    descriptionEn: 'Spacious backpack with club logo',
    price: 12000,
    originalPrice: 15000,
    category: 'accessories',
    image: generateProductImage('BAG', '#1F2937'),
    isSale: true,
    inStock: true,
  },

  // Kids
  {
    id: 'kids-jersey-home',
    name: 'Детская домашняя форма',
    nameKz: 'Балалар үй формасы',
    nameEn: 'Kids Home Jersey',
    description: 'Домашняя форма для юных болельщиков',
    descriptionKz: 'Жас жанкүйерлерге арналған үй формасы',
    descriptionEn: 'Home jersey for young fans',
    price: 18000,
    category: 'kids',
    image: generateProductImage('KIDS', '#DC2626'),
    sizes: ['6-8', '8-10', '10-12', '12-14'],
    isNew: true,
    inStock: true,
  },
  {
    id: 'kids-tshirt',
    name: 'Детская футболка',
    nameKz: 'Балалар футболкасы',
    nameEn: 'Kids T-Shirt',
    description: 'Удобная футболка для детей',
    descriptionKz: 'Балаларға арналған ыңғайлы футболка',
    descriptionEn: 'Comfortable t-shirt for kids',
    price: 6000,
    category: 'kids',
    image: generateProductImage('K-TEE', '#EF4444'),
    sizes: ['6-8', '8-10', '10-12', '12-14'],
    inStock: true,
  },
];

/**
 * Get products by category
 */
export const getProductsByCategory = (category: ProductCategory): Product[] => {
  return mockProducts.filter(product => product.category === category);
};

/**
 * Get featured products (new or on sale)
 */
export const getFeaturedProducts = (): Product[] => {
  return mockProducts.filter(product => product.isNew || product.isSale);
};

/**
 * Get product by ID
 */
export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(product => product.id === id);
};

/**
 * Format price in Tenge
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-KZ', {
    style: 'currency',
    currency: 'KZT',
    maximumFractionDigits: 0,
  }).format(price);
};
