export interface MenuItem {
  id: string;
  name: string;
  category: 'entradas' | 'parrilla' | 'especiales' | 'antojitos' | 'bebidas' | 'postres';
  description: string;
  price: number;
  image: string;
  badge?: string;
  spicyLevel?: number; // 0 to 3
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  rating: number;
  reviewsCount: number;
  prepTime: string;
  ingredients: string[];
}

export const CATEGORIES = [
  { id: 'todos', label: 'Todo el Menú', icon: 'Utensils' },
  { id: 'especiales', label: 'Especialidades', icon: 'Sparkles' },
  { id: 'entradas', label: 'Entradas & Tapas', icon: 'Soup' },
  { id: 'parrilla', label: 'Parrilla & Fuertes', icon: 'Flame' },
  { id: 'antojitos', label: 'Antojitos & Tacos', icon: 'Sandwich' },
  { id: 'bebidas', label: 'Cócteles & Bebidas', icon: 'Wine' },
  { id: 'postres', label: 'Postres Caseros', icon: 'Cake' },
] as const;

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'churrasco-patio',
    name: 'Churrasco al Carbón El Patio',
    category: 'parrilla',
    description: 'Corte fino de 350g asado a la leña, bañado en chimichurri rústico de la casa, servido con papas criollas doradas y ensalada fresca de aguacate.',
    price: 24.50,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    badge: 'Estrella de la Casa',
    rating: 4.9,
    reviewsCount: 142,
    prepTime: '20-25 min',
    ingredients: ['Corte selecto de res', 'Chimichurri de hierbas frescas', 'Papas criollas', 'Aguacate hass', 'Sal marina gruesa']
  },
  {
    id: 'ceviche-tropical',
    name: 'Ceviche Mixto del Patio',
    category: 'entradas',
    description: 'Corvina fresca y camarones marinados en leche de tigre de maracuyá, cebolla morada crujiente, maíz chulpe y chips de plátano verde.',
    price: 15.00,
    image: 'https://images.unsplash.com/photo-1535400255456-984241443b29?auto=format&fit=crop&w=800&q=80',
    badge: 'Frescura Máxima',
    rating: 4.8,
    reviewsCount: 98,
    isGlutenFree: true,
    prepTime: '12-15 min',
    ingredients: ['Corvina fresca', 'Camarón', 'Maracuyá', 'Lima', 'Cebolla morada', 'Plátano verde']
  },
  {
    id: 'costillas-tamarindo',
    name: 'Costillitas Glaseadas al Tamarindo',
    category: 'parrilla',
    description: 'Costillas de cerdo cocinadas lentamente por 6 horas, terminadas al fuego con glaseado agridulce de tamarindo artesanal y sésamo tostado.',
    price: 21.00,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 88,
    prepTime: '20 min',
    ingredients: ['Costillas baby back', 'Reducción de tamarindo y panela', 'Cebollín', 'Semillas de sésamo']
  },
  {
    id: 'tacos-birria',
    name: 'Tacos de Birria con Consomé',
    category: 'antojitos',
    description: 'Tres tacos en tortilla de maíz dorada al comal con queso fundido, carne jugosa cocida a fuego lento por 8 horas, cilantro, cebolla y consomé hirviendo para sopear.',
    price: 14.50,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    badge: 'Más Vendido',
    spicyLevel: 1,
    rating: 5.0,
    reviewsCount: 230,
    prepTime: '15 min',
    ingredients: ['Res deshebrada marinada', 'Tortilla de maíz nixtamalizado', 'Queso Oaxaca fundido', 'Consomé especiado', 'Cilantro']
  },
  {
    id: 'empanadas-artesanales',
    name: 'Dúo de Empanadas Crujientes',
    category: 'entradas',
    description: 'Masa de maíz crujiente rellena de carne mechada sazonada y papa criolla, acompañadas de ají casero picantito y salsa de suero costeño.',
    price: 8.50,
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewsCount: 76,
    isGlutenFree: true,
    prepTime: '10 min',
    ingredients: ['Masa de maíz', 'Carne tierna especiada', 'Ají de la casa', 'Limón']
  },
  {
    id: 'arroz-marinero',
    name: 'Cazuela Marinera del Caribe',
    category: 'especiales',
    description: 'Langostinos, calamares, mejillones y pulpo en salsa cremosa de leche de coco y pimientos asados, servido con arroz con coco y patacones crocantes.',
    price: 26.00,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    badge: 'Plato Insignia',
    rating: 4.9,
    reviewsCount: 165,
    isGlutenFree: true,
    prepTime: '25 min',
    ingredients: ['Langostinos frescos', 'Mejillones', 'Calamares', 'Leche de coco natural', 'Patacones', 'Achiote']
  },
  {
    id: 'mojito-maracuya',
    name: 'Mojito Patio Tropical (Maracuyá & Menta)',
    category: 'bebidas',
    description: 'Ron añejo caribeño, pulpa pura de maracuyá fresca, hierbabuena macerada con azúcar de caña y toque de soda burbujeante.',
    price: 9.50,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    badge: 'Cóctel Signature',
    rating: 4.9,
    reviewsCount: 110,
    prepTime: '5 min',
    ingredients: ['Ron añejo', 'Maracuyá natural', 'Hierbabuena fresca', 'Lima', 'Soda']
  },
  {
    id: 'limonada-coco',
    name: 'Limonada de Coco Cremosa',
    category: 'bebidas',
    description: 'Refrescante combinación helada de crema de coco artesanal con zumo recién exprimido de limas verdes. Sin alcohol.',
    price: 6.50,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 84,
    isVegetarian: true,
    prepTime: '5 min',
    ingredients: ['Crema de coco', 'Lima fresca', 'Hielo frappé', 'Ralladura de lima']
  },
  {
    id: 'tres-leches',
    name: 'Torta Tres Leches Tradicional',
    category: 'postres',
    description: 'Bizcocho esponjoso impregnado en infusión de tres leches perfumadas con vainilla y canela, coronado con merengue flameado y canela.',
    price: 7.50,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    badge: 'Receta de la Abuela',
    rating: 4.9,
    reviewsCount: 120,
    isVegetarian: true,
    prepTime: '5 min',
    ingredients: ['Bizcocho artesanal', 'Tres leches', 'Merengue suizo', 'Canela en polvo']
  },
  {
    id: 'volcan-arequipe',
    name: 'Volcán Fundido de Dulce de Leche',
    category: 'postres',
    description: 'Pastel tibio con centro líquido de dulce de leche caliente, acompañado de helado artesanal de vainilla bourbon y crumble de almendras.',
    price: 8.50,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewsCount: 145,
    isVegetarian: true,
    prepTime: '8 min',
    ingredients: ['Arequipe / Dulce de leche fundido', 'Helado de vainilla', 'Crumble de almendras']
  }
];

export const RESTAURANT_INFO = {
  name: 'El Patio del Sabor',
  slogan: 'Sabores que unen, momentos que se disfrutan',
  phone: '+1 (555) 345-7890',
  whatsapp: '+52 55 1234 5678',
  address: 'Calle de los Sabores #82, Barrio Gastronómico',
  schedule: {
    weekdays: '12:00 PM – 10:30 PM',
    weekends: '11:30 AM – 11:30 PM',
    brunch: 'Sábados & Domingos: 10:00 AM – 1:00 PM'
  },
  features: [
    { title: 'Patio al Aire Libre', desc: 'Ambiente cálido iluminado con faroles y vegetación natural' },
    { title: 'Parrilla al Carbón', desc: 'Cortes premium y mariscos con auténtico toque ahumado' },
    { title: 'Música en Vivo', desc: 'Acústicos y ritmos latinos los viernes y sábados por la noche' },
    { title: 'Cócteles de Autor', desc: 'Mixología con frutas tropicales y licores artesanales' }
  ]
};
