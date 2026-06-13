export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isTypical: boolean;
  calories?: number;
}   //define la forma de un plato

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  distance: string;
  address: string;
  city: string;
  phone: string;
  image: string;
  coverImage: string;
  latitude: number;
  longitude: number;
  menu: Dish[];
  openHours: string;
  isFeatured?: boolean;
  discount?: number;
  isReal?: boolean; // marca si es un restaurante real verificado
} // define la forma de un restaurante

export const CATEGORIES = [
  { id: "1", name: "Todos", emoji: "🍽️" },
  { id: "2", name: "Típica", emoji: "🫕" },
  { id: "3", name: "Mariscos", emoji: "🦐" },
  { id: "4", name: "Asados", emoji: "🔥" },
  { id: "5", name: "Dulces", emoji: "🍮" },
  { id: "6", name: "Sopas", emoji: "🍲" },
];

export const NOTIFICATIONS = [
  {
    id: "n1",
    title: "¡Nuevo plato! 🔥 ",
    body: "Llanera La 31 ha sacado un nuevo platillo con receta magica",
    time: "Hace 5 min",
    read: false,
  },
  {
    id: "n2",
    title: "¡Oferta especial! 🔥",
    body: "Pardo Gastro Bar tiene 20% de descuento esta noche en todos sus platos.",
    time: "Hace 1 hora",
    read: false,
  },

  {
    id: "n4",
    title: "Nuevo restaurante 🎉",
    body: "Rancho Grande ya está disponible en TasteGo.",
    time: "2 días",
    read: true,
  },
];

export const restaurants: Restaurant[] = [
  // ── RESTAURANTE REAL #1 ──────────────────────────────────────────
  {
    id: "1",
    name: "Llanera La 31",
    description:
      "Uno de los mejores restaurantes de comida típica sabanera de Sincelejo. Especialistas en carnes asadas a la llanera, mote de queso, sancocho de gallina y mondongo. Ubicado en el tradicional punto de El Pozo de Majagual con más de 2,000 reseñas positivas.",
    category: "Asados",
    tags: ["Asados", "Típica", "Sopas"],
    rating: 4.5,
    reviewCount: 2120,
    deliveryTime: "20-35 min",
    distance: "1.2 km",
    // Dirección real: Calle 31 #14-219, Nuevo México, Sincelejo
    address: "Cl. 31 #14-219, Nuevo México",
    city: "Sincelejo, Sucre",
    phone: "+57 301 5120013",
    image: "https://images.unsplash.com/photo-1544025162-d76594f0bac0?w=400",
    coverImage:
      "https://images.unsplash.com/photo-1544025162-d76594f0bac0?w=800",
    // Coordenadas reales: Calle 31 con Carrera 14, Sincelejo
    latitude: 9.3082,
    longitude: -75.3971,
    openHours: "Lun-Dom 6am - 11pm",
    isFeatured: true,
    discount: 0,
    isReal: true,
    menu: [
      {
        id: "d1",
        name: "Chivo Asado",
        description:
          "Especialidad de la casa. Chivo llanero asado a la brasa con especias sabaneras, acompañado de yuca frita y arepa.",
        price: 45000,
        image:
          "https://images.unsplash.com/photo-1544025162-d76594f0bac0?w=400",
        isTypical: true,
        calories: 520,
      },
      {
        id: "d2",
        name: "Lomo Salteado Llanero",
        description:
          "Lomo fino de res asado al carbón con chimichurri de la casa y papas criollas.",
        price: 38000,
        image:
          "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400",
        isTypical: true,
        calories: 480,
      },
      {
        id: "d3",
        name: "Mondongo",
        description:
          "Tradicional sopa de mondongo al estilo sabanero con verduras frescas y especias locales.",
        price: 22000,
        image:
          "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400",
        isTypical: true,
        calories: 380,
      },
      {
        id: "d4",
        name: "Sancocho de Gallina",
        description:
          "Caldo reconfortante de gallina criolla con yuca, ñame, plátano y mazorca.",
        price: 25000,
        image:
          "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400",
        isTypical: true,
        calories: 420,
      },
      {
        id: "d5",
        name: "Picada Especial Llanera",
        description:
          "Picada para compartir: chivo, cerdo, chorizo, chicharrón, yuca frita y plátano asado.",
        price: 65000,
        image:
          "https://images.unsplash.com/photo-1544025162-d76594f0bac0?w=400",
        isTypical: true,
        calories: 890,
      },
    ],
  },

  // ── RESTAURANTE REAL #2 ──────────────────────────────────────────
  {
    id: "2",
    name: "Pardo Gastro Bar",
    description:
      "Restaurante gastronómico moderno en el Barrio La Toscana de Sincelejo. Reconocido por su cocina de autor que fusiona sabores colombianos con cocina americana y mexicana. Ambiente acogedor, coctelería y excelente servicio. Rating 4.5 en Google con más de 218 reseñas.",
    category: "Típica",
    tags: ["Típica"],
    rating: 4.5,
    reviewCount: 218,
    deliveryTime: "25-40 min",
    distance: "2.3 km",
    // Dirección real: Cra. 28A #23B-13, Barrio La Toscana, Sincelejo
    address: "Cra. 28A #23B-13, Barrio La Toscana",
    city: "Sincelejo, Sucre",
    phone: "+57 304 3393333",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400",
    coverImage:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
    // Coordenadas reales: Carrera 28A con Calle 23B, Barrio La Toscana
    latitude: 9.3205,
    longitude: -75.4018,
    openHours: "Jue-Dom 5pm - 11pm",
    isFeatured: true,
    discount: 20,
    isReal: true,
    menu: [
      {
        id: "d6",
        name: "Tacos de Carne",
        description:
          "Tacos al estilo mexicano con carne de res marinada, pico de gallo, guacamole y salsa verde.",
        price: 32000,
        image:
          "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400",
        isTypical: false,
        calories: 440,
      },
      {
        id: "d7",
        name: "Hamburguesa Pardo",
        description:
          "Hamburguesa gourmet con carne angus 200g, cheddar ahumado, cebolla caramelizada y salsa especial de la casa.",
        price: 28000,
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
        isTypical: false,
        calories: 680,
      },
      {
        id: "d8",
        name: "Costillas BBQ",
        description:
          "Costillas de cerdo glaseadas con BBQ artesanal, servidas con papas rústicas y ensalada fresca.",
        price: 42000,
        image:
          "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400",
        isTypical: false,
        calories: 720,
      },
      {
        id: "d9",
        name: "Mojito Tropical",
        description:
          "Cóctel artesanal con ron blanco, limón, menta fresca, maracuyá y agua con gas.",
        price: 18000,
        image:
          "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400",
        isTypical: false,
        calories: 180,
      },
    ],
  },

  // ── RESTAURANTE REAL #3 ──────────────────────────────────────────
  {
    id: "3",
    name: "Rancho Grande",
    description:
      "Restaurante y bar de comida típica costeña con ambiente familiar. Ubicado en la zona de Rancho Grande, muy reconocido en Sincelejo por sus domicilios y platos criollos a buen precio.",
    category: "Típica",
    tags: ["Típica", "Sopas"],
    rating: 4.3,
    reviewCount: 186,
    deliveryTime: "15-30 min",
    distance: "3.1 km",
    // Dirección real: Calle 36 No. 34-366, Sincelejo
    address: "Cl. 36 #34-366, Rancho Grande",
    city: "Sincelejo, Sucre",
    phone: "+57 301 7541553",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
    coverImage:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
    // Coordenadas reales: Calle 36 con Carrera 34, Rancho Grande
    latitude: 9.2978,
    longitude: -75.3845,
    openHours: "Lun-Dom 7am - 10pm",
    isFeatured: false,
    discount: 0,
    isReal: true,
    menu: [
      {
        id: "d10",
        name: "Mote de Queso",
        description:
          "La sopa emblema de Sucre. Preparada con ñame espino, queso costeño y hogao tradicional.",
        price: 18000,
        image:
          "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400",
        isTypical: true,
        calories: 380,
      },
      {
        id: "d11",
        name: "Arroz con Pollo Costeño",
        description:
          "Arroz con pollo al estilo sabanero con verduras frescas, pimentón y especias criollas.",
        price: 22000,
        image:
          "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400",
        isTypical: true,
        calories: 450,
      },
      {
        id: "d12",
        name: "Sopa de Costilla",
        description:
          "Caldo de costilla de res con papa, yuca y cimarrón. El desayuno más popular de la costa.",
        price: 12000,
        image:
          "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400",
        isTypical: true,
        calories: 320,
      },
    ],
  },

  // ── RESTAURANTE SIMULADO (complemento) ──────────────────────────
  {
    id: "4",
    name: "El Rincón Marino",
    description:
      "Los mejores mariscos del Caribe colombiano. Frescos del día directo al plato.",
    category: "Mariscos",
    tags: ["Mariscos"],
    rating: 4.7,
    reviewCount: 289,
    deliveryTime: "25-35 min",
    distance: "1.5 km",
    address: "Av. Las Palmas #5-67",
    city: "Sincelejo, Sucre",
    phone: "+57 315 456 7890",
    image: "https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=400",
    coverImage:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
    latitude: 9.301,
    longitude: -75.3955,
    openHours: "Mar-Dom 11am - 10pm",
    isFeatured: false,
    menu: [
      {
        id: "d13",
        name: "Cazuela de Mariscos",
        description:
          "Camarones, calamares y mejillones en salsa criolla con arroz con coco.",
        price: 38000,
        image:
          "https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=400",
        isTypical: false,
        calories: 560,
      },
      {
        id: "d14",
        name: "Viuda de Pescado",
        description:
          "Pescado asado con ñame, yuca y plátano en su jugo. Plato típico sucreño.",
        price: 30000,
        image:
          "https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=400",
        isTypical: true,
        calories: 460,
      },
    ],
  },

  {
    id: "5",
    name: "Dulcería La Abuela",
    description:
      "Los dulces típicos más exquisitos de Sucre. Recetas transmitidas de generación en generación desde el Mercado Central.",
    category: "Dulces",
    tags: ["Dulces", "Típica"],
    rating: 4.9,
    reviewCount: 198,
    deliveryTime: "10-20 min",
    distance: "0.8 km",
    address: "Mercado Central, Local 14",
    city: "Sincelejo, Sucre",
    phone: "+57 320 111 2233",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
    coverImage:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800",
    latitude: 9.3055,
    longitude: -75.3988,
    openHours: "Lun-Sab 8am - 6pm",
    isFeatured: true,
    menu: [
      {
        id: "d15",
        name: "Caballito de Papaya",
        description:
          "Dulce tradicional de papaya con panela y canela. El más pedido de la dulcería.",
        price: 8000,
        image:
          "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
        isTypical: true,
        calories: 210,
      },
      {
        id: "d16",
        name: "Cocada de Piña",
        description:
          "Dulce artesanal de coco y piña, receta ancestral de las abuelas sincelejanas.",
        price: 6000,
        image:
          "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400",
        isTypical: true,
        calories: 280,
      },
    ],
  },
];
