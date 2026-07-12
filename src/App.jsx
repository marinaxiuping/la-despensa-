import React, { useState, useEffect, useMemo } from "react";
import {
  CalendarDays,
  BookOpen,
  ShoppingCart,
  Plus,
  X,
  Trash2,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Check,
  Copy,
  NotebookPen,
  PenLine,
  Home,
  FileText,
  Search,
  Star,
  Square,
  CheckSquare,
  Sparkles,
  Package,
  ClipboardCheck,
  Flame,
  TriangleAlert,
  ChefHat,
} from "lucide-react";

/* ---------- paleta y tipografía: Cuaderno de cocina ---------- */
const c = {
  paper: "#F1E9D6", // crema de cuaderno
  card: "#FCF8EC", // ficha de papel
  ink: "#2C3650", // tinta azul (bolígrafo)
  herb: "#4E7A4A", // tinta verde (acción / hecho)
  herbSoft: "#E6EEDD",
  paprika: "#C2462E", // tinta roja (margen / atención)
  paprikaSoft: "#F4E2D9",
  line: "#D9CDB2", // trazo de papel
  muted: "#998C72", // lápiz desvaído
  kraft: "#D7BF92", // tapa de cartón
  rule: "#BFD0DE", // renglón azul
  highlight: "#F4DC8E", // rotulador amarillo
};
const display = "'Fraunces', 'Playfair Display', Georgia, serif";
const body = "'Lora', Georgia, serif";
// Página con renglones y línea roja de margen (la firma del cuaderno)
const ruled = {
  backgroundColor: c.card,
  backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent 28px, ${c.rule}59 28px, ${c.rule}59 29px), linear-gradient(to right, transparent 0 26px, ${c.paprika}cc 26px 27px, transparent 27px)`,
  backgroundPosition: "0 8px, 0 0",
};

const SLOTS = ["Desayuno", "Comida", "Cena"];
const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const UNITS = ["ud", "g", "kg", "ml", "l", "cda", "cdta", "taza", "diente", "lata", "al gusto"];
const ALLERGENS = [
  { key: "gluten", label: "Gluten" },
  { key: "lacteos", label: "Lácteos" },
  { key: "frutos_secos", label: "Frutos secos" },
  { key: "huevo", label: "Huevo" },
  { key: "pescado", label: "Pescado/marisco" },
  { key: "soja", label: "Soja" },
];

/* ---------- datos de ejemplo (solo la 1ª vez) ---------- */
const seedRecipes = [
  {
    id: "r1",
    name: "Lentejas",
    category: "Legumbres",
    notes: "Pochar la verdura 10 min antes de añadir las lentejas. Cocer a fuego lento 35-40 min. Si quedan secas, añadir caldo caliente.",
    steps: [
      "Picar la cebolla, la zanahoria y la patata en dados pequeños.",
      "Sofreír la cebolla y la zanahoria en un chorrito de aceite a fuego medio 8-10 min, hasta que estén blandas.",
      "Añadir el pimentón fuera del fuego, remover unos segundos para que no se queme y volver a poner al fuego.",
      "Incorporar las lentejas, la patata y cubrir con agua unos tres dedos por encima. Si es la versión con chorizo, añadirlo entero aquí.",
      "Cocer a fuego lento 35-40 min con la olla semitapada, removiendo de vez en cuando.",
      "Si quedan secas, añadir agua o caldo caliente. Rectificar de sal al final.",
    ],
    variants: [
      {
        id: "v1",
        name: "Clásica",
        calories: 350, // kcal/ración (estimado)
        allergens: [], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Lentejas", qty: 300, unit: "g" },
          { name: "Zanahoria", qty: 2, unit: "ud" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Patata", qty: 2, unit: "ud" },
          { name: "Pimentón", qty: 1, unit: "cdta" },
        ],
      },
      {
        id: "v2",
        name: "Con chorizo",
        calories: 480, // kcal/ración (estimado)
        allergens: [], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Lentejas", qty: 300, unit: "g" },
          { name: "Zanahoria", qty: 2, unit: "ud" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Chorizo", qty: 150, unit: "g" },
        ],
      },
    ],
  },
  {
    id: "r2",
    name: "Pasta al pesto",
    category: "Pasta",
    steps: [
      "Cocer la pasta en agua abundante con sal según el tiempo del paquete, hasta que esté al dente.",
      "Mientras, triturar la albahaca, los piñones, el ajo y el parmesano con un buen chorro de aceite hasta obtener una pasta homogénea.",
      "Reservar un vaso del agua de cocción antes de escurrir la pasta.",
      "Mezclar la pasta escurrida con el pesto fuera del fuego, añadiendo agua de cocción poco a poco hasta que quede cremoso.",
      "Servir enseguida con parmesano extra por encima.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 520, // kcal/ración (estimado)
        allergens: ["frutos_secos", "lacteos"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Pasta", qty: 250, unit: "g" },
          { name: "Albahaca", qty: 1, unit: "taza" },
          { name: "Piñones", qty: 30, unit: "g" },
          { name: "Parmesano", qty: 50, unit: "g" },
          { name: "Ajo", qty: 1, unit: "diente" },
        ],
      },
    ],
  },
  {
    id: "r3",
    name: "Ensalada César",
    category: "Ensaladas",
    steps: [
      "Cortar el pan en dados y tostarlo en la sartén con un poco de aceite hasta que quede dorado y crujiente.",
      "Hacer el pollo a la plancha con sal y pimienta, 4-5 min por lado, y dejarlo reposar 5 min antes de cortarlo en tiras.",
      "Trocear la lechuga romana en trozos no muy pequeños.",
      "Mezclar la lechuga con el pollo, los picatostes y el parmesano en lascas.",
      "Aliñar con la salsa césar justo antes de servir para que la lechuga no se ablande.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 380, // kcal/ración (estimado)
        allergens: ["gluten", "lacteos"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Lechuga romana", qty: 1, unit: "ud" },
          { name: "Pollo", qty: 200, unit: "g" },
          { name: "Pan", qty: 2, unit: "ud" },
          { name: "Parmesano", qty: 40, unit: "g" },
        ],
      },
    ],
  },
  {
    id: "r4",
    name: "Tortilla de patatas",
    category: "Huevos",
    notes: "Freír la patata a fuego medio hasta que esté blanda, sin dorar. Cuajar al gusto: 1-2 min por lado para jugosa.",
    steps: [
      "Pelar y cortar las patatas en láminas finas (y la cebolla en juliana, si se usa).",
      "Freír a fuego medio-bajo en abundante aceite de oliva 15-20 min, hasta que estén blandas sin dorarse demasiado.",
      "Escurrir bien el aceite y mezclar las patatas calientes con los huevos batidos y sal.",
      "Dejar reposar la mezcla 5 min para que la patata suelte el almidón y ligue mejor.",
      "Cuajar en una sartén antiadherente con una gota de aceite, 2-3 min por el primer lado a fuego medio.",
      "Dar la vuelta con un plato y cuajar el otro lado 1-2 min más, para que quede jugosa por dentro.",
    ],
    variants: [
      {
        id: "v1",
        name: "Con cebolla",
        calories: 320, // kcal/ración (estimado)
        allergens: ["huevo"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Patata", qty: 4, unit: "ud" },
          { name: "Huevos", qty: 5, unit: "ud" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Aceite de oliva", qty: 200, unit: "ml" },
          { name: "Sal", qty: 1, unit: "cdta" },
        ],
      },
      {
        id: "v2",
        name: "Sin cebolla",
        calories: 310, // kcal/ración (estimado)
        allergens: ["huevo"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Patata", qty: 4, unit: "ud" },
          { name: "Huevos", qty: 5, unit: "ud" },
          { name: "Aceite de oliva", qty: 200, unit: "ml" },
          { name: "Sal", qty: 1, unit: "cdta" },
        ],
      },
    ],
  },
  {
    id: "r5",
    name: "Gazpacho",
    category: "Sopas frías",
    notes: "Triturar todo bien fino y colar si lo quieres muy suave. Mejor de un día para otro. Servir muy frío.",
    steps: [
      "Lavar y trocear el tomate, el pepino y el pimiento verde.",
      "Poner las verduras en la batidora con el ajo, el pan (remojado unos minutos), el aceite y el vinagre.",
      "Triturar a máxima potencia varios minutos hasta que quede totalmente fino.",
      "Colar si se quiere una textura muy lisa, y rectificar de sal.",
      "Enfriar en la nevera mínimo 2 h y servir muy frío.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 150, // kcal/ración (estimado)
        allergens: ["gluten"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Tomate maduro", qty: 1, unit: "kg" },
          { name: "Pepino", qty: 1, unit: "ud" },
          { name: "Pimiento verde", qty: 1, unit: "ud" },
          { name: "Ajo", qty: 1, unit: "diente" },
          { name: "Aceite de oliva", qty: 50, unit: "ml" },
          { name: "Vinagre", qty: 1, unit: "cda" },
          { name: "Pan", qty: 1, unit: "ud" },
        ],
      },
    ],
  },
  {
    id: "r6",
    name: "Garbanzos con espinacas",
    category: "Legumbres",
    notes: "Sofreír ajo y pimentón, añadir espinacas y garbanzos cocidos. Un chorrito de caldo y 10 min a fuego lento.",
    steps: [
      "Picar el ajo y sofreírlo en aceite de oliva a fuego suave, sin que llegue a dorarse del todo.",
      "Añadir el pimentón y el comino fuera del fuego, remover unos segundos para que no se quemen.",
      "Incorporar las espinacas y dejar que se pochen 3-4 min hasta que reduzcan de volumen.",
      "Añadir los garbanzos cocidos y un chorrito de caldo o agua.",
      "Cocer 10 min a fuego suave para que se integren los sabores. Rectificar de sal.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 320, // kcal/ración (estimado)
        allergens: [], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Garbanzos cocidos", qty: 2, unit: "lata" },
          { name: "Espinacas", qty: 300, unit: "g" },
          { name: "Ajo", qty: 2, unit: "diente" },
          { name: "Pimentón", qty: 1, unit: "cdta" },
          { name: "Comino", qty: 1, unit: "cdta", opt: true },
          { name: "Aceite de oliva", qty: 2, unit: "cda" },
        ],
      },
    ],
  },
  {
    id: "r7",
    name: "Macarrones con tomate",
    category: "Pasta",
    notes: "Reservar un poco del agua de cocción para ligar la salsa.",
    steps: [
      "Cocer los macarrones en agua con sal según el tiempo del paquete, hasta que estén al dente.",
      "Mientras, pochar la cebolla picada en aceite de oliva 8 min a fuego medio.",
      "En la versión con atún, añadir el atún desmigado y rehogar 1 min; en la vegetariana, añadir el calabacín en dados y cocinar 5 min.",
      "Incorporar el tomate triturado y cocer a fuego suave 10 min.",
      "Mezclar la pasta escurrida con la salsa y el queso rallado, removiendo hasta que se funda ligeramente.",
    ],
    variants: [
      {
        id: "v1",
        name: "Con atún",
        calories: 430, // kcal/ración (estimado)
        allergens: ["gluten", "lacteos", "pescado"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Macarrones", qty: 250, unit: "g" },
          { name: "Tomate triturado", qty: 1, unit: "lata" },
          { name: "Atún en lata", qty: 2, unit: "lata" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Queso rallado", qty: 50, unit: "g" },
        ],
      },
      {
        id: "v2",
        name: "Vegetariana",
        calories: 400, // kcal/ración (estimado)
        allergens: ["gluten", "lacteos"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Macarrones", qty: 250, unit: "g" },
          { name: "Tomate triturado", qty: 1, unit: "lata" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Calabacín", qty: 1, unit: "ud" },
          { name: "Queso rallado", qty: 50, unit: "g" },
        ],
      },
    ],
  },
  {
    id: "r8",
    name: "Arroz con verduras",
    category: "Arroz",
    notes: "Sofreír la verdura, nacarar el arroz 1 min y añadir el doble de caldo. 18 min y reposar 5.",
    steps: [
      "Cortar todas las verduras en dados pequeños y uniformes.",
      "Sofreír la cebolla en aceite 5 min, añadir el pimiento y el calabacín y cocinar 5 min más.",
      "Añadir el arroz y nacarar (remover 1-2 min para que se impregne del sofrito).",
      "Incorporar los guisantes y el doble de volumen de caldo caliente que de arroz.",
      "Cocer a fuego medio-bajo 18 min sin remover, y dejar reposar tapado 5 min antes de servir.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 350, // kcal/ración (estimado)
        allergens: [], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Arroz", qty: 300, unit: "g" },
          { name: "Pimiento rojo", qty: 1, unit: "ud" },
          { name: "Calabacín", qty: 1, unit: "ud" },
          { name: "Guisantes", qty: 150, unit: "g" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Caldo de verduras", qty: 600, unit: "ml" },
        ],
      },
    ],
  },
  {
    id: "r9",
    name: "Pollo al horno con patatas",
    category: "Carne",
    notes: "Horno a 200 ºC, unos 45-50 min. Regar con su jugo a mitad de cocción.",
    steps: [
      "Precalentar el horno a 200 ºC.",
      "Cortar las patatas en cuartos y la cebolla en gajos, colocar en una bandeja de horno.",
      "Salpimentar el pollo y colocarlo sobre las patatas, con el limón en rodajas y el romero repartido por encima.",
      "Regar todo con aceite de oliva.",
      "Hornear 45-50 min, regando con el jugo de la bandeja a media cocción, hasta que el pollo esté dorado y las patatas tiernas.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 520, // kcal/ración (estimado)
        allergens: [], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Muslos de pollo", qty: 4, unit: "ud" },
          { name: "Patata", qty: 4, unit: "ud" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Limón", qty: 1, unit: "ud" },
          { name: "Romero", qty: 1, unit: "cdta", opt: true },
          { name: "Aceite de oliva", qty: 3, unit: "cda" },
        ],
      },
    ],
  },
  {
    id: "r10",
    name: "Salmón al horno",
    category: "Pescado",
    notes: "200 ºC durante 12-15 min. Queda jugoso si lo sacas cuando el centro aún esté algo translúcido.",
    steps: [
      "Precalentar el horno a 200 ºC.",
      "Colocar el salmón en una bandeja con papel de horno y salpimentar.",
      "Repartir el ajo picado y el eneldo por encima, regar con aceite de oliva y unas rodajas de limón.",
      "Hornear 12-15 min según el grosor, hasta que el centro esté jugoso y ligeramente translúcido.",
      "Dejar reposar 2 min antes de servir.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 380, // kcal/ración (estimado)
        allergens: ["pescado"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Lomo de salmón", qty: 4, unit: "ud" },
          { name: "Limón", qty: 1, unit: "ud" },
          { name: "Ajo", qty: 2, unit: "diente" },
          { name: "Eneldo", qty: 1, unit: "cdta", opt: true },
          { name: "Aceite de oliva", qty: 2, unit: "cda" },
        ],
      },
    ],
  },
  {
    id: "r11",
    name: "Fajitas",
    category: "Tex-Mex",
    notes: "Marcar a fuego fuerte para que la verdura quede crujiente. Calentar las tortillas justo antes de servir.",
    steps: [
      "Cortar el pollo (o los champiñones, en la versión vegetal) y los pimientos en tiras finas.",
      "Marcar el pollo en una sartén o plancha muy caliente con las especias de fajita, 5-6 min hasta que esté dorado y hecho por dentro.",
      "En la misma sartén, saltear los pimientos y la cebolla 4-5 min hasta que estén tiernos con un punto crujiente.",
      "Calentar las tortillas de trigo en una sartén seca o en el microondas unos segundos.",
      "Montar las fajitas rellenando las tortillas con el pollo y las verduras.",
    ],
    variants: [
      {
        id: "v1",
        name: "De pollo",
        calories: 450, // kcal/ración (estimado)
        allergens: ["gluten"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Pechuga de pollo", qty: 400, unit: "g" },
          { name: "Pimiento rojo", qty: 1, unit: "ud" },
          { name: "Pimiento verde", qty: 1, unit: "ud" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Tortillas de trigo", qty: 8, unit: "ud" },
          { name: "Especias fajita", qty: 1, unit: "cda" },
        ],
      },
      {
        id: "v2",
        name: "Vegetales",
        calories: 380, // kcal/ración (estimado)
        allergens: ["gluten"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Champiñones", qty: 250, unit: "g" },
          { name: "Pimiento rojo", qty: 1, unit: "ud" },
          { name: "Pimiento verde", qty: 1, unit: "ud" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Tortillas de trigo", qty: 8, unit: "ud" },
          { name: "Especias fajita", qty: 1, unit: "cda" },
        ],
      },
    ],
  },
  {
    id: "r12",
    name: "Crema de calabacín",
    category: "Cremas y sopas",
    notes: "Triturar con la quesita para dar cremosidad. Ajustar el caldo según lo espesa que la quieras.",
    steps: [
      "Pelar y trocear la patata y el calabacín, picar la cebolla.",
      "Rehogar la cebolla en un poco de aceite 5 min, añadir el calabacín y la patata y cocinar 3 min más.",
      "Cubrir con el caldo de verduras y cocer 15-20 min hasta que las verduras estén blandas.",
      "Triturar con la batidora hasta que quede fino, añadiendo el quesito para dar cremosidad.",
      "Rectificar de sal y servir caliente.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 220, // kcal/ración (estimado)
        allergens: ["lacteos"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Calabacín", qty: 3, unit: "ud" },
          { name: "Patata", qty: 1, unit: "ud" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Caldo de verduras", qty: 500, unit: "ml" },
          { name: "Quesito", qty: 2, unit: "ud" },
        ],
      },
    ],
  },
  {
    id: "r13",
    name: "Hamburguesa casera",
    category: "Carne",
    notes: "No apretar la carne al formar. Marcar 3 min por lado a fuego fuerte.",
    steps: [
      "Formar las hamburguesas con la carne picada, salpimentando sin amasar demasiado para que no queden duras.",
      "Marcar en una sartén o plancha muy caliente 3 min por lado para un punto jugoso (más tiempo si se prefiere bien hecha).",
      "En el último minuto, poner una loncha de queso encima para que se funda con el calor residual.",
      "Tostar ligeramente el pan de hamburguesa por dentro.",
      "Montar con la lechuga, el tomate y la cebolla al gusto.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 600, // kcal/ración (estimado)
        allergens: ["gluten", "lacteos"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Carne picada", qty: 500, unit: "g" },
          { name: "Pan de hamburguesa", qty: 4, unit: "ud" },
          { name: "Queso", qty: 4, unit: "ud" },
          { name: "Tomate", qty: 1, unit: "ud" },
          { name: "Lechuga", qty: 1, unit: "ud" },
          { name: "Cebolla", qty: 1, unit: "ud" },
        ],
      },
    ],
  },
  {
    id: "r14",
    name: "Pisto",
    category: "Verduras",
    notes: "Cocinar cada verdura por separado y unir al final con el tomate. Sin prisa, a fuego suave.",
    steps: [
      "Cortar todas las verduras en dados de tamaño similar.",
      "Pochar la cebolla y el pimiento en aceite de oliva a fuego medio-bajo 10 min.",
      "Añadir el calabacín y cocinar 8-10 min más, hasta que esté tierno.",
      "Incorporar el tomate triturado y cocer a fuego suave 15-20 min, removiendo de vez en cuando, hasta que espese.",
      "Rectificar de sal y servir templado o caliente.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 250, // kcal/ración (estimado)
        allergens: [], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Calabacín", qty: 2, unit: "ud" },
          { name: "Pimiento rojo", qty: 1, unit: "ud" },
          { name: "Pimiento verde", qty: 1, unit: "ud" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Tomate triturado", qty: 1, unit: "lata" },
          { name: "Aceite de oliva", qty: 4, unit: "cda" },
        ],
      },
    ],
  },
  {
    id: "r15",
    name: "Merluza a la plancha",
    category: "Pescado",
    notes: "Secar bien el pescado antes de la plancha para que dore. Acompañar con verdura o ensalada.",
    steps: [
      "Secar bien los lomos de merluza con papel de cocina para que la plancha les dé color.",
      "Calentar la plancha o sartén con un poco de aceite a fuego fuerte.",
      "Cocinar la merluza 2-3 min por el lado de la piel y 1-2 min por el otro, según el grosor.",
      "En el mismo aceite, dorar el ajo laminado y el perejil picado unos segundos.",
      "Servir la merluza con el ajo y perejil por encima y un chorrito de limón.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 280, // kcal/ración (estimado)
        allergens: ["pescado"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Lomos de merluza", qty: 4, unit: "ud" },
          { name: "Ajo", qty: 2, unit: "diente" },
          { name: "Perejil", qty: 1, unit: "cda", opt: true },
          { name: "Limón", qty: 1, unit: "ud" },
          { name: "Aceite de oliva", qty: 2, unit: "cda" },
        ],
      },
    ],
  },
  {
    id: "r16",
    name: "Curry de garbanzos",
    category: "Legumbres",
    notes: "Vegano. Sofreír la pasta de curry, añadir tomate y leche de coco, luego los garbanzos. 15 min.",
    steps: [
      "Picar la cebolla y sofreírla en un poco de aceite 5 min.",
      "Añadir la pasta de curry y remover 1 min para que suelte el aroma.",
      "Incorporar el tomate triturado y la leche de coco, remover bien.",
      "Añadir los garbanzos cocidos y cocer a fuego suave 15 min para que espese.",
      "Servir con el arroz basmati cocido aparte.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 480, // kcal/ración (estimado)
        allergens: [], // estimado a partir de los ingredientes (leche de coco no es lácteo)
        ingredients: [
          { name: "Garbanzos cocidos", qty: 2, unit: "lata" },
          { name: "Leche de coco", qty: 1, unit: "lata" },
          { name: "Tomate triturado", qty: 1, unit: "lata" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Pasta de curry", qty: 2, unit: "cda" },
          { name: "Arroz basmati", qty: 250, unit: "g" },
        ],
      },
    ],
  },

  /* ---------- ESPAÑA TRADICIONAL ---------- */
  {
    id: "r17",
    name: "Paella",
    category: "Arroz",
    notes: "El sofrito al principio es clave. Añadir el caldo caliente, hervir 10 min fuerte y 8 min suave. Reposar tapada 5 min.",
    steps: [
      "Sofreír el pollo troceado en el aceite de la paellera hasta dorar (en la versión mixta).",
      "Añadir el pimiento y el ajo picado, sofreír 3-4 min.",
      "Incorporar el tomate triturado y cocinar 5 min hasta que se reduzca.",
      "Añadir el arroz y nacarar 1-2 min, luego el caldo caliente con el azafrán y el pimentón disueltos.",
      "Cocer a fuego fuerte los primeros 10 min sin remover, bajar el fuego y cocer 8 min más. En la mixta, añadir las gambas y mejillones los últimos 5 min.",
      "Dejar reposar 5 min fuera del fuego antes de servir.",
    ],
    variants: [
      {
        id: "v1",
        name: "Mixta (pollo y marisco)",
        calories: 520, // kcal/ración (estimado)
        allergens: ["pescado"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Arroz bomba", qty: 400, unit: "g" },
          { name: "Pollo troceado", qty: 400, unit: "g" },
          { name: "Gambas", qty: 200, unit: "g" },
          { name: "Mejillones", qty: 250, unit: "g" },
          { name: "Tomate triturado", qty: 200, unit: "g" },
          { name: "Pimiento rojo", qty: 1, unit: "ud" },
          { name: "Ajo", qty: 2, unit: "diente" },
          { name: "Caldo de pescado", qty: 1, unit: "l" },
          { name: "Azafrán", qty: 1, unit: "pinch" },
          { name: "Pimentón dulce", qty: 1, unit: "cdta" },
        ],
      },
      {
        id: "v2",
        name: "De verduras",
        calories: 420, // kcal/ración (estimado)
        allergens: [], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Arroz bomba", qty: 400, unit: "g" },
          { name: "Judía verde", qty: 200, unit: "g" },
          { name: "Alcachofa", qty: 4, unit: "ud" },
          { name: "Pimiento rojo", qty: 1, unit: "ud" },
          { name: "Tomate triturado", qty: 200, unit: "g" },
          { name: "Ajo", qty: 2, unit: "diente" },
          { name: "Caldo de verduras", qty: 1, unit: "l" },
          { name: "Azafrán", qty: 1, unit: "pinch" },
          { name: "Pimentón dulce", qty: 1, unit: "cdta" },
        ],
      },
    ],
  },
  {
    id: "r18",
    name: "Fabada asturiana",
    category: "Legumbres",
    notes: "Remojar las fabes la noche antes. Cocer a fuego suave 2 h, sin remover; mover la cazuela con cuidado para que no se rompan.",
    steps: [
      "Poner las fabes en remojo la noche anterior.",
      "Cubrir las fabes con agua fría en una olla junto con el chorizo, la morcilla, la panceta, el laurel y el azafrán.",
      "Llevar a ebullición y retirar la espuma que suba a la superficie.",
      "Bajar el fuego al mínimo y cocer 1 h 30 min - 2 h, añadiendo agua fría (\"asustando\" el guiso) si rompe a hervir fuerte.",
      "Rectificar de sal al final y dejar reposar antes de servir.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 650, // kcal/ración (estimado)
        allergens: [], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Fabes (judía blanca)", qty: 500, unit: "g" },
          { name: "Chorizo", qty: 200, unit: "g" },
          { name: "Morcilla asturiana", qty: 150, unit: "g" },
          { name: "Panceta", qty: 200, unit: "g" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Ajo", qty: 2, unit: "diente" },
          { name: "Laurel", qty: 1, unit: "ud", opt: true },
          { name: "Pimentón dulce", qty: 1, unit: "cdta" },
          { name: "Azafrán", qty: 1, unit: "pinch", opt: true },
        ],
      },
    ],
  },
  {
    id: "r19",
    name: "Salmorejo",
    category: "Sopas frías",
    notes: "Triturar todo bien y emulsionar con el aceite al final. Mejor reposado en nevera 1 h. Servir con jamón y huevo duro picado.",
    steps: [
      "Trocear el tomate y el pan, sin corteza (remojado unos minutos si está muy duro).",
      "Triturar el tomate, el pan, el ajo y la sal en la batidora a máxima potencia.",
      "Ir añadiendo el aceite en hilo mientras se sigue triturando, para que emulsione y quede cremoso.",
      "Añadir el vinagre y triturar de nuevo, rectificando de sal.",
      "Enfriar en la nevera mínimo 1 h y servir con el jamón y el huevo duro picados por encima.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 300, // kcal/ración (estimado)
        allergens: ["gluten", "huevo"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Tomate maduro", qty: 1, unit: "kg" },
          { name: "Pan", qty: 150, unit: "g" },
          { name: "Ajo", qty: 1, unit: "diente" },
          { name: "Aceite de oliva virgen", qty: 100, unit: "ml" },
          { name: "Vinagre de Jerez", qty: 1, unit: "cda" },
          { name: "Sal", qty: 1, unit: "cdta" },
          { name: "Jamón serrano", qty: 80, unit: "g", opt: true },
          { name: "Huevo duro", qty: 2, unit: "ud", opt: true },
        ],
      },
    ],
  },
  {
    id: "r20",
    name: "Croquetas de jamón",
    category: "Tapas",
    notes: "La bechamel debe quedar espesa. Enfriar bien antes de bolear. Freír en aceite muy caliente, poca cantidad cada vez.",
    steps: [
      "Picar la cebolla muy fina y pocharla en la mantequilla a fuego suave 5 min.",
      "Añadir la harina y cocinar 2 min sin dejar de remover, para que pierda el sabor a crudo.",
      "Verter la leche caliente poco a poco, sin dejar de remover, hasta conseguir una bechamel espesa sin grumos.",
      "Incorporar el jamón (o el pollo) picado y la nuez moscada, cocinar 3-4 min más.",
      "Extender la masa en una bandeja y enfriar en la nevera mínimo 3 h (mejor de un día para otro).",
      "Formar las croquetas, pasarlas por huevo y pan rallado, y freír en aceite bien caliente hasta dorar.",
    ],
    variants: [
      {
        id: "v1",
        name: "De jamón",
        calories: 380, // kcal/ración (estimado)
        allergens: ["gluten", "huevo", "lacteos"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Jamón serrano picado", qty: 200, unit: "g" },
          { name: "Mantequilla", qty: 80, unit: "g" },
          { name: "Harina", qty: 100, unit: "g" },
          { name: "Leche", qty: 750, unit: "ml" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Huevo", qty: 2, unit: "ud" },
          { name: "Pan rallado", qty: 200, unit: "g" },
          { name: "Nuez moscada", qty: 1, unit: "pinch", opt: true },
        ],
      },
      {
        id: "v2",
        name: "De pollo",
        calories: 360, // kcal/ración (estimado)
        allergens: ["gluten", "huevo", "lacteos"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Pollo cocido picado", qty: 250, unit: "g" },
          { name: "Mantequilla", qty: 80, unit: "g" },
          { name: "Harina", qty: 100, unit: "g" },
          { name: "Leche", qty: 750, unit: "ml" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Huevo", qty: 2, unit: "ud" },
          { name: "Pan rallado", qty: 200, unit: "g" },
        ],
      },
    ],
  },
  {
    id: "r21",
    name: "Patatas bravas",
    category: "Tapas",
    notes: "Cocer las patatas a fuego suave en aceite, luego subir el fuego para que doren. Salsa brava: tomate, pimentón picante y un toque de vinagre.",
    steps: [
      "Cortar la patata en dados y freír en abundante aceite a fuego medio 10 min, hasta que estén casi tiernas.",
      "Subir el fuego los últimos minutos para que doren y queden crujientes por fuera.",
      "Para la salsa brava, sofreír el ajo, añadir el tomate triturado, el pimentón dulce y picante, y el vinagre; cocer 10 min a fuego suave.",
      "Escurrir bien las patatas y servir con la salsa brava y el alioli o mayonesa por encima.",
    ],
    variants: [
      {
        id: "v1",
        name: "Bravas + alioli",
        calories: 450, // kcal/ración (estimado)
        allergens: ["huevo"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Patata", qty: 800, unit: "g" },
          { name: "Aceite de oliva", qty: 300, unit: "ml" },
          { name: "Tomate triturado", qty: 200, unit: "g" },
          { name: "Pimentón picante", qty: 1, unit: "cdta" },
          { name: "Pimentón dulce", qty: 1, unit: "cdta" },
          { name: "Vinagre", qty: 1, unit: "cda" },
          { name: "Ajo", qty: 2, unit: "diente" },
          { name: "Mayonesa", qty: 100, unit: "g" },
        ],
      },
    ],
  },
  {
    id: "r22",
    name: "Albóndigas en salsa",
    category: "Carne",
    notes: "Reposar la masa 15 min antes de bolear. Dorar las albóndigas y cocinarlas dentro de la salsa 15-20 min.",
    steps: [
      "Mezclar la carne picada con el pan rallado remojado en leche o agua, el huevo, el ajo y el perejil picados. Salpimentar.",
      "Formar las albóndigas con las manos húmedas y dorarlas en una sartén con aceite por todos los lados.",
      "Retirar las albóndigas y en el mismo aceite hacer el sofrito de cebolla (y almendras majadas, en la versión con salsa de almendras).",
      "Añadir el tomate triturado (o el caldo con las almendras trituradas) y el vino blanco, cocer 5 min.",
      "Devolver las albóndigas a la salsa y cocer todo junto 15-20 min a fuego suave hasta que espese.",
    ],
    variants: [
      {
        id: "v1",
        name: "En salsa de tomate",
        calories: 420, // kcal/ración (estimado)
        allergens: ["gluten", "huevo"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Carne picada mixta", qty: 500, unit: "g" },
          { name: "Pan rallado", qty: 50, unit: "g" },
          { name: "Huevo", qty: 1, unit: "ud" },
          { name: "Ajo", qty: 2, unit: "diente" },
          { name: "Perejil", qty: 1, unit: "cda", opt: true },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Tomate triturado", qty: 400, unit: "g" },
          { name: "Vino blanco", qty: 100, unit: "ml" },
        ],
      },
      {
        id: "v2",
        name: "En salsa de almendras",
        calories: 480, // kcal/ración (estimado)
        allergens: ["frutos_secos", "gluten", "huevo"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Carne picada mixta", qty: 500, unit: "g" },
          { name: "Pan rallado", qty: 50, unit: "g" },
          { name: "Huevo", qty: 1, unit: "ud" },
          { name: "Ajo", qty: 3, unit: "diente" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Almendras tostadas", qty: 80, unit: "g" },
          { name: "Caldo de pollo", qty: 300, unit: "ml" },
          { name: "Vino blanco", qty: 100, unit: "ml" },
        ],
      },
    ],
  },
  {
    id: "r23",
    name: "Empanada gallega",
    category: "Hornear",
    notes: "El relleno frío antes de montar, así no humedece la masa. Horno a 200 ºC unos 35 min, pintar con huevo batido.",
    steps: [
      "Precalentar el horno a 200 ºC.",
      "Pochar la cebolla y el pimiento en aceite 10-12 min hasta que estén bien blandos.",
      "Añadir el tomate triturado y el pimentón, cocer 5 min. Incorporar el atún desmigado (o la carne ya cocinada) y mezclar.",
      "Extender una base de masa en la bandeja, repartir el relleno y cubrir con la segunda masa, sellando bien los bordes.",
      "Pincelar con huevo batido y hacer unos cortes para que salga el vapor.",
      "Hornear 30-35 min hasta que esté dorada.",
    ],
    variants: [
      {
        id: "v1",
        name: "De atún",
        calories: 430, // kcal/ración (estimado)
        allergens: ["gluten", "huevo", "pescado"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Masa de empanada", qty: 2, unit: "ud" },
          { name: "Atún en lata", qty: 3, unit: "lata" },
          { name: "Cebolla", qty: 2, unit: "ud" },
          { name: "Pimiento rojo", qty: 1, unit: "ud" },
          { name: "Pimiento verde", qty: 1, unit: "ud" },
          { name: "Tomate triturado", qty: 200, unit: "g" },
          { name: "Huevo", qty: 1, unit: "ud" },
          { name: "Pimentón dulce", qty: 1, unit: "cdta" },
        ],
      },
      {
        id: "v2",
        name: "De carne",
        calories: 460, // kcal/ración (estimado)
        allergens: ["gluten", "huevo"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Masa de empanada", qty: 2, unit: "ud" },
          { name: "Carne picada", qty: 400, unit: "g" },
          { name: "Cebolla", qty: 2, unit: "ud" },
          { name: "Pimiento rojo", qty: 1, unit: "ud" },
          { name: "Tomate triturado", qty: 200, unit: "g" },
          { name: "Huevo", qty: 1, unit: "ud" },
          { name: "Pimentón dulce", qty: 1, unit: "cdta" },
        ],
      },
    ],
  },
  {
    id: "r24",
    name: "Cocido madrileño",
    category: "Legumbres",
    notes: "Tres vuelcos: caldo con fideos, garbanzos con verduras, carnes. Cocer a fuego suave al menos 2 h.",
    steps: [
      "Poner los garbanzos en remojo la noche anterior.",
      "Cocer en una olla grande la gallina, el morcillo, el hueso de jamón y los garbanzos, cubiertos de agua, 1 h 30 min - 2 h a fuego suave, espumando de vez en cuando.",
      "Añadir el chorizo y la morcilla los últimos 30 min.",
      "Aparte, cocer la patata, la zanahoria y el repollo hasta que estén tiernos.",
      "Colar parte del caldo, llevarlo a hervor y cocer los fideos 5 min para la sopa.",
      "Servir en tres vuelcos: sopa de fideos, verdura con garbanzos, y las carnes.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 650, // kcal/ración (estimado)
        allergens: ["gluten"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Garbanzos", qty: 400, unit: "g" },
          { name: "Morcillo de ternera", qty: 300, unit: "g" },
          { name: "Gallina", qty: 1, unit: "ud" },
          { name: "Hueso de jamón", qty: 1, unit: "ud" },
          { name: "Chorizo", qty: 150, unit: "g" },
          { name: "Morcilla", qty: 150, unit: "g" },
          { name: "Repollo", qty: 0.5, unit: "ud" },
          { name: "Patata", qty: 4, unit: "ud" },
          { name: "Zanahoria", qty: 3, unit: "ud" },
          { name: "Fideos finos", qty: 100, unit: "g" },
        ],
      },
    ],
  },
  {
    id: "r25",
    name: "Escalivada",
    category: "Verduras",
    notes: "Asar las verduras enteras en horno a 200 ºC unos 45 min, dejar enfriar y pelar. Servir con buen aceite y sal en escamas.",
    steps: [
      "Precalentar el horno a 200 ºC.",
      "Colocar la berenjena y el pimiento enteros en una bandeja con la cebolla, regar con un poco de aceite.",
      "Asar 40-45 min, dando la vuelta a mitad de cocción, hasta que la piel esté arrugada y la carne tierna.",
      "Dejar templar, pelar las verduras y cortarlas en tiras.",
      "Aliñar con el ajo picado, aceite de oliva virgen y sal en escamas.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 150, // kcal/ración (estimado)
        allergens: [], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Berenjena", qty: 2, unit: "ud" },
          { name: "Pimiento rojo", qty: 2, unit: "ud" },
          { name: "Cebolla", qty: 2, unit: "ud" },
          { name: "Ajo", qty: 4, unit: "diente" },
          { name: "Aceite de oliva virgen", qty: 4, unit: "cda" },
          { name: "Sal en escamas", qty: 1, unit: "cdta" },
        ],
      },
    ],
  },
  {
    id: "r26",
    name: "Pulpo a la gallega",
    category: "Pescado",
    notes: "Cocer el pulpo 35-40 min y dejar reposar 10 min en su agua. Cortar en rodajas con tijeras, sobre patata cocida. Aceite, sal gorda y pimentón al final.",
    steps: [
      "Cocer el pulpo en agua hirviendo, sin sal, 35-40 min según el tamaño, hasta que esté tierno al pincharlo.",
      "Dejar reposar el pulpo en su agua de cocción 10 min.",
      "Cocer las patatas en la misma agua hasta que estén tiernas, y cortarlas en rodajas gruesas para la base del plato.",
      "Cortar el pulpo con tijeras en rodajas y colocarlo sobre las patatas.",
      "Aliñar con aceite de oliva virgen, sal gorda y pimentón dulce (y picante, si se quiere) por encima.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 320, // kcal/ración (estimado)
        allergens: ["pescado"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Pulpo cocido", qty: 1, unit: "kg" },
          { name: "Patata", qty: 4, unit: "ud" },
          { name: "Aceite de oliva virgen", qty: 4, unit: "cda" },
          { name: "Pimentón dulce", qty: 1, unit: "cdta" },
          { name: "Pimentón picante", qty: 0.5, unit: "cdta", opt: true },
          { name: "Sal gorda", qty: 1, unit: "cdta" },
        ],
      },
    ],
  },
  {
    id: "r27",
    name: "Arroz al horno",
    category: "Arroz",
    notes: "Cazuela de barro mejor. Sofreír todo, añadir caldo hirviendo, al horno a 200 ºC unos 20 min sin remover.",
    steps: [
      "Precalentar el horno a 200 ºC.",
      "En una cazuela apta para horno, dorar las costillas y la morcilla en aceite.",
      "Añadir el ajo, la patata en rodajas y el tomate, sofreír 5 min.",
      "Incorporar el arroz y los garbanzos, mezclar, y cubrir con el caldo caliente con el pimentón disuelto.",
      "Hornear 20 min sin remover, hasta que el arroz esté en su punto y ligeramente dorado por encima.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 520, // kcal/ración (estimado)
        allergens: [], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Arroz bomba", qty: 400, unit: "g" },
          { name: "Costillas de cerdo", qty: 400, unit: "g" },
          { name: "Morcilla", qty: 1, unit: "ud" },
          { name: "Garbanzos cocidos", qty: 1, unit: "lata" },
          { name: "Patata", qty: 2, unit: "ud" },
          { name: "Tomate", qty: 2, unit: "ud" },
          { name: "Ajo", qty: 1, unit: "ud" },
          { name: "Caldo de carne", qty: 1, unit: "l" },
          { name: "Pimentón dulce", qty: 1, unit: "cdta" },
        ],
      },
    ],
  },
  {
    id: "r28",
    name: "Pimientos rellenos",
    category: "Verduras",
    notes: "Asar los pimientos antes para ablandar. Horno a 180 ºC unos 25 min con el relleno dentro.",
    steps: [
      "Precalentar el horno a 180 ºC.",
      "Para el relleno de carne: sofreír la cebolla y el ajo, añadir la carne picada y dorar; incorporar el arroz precocido, el tomate y el queso.",
      "Para el de verduras: sofreír la cebolla, el calabacín y los champiñones, añadir el arroz precocido, el tomate y el queso.",
      "Rellenar los pimientos, previamente vaciados, con la mezcla.",
      "Hornear 25-30 min hasta que los pimientos estén tiernos y el relleno dorado por encima.",
    ],
    variants: [
      {
        id: "v1",
        name: "De carne",
        calories: 380, // kcal/ración (estimado)
        allergens: ["lacteos"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Pimientos rojos grandes", qty: 4, unit: "ud" },
          { name: "Carne picada", qty: 400, unit: "g" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Arroz", qty: 100, unit: "g" },
          { name: "Tomate triturado", qty: 200, unit: "g" },
          { name: "Queso rallado", qty: 50, unit: "g", opt: true },
          { name: "Ajo", qty: 2, unit: "diente" },
        ],
      },
      {
        id: "v2",
        name: "De arroz y verduras",
        calories: 320, // kcal/ración (estimado)
        allergens: ["lacteos"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Pimientos rojos grandes", qty: 4, unit: "ud" },
          { name: "Arroz", qty: 200, unit: "g" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Calabacín", qty: 1, unit: "ud" },
          { name: "Tomate triturado", qty: 200, unit: "g" },
          { name: "Champiñones", qty: 150, unit: "g" },
          { name: "Queso rallado", qty: 50, unit: "g" },
        ],
      },
    ],
  },

  /* ---------- INTERNACIONAL ---------- */
  {
    id: "r29",
    name: "Pizza casera",
    category: "Pizza",
    notes: "Si haces la masa, dejarla levar 1 h. Horno al máximo (240 ºC) con la bandeja precalentada para que la base quede crujiente.",
    steps: [
      "Precalentar el horno al máximo que alcance, con la bandeja dentro para que se caliente.",
      "Estirar la masa de pizza sobre papel de horno.",
      "Cubrir con el tomate triturado, dejando un borde libre.",
      "Repartir la mozzarella y los ingredientes de cada variante: albahaca; los cuatro quesos; o el pepperoni, bacon y chorizo.",
      "Deslizar la pizza, con el papel, sobre la bandeja caliente y hornear 8-10 min hasta que el borde esté dorado y el queso burbujeante.",
    ],
    variants: [
      {
        id: "v1",
        name: "Margarita",
        calories: 550, // kcal/ración (estimado)
        allergens: ["gluten", "lacteos"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Masa de pizza", qty: 2, unit: "ud" },
          { name: "Tomate triturado", qty: 200, unit: "g" },
          { name: "Mozzarella", qty: 250, unit: "g" },
          { name: "Albahaca fresca", qty: 1, unit: "taza", opt: true },
          { name: "Aceite de oliva", qty: 2, unit: "cda" },
          { name: "Orégano", qty: 1, unit: "cdta", opt: true },
        ],
      },
      {
        id: "v2",
        name: "Cuatro quesos",
        calories: 650, // kcal/ración (estimado)
        allergens: ["gluten", "lacteos"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Masa de pizza", qty: 2, unit: "ud" },
          { name: "Tomate triturado", qty: 200, unit: "g" },
          { name: "Mozzarella", qty: 150, unit: "g" },
          { name: "Queso azul", qty: 80, unit: "g" },
          { name: "Parmesano", qty: 50, unit: "g" },
          { name: "Queso de cabra", qty: 80, unit: "g" },
        ],
      },
      {
        id: "v3",
        name: "Carnívora",
        calories: 700, // kcal/ración (estimado)
        allergens: ["gluten", "lacteos"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Masa de pizza", qty: 2, unit: "ud" },
          { name: "Tomate triturado", qty: 200, unit: "g" },
          { name: "Mozzarella", qty: 200, unit: "g" },
          { name: "Pepperoni", qty: 100, unit: "g" },
          { name: "Bacon", qty: 100, unit: "g" },
          { name: "Chorizo", qty: 80, unit: "g" },
        ],
      },
    ],
  },
  {
    id: "r30",
    name: "Lasaña boloñesa",
    category: "Pasta",
    notes: "La boloñesa, lo más lenta posible (mín. 45 min). Capas: salsa-pasta-bechamel-queso. Horno 200 ºC unos 30 min.",
    steps: [
      "Sofreír la cebolla, la zanahoria y el apio picados en aceite 8 min.",
      "Añadir la carne picada y dorar bien, deshaciendo los grumos.",
      "Incorporar el vino tinto y dejar que reduzca, luego el tomate triturado; cocer a fuego suave 30-40 min.",
      "Para la bechamel: fundir la mantequilla, añadir la harina y cocinar 2 min, luego la leche poco a poco hasta espesar.",
      "Montar la lasaña en capas —boloñesa, placas, bechamel— repitiendo, y terminar con bechamel y queso rallado por encima.",
      "Hornear a 200 ºC 25-30 min hasta que esté dorada por encima.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 550, // kcal/ración (estimado)
        allergens: ["gluten", "lacteos"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Placas de lasaña", qty: 12, unit: "ud" },
          { name: "Carne picada", qty: 500, unit: "g" },
          { name: "Tomate triturado", qty: 400, unit: "g" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Zanahoria", qty: 1, unit: "ud" },
          { name: "Apio", qty: 1, unit: "ud", opt: true },
          { name: "Mantequilla", qty: 50, unit: "g" },
          { name: "Harina", qty: 50, unit: "g" },
          { name: "Leche", qty: 500, unit: "ml" },
          { name: "Queso rallado", qty: 150, unit: "g" },
          { name: "Vino tinto", qty: 100, unit: "ml", opt: true },
        ],
      },
    ],
  },
  {
    id: "r31",
    name: "Risotto de setas",
    category: "Arroz",
    notes: "Caldo siempre caliente, cucharón a cucharón. Mantecar al final con mantequilla y parmesano fuera del fuego.",
    steps: [
      "Sofreír la cebolla picada en mantequilla a fuego suave 5 min.",
      "Añadir el arroz y nacarar 1-2 min removiendo.",
      "Verter el vino blanco y dejar que se evapore el alcohol.",
      "Añadir el caldo caliente poco a poco, un cucharón cada vez, esperando a que se absorba antes de añadir más (unos 18 min en total).",
      "A media cocción, añadir las setas salteadas aparte.",
      "Fuera del fuego, mantecar con mantequilla y parmesano hasta que quede cremoso.",
    ],
    variants: [
      {
        id: "v1",
        name: "Con setas variadas",
        calories: 480, // kcal/ración (estimado)
        allergens: ["lacteos"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Arroz arborio", qty: 320, unit: "g" },
          { name: "Setas variadas", qty: 300, unit: "g" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Vino blanco", qty: 100, unit: "ml" },
          { name: "Caldo de verduras", qty: 1, unit: "l" },
          { name: "Mantequilla", qty: 50, unit: "g" },
          { name: "Parmesano", qty: 80, unit: "g" },
          { name: "Perejil", qty: 1, unit: "cda", opt: true },
        ],
      },
    ],
  },
  {
    id: "r32",
    name: "Pad thai",
    category: "Asiática",
    notes: "Wok a fuego muy fuerte. Tener todos los ingredientes preparados antes de empezar.",
    steps: [
      "Remojar los fideos de arroz en agua caliente 10 min, hasta que estén flexibles, y escurrir.",
      "Calentar el wok a fuego muy fuerte con un poco de aceite; saltear las gambas (o el pollo) hasta que estén hechos.",
      "Apartar a un lado del wok y cuajar el huevo batido en el hueco libre.",
      "Añadir los fideos, los brotes de soja, la salsa de pescado, la salsa de soja y el azúcar; saltear todo junto 2-3 min.",
      "Servir con los cacahuetes picados y lima por encima.",
    ],
    variants: [
      {
        id: "v1",
        name: "De gambas",
        calories: 480, // kcal/ración (estimado)
        allergens: ["frutos_secos", "gluten", "huevo", "pescado", "soja"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Fideos de arroz", qty: 300, unit: "g" },
          { name: "Gambas", qty: 300, unit: "g" },
          { name: "Huevo", qty: 2, unit: "ud" },
          { name: "Brotes de soja", qty: 150, unit: "g" },
          { name: "Cacahuetes tostados", qty: 60, unit: "g" },
          { name: "Lima", qty: 2, unit: "ud" },
          { name: "Salsa de pescado", qty: 2, unit: "cda" },
          { name: "Salsa de soja", qty: 2, unit: "cda" },
          { name: "Azúcar moreno", qty: 1, unit: "cda" },
          { name: "Ajo", qty: 2, unit: "diente" },
          { name: "Cilantro", qty: 1, unit: "taza", opt: true },
        ],
      },
      {
        id: "v2",
        name: "De pollo",
        calories: 520, // kcal/ración (estimado)
        allergens: ["frutos_secos", "gluten", "huevo", "soja"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Fideos de arroz", qty: 300, unit: "g" },
          { name: "Pechuga de pollo", qty: 400, unit: "g" },
          { name: "Huevo", qty: 2, unit: "ud" },
          { name: "Brotes de soja", qty: 150, unit: "g" },
          { name: "Cacahuetes tostados", qty: 60, unit: "g" },
          { name: "Lima", qty: 2, unit: "ud" },
          { name: "Salsa de soja", qty: 3, unit: "cda" },
          { name: "Azúcar moreno", qty: 1, unit: "cda" },
          { name: "Ajo", qty: 2, unit: "diente" },
        ],
      },
    ],
  },
  {
    id: "r33",
    name: "Tacos al pastor",
    category: "Tex-Mex",
    notes: "Marinar el cerdo al menos 2 h con adobo. Servir con piña asada, cebolla y cilantro picado.",
    steps: [
      "Marinar el lomo de cerdo cortado en filetes finos con el pimentón, el comino y el orégano mínimo 2 h.",
      "Marcar la carne en una plancha o sartén muy caliente hasta que esté dorada y hecha.",
      "En la misma plancha, dorar unas rodajas de piña.",
      "Picar la carne y la piña en trozos pequeños.",
      "Calentar las tortillas de maíz y rellenar con la carne, la piña, la cebolla morada y el cilantro picados, con un chorro de lima.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 450, // kcal/ración (estimado)
        allergens: [], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Tortillas de maíz", qty: 12, unit: "ud" },
          { name: "Lomo de cerdo", qty: 600, unit: "g" },
          { name: "Piña fresca", qty: 0.5, unit: "ud" },
          { name: "Cebolla morada", qty: 1, unit: "ud" },
          { name: "Cilantro", qty: 1, unit: "taza", opt: true },
          { name: "Lima", qty: 2, unit: "ud" },
          { name: "Pimentón dulce", qty: 1, unit: "cda" },
          { name: "Comino", qty: 1, unit: "cdta" },
          { name: "Orégano", qty: 1, unit: "cdta", opt: true },
        ],
      },
    ],
  },
  {
    id: "r34",
    name: "Chili con carne",
    category: "Tex-Mex",
    notes: "Cuanto más se cocine a fuego suave, mejor. Mínimo 30 min. Servir con arroz blanco o nachos.",
    steps: [
      "Sofreír la cebolla y el pimiento en aceite 8 min.",
      "Añadir el ajo y la carne picada, dorar bien deshaciendo los grumos.",
      "Incorporar el comino y el chile en polvo, remover 1 min.",
      "Añadir el tomate triturado y las alubias, cocer a fuego suave 25-30 min hasta que espese.",
      "Servir con cilantro fresco picado por encima.",
    ],
    variants: [
      {
        id: "v1",
        name: "Con alubias",
        calories: 480, // kcal/ración (estimado)
        allergens: [], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Carne picada", qty: 500, unit: "g" },
          { name: "Alubias rojas cocidas", qty: 2, unit: "lata" },
          { name: "Tomate triturado", qty: 400, unit: "g" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Pimiento rojo", qty: 1, unit: "ud" },
          { name: "Ajo", qty: 3, unit: "diente" },
          { name: "Comino", qty: 1, unit: "cdta" },
          { name: "Chile en polvo", qty: 1, unit: "cda" },
          { name: "Cilantro", qty: 1, unit: "cda", opt: true },
        ],
      },
    ],
  },
  {
    id: "r35",
    name: "Cuscús con verduras",
    category: "Marroquí",
    notes: "Hidratar el cuscús con agua hirviendo y un chorrito de aceite. Las verduras estofadas a fuego lento con las especias.",
    steps: [
      "Cortar la calabaza, el calabacín y la zanahoria en dados.",
      "Sofreír la cebolla, añadir las verduras y el ras el hanout, rehogar 5 min (en la versión de pollo, añadir el pollo troceado desde el principio).",
      "Cubrir con el caldo y cocer 15-20 min hasta que las verduras estén tiernas.",
      "Aparte, hidratar el cuscús con la misma cantidad de agua o caldo hirviendo, tapado 5 min, y soltar los granos con un tenedor.",
      "Servir el cuscús con las verduras y su caldo por encima.",
    ],
    variants: [
      {
        id: "v1",
        name: "De verduras",
        calories: 380, // kcal/ración (estimado)
        allergens: ["gluten"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Cuscús", qty: 300, unit: "g" },
          { name: "Calabaza", qty: 300, unit: "g" },
          { name: "Calabacín", qty: 1, unit: "ud" },
          { name: "Zanahoria", qty: 2, unit: "ud" },
          { name: "Garbanzos cocidos", qty: 1, unit: "lata" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Ras el hanout", qty: 1, unit: "cda" },
          { name: "Caldo de verduras", qty: 400, unit: "ml" },
        ],
      },
      {
        id: "v2",
        name: "De pollo",
        calories: 450, // kcal/ración (estimado)
        allergens: ["gluten"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Cuscús", qty: 300, unit: "g" },
          { name: "Muslos de pollo", qty: 4, unit: "ud" },
          { name: "Calabaza", qty: 300, unit: "g" },
          { name: "Zanahoria", qty: 2, unit: "ud" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Ras el hanout", qty: 1, unit: "cda" },
          { name: "Caldo de pollo", qty: 400, unit: "ml" },
        ],
      },
    ],
  },
  {
    id: "r36",
    name: "Poke bowl",
    category: "Asiática",
    notes: "Marinar el pescado 15 min en soja y sésamo. Montar el bol justo antes de servir.",
    steps: [
      "Cocer el arroz para sushi y aliñarlo con un poco de vinagre de arroz mientras aún está caliente.",
      "Cortar el salmón (o el atún) fresco en dados, y el aguacate y el pepino en láminas.",
      "Repartir el arroz en boles y colocar encima el pescado y las verduras por secciones.",
      "Aliñar con la salsa de soja y espolvorear el sésamo por encima.",
      "Servir frío, recién montado.",
    ],
    variants: [
      {
        id: "v1",
        name: "De salmón",
        calories: 520, // kcal/ración (estimado)
        allergens: ["frutos_secos", "gluten", "pescado", "soja"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Arroz para sushi", qty: 300, unit: "g" },
          { name: "Salmón fresco", qty: 400, unit: "g" },
          { name: "Aguacate", qty: 1, unit: "ud" },
          { name: "Pepino", qty: 1, unit: "ud" },
          { name: "Zanahoria", qty: 1, unit: "ud" },
          { name: "Edamame", qty: 150, unit: "g" },
          { name: "Salsa de soja", qty: 3, unit: "cda" },
          { name: "Sésamo", qty: 1, unit: "cda" },
          { name: "Alga nori", qty: 1, unit: "ud", opt: true },
        ],
      },
      {
        id: "v2",
        name: "De atún",
        calories: 480, // kcal/ración (estimado)
        allergens: ["frutos_secos", "gluten", "pescado", "soja"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Arroz para sushi", qty: 300, unit: "g" },
          { name: "Atún fresco", qty: 400, unit: "g" },
          { name: "Aguacate", qty: 1, unit: "ud" },
          { name: "Mango", qty: 1, unit: "ud" },
          { name: "Pepino", qty: 1, unit: "ud" },
          { name: "Salsa de soja", qty: 3, unit: "cda" },
          { name: "Sésamo", qty: 1, unit: "cda" },
        ],
      },
    ],
  },
  {
    id: "r37",
    name: "Hummus con crudités",
    category: "Tapas",
    notes: "Triturar los garbanzos hasta que esté muy cremoso. Aceite generoso y un toque de pimentón por encima al servir.",
    steps: [
      "Escurrir bien los garbanzos cocidos.",
      "Triturar los garbanzos con el tahini, el ajo, el zumo de limón, el comino y un poco de agua hasta obtener una crema fina.",
      "Ir añadiendo aceite de oliva en hilo mientras se tritura, hasta la textura deseada.",
      "Rectificar de sal y limón al gusto.",
      "Servir con un chorro de aceite por encima, las verduras cortadas en bastones y el pan de pita.",
    ],
    variants: [
      {
        id: "v1",
        name: "Clásico",
        calories: 350, // kcal/ración (estimado)
        allergens: ["gluten", "frutos_secos"], // estimado a partir de los ingredientes (tahini es sésamo)
        ingredients: [
          { name: "Garbanzos cocidos", qty: 2, unit: "lata" },
          { name: "Tahini", qty: 3, unit: "cda" },
          { name: "Ajo", qty: 2, unit: "diente" },
          { name: "Limón", qty: 1, unit: "ud" },
          { name: "Aceite de oliva", qty: 4, unit: "cda" },
          { name: "Comino", qty: 1, unit: "cdta" },
          { name: "Zanahoria", qty: 2, unit: "ud" },
          { name: "Apio", qty: 2, unit: "ud" },
          { name: "Pan de pita", qty: 4, unit: "ud" },
        ],
      },
    ],
  },
  {
    id: "r38",
    name: "Wok de fideos con verduras",
    category: "Asiática",
    notes: "Tener todo cortado antes de empezar. Wok a fuego máximo, ir añadiendo por orden de cocción.",
    steps: [
      "Cocer los fideos chinos según el paquete y reservar.",
      "Calentar el wok a fuego muy fuerte con aceite; saltear el pollo (o el tofu) hasta que esté dorado.",
      "Añadir el brócoli, la zanahoria y el pimiento, saltear 3-4 min para que queden al dente.",
      "Incorporar los fideos, la salsa de soja, el jengibre y el ajo, saltear todo junto 2 min.",
      "Terminar con un chorrito de aceite de sésamo y servir caliente.",
    ],
    variants: [
      {
        id: "v1",
        name: "Con pollo",
        calories: 450, // kcal/ración (estimado)
        allergens: ["frutos_secos", "gluten", "soja"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Fideos chinos", qty: 250, unit: "g" },
          { name: "Pechuga de pollo", qty: 400, unit: "g" },
          { name: "Brócoli", qty: 200, unit: "g" },
          { name: "Zanahoria", qty: 1, unit: "ud" },
          { name: "Pimiento rojo", qty: 1, unit: "ud" },
          { name: "Salsa de soja", qty: 4, unit: "cda" },
          { name: "Jengibre", qty: 1, unit: "cda" },
          { name: "Ajo", qty: 2, unit: "diente" },
          { name: "Aceite de sésamo", qty: 1, unit: "cda", opt: true },
        ],
      },
      {
        id: "v2",
        name: "Con tofu",
        calories: 400, // kcal/ración (estimado)
        allergens: ["gluten", "soja"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Fideos chinos", qty: 250, unit: "g" },
          { name: "Tofu firme", qty: 350, unit: "g" },
          { name: "Brócoli", qty: 200, unit: "g" },
          { name: "Zanahoria", qty: 1, unit: "ud" },
          { name: "Champiñones", qty: 200, unit: "g" },
          { name: "Salsa de soja", qty: 4, unit: "cda" },
          { name: "Jengibre", qty: 1, unit: "cda" },
          { name: "Ajo", qty: 2, unit: "diente" },
        ],
      },
    ],
  },
  {
    id: "r39",
    name: "Goulash húngaro",
    category: "Carne",
    notes: "Mucha cebolla, fuego suave. Mínimo 1,5 h para que la carne quede tierna. El pimentón ahumado marca la diferencia.",
    steps: [
      "Dorar la carne de ternera en una olla con un poco de aceite, por tandas para que selle bien.",
      "En la misma olla, sofreír la cebolla y el pimiento 8 min.",
      "Añadir el pimentón dulce y ahumado fuera del fuego, remover y volver a poner al fuego.",
      "Incorporar el tomate triturado, la carne dorada, la patata y el caldo.",
      "Cocer a fuego lento 1 h 30 min - 2 h, hasta que la carne esté muy tierna.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 480, // kcal/ración (estimado)
        allergens: [], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Ternera para guisar", qty: 700, unit: "g" },
          { name: "Cebolla", qty: 3, unit: "ud" },
          { name: "Pimiento rojo", qty: 2, unit: "ud" },
          { name: "Tomate triturado", qty: 200, unit: "g" },
          { name: "Patata", qty: 4, unit: "ud" },
          { name: "Pimentón dulce", qty: 2, unit: "cda" },
          { name: "Pimentón ahumado", qty: 1, unit: "cdta" },
          { name: "Caldo de carne", qty: 500, unit: "ml" },
          { name: "Comino", qty: 1, unit: "cdta", opt: true },
        ],
      },
    ],
  },
  {
    id: "r40",
    name: "Quiche lorraine",
    category: "Hornear",
    notes: "Hornear la masa sola 10 min antes de añadir el relleno (así no se humedece). Horno a 180 ºC unos 35 min.",
    steps: [
      "Precalentar el horno a 200 ºC. Forrar un molde con la masa quebrada y pincharla con un tenedor.",
      "Hornear la masa sola (\"en blanco\") 10 min para que no quede cruda por debajo.",
      "Dorar el bacon en una sartén (o pochar el puerro, en la otra versión).",
      "Batir los huevos con la nata y salpimentar.",
      "Repartir el bacon (o puerro) y el queso sobre la masa, cubrir con la mezcla de huevo y nata.",
      "Hornear 30-35 min a 180 ºC hasta que esté cuajada y dorada.",
    ],
    variants: [
      {
        id: "v1",
        name: "Clásica",
        calories: 480, // kcal/ración (estimado)
        allergens: ["gluten", "huevo", "lacteos"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Masa quebrada", qty: 1, unit: "ud" },
          { name: "Bacon", qty: 200, unit: "g" },
          { name: "Huevos", qty: 4, unit: "ud" },
          { name: "Nata", qty: 200, unit: "ml" },
          { name: "Queso rallado", qty: 100, unit: "g" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Nuez moscada", qty: 1, unit: "pinch", opt: true },
        ],
      },
      {
        id: "v2",
        name: "De puerro y queso",
        calories: 450, // kcal/ración (estimado)
        allergens: ["gluten", "huevo", "lacteos"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Masa quebrada", qty: 1, unit: "ud" },
          { name: "Puerro", qty: 3, unit: "ud" },
          { name: "Huevos", qty: 4, unit: "ud" },
          { name: "Nata", qty: 200, unit: "ml" },
          { name: "Queso de cabra", qty: 120, unit: "g" },
          { name: "Mantequilla", qty: 20, unit: "g" },
        ],
      },
    ],
  },

  /* ---------- RÁPIDAS (15-30 min) ---------- */
  {
    id: "r41",
    name: "Sándwich club",
    category: "Rápidas",
    notes: "Tostar el pan justo antes de montar. Cortar en triángulos y pinchar con palillo para que no se desmonte.",
    steps: [
      "Tostar el pan de molde.",
      "Hacer el pollo a la plancha salpimentado, 4-5 min por lado, y cortarlo en tiras. Freír el bacon hasta que esté crujiente.",
      "Cocer el huevo si se quiere añadir en rodajas.",
      "Montar por capas: pan, mayonesa, lechuga, tomate, pollo, otro pan, bacon, huevo, y el pan final.",
      "Sujetar con palillos y cortar en triángulos.",
    ],
    variants: [
      {
        id: "v1",
        name: "Clásico",
        calories: 520, // kcal/ración (estimado)
        allergens: ["gluten", "huevo"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Pan de molde", qty: 12, unit: "ud" },
          { name: "Pechuga de pollo", qty: 300, unit: "g" },
          { name: "Bacon", qty: 8, unit: "ud" },
          { name: "Lechuga", qty: 1, unit: "ud" },
          { name: "Tomate", qty: 2, unit: "ud" },
          { name: "Mayonesa", qty: 4, unit: "cda" },
          { name: "Huevo", qty: 2, unit: "ud", opt: true },
        ],
      },
    ],
  },
  {
    id: "r42",
    name: "Wrap de pollo",
    category: "Rápidas",
    notes: "Calentar la tortilla unos segundos antes de rellenar para que sea flexible. Enrollar bien apretado.",
    steps: [
      "Hacer el pollo a la plancha salpimentado y cortarlo en tiras (o usar pollo ya cocinado).",
      "Calentar la tortilla de trigo unos segundos para que quede flexible.",
      "Rellenar con el pollo y, en la versión césar, la lechuga, el parmesano y la salsa césar; en la mexicana, el aguacate, el maíz, el tomate y el queso.",
      "Enrollar bien apretado, doblando los extremos hacia dentro.",
      "Cortar por la mitad en diagonal para servir.",
    ],
    variants: [
      {
        id: "v1",
        name: "César",
        calories: 450, // kcal/ración (estimado)
        allergens: ["gluten", "huevo", "lacteos", "pescado"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Tortilla de trigo grande", qty: 4, unit: "ud" },
          { name: "Pollo a la plancha", qty: 400, unit: "g" },
          { name: "Lechuga romana", qty: 1, unit: "ud" },
          { name: "Parmesano", qty: 50, unit: "g" },
          { name: "Salsa césar", qty: 4, unit: "cda" },
        ],
      },
      {
        id: "v2",
        name: "Mexicano",
        calories: 480, // kcal/ración (estimado)
        allergens: ["gluten", "lacteos"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Tortilla de trigo grande", qty: 4, unit: "ud" },
          { name: "Pollo a la plancha", qty: 400, unit: "g" },
          { name: "Aguacate", qty: 1, unit: "ud" },
          { name: "Maíz dulce", qty: 1, unit: "lata" },
          { name: "Tomate", qty: 1, unit: "ud" },
          { name: "Queso rallado", qty: 80, unit: "g" },
          { name: "Salsa picante", qty: 2, unit: "cda", opt: true },
        ],
      },
    ],
  },
  {
    id: "r43",
    name: "Ensalada de quinoa",
    category: "Ensaladas",
    notes: "Cocer la quinoa 15 min, enfriar antes de aliñar. Aguanta perfecta 2 días en nevera.",
    steps: [
      "Cocer la quinoa en agua con sal 15 min, hasta que los granos se abran, y dejar enfriar.",
      "Cortar el tomate cherry, el pepino y el aguacate.",
      "Mezclar la quinoa fría con las verduras, los garbanzos, la feta y las aceitunas.",
      "Aliñar con el zumo de limón y el aceite de oliva.",
      "Remover bien y servir fresca.",
    ],
    variants: [
      {
        id: "v1",
        name: "Mediterránea",
        calories: 420, // kcal/ración (estimado)
        allergens: ["lacteos"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Quinoa", qty: 200, unit: "g" },
          { name: "Tomate cherry", qty: 200, unit: "g" },
          { name: "Pepino", qty: 1, unit: "ud" },
          { name: "Aguacate", qty: 1, unit: "ud" },
          { name: "Garbanzos cocidos", qty: 1, unit: "lata" },
          { name: "Queso feta", qty: 100, unit: "g" },
          { name: "Aceitunas", qty: 60, unit: "g" },
          { name: "Limón", qty: 1, unit: "ud" },
          { name: "Aceite de oliva", qty: 3, unit: "cda" },
        ],
      },
    ],
  },
  {
    id: "r44",
    name: "Brochetas de pollo y verduras",
    category: "Carne",
    notes: "Marinar el pollo 15 min mínimo. Plancha o parrilla fuerte, 4 min por lado.",
    steps: [
      "Cortar el pollo y las verduras en dados de tamaño similar.",
      "Marinar con aceite, limón, orégano y romero mínimo 30 min.",
      "Montar las brochetas alternando pollo y verduras.",
      "Asar a la plancha o parrilla a fuego medio-alto, 3-4 min por cada lado, girando para que se doren por igual.",
      "Servir con un chorro de limón.",
    ],
    variants: [
      {
        id: "v1",
        name: "Mediterráneas",
        calories: 350, // kcal/ración (estimado)
        allergens: [], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Pechuga de pollo", qty: 500, unit: "g" },
          { name: "Calabacín", qty: 1, unit: "ud" },
          { name: "Pimiento rojo", qty: 1, unit: "ud" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Tomate cherry", qty: 200, unit: "g" },
          { name: "Aceite de oliva", qty: 3, unit: "cda" },
          { name: "Limón", qty: 1, unit: "ud" },
          { name: "Orégano", qty: 1, unit: "cdta", opt: true },
          { name: "Romero", qty: 1, unit: "cdta", opt: true },
        ],
      },
    ],
  },
  {
    id: "r45",
    name: "Gambas al ajillo",
    category: "Pescado",
    notes: "Cazuela de barro y aceite generoso. El ajo dorado, no quemado. Apagar el fuego antes de añadir las gambas para que no se pasen.",
    steps: [
      "Calentar el aceite en una cazuela de barro o sartén a fuego medio con el ajo laminado y la guindilla.",
      "Dorar el ajo despacio, sin que llegue a quemarse.",
      "Subir el fuego y añadir las gambas, salteando 1-2 min hasta que cambien de color.",
      "Añadir un chorrito de vino blanco si se usa, dejar evaporar el alcohol unos segundos.",
      "Espolvorear con perejil picado y servir muy caliente, con pan para mojar.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 280, // kcal/ración (estimado)
        allergens: ["pescado"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Gambas peladas", qty: 500, unit: "g" },
          { name: "Ajo", qty: 6, unit: "diente" },
          { name: "Aceite de oliva", qty: 100, unit: "ml" },
          { name: "Guindilla", qty: 1, unit: "ud", opt: true },
          { name: "Perejil", qty: 1, unit: "cda", opt: true },
          { name: "Vino blanco", qty: 50, unit: "ml", opt: true },
        ],
      },
    ],
  },
  {
    id: "r46",
    name: "Bocadillo de calamares",
    category: "Rápidas",
    notes: "Calamares en aros, harina y fritos en aceite muy caliente. Pan crujiente y unas gotas de limón.",
    steps: [
      "Cortar los calamares en anillas y secarlos bien con papel de cocina.",
      "Pasar las anillas por harina, sacudiendo el exceso.",
      "Freír en aceite bien caliente en tandas pequeñas, 1-2 min hasta que estén dorados y crujientes.",
      "Escurrir sobre papel absorbente y salar al momento.",
      "Rellenar el pan con los calamares, un chorro de limón y alioli al gusto.",
    ],
    variants: [
      {
        id: "v1",
        name: "Madrileño",
        calories: 550, // kcal/ración (estimado)
        allergens: ["gluten", "pescado"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Pan de barra", qty: 2, unit: "ud" },
          { name: "Anillas de calamar", qty: 500, unit: "g" },
          { name: "Harina", qty: 100, unit: "g" },
          { name: "Aceite de oliva", qty: 300, unit: "ml" },
          { name: "Limón", qty: 1, unit: "ud" },
          { name: "Alioli", qty: 4, unit: "cda", opt: true },
        ],
      },
    ],
  },
  {
    id: "r47",
    name: "Tortilla francesa con relleno",
    category: "Huevos",
    notes: "Fuego medio-fuerte, batir bien los huevos. Doblar en cuanto cuaje por fuera y aún esté algo cremosa por dentro.",
    steps: [
      "Batir los huevos con una pizca de sal.",
      "Calentar la mantequilla en una sartén a fuego medio-alto.",
      "En la versión de queso y jamón: verter el huevo, y cuando empiece a cuajar por los bordes, añadir el jamón y el queso en el centro.",
      "En la de champiñones: saltear los champiñones con ajo antes de añadir el huevo.",
      "Doblar la tortilla por la mitad en cuanto esté cuajada por fuera y aún cremosa por dentro, y servir enseguida.",
    ],
    variants: [
      {
        id: "v1",
        name: "De queso y jamón",
        calories: 350, // kcal/ración (estimado)
        allergens: ["huevo", "lacteos"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Huevos", qty: 6, unit: "ud" },
          { name: "Jamón cocido", qty: 100, unit: "g" },
          { name: "Queso para fundir", qty: 80, unit: "g" },
          { name: "Mantequilla", qty: 20, unit: "g" },
        ],
      },
      {
        id: "v2",
        name: "De champiñones",
        calories: 280, // kcal/ración (estimado)
        allergens: ["huevo", "lacteos"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Huevos", qty: 6, unit: "ud" },
          { name: "Champiñones", qty: 200, unit: "g" },
          { name: "Ajo", qty: 1, unit: "diente" },
          { name: "Mantequilla", qty: 20, unit: "g" },
          { name: "Perejil", qty: 1, unit: "cda", opt: true },
        ],
      },
    ],
  },
  {
    id: "r48",
    name: "Sopa de fideos",
    category: "Cremas y sopas",
    notes: "Caldo bueno, fideos los justos. 5-6 min y listo. Un huevo escalfado por encima la convierte en plato único.",
    steps: [
      "Calentar el caldo de pollo en una olla.",
      "Añadir la zanahoria y el apio en rodajas finas, cocer 8-10 min.",
      "Incorporar los fideos finos y cocer 5-6 min más, hasta que estén tiernos.",
      "Añadir el pollo cocido desmenuzado y calentar 2 min.",
      "Servir bien caliente con perejil picado por encima.",
    ],
    variants: [
      {
        id: "v1",
        name: "De pollo",
        calories: 220, // kcal/ración (estimado)
        allergens: ["gluten"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Caldo de pollo", qty: 1.5, unit: "l" },
          { name: "Fideos finos", qty: 150, unit: "g" },
          { name: "Pollo cocido desmenuzado", qty: 200, unit: "g" },
          { name: "Zanahoria", qty: 1, unit: "ud" },
          { name: "Apio", qty: 1, unit: "ud", opt: true },
          { name: "Hierbabuena", qty: 1, unit: "cda", opt: true },
        ],
      },
    ],
  },

  /* ---------- DESAYUNOS ---------- */
  {
    id: "r49",
    name: "Tostadas con tomate",
    category: "Desayuno",
    notes: "Pan tostado, ajo restregado, tomate rallado, aceite generoso y sal. El básico andaluz.",
    steps: [
      "Tostar el pan de hogaza hasta que esté crujiente.",
      "Restregar un diente de ajo por la superficie de cada tostada.",
      "Rallar el tomate maduro y repartirlo sobre el pan.",
      "Regar con un buen chorro de aceite de oliva virgen y una pizca de sal.",
      "En la versión con jamón, añadir unas lonchas por encima.",
    ],
    variants: [
      {
        id: "v1",
        name: "Con jamón",
        calories: 320, // kcal/ración (estimado)
        allergens: ["gluten"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Pan de hogaza", qty: 4, unit: "ud" },
          { name: "Tomate maduro", qty: 2, unit: "ud" },
          { name: "Ajo", qty: 1, unit: "diente" },
          { name: "Aceite de oliva virgen", qty: 3, unit: "cda" },
          { name: "Jamón serrano", qty: 100, unit: "g" },
          { name: "Sal", qty: 1, unit: "pinch" },
        ],
      },
      {
        id: "v2",
        name: "Solo",
        calories: 220, // kcal/ración (estimado)
        allergens: ["gluten"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Pan de hogaza", qty: 4, unit: "ud" },
          { name: "Tomate maduro", qty: 2, unit: "ud" },
          { name: "Ajo", qty: 1, unit: "diente" },
          { name: "Aceite de oliva virgen", qty: 3, unit: "cda" },
          { name: "Sal", qty: 1, unit: "pinch" },
        ],
      },
    ],
  },
  {
    id: "r50",
    name: "Porridge de avena",
    category: "Desayuno",
    notes: "Avena con el doble de líquido, fuego suave 5 min removiendo. Personalizar con fruta y un toque de canela.",
    steps: [
      "Poner los copos de avena y la leche en un cazo a fuego medio.",
      "Cocer 5 min removiendo, hasta que espese a la textura deseada.",
      "Retirar del fuego y añadir la miel.",
      "Servir con el plátano en rodajas y canela por encima, o con los frutos rojos y las almendras en la otra versión.",
    ],
    variants: [
      {
        id: "v1",
        name: "Con plátano y canela",
        calories: 380, // kcal/ración (estimado)
        allergens: ["frutos_secos", "lacteos"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Copos de avena", qty: 200, unit: "g" },
          { name: "Leche", qty: 400, unit: "ml" },
          { name: "Plátano", qty: 2, unit: "ud" },
          { name: "Miel", qty: 2, unit: "cda" },
          { name: "Canela", qty: 1, unit: "cdta" },
          { name: "Nueces", qty: 30, unit: "g", opt: true },
        ],
      },
      {
        id: "v2",
        name: "Con frutos rojos",
        calories: 350, // kcal/ración (estimado)
        allergens: ["frutos_secos", "lacteos"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Copos de avena", qty: 200, unit: "g" },
          { name: "Leche", qty: 400, unit: "ml" },
          { name: "Frutos rojos", qty: 200, unit: "g" },
          { name: "Miel", qty: 2, unit: "cda" },
          { name: "Almendras", qty: 30, unit: "g", opt: true },
        ],
      },
    ],
  },

  /* ---------- POSTRES ---------- */
  {
    id: "r51",
    name: "Arroz con leche",
    category: "Postres",
    notes: "Fuego muy suave y remover a menudo. Aroma con piel de limón y canela en rama, retirar antes de servir.",
    steps: [
      "Poner la leche a calentar con la piel de limón y la canela en rama.",
      "Cuando rompa a hervir, añadir el arroz y bajar a fuego muy suave.",
      "Cocer 35-40 min removiendo a menudo, para que no se pegue, hasta que el arroz esté cremoso.",
      "Añadir el azúcar los últimos 10 min de cocción.",
      "Retirar la piel de limón y la canela en rama, servir templado o frío con canela en polvo por encima.",
    ],
    variants: [
      {
        id: "v1",
        name: "Tradicional",
        calories: 280, // kcal/ración (estimado)
        allergens: ["lacteos"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Arroz", qty: 150, unit: "g" },
          { name: "Leche", qty: 1, unit: "l" },
          { name: "Azúcar", qty: 150, unit: "g" },
          { name: "Piel de limón", qty: 1, unit: "ud" },
          { name: "Canela en rama", qty: 1, unit: "ud" },
          { name: "Canela en polvo", qty: 1, unit: "cdta" },
        ],
      },
    ],
  },
  {
    id: "r52",
    name: "Manzana al horno",
    category: "Postres",
    notes: "Quitar el corazón, rellenar con azúcar y mantequilla. Horno 180 ºC unos 30-35 min. Mejor templada que caliente.",
    steps: [
      "Precalentar el horno a 180 ºC.",
      "Quitar el corazón de las manzanas con un descorazonador o cuchillo, sin llegar a la base.",
      "Rellenar el hueco con las nueces picadas, el azúcar moreno y un trozo de mantequilla.",
      "Colocar en una bandeja con un fondo de agua, y hornear 30-35 min hasta que estén tiernas.",
      "Servir templadas con un chorrito de miel y canela por encima.",
    ],
    variants: [
      {
        id: "v1",
        name: "Con nueces y miel",
        calories: 250, // kcal/ración (estimado)
        allergens: ["frutos_secos", "lacteos"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Manzana reineta", qty: 4, unit: "ud" },
          { name: "Azúcar moreno", qty: 4, unit: "cda" },
          { name: "Mantequilla", qty: 30, unit: "g" },
          { name: "Nueces", qty: 50, unit: "g" },
          { name: "Miel", qty: 2, unit: "cda" },
          { name: "Canela", qty: 1, unit: "cdta" },
        ],
      },
    ],
  },

  /* ---------- COCINA CHINA ---------- */
  {
    id: "r53",
    name: "Pollo Kung Pao",
    category: "China",
    baseServings: 4,
    notes: "Marinar el pollo 15 min en soja y maicena. Wok muy fuerte, saltear rápido. La salsa al final, justo para napar.",
    steps: [
      "Cortar el pollo en dados y marinarlo con un poco de salsa de soja y maicena 15 min.",
      "Calentar el wok a fuego fuerte con aceite, saltear el pollo hasta que esté dorado, y reservar.",
      "En el mismo wok, saltear el pimiento, el jengibre, el ajo y el chile seco 1-2 min.",
      "Devolver el pollo al wok, añadir la salsa de soja, el vinagre y el azúcar disueltos, saltear todo junto 2 min.",
      "Añadir los cacahuetes al final y servir enseguida.",
    ],
    variants: [
      {
        id: "v1",
        name: "Clásico",
        calories: 450, // kcal/ración (estimado)
        allergens: ["frutos_secos", "gluten", "soja"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Pechuga de pollo", qty: 500, unit: "g" },
          { name: "Cacahuetes tostados", qty: 80, unit: "g" },
          { name: "Pimiento rojo", qty: 1, unit: "ud" },
          { name: "Cebolleta", qty: 4, unit: "ud" },
          { name: "Ajo", qty: 3, unit: "diente" },
          { name: "Jengibre", qty: 1, unit: "cda" },
          { name: "Salsa de soja", qty: 3, unit: "cda" },
          { name: "Vinagre de arroz", qty: 1, unit: "cda" },
          { name: "Azúcar", qty: 1, unit: "cdta" },
          { name: "Maicena", qty: 1, unit: "cda" },
          { name: "Chile seco", qty: 4, unit: "ud", opt: true },
        ],
      },
    ],
  },
  {
    id: "r54",
    name: "Arroz frito tres delicias",
    category: "China",
    baseServings: 4,
    notes: "Mejor con arroz cocido del día anterior, frío. Wok caliente, ir añadiendo por orden: huevo, verdura, jamón, gambas, arroz al final.",
    steps: [
      "Usar arroz cocido y frío, mejor del día anterior.",
      "Calentar el wok a fuego fuerte con aceite, cuajar el huevo batido y reservarlo troceado.",
      "Saltear las gambas y el jamón (versión tradicional) o los guisantes y el maíz (vegetariana) 2 min.",
      "Añadir el arroz, los guisantes y la zanahoria, saltear todo junto 3-4 min.",
      "Incorporar el huevo troceado y la salsa de soja, mezclar bien y servir caliente.",
    ],
    variants: [
      {
        id: "v1",
        name: "Tradicional",
        calories: 420, // kcal/ración (estimado)
        allergens: ["frutos_secos", "gluten", "huevo", "pescado", "soja"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Arroz cocido frío", qty: 600, unit: "g" },
          { name: "Huevos", qty: 3, unit: "ud" },
          { name: "Gambas peladas", qty: 200, unit: "g" },
          { name: "Jamón cocido", qty: 150, unit: "g" },
          { name: "Guisantes", qty: 150, unit: "g" },
          { name: "Zanahoria", qty: 1, unit: "ud" },
          { name: "Cebolleta", qty: 2, unit: "ud" },
          { name: "Salsa de soja", qty: 3, unit: "cda" },
          { name: "Aceite de sésamo", qty: 1, unit: "cda", opt: true },
        ],
      },
      {
        id: "v2",
        name: "Vegetariano",
        calories: 380, // kcal/ración (estimado)
        allergens: ["gluten", "huevo", "soja"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Arroz cocido frío", qty: 600, unit: "g" },
          { name: "Huevos", qty: 3, unit: "ud" },
          { name: "Guisantes", qty: 200, unit: "g" },
          { name: "Maíz dulce", qty: 1, unit: "lata" },
          { name: "Zanahoria", qty: 1, unit: "ud" },
          { name: "Cebolleta", qty: 2, unit: "ud" },
          { name: "Salsa de soja", qty: 3, unit: "cda" },
        ],
      },
    ],
  },
  {
    id: "r55",
    name: "Ternera con brócoli",
    category: "China",
    baseServings: 4,
    notes: "Cortar la ternera muy fina contra la fibra. Marinar 20 min. El brócoli escaldado 1 min antes de saltear para que quede al dente.",
    steps: [
      "Cortar la ternera en tiras finas contra la fibra y marinarla con un poco de maicena y salsa de soja 15 min.",
      "Escaldar el brócoli en agua hirviendo 1 min y escurrir.",
      "Calentar el wok a fuego fuerte, saltear la ternera hasta que esté dorada, y reservar.",
      "En el mismo wok, saltear el ajo y el jengibre, añadir el brócoli y la ternera.",
      "Incorporar la salsa de ostras, la salsa de soja y el azúcar, saltear todo junto 2 min y servir.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estilo cantonés",
        calories: 380, // kcal/ración (estimado)
        allergens: ["gluten", "pescado", "soja"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Solomillo de ternera", qty: 500, unit: "g" },
          { name: "Brócoli", qty: 500, unit: "g" },
          { name: "Salsa de ostras", qty: 3, unit: "cda" },
          { name: "Salsa de soja", qty: 2, unit: "cda" },
          { name: "Maicena", qty: 2, unit: "cda" },
          { name: "Ajo", qty: 3, unit: "diente" },
          { name: "Jengibre", qty: 1, unit: "cda" },
          { name: "Aceite", qty: 3, unit: "cda" },
          { name: "Azúcar", qty: 1, unit: "cdta" },
        ],
      },
    ],
  },
  {
    id: "r56",
    name: "Cerdo agridulce",
    category: "China",
    baseServings: 4,
    notes: "Rebozar el cerdo dos veces para que quede crujiente. La salsa por encima al final, no antes (perdería el crujiente).",
    steps: [
      "Cortar el lomo de cerdo en dados y pasarlos por huevo batido y maicena.",
      "Freír en aceite caliente hasta que estén dorados y crujientes, y escurrir.",
      "En un wok, saltear los pimientos y la piña.",
      "Mezclar el vinagre de arroz, el azúcar, el ketchup y la salsa de soja, añadir al wok y dejar que espese ligeramente.",
      "Incorporar el cerdo frito, mezclar bien para que se impregne de la salsa, y servir enseguida.",
    ],
    variants: [
      {
        id: "v1",
        name: "Con piña",
        calories: 520, // kcal/ración (estimado)
        allergens: ["gluten", "huevo", "soja"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Lomo de cerdo", qty: 600, unit: "g" },
          { name: "Maicena", qty: 100, unit: "g" },
          { name: "Huevo", qty: 1, unit: "ud" },
          { name: "Piña en rodajas", qty: 1, unit: "lata" },
          { name: "Pimiento rojo", qty: 1, unit: "ud" },
          { name: "Pimiento verde", qty: 1, unit: "ud" },
          { name: "Vinagre de arroz", qty: 4, unit: "cda" },
          { name: "Azúcar", qty: 4, unit: "cda" },
          { name: "Ketchup", qty: 3, unit: "cda" },
          { name: "Salsa de soja", qty: 2, unit: "cda" },
        ],
      },
    ],
  },
  {
    id: "r57",
    name: "Tallarines lo mein",
    category: "China",
    baseServings: 4,
    notes: "Cocer los tallarines al dente. El salteado al wok muy rápido, todo dentro y mezclar bien.",
    steps: [
      "Cocer los tallarines chinos al huevo según el paquete y escurrir.",
      "Calentar el wok a fuego fuerte, saltear el pollo (o las gambas) hasta que esté hecho.",
      "Añadir la col china y la zanahoria, saltear 2-3 min.",
      "Incorporar los tallarines, la salsa de soja, la salsa de ostras y el aceite de sésamo.",
      "Saltear todo junto 2 min hasta que se integren los sabores y servir caliente.",
    ],
    variants: [
      {
        id: "v1",
        name: "De pollo y verduras",
        calories: 450, // kcal/ración (estimado)
        allergens: ["frutos_secos", "gluten", "huevo", "pescado", "soja"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Tallarines chinos al huevo", qty: 350, unit: "g" },
          { name: "Pechuga de pollo", qty: 300, unit: "g" },
          { name: "Col china", qty: 300, unit: "g" },
          { name: "Zanahoria", qty: 1, unit: "ud" },
          { name: "Cebolleta", qty: 3, unit: "ud" },
          { name: "Salsa de soja", qty: 4, unit: "cda" },
          { name: "Salsa de ostras", qty: 2, unit: "cda" },
          { name: "Aceite de sésamo", qty: 1, unit: "cda" },
          { name: "Ajo", qty: 2, unit: "diente" },
        ],
      },
      {
        id: "v2",
        name: "De gambas",
        calories: 420, // kcal/ración (estimado)
        allergens: ["frutos_secos", "gluten", "huevo", "pescado", "soja"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Tallarines chinos al huevo", qty: 350, unit: "g" },
          { name: "Gambas peladas", qty: 350, unit: "g" },
          { name: "Brotes de soja", qty: 200, unit: "g" },
          { name: "Pimiento rojo", qty: 1, unit: "ud" },
          { name: "Cebolleta", qty: 3, unit: "ud" },
          { name: "Salsa de soja", qty: 4, unit: "cda" },
          { name: "Aceite de sésamo", qty: 1, unit: "cda" },
          { name: "Ajo", qty: 2, unit: "diente" },
        ],
      },
    ],
  },

  /* ---------- COCINA JAPONESA ---------- */
  {
    id: "r58",
    name: "Ramen casero",
    category: "Japonesa",
    baseServings: 4,
    notes: "Caldo concentrado, mejor cocido 1 h. Cocer fideos justos antes de servir y montar el bol al momento.",
    steps: [
      "Preparar el caldo: cocer el caldo de pollo (o de verduras) con la salsa de soja, el mirin, el jengibre y el ajo, 30-40 min a fuego suave.",
      "Cocer los fideos ramen según el paquete, justo antes de servir.",
      "En la versión de cerdo, calentar la panceta ya cocinada en lonchas; en la de miso, disolver la pasta de miso en el caldo y saltear el tofu y los champiñones.",
      "Preparar un huevo por persona, cocido o escalfado.",
      "Montar el bol: caldo, fideos, la proteína, el huevo, el alga nori y la cebolleta picada por encima.",
    ],
    variants: [
      {
        id: "v1",
        name: "Shoyu de cerdo",
        calories: 550, // kcal/ración (estimado)
        allergens: ["gluten", "huevo", "soja"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Fideos ramen", qty: 4, unit: "ud" },
          { name: "Panceta de cerdo (chashu)", qty: 400, unit: "g" },
          { name: "Caldo de pollo", qty: 1.5, unit: "l" },
          { name: "Salsa de soja", qty: 100, unit: "ml" },
          { name: "Mirin", qty: 50, unit: "ml", opt: true },
          { name: "Huevo", qty: 4, unit: "ud" },
          { name: "Alga nori", qty: 4, unit: "ud" },
          { name: "Cebolleta", qty: 3, unit: "ud" },
          { name: "Jengibre", qty: 1, unit: "cda" },
          { name: "Ajo", qty: 3, unit: "diente" },
        ],
      },
      {
        id: "v2",
        name: "Vegetariano de miso",
        calories: 420, // kcal/ración (estimado)
        allergens: ["gluten", "huevo", "soja"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Fideos ramen", qty: 4, unit: "ud" },
          { name: "Caldo de verduras", qty: 1.5, unit: "l" },
          { name: "Pasta de miso", qty: 4, unit: "cda" },
          { name: "Tofu firme", qty: 300, unit: "g" },
          { name: "Champiñones shiitake", qty: 200, unit: "g" },
          { name: "Huevo", qty: 4, unit: "ud" },
          { name: "Alga nori", qty: 4, unit: "ud" },
          { name: "Cebolleta", qty: 3, unit: "ud" },
          { name: "Maíz dulce", qty: 1, unit: "lata", opt: true },
        ],
      },
    ],
  },
  {
    id: "r59",
    name: "Gyoza",
    category: "Japonesa",
    baseServings: 4,
    notes: "Sellar bien las gyoza para que no se abran. Plancha primero (3 min) y luego añadir agua y tapar para vapor.",
    steps: [
      "Mezclar la carne picada de cerdo (o las gambas picadas) con la col china, la cebolleta, el ajo y el jengibre picados, la salsa de soja y el aceite de sésamo.",
      "Poner una cucharadita de relleno en el centro de cada oblea, humedecer el borde y sellar en forma de media luna con pliegues.",
      "Calentar una sartén con un poco de aceite y colocar las gyozas, dorando la base 2-3 min.",
      "Añadir un chorrito de agua y tapar, dejando que se cuezan al vapor 4-5 min.",
      "Destapar y dejar que se evapore el agua para que la base quede crujiente. Servir con vinagre de arroz.",
    ],
    variants: [
      {
        id: "v1",
        name: "De cerdo y col",
        calories: 380, // kcal/ración (estimado)
        allergens: ["frutos_secos", "gluten", "soja"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Obleas de gyoza", qty: 32, unit: "ud" },
          { name: "Carne picada de cerdo", qty: 400, unit: "g" },
          { name: "Col china", qty: 200, unit: "g" },
          { name: "Cebolleta", qty: 3, unit: "ud" },
          { name: "Ajo", qty: 2, unit: "diente" },
          { name: "Jengibre", qty: 1, unit: "cda" },
          { name: "Salsa de soja", qty: 2, unit: "cda" },
          { name: "Aceite de sésamo", qty: 1, unit: "cda" },
          { name: "Vinagre de arroz", qty: 2, unit: "cda" },
        ],
      },
      {
        id: "v2",
        name: "De gambas",
        calories: 350, // kcal/ración (estimado)
        allergens: ["frutos_secos", "gluten", "pescado", "soja"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Obleas de gyoza", qty: 32, unit: "ud" },
          { name: "Gambas peladas picadas", qty: 400, unit: "g" },
          { name: "Col china", qty: 200, unit: "g" },
          { name: "Cebolleta", qty: 3, unit: "ud" },
          { name: "Jengibre", qty: 1, unit: "cda" },
          { name: "Salsa de soja", qty: 2, unit: "cda" },
          { name: "Aceite de sésamo", qty: 1, unit: "cda" },
        ],
      },
    ],
  },
  {
    id: "r60",
    name: "Oyakodon",
    category: "Japonesa",
    baseServings: 4,
    notes: "Pollo y huevo sobre arroz: oyako significa 'padre e hijo'. Cocer el huevo apenas, debe quedar cremoso, no cuajado del todo.",
    steps: [
      "Cocer el arroz japonés.",
      "Pochar la cebolla en el caldo dashi con la salsa de soja y el mirin.",
      "Añadir el pollo troceado y cocer 5-6 min hasta que esté hecho.",
      "Verter el huevo batido por encima, tapar y dejar que cuaje ligeramente, 1-2 min, quedando cremoso.",
      "Servir sobre un bol de arroz, con la cebolleta picada por encima.",
    ],
    variants: [
      {
        id: "v1",
        name: "Tradicional",
        calories: 480, // kcal/ración (estimado)
        allergens: ["gluten", "huevo", "soja"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Pechuga de pollo", qty: 400, unit: "g" },
          { name: "Huevos", qty: 6, unit: "ud" },
          { name: "Arroz japonés", qty: 400, unit: "g" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Cebolleta", qty: 3, unit: "ud" },
          { name: "Salsa de soja", qty: 4, unit: "cda" },
          { name: "Mirin", qty: 3, unit: "cda", opt: true },
          { name: "Caldo dashi", qty: 200, unit: "ml" },
          { name: "Azúcar", qty: 1, unit: "cda" },
        ],
      },
    ],
  },
  {
    id: "r61",
    name: "Maki sushi",
    category: "Japonesa",
    baseServings: 4,
    notes: "Arroz bien condimentado con vinagre, azúcar y sal mientras está caliente. Esterilla de bambú envuelta en film para enrollar sin pegarse.",
    steps: [
      "Cocer el arroz para sushi y aliñarlo con vinagre de arroz y azúcar mientras está caliente; dejar enfriar a temperatura ambiente.",
      "Colocar una lámina de alga nori sobre una esterilla de bambú envuelta en film.",
      "Extender una capa fina de arroz sobre el alga, dejando un borde libre en el extremo superior.",
      "Colocar el relleno —surimi y aguacate, o salmón y aguacate— en una línea en el centro.",
      "Enrollar con ayuda de la esterilla, apretando bien, y sellar humedeciendo el borde libre.",
      "Cortar el rollo en 6-8 trozos con un cuchillo mojado y servir con salsa de soja.",
    ],
    variants: [
      {
        id: "v1",
        name: "California",
        calories: 380, // kcal/ración (estimado)
        allergens: ["frutos_secos", "gluten", "pescado", "soja"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Arroz para sushi", qty: 400, unit: "g" },
          { name: "Vinagre de arroz", qty: 80, unit: "ml" },
          { name: "Azúcar", qty: 2, unit: "cda" },
          { name: "Alga nori", qty: 8, unit: "ud" },
          { name: "Surimi", qty: 250, unit: "g" },
          { name: "Aguacate", qty: 2, unit: "ud" },
          { name: "Pepino", qty: 1, unit: "ud" },
          { name: "Sésamo", qty: 2, unit: "cda" },
          { name: "Salsa de soja", qty: 100, unit: "ml" },
        ],
      },
      {
        id: "v2",
        name: "De salmón y aguacate",
        calories: 400, // kcal/ración (estimado)
        allergens: ["gluten", "pescado", "soja"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Arroz para sushi", qty: 400, unit: "g" },
          { name: "Vinagre de arroz", qty: 80, unit: "ml" },
          { name: "Azúcar", qty: 2, unit: "cda" },
          { name: "Alga nori", qty: 8, unit: "ud" },
          { name: "Salmón fresco", qty: 300, unit: "g" },
          { name: "Aguacate", qty: 2, unit: "ud" },
          { name: "Salsa de soja", qty: 100, unit: "ml" },
          { name: "Wasabi", qty: 1, unit: "cda", opt: true },
        ],
      },
    ],
  },
  {
    id: "r62",
    name: "Tonkatsu",
    category: "Japonesa",
    baseServings: 4,
    notes: "Pasar el cerdo por harina, huevo y panko en ese orden. Aceite a 170 ºC, 4 min por lado. Cortar en tiras antes de servir.",
    steps: [
      "Salpimentar los filetes de cerdo (o pollo) y darles unos golpes suaves para ablandar la fibra.",
      "Pasarlos por harina, luego por huevo batido, y finalmente por panko, presionando para que se adhiera bien.",
      "Freír en aceite bien caliente 3-4 min por lado, hasta que estén dorados y crujientes.",
      "Escurrir sobre papel absorbente y dejar reposar 2 min.",
      "Cortar en tiras y servir sobre col blanca en juliana, con la salsa tonkatsu por encima.",
    ],
    variants: [
      {
        id: "v1",
        name: "De cerdo",
        calories: 600, // kcal/ración (estimado)
        allergens: ["gluten", "huevo"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Filetes de lomo de cerdo", qty: 4, unit: "ud" },
          { name: "Harina", qty: 100, unit: "g" },
          { name: "Huevos", qty: 2, unit: "ud" },
          { name: "Panko", qty: 200, unit: "g" },
          { name: "Aceite", qty: 500, unit: "ml" },
          { name: "Salsa tonkatsu", qty: 4, unit: "cda" },
          { name: "Col blanca", qty: 0.5, unit: "ud" },
          { name: "Limón", qty: 1, unit: "ud", opt: true },
        ],
      },
      {
        id: "v2",
        name: "De pollo (chicken katsu)",
        calories: 550, // kcal/ración (estimado)
        allergens: ["gluten", "huevo"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Pechuga de pollo", qty: 600, unit: "g" },
          { name: "Harina", qty: 100, unit: "g" },
          { name: "Huevos", qty: 2, unit: "ud" },
          { name: "Panko", qty: 200, unit: "g" },
          { name: "Aceite", qty: 500, unit: "ml" },
          { name: "Salsa tonkatsu", qty: 4, unit: "cda" },
          { name: "Col blanca", qty: 0.5, unit: "ud" },
        ],
      },
    ],
  },

  /* ---------- COCINA COREANA ---------- */
  {
    id: "r63",
    name: "Bibimbap",
    category: "Coreana",
    baseServings: 4,
    notes: "Saltear cada verdura por separado y reservar. Montar el bol con arroz, verduras en sectores, huevo en el centro. Salsa al gusto.",
    steps: [
      "Cocer el arroz japonés.",
      "Saltear cada verdura por separado —espinacas, zanahoria, calabacín, setas, brotes de soja—, sazonando cada una con un poco de sal y aceite de sésamo.",
      "Marcar la ternera (o el tofu) en tiras a fuego fuerte.",
      "Freír un huevo por persona, dejando la yema líquida.",
      "Montar el bol: arroz en la base, las verduras y la carne repartidas por secciones, el huevo en el centro y el gochujang al lado.",
      "Mezclar todo justo antes de comer.",
    ],
    variants: [
      {
        id: "v1",
        name: "Con ternera",
        calories: 520, // kcal/ración (estimado)
        allergens: ["frutos_secos", "gluten", "huevo", "soja"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Arroz japonés", qty: 400, unit: "g" },
          { name: "Solomillo de ternera", qty: 400, unit: "g" },
          { name: "Espinacas", qty: 200, unit: "g" },
          { name: "Zanahoria", qty: 2, unit: "ud" },
          { name: "Calabacín", qty: 1, unit: "ud" },
          { name: "Setas shiitake", qty: 150, unit: "g" },
          { name: "Brotes de soja", qty: 200, unit: "g" },
          { name: "Huevos", qty: 4, unit: "ud" },
          { name: "Gochujang", qty: 3, unit: "cda" },
          { name: "Salsa de soja", qty: 2, unit: "cda" },
          { name: "Aceite de sésamo", qty: 2, unit: "cda" },
          { name: "Sésamo", qty: 1, unit: "cda" },
          { name: "Ajo", qty: 2, unit: "diente" },
        ],
      },
      {
        id: "v2",
        name: "Vegetariano",
        calories: 450, // kcal/ración (estimado)
        allergens: ["frutos_secos", "huevo", "soja"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Arroz japonés", qty: 400, unit: "g" },
          { name: "Tofu firme", qty: 300, unit: "g" },
          { name: "Espinacas", qty: 200, unit: "g" },
          { name: "Zanahoria", qty: 2, unit: "ud" },
          { name: "Calabacín", qty: 1, unit: "ud" },
          { name: "Setas shiitake", qty: 200, unit: "g" },
          { name: "Brotes de soja", qty: 200, unit: "g" },
          { name: "Huevos", qty: 4, unit: "ud" },
          { name: "Gochujang", qty: 3, unit: "cda" },
          { name: "Aceite de sésamo", qty: 2, unit: "cda" },
          { name: "Sésamo", qty: 1, unit: "cda" },
        ],
      },
    ],
  },
  {
    id: "r64",
    name: "Bulgogi",
    category: "Coreana",
    baseServings: 4,
    notes: "Marinar la ternera cortada muy fina mínimo 30 min (mejor 2 h). Plancha o sartén muy caliente, vuelta y vuelta.",
    steps: [
      "Marinar la ternera (o el cerdo) laminada muy fina con la pera rallada, la salsa de soja, el azúcar, el aceite de sésamo, el ajo y el jengibre, mínimo 30 min (mejor 2 h).",
      "Cocer el arroz japonés.",
      "Calentar una sartén o plancha a fuego fuerte y saltear la carne marinada por tandas, 2-3 min hasta que esté dorada.",
      "Espolvorear con sésamo y cebolleta picada.",
      "Servir sobre el arroz.",
    ],
    variants: [
      {
        id: "v1",
        name: "De ternera",
        calories: 520, // kcal/ración (estimado)
        allergens: ["frutos_secos", "gluten", "soja"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Solomillo de ternera laminado", qty: 600, unit: "g" },
          { name: "Pera asiática (o manzana)", qty: 1, unit: "ud" },
          { name: "Salsa de soja", qty: 6, unit: "cda" },
          { name: "Azúcar moreno", qty: 2, unit: "cda" },
          { name: "Aceite de sésamo", qty: 2, unit: "cda" },
          { name: "Ajo", qty: 4, unit: "diente" },
          { name: "Jengibre", qty: 1, unit: "cda" },
          { name: "Cebolleta", qty: 4, unit: "ud" },
          { name: "Sésamo", qty: 1, unit: "cda" },
          { name: "Arroz japonés", qty: 300, unit: "g" },
        ],
      },
      {
        id: "v2",
        name: "De cerdo (dwaeji bulgogi)",
        calories: 500, // kcal/ración (estimado)
        allergens: ["frutos_secos", "gluten", "soja"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Panceta de cerdo laminada", qty: 600, unit: "g" },
          { name: "Gochujang", qty: 3, unit: "cda" },
          { name: "Salsa de soja", qty: 3, unit: "cda" },
          { name: "Azúcar moreno", qty: 2, unit: "cda" },
          { name: "Aceite de sésamo", qty: 2, unit: "cda" },
          { name: "Ajo", qty: 4, unit: "diente" },
          { name: "Jengibre", qty: 1, unit: "cda" },
          { name: "Cebolleta", qty: 4, unit: "ud" },
          { name: "Arroz japonés", qty: 300, unit: "g" },
        ],
      },
    ],
  },
  {
    id: "r65",
    name: "Japchae",
    category: "Coreana",
    baseServings: 4,
    notes: "Cocer los fideos de batata 6 min, escurrir y aclarar con agua fría. Saltear cada verdura por separado y mezclar al final con la salsa.",
    steps: [
      "Cocer los fideos de batata en agua hirviendo 6 min, escurrir y aclarar con agua fría.",
      "Saltear la ternera en tiras a fuego fuerte hasta que esté dorada, y reservar.",
      "Saltear cada verdura por separado —espinacas, zanahoria, pimiento, setas— para que no suelten demasiada agua.",
      "Mezclar los fideos con la salsa de soja, el azúcar y el aceite de sésamo.",
      "Juntar todo en el wok, saltear 2 min para que se integren los sabores, y terminar con sésamo por encima.",
    ],
    variants: [
      {
        id: "v1",
        name: "Tradicional",
        calories: 420, // kcal/ración (estimado)
        allergens: ["frutos_secos", "gluten", "soja"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Fideos de batata (dangmyeon)", qty: 300, unit: "g" },
          { name: "Solomillo de ternera", qty: 300, unit: "g" },
          { name: "Espinacas", qty: 200, unit: "g" },
          { name: "Zanahoria", qty: 2, unit: "ud" },
          { name: "Pimiento rojo", qty: 1, unit: "ud" },
          { name: "Setas shiitake", qty: 200, unit: "g" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Salsa de soja", qty: 5, unit: "cda" },
          { name: "Azúcar", qty: 2, unit: "cda" },
          { name: "Aceite de sésamo", qty: 3, unit: "cda" },
          { name: "Sésamo", qty: 2, unit: "cda" },
          { name: "Ajo", qty: 3, unit: "diente" },
        ],
      },
    ],
  },
  {
    id: "r66",
    name: "Tteokbokki",
    category: "Coreana",
    baseServings: 4,
    notes: "Remojar los pasteles de arroz 10 min si están secos. Cocer 8 min en la salsa hasta que espese. Picante: ajustar el gochujang al gusto.",
    steps: [
      "Si los pasteles de arroz están duros, remojarlos en agua templada 10 min.",
      "Calentar el caldo dashi en una sartén con el gochujang, el gochugaru, la salsa de soja y el azúcar, disolviendo bien.",
      "Añadir los pasteles de arroz y la pasta de pescado, cocer a fuego medio 8 min, removiendo para que no se peguen.",
      "Dejar que la salsa espese y se adhiera a los pasteles.",
      "Servir con cebolleta y sésamo por encima.",
    ],
    variants: [
      {
        id: "v1",
        name: "Picante clásico",
        calories: 450, // kcal/ración (estimado)
        allergens: ["frutos_secos", "gluten", "pescado", "soja"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Pasteles de arroz (tteok)", qty: 500, unit: "g" },
          { name: "Pasta de pescado (eomuk)", qty: 200, unit: "g", opt: true },
          { name: "Cebolleta", qty: 4, unit: "ud" },
          { name: "Gochujang", qty: 3, unit: "cda" },
          { name: "Gochugaru (chile en polvo)", qty: 2, unit: "cda", opt: true },
          { name: "Salsa de soja", qty: 2, unit: "cda" },
          { name: "Azúcar", qty: 2, unit: "cda" },
          { name: "Ajo", qty: 3, unit: "diente" },
          { name: "Caldo dashi", qty: 500, unit: "ml" },
          { name: "Sésamo", qty: 1, unit: "cda", opt: true },
        ],
      },
    ],
  },
  {
    id: "r67",
    name: "Pollo coreano frito",
    category: "Coreana",
    baseServings: 4,
    notes: "Doble fritura es la clave: primera a 160 ºC para cocinar, segunda a 190 ºC para que quede ultracrujiente. Glaseado caliente al final.",
    steps: [
      "Cortar las alitas de pollo y pasarlas por maicena.",
      "Freír en aceite a 160 ºC unos 8 min hasta que estén cocidas por dentro.",
      "Subir el aceite a 190 ºC y freír de nuevo 2-3 min para que queden muy crujientes.",
      "Mientras, calentar en una sartén la salsa —gochujang, ketchup, miel y ajo; o soja, miel y ajo— hasta que espese ligeramente.",
      "Mezclar el pollo frito con la salsa caliente hasta que quede bien cubierto, y espolvorear con sésamo.",
    ],
    variants: [
      {
        id: "v1",
        name: "Yangnyeom (dulce-picante)",
        calories: 650, // kcal/ración (estimado)
        allergens: ["frutos_secos", "gluten", "soja"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Alitas de pollo", qty: 1, unit: "kg" },
          { name: "Maicena", qty: 150, unit: "g" },
          { name: "Aceite", qty: 1, unit: "l" },
          { name: "Gochujang", qty: 3, unit: "cda" },
          { name: "Ketchup", qty: 3, unit: "cda" },
          { name: "Miel", qty: 2, unit: "cda" },
          { name: "Salsa de soja", qty: 2, unit: "cda" },
          { name: "Ajo", qty: 5, unit: "diente" },
          { name: "Jengibre", qty: 1, unit: "cda" },
          { name: "Sésamo", qty: 1, unit: "cda" },
        ],
      },
      {
        id: "v2",
        name: "Soja y ajo",
        calories: 620, // kcal/ración (estimado)
        allergens: ["frutos_secos", "gluten", "soja"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Alitas de pollo", qty: 1, unit: "kg" },
          { name: "Maicena", qty: 150, unit: "g" },
          { name: "Aceite", qty: 1, unit: "l" },
          { name: "Salsa de soja", qty: 5, unit: "cda" },
          { name: "Miel", qty: 3, unit: "cda" },
          { name: "Ajo", qty: 8, unit: "diente" },
          { name: "Jengibre", qty: 1, unit: "cda" },
          { name: "Sésamo", qty: 1, unit: "cda" },
        ],
      },
    ],
  },

  /* ---------- MEDITERRÁNEO ---------- */
  {
    id: "r68",
    name: "Pasta carbonara",
    category: "Pasta",
    baseServings: 4,
    notes: "Sin nata. La clave: fuera del fuego para mezclar la pasta con el huevo, así cuaja sedosa sin cortarse. Reservar agua de cocción para ligar.",
    steps: [
      "Cocer la pasta en agua con sal hasta que esté al dente.",
      "Mientras, dorar el guanciale (o el bacon) en una sartén sin aceite, hasta que suelte su grasa y quede crujiente.",
      "Batir las yemas, el huevo entero y el queso rallado en un bol.",
      "Escurrir la pasta reservando un poco del agua de cocción, y mezclarla con el guanciale fuera del fuego.",
      "Añadir la mezcla de huevo y queso, removiendo rápido para que se cree una crema sedosa sin que cuaje en grumos, añadiendo agua de cocción si hace falta.",
      "Servir con pimienta negra recién molida.",
    ],
    variants: [
      {
        id: "v1",
        name: "Tradicional (guanciale)",
        calories: 580, // kcal/ración (estimado)
        allergens: ["gluten", "huevo", "lacteos"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Espaguetis", qty: 400, unit: "g" },
          { name: "Guanciale", qty: 200, unit: "g" },
          { name: "Yemas de huevo", qty: 6, unit: "ud" },
          { name: "Huevo entero", qty: 1, unit: "ud" },
          { name: "Pecorino romano rallado", qty: 100, unit: "g" },
          { name: "Pimienta negra", qty: 1, unit: "cdta" },
        ],
      },
      {
        id: "v2",
        name: "Con bacon",
        calories: 560, // kcal/ración (estimado)
        allergens: ["gluten", "huevo", "lacteos"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Espaguetis", qty: 400, unit: "g" },
          { name: "Bacon", qty: 200, unit: "g" },
          { name: "Yemas de huevo", qty: 6, unit: "ud" },
          { name: "Huevo entero", qty: 1, unit: "ud" },
          { name: "Parmesano rallado", qty: 100, unit: "g" },
          { name: "Pimienta negra", qty: 1, unit: "cdta" },
        ],
      },
    ],
  },
  {
    id: "r69",
    name: "Ossobuco",
    category: "Italiana",
    baseServings: 4,
    notes: "Guisado lento a fuego suave, 90 min mínimo. Al servir, gremolata por encima: ralladura de limón, ajo y perejil picado.",
    steps: [
      "Salpimentar los ossobuco y pasarlos por harina.",
      "Dorar en una cazuela con mantequilla por ambos lados, y reservar.",
      "En la misma cazuela, sofreír la cebolla, la zanahoria y el apio 8 min.",
      "Devolver la carne, añadir el vino blanco y dejar reducir, luego el tomate triturado y el caldo.",
      "Cocer tapado a fuego lento 1 h 30 min - 2 h, hasta que la carne se despegue del hueso.",
      "Servir con la gremolata: ralladura de limón, ajo y perejil picados por encima.",
    ],
    variants: [
      {
        id: "v1",
        name: "Tradicional milanés",
        calories: 450, // kcal/ración (estimado)
        allergens: ["gluten", "lacteos"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Ossobuco de ternera", qty: 4, unit: "ud" },
          { name: "Harina", qty: 50, unit: "g" },
          { name: "Mantequilla", qty: 50, unit: "g" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Zanahoria", qty: 2, unit: "ud" },
          { name: "Apio", qty: 2, unit: "ud", opt: true },
          { name: "Tomate triturado", qty: 200, unit: "g" },
          { name: "Vino blanco", qty: 200, unit: "ml" },
          { name: "Caldo de carne", qty: 500, unit: "ml" },
          { name: "Ralladura de limón", qty: 1, unit: "ud" },
          { name: "Perejil", qty: 2, unit: "cda", opt: true },
          { name: "Ajo", qty: 1, unit: "diente", opt: true },
        ],
      },
    ],
  },
  {
    id: "r70",
    name: "Souvlaki",
    category: "Griega",
    baseServings: 4,
    notes: "Marinar la carne mínimo 2 h en yogur y limón (mejor toda la noche). Brochetas a fuego fuerte, 3-4 min por lado. Servir con pita, tzatziki y ensalada.",
    steps: [
      "Marinar el pollo (o el cerdo) en dados con el yogur, el limón, el ajo, el orégano y el comino, mínimo 2 h (mejor toda la noche).",
      "Montar en brochetas.",
      "Asar a la plancha o parrilla a fuego medio-alto, 3-4 min por lado, hasta que esté dorado y hecho por dentro.",
      "Calentar el pan de pita.",
      "Servir las brochetas con el pan, la salsa tzatziki y la cebolla morada.",
    ],
    variants: [
      {
        id: "v1",
        name: "De pollo",
        calories: 480, // kcal/ración (estimado)
        allergens: ["gluten", "lacteos"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Pechuga de pollo", qty: 600, unit: "g" },
          { name: "Yogur griego", qty: 200, unit: "g" },
          { name: "Limón", qty: 2, unit: "ud" },
          { name: "Ajo", qty: 4, unit: "diente" },
          { name: "Aceite de oliva", qty: 3, unit: "cda" },
          { name: "Orégano", qty: 1, unit: "cda" },
          { name: "Comino", qty: 1, unit: "cdta" },
          { name: "Pan de pita", qty: 4, unit: "ud" },
          { name: "Salsa tzatziki", qty: 200, unit: "g" },
          { name: "Cebolla morada", qty: 1, unit: "ud" },
        ],
      },
      {
        id: "v2",
        name: "De cerdo",
        calories: 500, // kcal/ración (estimado)
        allergens: ["gluten", "lacteos"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Solomillo de cerdo", qty: 600, unit: "g" },
          { name: "Aceite de oliva", qty: 4, unit: "cda" },
          { name: "Limón", qty: 2, unit: "ud" },
          { name: "Ajo", qty: 4, unit: "diente" },
          { name: "Orégano", qty: 1, unit: "cda" },
          { name: "Pan de pita", qty: 4, unit: "ud" },
          { name: "Salsa tzatziki", qty: 200, unit: "g" },
          { name: "Cebolla morada", qty: 1, unit: "ud" },
        ],
      },
    ],
  },
  {
    id: "r71",
    name: "Moussaka",
    category: "Griega",
    baseServings: 6,
    notes: "Freír o asar las berenjenas antes (mejor la víspera para que escurran aceite). Bechamel espesa arriba. Horno 200 ºC unos 30 min hasta dorar.",
    steps: [
      "Cortar la berenjena y la patata en láminas; salar la berenjena y dejarla reposar 15 min para que suelte el amargor, luego secarla.",
      "Freír o asar las láminas de berenjena y patata hasta que estén doradas.",
      "Sofreír la cebolla y el ajo, añadir la carne picada y dorar bien.",
      "Incorporar el tomate triturado, la canela y la nuez moscada, cocer 20 min a fuego suave.",
      "Para la bechamel: fundir la mantequilla, añadir la harina, cocinar 2 min, y añadir la leche poco a poco hasta espesar; mezclar con el queso feta (o el huevo, según la versión).",
      "Montar en capas en una fuente: patata, berenjena, la carne, y cubrir con la bechamel.",
      "Hornear a 200 ºC 30 min hasta que esté dorada por encima.",
    ],
    variants: [
      {
        id: "v1",
        name: "Tradicional de cordero",
        calories: 550, // kcal/ración (estimado)
        allergens: ["gluten", "huevo", "lacteos"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Berenjenas grandes", qty: 3, unit: "ud" },
          { name: "Patata", qty: 3, unit: "ud" },
          { name: "Carne picada de cordero", qty: 600, unit: "g" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Ajo", qty: 3, unit: "diente" },
          { name: "Tomate triturado", qty: 400, unit: "g" },
          { name: "Vino tinto", qty: 100, unit: "ml", opt: true },
          { name: "Canela", qty: 1, unit: "cdta" },
          { name: "Nuez moscada", qty: 1, unit: "pinch" },
          { name: "Mantequilla", qty: 50, unit: "g" },
          { name: "Harina", qty: 50, unit: "g" },
          { name: "Leche", qty: 500, unit: "ml" },
          { name: "Queso feta", qty: 100, unit: "g" },
          { name: "Huevos", qty: 2, unit: "ud" },
        ],
      },
      {
        id: "v2",
        name: "Con ternera",
        calories: 520, // kcal/ración (estimado)
        allergens: ["gluten", "lacteos"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Berenjenas grandes", qty: 3, unit: "ud" },
          { name: "Patata", qty: 3, unit: "ud" },
          { name: "Carne picada de ternera", qty: 600, unit: "g" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Ajo", qty: 3, unit: "diente" },
          { name: "Tomate triturado", qty: 400, unit: "g" },
          { name: "Canela", qty: 1, unit: "cdta" },
          { name: "Mantequilla", qty: 50, unit: "g" },
          { name: "Harina", qty: 50, unit: "g" },
          { name: "Leche", qty: 500, unit: "ml" },
          { name: "Queso rallado", qty: 100, unit: "g" },
        ],
      },
    ],
  },
  {
    id: "r72",
    name: "Tabulé",
    category: "Ensaladas",
    baseServings: 4,
    notes: "Hidratar el bulgur 15 min con agua caliente. La proporción libanesa: MUCHÍSIMO perejil (casi verde), poco bulgur. Servir frío.",
    steps: [
      "Hidratar el bulgur con agua caliente 15 min, hasta que esté tierno, y escurrir bien.",
      "Picar muy fino el perejil, la menta, el tomate y la cebolla tierna.",
      "Mezclar el bulgur con las hierbas y verduras picadas.",
      "Aliñar con el zumo de limón, el aceite de oliva y sal.",
      "Dejar reposar en la nevera al menos 30 min antes de servir para que se integren los sabores.",
    ],
    variants: [
      {
        id: "v1",
        name: "Libanés",
        calories: 180, // kcal/ración (estimado)
        allergens: ["gluten"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Bulgur fino", qty: 150, unit: "g" },
          { name: "Perejil fresco", qty: 3, unit: "taza" },
          { name: "Menta fresca", qty: 1, unit: "taza" },
          { name: "Tomate", qty: 3, unit: "ud" },
          { name: "Cebolla tierna", qty: 4, unit: "ud" },
          { name: "Pepino", qty: 1, unit: "ud" },
          { name: "Limón", qty: 2, unit: "ud" },
          { name: "Aceite de oliva virgen", qty: 4, unit: "cda" },
          { name: "Sal", qty: 1, unit: "cdta" },
        ],
      },
    ],
  },
  {
    id: "r73",
    name: "Shakshuka",
    category: "Huevos",
    baseServings: 4,
    notes: "Pochar bien el pimiento y la cebolla (15 min a fuego suave). Hacer huecos en la salsa y romper los huevos dentro; tapar hasta que cuajen.",
    steps: [
      "Sofreír el pimiento y la cebolla en aceite de oliva a fuego medio 10-12 min, hasta que estén blandos.",
      "Añadir el ajo, el comino y el pimentón, remover 1 min.",
      "Incorporar el tomate triturado y cocer a fuego suave 10-12 min hasta que espese.",
      "Hacer huecos en la salsa con una cuchara y cascar un huevo en cada uno.",
      "Tapar y cocer 5-7 min a fuego suave hasta que las claras cuajen y las yemas queden líquidas.",
      "En la versión con feta, desmigar el queso por encima antes de tapar. Servir con pan de pita.",
    ],
    variants: [
      {
        id: "v1",
        name: "Con feta",
        calories: 380, // kcal/ración (estimado)
        allergens: ["gluten", "huevo", "lacteos"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Huevos", qty: 6, unit: "ud" },
          { name: "Pimiento rojo", qty: 2, unit: "ud" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Tomate triturado", qty: 400, unit: "g" },
          { name: "Ajo", qty: 3, unit: "diente" },
          { name: "Comino", qty: 1, unit: "cdta" },
          { name: "Pimentón dulce", qty: 1, unit: "cdta" },
          { name: "Guindilla", qty: 1, unit: "ud", opt: true },
          { name: "Cilantro fresco", qty: 1, unit: "cda", opt: true },
          { name: "Aceite de oliva", qty: 3, unit: "cda" },
          { name: "Queso feta", qty: 100, unit: "g" },
          { name: "Pan de pita", qty: 4, unit: "ud" },
        ],
      },
      {
        id: "v2",
        name: "Sencilla",
        calories: 320, // kcal/ración (estimado)
        allergens: ["gluten", "huevo"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Huevos", qty: 6, unit: "ud" },
          { name: "Pimiento rojo", qty: 2, unit: "ud" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Tomate triturado", qty: 400, unit: "g" },
          { name: "Ajo", qty: 3, unit: "diente" },
          { name: "Comino", qty: 1, unit: "cdta" },
          { name: "Pimentón dulce", qty: 1, unit: "cdta" },
          { name: "Aceite de oliva", qty: 3, unit: "cda" },
          { name: "Pan", qty: 4, unit: "ud" },
        ],
      },
    ],
  },

  /* ---------- DESAYUNOS Y MERIENDAS ---------- */
  {
    id: "r74",
    name: "Yogur con granola casera",
    category: "Desayuno",
    baseServings: 4,
    notes: "Granola en horno a 160 ºC unos 25 min removiendo cada 8. Se guarda 2-3 semanas en tarro cerrado, sirve para muchos desayunos.",
    steps: [
      "Precalentar el horno a 160 ºC.",
      "Mezclar los copos de avena con las nueces, las almendras, las semillas de girasol, la miel, el aceite de coco y la canela.",
      "Extender en una bandeja y hornear 25 min, removiendo cada 8 min, hasta que esté dorada y crujiente.",
      "Dejar enfriar completamente; se endurece al enfriar.",
      "Servir el yogur con la granola y los frutos rojos por encima.",
    ],
    variants: [
      {
        id: "v1",
        name: "Con frutos rojos",
        calories: 380, // kcal/ración (estimado)
        allergens: ["frutos_secos", "lacteos"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Yogur griego", qty: 4, unit: "ud" },
          { name: "Copos de avena", qty: 300, unit: "g" },
          { name: "Miel", qty: 3, unit: "cda" },
          { name: "Aceite de coco", qty: 2, unit: "cda" },
          { name: "Nueces", qty: 100, unit: "g" },
          { name: "Almendras", qty: 100, unit: "g" },
          { name: "Semillas de girasol", qty: 50, unit: "g" },
          { name: "Frutos rojos", qty: 200, unit: "g" },
          { name: "Canela", qty: 1, unit: "cdta" },
        ],
      },
    ],
  },
  {
    id: "r75",
    name: "Bizcocho de yogur",
    category: "Merienda",
    baseServings: 8,
    notes: "El clásico 1-2-3: 1 yogur, 2 vasos de yogur de azúcar, 3 de harina, 1 de aceite. Horno 180 ºC unos 40 min hasta que pinche seco.",
    steps: [
      "Precalentar el horno a 180 ºC y engrasar un molde.",
      "Batir el yogur, los huevos, el azúcar y el aceite hasta que estén bien integrados.",
      "Añadir la harina tamizada con la levadura y la ralladura de limón, mezclando con movimientos envolventes.",
      "Verter en el molde y hornear 35-40 min, hasta que al pinchar con un palillo salga limpio.",
      "Dejar enfriar antes de desmoldar.",
    ],
    variants: [
      {
        id: "v1",
        name: "De limón",
        calories: 320, // kcal/ración (estimado)
        allergens: ["gluten", "huevo", "lacteos"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Yogur natural", qty: 1, unit: "ud" },
          { name: "Huevos", qty: 3, unit: "ud" },
          { name: "Azúcar", qty: 350, unit: "g" },
          { name: "Aceite de girasol", qty: 150, unit: "ml" },
          { name: "Harina", qty: 400, unit: "g" },
          { name: "Levadura química", qty: 1, unit: "ud" },
          { name: "Ralladura de limón", qty: 1, unit: "ud" },
          { name: "Sal", qty: 1, unit: "pinch", opt: true },
        ],
      },
    ],
  },
  {
    id: "r76",
    name: "Tostada con aguacate y huevo",
    category: "Desayuno",
    baseServings: 2,
    notes: "Aguacate aplastado con limón y sal en escamas. Huevo poché por encima (2 min en agua hirviendo con un chorro de vinagre).",
    steps: [
      "Tostar el pan de hogaza.",
      "Aplastar el aguacate con un tenedor, el zumo de limón y sal.",
      "Para el huevo poché: llevar agua a ebullición suave con un chorro de vinagre, crear un remolino y verter el huevo con cuidado; cocer 2-3 min y retirar con espumadera.",
      "Extender el aguacate sobre el pan y colocar el huevo poché encima (o el salmón ahumado, en la otra versión).",
      "Terminar con sal en escamas y un toque de chile en escamas.",
    ],
    variants: [
      {
        id: "v1",
        name: "Con huevo poché",
        calories: 350, // kcal/ración (estimado)
        allergens: ["gluten", "huevo"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Pan de hogaza", qty: 4, unit: "ud" },
          { name: "Aguacate", qty: 2, unit: "ud" },
          { name: "Limón", qty: 1, unit: "ud" },
          { name: "Huevos", qty: 4, unit: "ud" },
          { name: "Vinagre", qty: 1, unit: "cda" },
          { name: "Sal en escamas", qty: 1, unit: "cdta" },
          { name: "Chile en escamas", qty: 1, unit: "pinch", opt: true },
          { name: "Aceite de oliva", qty: 2, unit: "cda" },
        ],
      },
      {
        id: "v2",
        name: "Con salmón ahumado",
        calories: 380, // kcal/ración (estimado)
        allergens: ["gluten", "pescado"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Pan de hogaza", qty: 4, unit: "ud" },
          { name: "Aguacate", qty: 2, unit: "ud" },
          { name: "Limón", qty: 1, unit: "ud" },
          { name: "Salmón ahumado", qty: 150, unit: "g" },
          { name: "Alcaparras", qty: 1, unit: "cda", opt: true },
          { name: "Eneldo fresco", qty: 1, unit: "cda", opt: true },
          { name: "Sal en escamas", qty: 1, unit: "cdta" },
        ],
      },
    ],
  },
  {
    id: "r77",
    name: "Batido verde",
    category: "Desayuno",
    baseServings: 2,
    notes: "La espinaca cruda no se nota, con la fruta se disimula. Los dátiles endulzan de forma natural, sin azúcar añadido.",
    steps: [
      "Lavar las espinacas.",
      "Poner todos los ingredientes en la batidora: espinacas, plátano, manzana, dátiles, jengibre y la leche vegetal.",
      "Triturar a máxima potencia hasta que quede totalmente liso.",
      "Añadir más leche vegetal si queda muy espeso.",
      "Servir enseguida, con las semillas de chía por encima si se desea.",
    ],
    variants: [
      {
        id: "v1",
        name: "Espinaca y plátano",
        calories: 220, // kcal/ración (estimado)
        allergens: [], // estimado a partir de los ingredientes (leche vegetal no es lácteo)
        ingredients: [
          { name: "Espinacas frescas", qty: 2, unit: "taza" },
          { name: "Plátano", qty: 2, unit: "ud" },
          { name: "Manzana", qty: 1, unit: "ud" },
          { name: "Dátiles", qty: 4, unit: "ud" },
          { name: "Jengibre fresco", qty: 1, unit: "cdta", opt: true },
          { name: "Leche vegetal", qty: 400, unit: "ml" },
          { name: "Semillas de chía", qty: 1, unit: "cda", opt: true },
        ],
      },
    ],
  },
  {
    id: "r78",
    name: "Bizcocho de zanahoria",
    category: "Merienda",
    baseServings: 8,
    notes: "La zanahoria aporta jugosidad, no hay que ablandarla. Frosting de queso crema por encima si te apetece un plus.",
    steps: [
      "Precalentar el horno a 180 ºC y engrasar un molde.",
      "Batir los huevos con el azúcar moreno y el aceite hasta que blanqueen un poco.",
      "Añadir la zanahoria rallada y mezclar.",
      "Incorporar la harina tamizada con la levadura y la canela, con movimientos envolventes.",
      "Verter en el molde y hornear 40-45 min, hasta que al pinchar salga limpio.",
      "Dejar enfriar del todo antes de cubrir con el frosting de queso crema, si se usa.",
    ],
    variants: [
      {
        id: "v1",
        name: "Con frosting",
        calories: 420, // kcal/ración (estimado)
        allergens: ["frutos_secos", "gluten", "huevo", "lacteos"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Zanahoria rallada", qty: 300, unit: "g" },
          { name: "Huevos", qty: 3, unit: "ud" },
          { name: "Azúcar moreno", qty: 250, unit: "g" },
          { name: "Aceite de girasol", qty: 200, unit: "ml" },
          { name: "Harina", qty: 300, unit: "g" },
          { name: "Levadura química", qty: 1, unit: "ud" },
          { name: "Canela", qty: 2, unit: "cdta" },
          { name: "Nuez moscada", qty: 1, unit: "pinch", opt: true },
          { name: "Nueces", qty: 80, unit: "g", opt: true },
          { name: "Queso crema", qty: 150, unit: "g" },
          { name: "Azúcar glas", qty: 60, unit: "g" },
        ],
      },
      {
        id: "v2",
        name: "Sin frosting",
        calories: 320, // kcal/ración (estimado)
        allergens: ["frutos_secos", "gluten", "huevo"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Zanahoria rallada", qty: 300, unit: "g" },
          { name: "Huevos", qty: 3, unit: "ud" },
          { name: "Azúcar moreno", qty: 250, unit: "g" },
          { name: "Aceite de girasol", qty: 200, unit: "ml" },
          { name: "Harina", qty: 300, unit: "g" },
          { name: "Levadura química", qty: 1, unit: "ud" },
          { name: "Canela", qty: 2, unit: "cdta" },
          { name: "Nueces", qty: 80, unit: "g", opt: true },
        ],
      },
    ],
  },

  /* ---------- TRADICIONAL ESPAÑOLA ---------- */
  {
    id: "r79",
    name: "Pollo al ajillo",
    category: "Carne",
    baseServings: 4,
    notes: "Dorar bien el pollo primero. Ajos aplastados sin pelar. Reducir el vino hasta que la salsa espese; queda una salsita marrón brillante.",
    steps: [
      "Salpimentar el pollo y dorarlo en una cazuela con aceite hasta que esté bien dorado por todos los lados.",
      "Añadir los ajos enteros sin pelar y el laurel, rehogar 2 min.",
      "Verter el vino blanco (y el coñac, si se usa) y dejar que reduzca a fuego medio.",
      "Tapar y cocer a fuego suave 20-25 min, hasta que el pollo esté tierno y la salsa haya espesado.",
      "Espolvorear con perejil picado antes de servir.",
    ],
    variants: [
      {
        id: "v1",
        name: "Con vino blanco",
        calories: 420, // kcal/ración (estimado)
        allergens: [], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Muslos de pollo", qty: 8, unit: "ud" },
          { name: "Ajo", qty: 8, unit: "diente" },
          { name: "Vino blanco", qty: 150, unit: "ml" },
          { name: "Coñac", qty: 50, unit: "ml", opt: true },
          { name: "Laurel", qty: 1, unit: "ud", opt: true },
          { name: "Aceite de oliva", qty: 4, unit: "cda" },
          { name: "Perejil", qty: 1, unit: "cda", opt: true },
          { name: "Sal", qty: 1, unit: "cdta" },
          { name: "Pimienta", qty: 0.5, unit: "cdta" },
        ],
      },
    ],
  },
  {
    id: "r80",
    name: "Migas",
    category: "Tradicional",
    baseServings: 4,
    notes: "Pan del día anterior (mejor duro). Humedecer con agua salada la noche antes. Fuego suave, mucho tiempo y remover con paciencia.",
    steps: [
      "Desmigar el pan del día anterior en trozos pequeños y humedecerlo con agua salada unas horas antes, tapado con un paño.",
      "Dorar el chorizo y la panceta troceados en una sartén con aceite, y reservar.",
      "En el mismo aceite, dorar los ajos y el pimiento verde.",
      "Añadir el pan humedecido y el pimentón, cocinar a fuego suave 20-25 min, removiendo a menudo para que se suelte y no se pegue.",
      "Devolver el chorizo y la panceta a la sartén, mezclar bien y servir con uvas si se desea.",
    ],
    variants: [
      {
        id: "v1",
        name: "Extremeñas",
        calories: 550, // kcal/ración (estimado)
        allergens: ["gluten"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Pan del día anterior", qty: 500, unit: "g" },
          { name: "Chorizo", qty: 200, unit: "g" },
          { name: "Panceta", qty: 150, unit: "g" },
          { name: "Ajo", qty: 4, unit: "diente" },
          { name: "Pimiento verde", qty: 1, unit: "ud", opt: true },
          { name: "Uvas", qty: 200, unit: "g", opt: true },
          { name: "Aceite de oliva", qty: 100, unit: "ml" },
          { name: "Pimentón dulce", qty: 1, unit: "cdta" },
          { name: "Sal", qty: 1, unit: "cdta" },
        ],
      },
    ],
  },
  {
    id: "r81",
    name: "Bacalao a la vizcaína",
    category: "Pescado",
    baseServings: 4,
    notes: "Desalar el bacalao 24-36 h en agua fría, cambiando el agua 3 veces. La salsa: cebolla y pulpa de choricero, sin tomate en la versión pura.",
    steps: [
      "Desalar el bacalao 24-36 h en agua fría, cambiando el agua 3 veces.",
      "Sofreír la cebolla y el ajo a fuego suave 15-20 min, hasta que estén muy blandos.",
      "Añadir la pulpa de pimiento choricero y el tomate, cocer 10 min.",
      "Triturar la salsa con el pan frito hasta que quede fina, y añadir el caldo de pescado si hace falta aligerar.",
      "Incorporar el bacalao a la salsa y cocer a fuego suave 8-10 min, sin que hierva fuerte, hasta que esté hecho.",
    ],
    variants: [
      {
        id: "v1",
        name: "Tradicional",
        calories: 380, // kcal/ración (estimado)
        allergens: ["gluten", "pescado"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Bacalao desalado", qty: 4, unit: "ud" },
          { name: "Cebolla", qty: 3, unit: "ud" },
          { name: "Pulpa de pimiento choricero", qty: 3, unit: "cda" },
          { name: "Tomate maduro", qty: 2, unit: "ud" },
          { name: "Ajo", qty: 3, unit: "diente" },
          { name: "Pan del día anterior", qty: 2, unit: "ud" },
          { name: "Aceite de oliva", qty: 100, unit: "ml" },
          { name: "Caldo de pescado", qty: 300, unit: "ml" },
        ],
      },
    ],
  },
  {
    id: "r82",
    name: "Sopa castellana",
    category: "Cremas y sopas",
    baseServings: 4,
    notes: "Ajo dorado sin quemar (si se quema, empezar de nuevo). El huevo se rompe dentro de la sopa caliente para que escalfe solo.",
    steps: [
      "Dorar los ajos laminados en aceite de oliva a fuego suave, sin que se quemen.",
      "Añadir el pimentón fuera del fuego, remover y volver a poner al fuego.",
      "Incorporar el jamón en taquitos y el pan troceado, rehogar 2 min.",
      "Añadir el caldo de pollo y el laurel, cocer 15 min a fuego suave.",
      "Cascar los huevos directamente en la sopa hirviendo y dejar que cuajen 3-4 min. Servir muy caliente.",
    ],
    variants: [
      {
        id: "v1",
        name: "De ajo con huevo",
        calories: 280, // kcal/ración (estimado)
        allergens: ["gluten", "huevo"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Pan del día anterior", qty: 200, unit: "g" },
          { name: "Ajo", qty: 6, unit: "diente" },
          { name: "Pimentón dulce", qty: 2, unit: "cdta" },
          { name: "Jamón serrano en taquitos", qty: 100, unit: "g" },
          { name: "Aceite de oliva", qty: 4, unit: "cda" },
          { name: "Caldo de pollo", qty: 1, unit: "l" },
          { name: "Huevos", qty: 4, unit: "ud" },
          { name: "Laurel", qty: 1, unit: "ud", opt: true },
          { name: "Sal", qty: 1, unit: "cdta" },
        ],
      },
    ],
  },
  {
    id: "r83",
    name: "Ropa vieja",
    category: "Tradicional",
    baseServings: 4,
    notes: "Perfecta para aprovechar la carne del cocido. Sofrito bien hecho (mínimo 20 min), luego la carne y los garbanzos.",
    steps: [
      "Sofreír la cebolla, el ajo y los pimientos en aceite de oliva a fuego medio 15-20 min, hasta que estén muy blandos.",
      "Añadir el pimentón y el comino, remover 1 min.",
      "Incorporar el tomate triturado y cocer 10 min.",
      "Añadir la carne desmenuzada y los garbanzos, mezclar bien.",
      "Cocer todo junto a fuego suave 15 min para que se integren los sabores.",
    ],
    variants: [
      {
        id: "v1",
        name: "Con garbanzos del cocido",
        calories: 420, // kcal/ración (estimado)
        allergens: [], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Carne cocida desmenuzada", qty: 500, unit: "g" },
          { name: "Garbanzos cocidos", qty: 300, unit: "g" },
          { name: "Cebolla", qty: 2, unit: "ud" },
          { name: "Pimiento rojo", qty: 1, unit: "ud" },
          { name: "Pimiento verde", qty: 1, unit: "ud" },
          { name: "Tomate triturado", qty: 200, unit: "g" },
          { name: "Ajo", qty: 3, unit: "diente" },
          { name: "Pimentón dulce", qty: 1, unit: "cdta" },
          { name: "Comino", qty: 1, unit: "cdta", opt: true },
          { name: "Aceite de oliva", qty: 3, unit: "cda" },
        ],
      },
    ],
  },

  /* ---------- ENSALADAS COMPLETAS ---------- */
  {
    id: "r84",
    name: "Ensalada campera",
    category: "Ensaladas",
    baseServings: 4,
    notes: "La patata cocida y templada absorbe mejor el aliño. Vinagre de Jerez y buen aceite de oliva marcan la diferencia.",
    steps: [
      "Cocer las patatas con piel hasta que estén tiernas, dejar templar y cortar en dados.",
      "Cocer los huevos 10 min, enfriar y pelar.",
      "Cortar la cebolla morada, el tomate y el pimiento verde en dados pequeños.",
      "Mezclar la patata templada con las verduras, el atún desmigado y las aceitunas.",
      "Aliñar con el vinagre de Jerez y el aceite de oliva virgen, y añadir el huevo en cuartos por encima.",
    ],
    variants: [
      {
        id: "v1",
        name: "Con atún y huevo",
        calories: 420, // kcal/ración (estimado)
        allergens: ["huevo", "pescado"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Patata", qty: 800, unit: "g" },
          { name: "Cebolla morada", qty: 1, unit: "ud" },
          { name: "Tomate", qty: 3, unit: "ud" },
          { name: "Pimiento verde", qty: 1, unit: "ud" },
          { name: "Huevos", qty: 4, unit: "ud" },
          { name: "Atún en aceite", qty: 3, unit: "lata" },
          { name: "Aceitunas negras", qty: 100, unit: "g" },
          { name: "Vinagre de Jerez", qty: 3, unit: "cda" },
          { name: "Aceite de oliva virgen", qty: 5, unit: "cda" },
          { name: "Sal", qty: 1, unit: "cdta" },
        ],
      },
    ],
  },
  {
    id: "r85",
    name: "Ensalada de garbanzos y atún",
    category: "Ensaladas",
    baseServings: 4,
    notes: "Excelente para tupper: aguanta perfecta 2 días en nevera. Aliñar en el momento de servir para que el atún no se seque.",
    steps: [
      "Escurrir bien los garbanzos cocidos y el atún.",
      "Cortar el tomate cherry por la mitad, el pepino en dados y la cebolla morada en juliana fina.",
      "Mezclar los garbanzos con las verduras, el atún y las aceitunas.",
      "Aliñar con el zumo de limón y el aceite de oliva virgen.",
      "Dejar reposar 10 min en la nevera antes de servir para que se integren los sabores.",
    ],
    variants: [
      {
        id: "v1",
        name: "Con cebolla morada",
        calories: 380, // kcal/ración (estimado)
        allergens: ["pescado"], // estimado a partir de los ingredientes
        ingredients: [
          { name: "Garbanzos cocidos", qty: 2, unit: "lata" },
          { name: "Atún en aceite", qty: 3, unit: "lata" },
          { name: "Tomate cherry", qty: 200, unit: "g" },
          { name: "Pepino", qty: 1, unit: "ud" },
          { name: "Cebolla morada", qty: 0.5, unit: "ud" },
          { name: "Aceitunas", qty: 60, unit: "g" },
          { name: "Perejil", qty: 1, unit: "cda", opt: true },
          { name: "Limón", qty: 1, unit: "ud" },
          { name: "Aceite de oliva virgen", qty: 3, unit: "cda" },
          { name: "Sal", qty: 1, unit: "cdta" },
        ],
      },
    ],
  },

  /* ---------- INDIA / CURRIES ---------- */
  {
    id: "r86",
    name: "Pollo tikka masala",
    category: "India",
    baseServings: 4,
    notes: "Marinar el pollo en yogur y especias mínimo 1 h (mejor toda la noche). Dorar bien antes de añadir la salsa. Nata al final, fuera del hervor fuerte.",
    steps: [
      "Cortar el pollo en dados y marinarlo con el yogur, el ajo, el jengibre y parte de las especias, mínimo 1 h (mejor toda la noche).",
      "Dorar el pollo marinado en una sartén con un poco de aceite, por tandas, y reservar.",
      "En la misma sartén, sofreír la cebolla, añadir el resto de especias y remover 1 min.",
      "Incorporar el tomate triturado y cocer 10 min.",
      "Devolver el pollo a la salsa, añadir la nata y cocer a fuego suave 10 min más, sin que hierva fuerte.",
      "Servir con el arroz basmati cocido aparte.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 480,
        allergens: ["lacteos"],
        ingredients: [
          { name: "Pechuga de pollo", qty: 600, unit: "g" },
          { name: "Yogur natural", qty: 150, unit: "g" },
          { name: "Tomate triturado", qty: 400, unit: "g" },
          { name: "Nata", qty: 100, unit: "ml" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Ajo", qty: 3, unit: "diente" },
          { name: "Jengibre", qty: 1, unit: "cda" },
          { name: "Garam masala", qty: 2, unit: "cdta" },
          { name: "Comino", qty: 1, unit: "cdta" },
          { name: "Pimentón dulce", qty: 1, unit: "cdta" },
          { name: "Arroz basmati", qty: 300, unit: "g" },
        ],
      },
    ],
  },
  {
    id: "r87",
    name: "Dal de lentejas rojas",
    category: "India",
    baseServings: 4,
    notes: "Vegano. Las lentejas rojas se deshacen solas, no hace falta remojo previo. 20-25 min a fuego suave removiendo de vez en cuando.",
    steps: [
      "Sofreír la cebolla, el ajo y el jengibre en aceite 5 min.",
      "Añadir la cúrcuma y el comino, remover unos segundos.",
      "Incorporar las lentejas rojas, el tomate triturado y la leche de coco.",
      "Cubrir con agua si hace falta y cocer a fuego medio 20-25 min, removiendo de vez en cuando, hasta que las lentejas se deshagan y espese.",
      "Servir con el arroz basmati y el cilantro fresco por encima.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 380,
        allergens: [],
        ingredients: [
          { name: "Lentejas rojas", qty: 300, unit: "g" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Ajo", qty: 3, unit: "diente" },
          { name: "Jengibre", qty: 1, unit: "cda" },
          { name: "Tomate triturado", qty: 200, unit: "g" },
          { name: "Leche de coco", qty: 1, unit: "lata" },
          { name: "Cúrcuma", qty: 1, unit: "cdta" },
          { name: "Comino", qty: 1, unit: "cdta" },
          { name: "Cilantro fresco", qty: 1, unit: "cda", opt: true },
          { name: "Arroz basmati", qty: 250, unit: "g" },
        ],
      },
    ],
  },
  {
    id: "r88",
    name: "Palak paneer",
    category: "India",
    baseServings: 4,
    notes: "Triturar parte de las espinacas para dar cremosidad, dejar otra parte entera. El paneer se dora ligero antes de añadirlo, así no se deshace.",
    steps: [
      "Escaldar las espinacas 2 min en agua hirviendo, escurrir y triturar la mitad hasta obtener un puré, dejando la otra mitad entera.",
      "Cortar el paneer en dados y dorarlo ligeramente en una sartén con un poco de aceite; reservar.",
      "Sofreír la cebolla, el ajo y el jengibre 5 min, añadir el comino y el garam masala.",
      "Incorporar el tomate triturado y cocer 5 min.",
      "Añadir las espinacas, el puré y las enteras, y la nata, cocer 5 min a fuego suave.",
      "Incorporar el paneer dorado, calentar 2 min más y servir.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 420,
        allergens: ["lacteos"],
        ingredients: [
          { name: "Espinacas frescas", qty: 500, unit: "g" },
          { name: "Paneer", qty: 250, unit: "g" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Ajo", qty: 3, unit: "diente" },
          { name: "Jengibre", qty: 1, unit: "cda" },
          { name: "Tomate triturado", qty: 100, unit: "g" },
          { name: "Nata", qty: 80, unit: "ml", opt: true },
          { name: "Garam masala", qty: 1, unit: "cdta" },
          { name: "Comino", qty: 1, unit: "cdta" },
        ],
      },
    ],
  },
  {
    id: "r89",
    name: "Biryani de pollo",
    category: "India",
    baseServings: 4,
    notes: "Arroz y pollo se cuecen por separado y se montan en capas al final, con azafrán en leche caliente por encima. Reposar tapado 10 min antes de servir.",
    steps: [
      "Marinar el pollo con el yogur, el ajo, el jengibre y el garam masala mínimo 1 h.",
      "Cocer el arroz basmati en agua con sal hasta que esté a medio hacer, unos 6-7 min, y escurrir.",
      "Sofreír la cebolla hasta que esté bien dorada y caramelizada; reservar la mitad para decorar.",
      "Dorar el pollo marinado en una cazuela con el resto de la cebolla.",
      "Disponer el arroz a medio cocer sobre el pollo en capas, con el azafrán disuelto en un poco de leche caliente por encima, los anacardos y las pasas.",
      "Tapar bien y cocer a fuego muy bajo 20-25 min para que se termine de hacer al vapor. Dejar reposar 10 min antes de abrir.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 550,
        allergens: ["lacteos", "frutos_secos"],
        ingredients: [
          { name: "Arroz basmati", qty: 400, unit: "g" },
          { name: "Muslos de pollo", qty: 600, unit: "g" },
          { name: "Yogur natural", qty: 150, unit: "g" },
          { name: "Cebolla", qty: 2, unit: "ud" },
          { name: "Ajo", qty: 3, unit: "diente" },
          { name: "Jengibre", qty: 1, unit: "cda" },
          { name: "Garam masala", qty: 2, unit: "cdta" },
          { name: "Azafrán", qty: 1, unit: "pinch" },
          { name: "Anacardos", qty: 40, unit: "g", opt: true },
          { name: "Pasas", qty: 30, unit: "g", opt: true },
        ],
      },
    ],
  },
  {
    id: "r90",
    name: "Samosas de verduras",
    category: "India",
    baseServings: 6,
    notes: "Relleno bien seco para que no reviente la masa al freír. Doblar en triángulo y sellar bien los bordes con agua.",
    steps: [
      "Cocer la patata en dados hasta que esté tierna, escurrir.",
      "Sofreír la cebolla, añadir los guisantes, el comino y el garam masala, rehogar 3-4 min.",
      "Incorporar la patata cocida, aplastando un poco, y el cilantro fresco.",
      "Doblar cada oblea en forma de cono, rellenar con la mezcla y sellar el borde con agua, formando un triángulo.",
      "Freír en aceite caliente 3-4 min hasta que estén doradas y crujientes por todos los lados.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 320,
        allergens: ["gluten"],
        ingredients: [
          { name: "Obleas para samosas", qty: 12, unit: "ud" },
          { name: "Patata", qty: 3, unit: "ud" },
          { name: "Guisantes", qty: 150, unit: "g" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Comino", qty: 1, unit: "cdta" },
          { name: "Garam masala", qty: 1, unit: "cdta" },
          { name: "Cilantro fresco", qty: 1, unit: "cda", opt: true },
          { name: "Aceite para freír", qty: 500, unit: "ml" },
        ],
      },
    ],
  },
  {
    id: "r91",
    name: "Chana masala",
    category: "India",
    baseServings: 4,
    notes: "Vegano. Aplastar un poco los garbanzos mientras se cuecen para que la salsa espese sola.",
    steps: [
      "Sofreír la cebolla, el ajo y el jengibre en aceite 5 min.",
      "Añadir el garam masala y el comino, remover unos segundos.",
      "Incorporar el tomate triturado y cocer 8 min hasta que espese.",
      "Añadir los garbanzos cocidos, aplastando algunos con el dorso de la cuchara para espesar la salsa.",
      "Cocer a fuego suave 15 min, y servir con el arroz basmati y el cilantro por encima.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 380,
        allergens: [],
        ingredients: [
          { name: "Garbanzos cocidos", qty: 2, unit: "lata" },
          { name: "Tomate triturado", qty: 300, unit: "g" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Ajo", qty: 3, unit: "diente" },
          { name: "Jengibre", qty: 1, unit: "cda" },
          { name: "Garam masala", qty: 1, unit: "cdta" },
          { name: "Comino", qty: 1, unit: "cdta" },
          { name: "Cilantro fresco", qty: 1, unit: "cda", opt: true },
          { name: "Arroz basmati", qty: 250, unit: "g" },
        ],
      },
    ],
  },
  {
    id: "r92",
    name: "Curry de cordero",
    category: "India",
    baseServings: 4,
    notes: "Estilo rogan josh. Cuanto más lento el guiso, más tierno queda el cordero — mínimo 1 h a fuego bajo.",
    steps: [
      "Marinar el cordero con el yogur mínimo 1 h.",
      "Dorar el cordero marinado en una cazuela con un poco de aceite, por tandas, y reservar.",
      "Sofreír la cebolla, el ajo y el jengibre 8 min, añadir el garam masala y el pimentón.",
      "Incorporar el tomate triturado y el cordero dorado.",
      "Cubrir con agua o caldo y cocer tapado a fuego lento 1 h, hasta que el cordero esté muy tierno.",
      "Servir con el arroz basmati.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 520,
        allergens: ["lacteos"],
        ingredients: [
          { name: "Cordero para guisar", qty: 700, unit: "g" },
          { name: "Yogur natural", qty: 150, unit: "g" },
          { name: "Cebolla", qty: 2, unit: "ud" },
          { name: "Ajo", qty: 4, unit: "diente" },
          { name: "Jengibre", qty: 1, unit: "cda" },
          { name: "Tomate triturado", qty: 300, unit: "g" },
          { name: "Garam masala", qty: 2, unit: "cdta" },
          { name: "Pimentón dulce", qty: 1, unit: "cdta" },
          { name: "Arroz basmati", qty: 300, unit: "g" },
        ],
      },
    ],
  },
  {
    id: "r93",
    name: "Naan casero",
    category: "India",
    baseServings: 6,
    notes: "Sartén o plancha muy caliente, 1-2 min por lado hasta que salgan burbujas doradas. Pincelar con mantequilla al sacarlo.",
    steps: [
      "Disolver la levadura en un poco de agua templada y dejar activar 10 min.",
      "Mezclar la harina, el yogur, el aceite, la sal y la levadura activada, amasando hasta obtener una masa lisa.",
      "Dejar reposar tapada en un lugar cálido 1 h, hasta que doble su tamaño.",
      "Dividir en porciones y estirar cada una en forma ovalada.",
      "Cocinar en una sartén o plancha muy caliente, 1-2 min por lado hasta que salgan burbujas doradas.",
      "Pincelar con mantequilla, y ajo picado si se usa, recién salidos de la sartén.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 250,
        allergens: ["gluten", "lacteos"],
        ingredients: [
          { name: "Harina", qty: 400, unit: "g" },
          { name: "Yogur natural", qty: 150, unit: "g" },
          { name: "Levadura seca", qty: 1, unit: "cdta" },
          { name: "Aceite de oliva", qty: 2, unit: "cda" },
          { name: "Ajo", qty: 2, unit: "diente", opt: true },
          { name: "Mantequilla", qty: 30, unit: "g", opt: true },
          { name: "Sal", qty: 1, unit: "cdta" },
        ],
      },
    ],
  },

  /* ---------- FRANCESA ---------- */
  {
    id: "r94",
    name: "Coq au vin",
    category: "Francesa",
    baseServings: 4,
    notes: "Marinar el pollo en vino tinto un par de horas si hay tiempo. Guiso lento, mínimo 45 min, para que la salsa reduzca y espese.",
    steps: [
      "Dorar el pollo en una cazuela con un poco de aceite, por tandas, y reservar.",
      "En la misma cazuela, dorar la panceta, luego sofreír la cebolla, la zanahoria y el ajo.",
      "Añadir la harina, remover 1 min, y verter el vino tinto poco a poco, removiendo para que no se formen grumos.",
      "Devolver el pollo a la cazuela, añadir el caldo y el laurel.",
      "Cocer tapado a fuego lento 45 min, añadiendo los champiñones los últimos 15 min, hasta que la salsa espese y el pollo esté muy tierno.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 480,
        allergens: ["gluten"],
        ingredients: [
          { name: "Muslos de pollo", qty: 8, unit: "ud" },
          { name: "Vino tinto", qty: 400, unit: "ml" },
          { name: "Panceta", qty: 150, unit: "g" },
          { name: "Champiñones", qty: 250, unit: "g" },
          { name: "Cebolla", qty: 2, unit: "ud" },
          { name: "Zanahoria", qty: 2, unit: "ud" },
          { name: "Ajo", qty: 2, unit: "diente" },
          { name: "Caldo de pollo", qty: 300, unit: "ml" },
          { name: "Harina", qty: 2, unit: "cda" },
          { name: "Laurel", qty: 1, unit: "ud", opt: true },
        ],
      },
    ],
  },
  {
    id: "r95",
    name: "Ratatouille",
    category: "Francesa",
    baseServings: 4,
    notes: "Vegano. Cortar todas las verduras en rodajas finas de grosor similar para que se hagan por igual. Horno a 180 ºC unos 40 min.",
    steps: [
      "Cortar todas las verduras en rodajas finas de grosor similar.",
      "Hacer una base de tomate triturado con la cebolla y el ajo pochados en el fondo de una fuente de horno.",
      "Colocar las rodajas de berenjena, calabacín y tomate intercaladas verticalmente, en espiral.",
      "Regar con aceite de oliva y espolvorear con tomillo.",
      "Cubrir con papel de aluminio y hornear a 180 ºC 30 min; destapar y hornear 10-15 min más hasta que estén tiernas y ligeramente doradas.",
      "Terminar con albahaca fresca por encima.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 200,
        allergens: [],
        ingredients: [
          { name: "Berenjena", qty: 1, unit: "ud" },
          { name: "Calabacín", qty: 2, unit: "ud" },
          { name: "Pimiento rojo", qty: 1, unit: "ud" },
          { name: "Tomate", qty: 4, unit: "ud" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Ajo", qty: 2, unit: "diente" },
          { name: "Aceite de oliva", qty: 4, unit: "cda" },
          { name: "Tomillo", qty: 1, unit: "cdta", opt: true },
          { name: "Albahaca fresca", qty: 1, unit: "cda", opt: true },
        ],
      },
    ],
  },
  {
    id: "r96",
    name: "Boeuf bourguignon",
    category: "Francesa",
    baseServings: 4,
    notes: "El guiso francés por excelencia: cuanto más tiempo a fuego lento, mejor (mínimo 2 h). Mejor de un día para otro.",
    steps: [
      "Dorar la carne de ternera en una cazuela con un poco de aceite, por tandas, y reservar.",
      "En la misma cazuela, dorar la panceta, luego sofreír la cebolla, la zanahoria y el ajo.",
      "Añadir la harina, remover 1 min, y verter el vino tinto poco a poco.",
      "Devolver la carne a la cazuela, añadir el caldo y el laurel.",
      "Cocer tapado a fuego lento 2 h, añadiendo los champiñones los últimos 20 min, hasta que la carne esté muy tierna y la salsa espesa.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 520,
        allergens: ["gluten"],
        ingredients: [
          { name: "Carne de ternera para guisar", qty: 800, unit: "g" },
          { name: "Vino tinto", qty: 500, unit: "ml" },
          { name: "Panceta", qty: 150, unit: "g" },
          { name: "Champiñones", qty: 250, unit: "g" },
          { name: "Zanahoria", qty: 2, unit: "ud" },
          { name: "Cebolla", qty: 2, unit: "ud" },
          { name: "Ajo", qty: 2, unit: "diente" },
          { name: "Caldo de carne", qty: 300, unit: "ml" },
          { name: "Harina", qty: 2, unit: "cda" },
          { name: "Laurel", qty: 1, unit: "ud", opt: true },
        ],
      },
    ],
  },
  {
    id: "r97",
    name: "Crepes",
    category: "Francesa",
    baseServings: 4,
    notes: "Dejar reposar la masa 30 min en la nevera antes de hacerlas, quedan más finas. Sartén bien caliente y poca cantidad de masa cada vez.",
    steps: [
      "Batir la harina, los huevos, la leche, la mantequilla derretida y la sal hasta obtener una masa lisa, sin grumos.",
      "Dejar reposar la masa en la nevera 30 min.",
      "Calentar una sartén antiadherente a fuego medio-alto con una gota de mantequilla.",
      "Verter un cucharón de masa, repartiéndola por toda la base con un movimiento circular.",
      "Cocinar 1-2 min hasta que se despegue de los bordes, dar la vuelta y cocinar 1 min más.",
      "Rellenar o cubrir al gusto y servir calientes.",
    ],
    variants: [
      {
        id: "v1",
        name: "Dulces",
        calories: 320,
        allergens: ["gluten", "huevo", "lacteos"],
        ingredients: [
          { name: "Harina", qty: 250, unit: "g" },
          { name: "Huevos", qty: 3, unit: "ud" },
          { name: "Leche", qty: 500, unit: "ml" },
          { name: "Mantequilla", qty: 30, unit: "g" },
          { name: "Sal", qty: 1, unit: "pinch" },
          { name: "Azúcar", qty: 1, unit: "cda", opt: true },
        ],
      },
    ],
  },
  {
    id: "r98",
    name: "Sopa de cebolla francesa",
    category: "Francesa",
    baseServings: 4,
    notes: "Pochar la cebolla muy despacio, mínimo 40 min, hasta que quede dorada y dulce — ahí está el sabor. Gratinar con el queso antes de servir.",
    steps: [
      "Cortar la cebolla en juliana fina.",
      "Pocharla en mantequilla a fuego muy suave 40 min, removiendo de vez en cuando, hasta que quede dorada y muy tierna.",
      "Añadir el vino blanco y dejar que reduzca.",
      "Verter el caldo de carne y cocer 20 min a fuego suave.",
      "Repartir la sopa en boles individuales, colocar una tostada de pan por encima y cubrir con el queso gruyère.",
      "Gratinar en el horno o con un soplete hasta que el queso se funda y dore.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 350,
        allergens: ["gluten", "lacteos"],
        ingredients: [
          { name: "Cebolla", qty: 4, unit: "ud" },
          { name: "Caldo de carne", qty: 1, unit: "l" },
          { name: "Vino blanco", qty: 100, unit: "ml", opt: true },
          { name: "Mantequilla", qty: 40, unit: "g" },
          { name: "Pan", qty: 4, unit: "ud" },
          { name: "Queso gruyère", qty: 120, unit: "g" },
        ],
      },
    ],
  },
  {
    id: "r99",
    name: "Tarte tatin",
    category: "Francesa",
    baseServings: 6,
    notes: "El caramelo se hace en la misma sartén antes de poner la masa y las manzanas. Se desmolda boca abajo, con cuidado, recién salida del horno.",
    steps: [
      "Precalentar el horno a 180 ºC.",
      "Pelar y cortar las manzanas por la mitad, quitando el corazón.",
      "Derretir el azúcar en una sartén apta para horno hasta obtener un caramelo dorado, y añadir la mantequilla.",
      "Colocar las manzanas boca abajo sobre el caramelo, bien apretadas.",
      "Cubrir con la masa quebrada, remetiendo los bordes hacia dentro.",
      "Hornear 30-35 min hasta que la masa esté dorada.",
      "Dejar templar 5 min y desmoldar volcando sobre un plato, con cuidado porque el caramelo quema.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 380,
        allergens: ["gluten", "lacteos"],
        ingredients: [
          { name: "Manzana reineta", qty: 6, unit: "ud" },
          { name: "Masa quebrada", qty: 1, unit: "ud" },
          { name: "Mantequilla", qty: 80, unit: "g" },
          { name: "Azúcar", qty: 150, unit: "g" },
        ],
      },
    ],
  },
  {
    id: "r100",
    name: "Croque monsieur",
    category: "Francesa",
    baseServings: 4,
    notes: "La bechamel por encima es lo que lo distingue de un sándwich mixto normal. Horno o gratinador hasta que dore la superficie.",
    steps: [
      "Hacer una bechamel: fundir la mantequilla, añadir la harina, cocinar 2 min, y añadir la leche poco a poco hasta espesar; sazonar con nuez moscada.",
      "Montar el sándwich: pan, jamón cocido, queso gruyère, y otro pan.",
      "Cubrir la parte superior con la bechamel y espolvorear más queso.",
      "Hornear o gratinar a 200 ºC 8-10 min, hasta que la superficie esté dorada y burbujeante.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 450,
        allergens: ["gluten", "lacteos"],
        ingredients: [
          { name: "Pan de molde", qty: 8, unit: "ud" },
          { name: "Jamón cocido", qty: 200, unit: "g" },
          { name: "Queso gruyère", qty: 150, unit: "g" },
          { name: "Mantequilla", qty: 30, unit: "g" },
          { name: "Harina", qty: 20, unit: "g" },
          { name: "Leche", qty: 200, unit: "ml" },
          { name: "Nuez moscada", qty: 1, unit: "pinch", opt: true },
        ],
      },
    ],
  },
  {
    id: "r101",
    name: "Salade niçoise",
    category: "Francesa",
    baseServings: 4,
    notes: "Todos los ingredientes por separado sobre la ensalada, sin mezclar del todo — así se presenta tradicionalmente.",
    steps: [
      "Cocer las patatas con piel hasta que estén tiernas, dejar templar y cortar en rodajas.",
      "Cocer la judía verde 4-5 min en agua hirviendo, hasta que esté al dente, y enfriar en agua con hielo para que mantenga el color.",
      "Cocer los huevos 9-10 min, enfriar y cortar en cuartos.",
      "Disponer en una fuente el atún, las patatas, la judía verde, el tomate en gajos, las aceitunas, los huevos y las anchoas, por secciones sin mezclar.",
      "Aliñar con el aceite de oliva y el vinagre justo antes de servir.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 380,
        allergens: ["huevo", "pescado"],
        ingredients: [
          { name: "Atún en aceite", qty: 2, unit: "lata" },
          { name: "Huevos", qty: 4, unit: "ud" },
          { name: "Judía verde", qty: 200, unit: "g" },
          { name: "Patata", qty: 3, unit: "ud" },
          { name: "Tomate", qty: 2, unit: "ud" },
          { name: "Aceitunas negras", qty: 80, unit: "g" },
          { name: "Anchoas", qty: 8, unit: "ud", opt: true },
          { name: "Aceite de oliva", qty: 4, unit: "cda" },
          { name: "Vinagre", qty: 1, unit: "cda" },
        ],
      },
    ],
  },

  /* ---------- VEGETARIANO / VEGANO A FONDO ---------- */
  {
    id: "r102",
    name: "Buddha bowl vegano",
    category: "Vegano",
    baseServings: 4,
    notes: "Cada ingrediente cocinado o cortado por separado y montado en el bol por secciones. Aliñar justo antes de comer.",
    steps: [
      "Cocer la quinoa según el paquete y dejar enfriar.",
      "Cortar la zanahoria en tiras finas, la col lombarda en juliana y el aguacate en láminas.",
      "Mezclar el tahini con el zumo de limón y un poco de agua hasta obtener una salsa fluida.",
      "Repartir la quinoa en boles y colocar encima los garbanzos, la zanahoria, la col, las espinacas y el aguacate por secciones.",
      "Aliñar con la salsa de tahini y el aceite de oliva.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 420,
        allergens: ["frutos_secos"],
        ingredients: [
          { name: "Quinoa", qty: 250, unit: "g" },
          { name: "Garbanzos cocidos", qty: 1, unit: "lata" },
          { name: "Aguacate", qty: 1, unit: "ud" },
          { name: "Zanahoria", qty: 2, unit: "ud" },
          { name: "Col lombarda", qty: 150, unit: "g" },
          { name: "Espinacas frescas", qty: 100, unit: "g" },
          { name: "Tahini", qty: 2, unit: "cda" },
          { name: "Limón", qty: 1, unit: "ud" },
          { name: "Aceite de oliva", qty: 2, unit: "cda" },
        ],
      },
    ],
  },
  {
    id: "r103",
    name: "Lasaña vegetal",
    category: "Vegetariano",
    baseServings: 4,
    notes: "Asar antes la berenjena y el calabacín en el horno para que suelten agua y no quede aguada la lasaña. Horno final 200 ºC 25 min.",
    steps: [
      "Precalentar el horno a 200 ºC.",
      "Cortar el calabacín y la berenjena en láminas y asarlas en el horno 15 min hasta que suelten agua y estén tiernas.",
      "Saltear las espinacas hasta que reduzcan de volumen.",
      "Hacer la bechamel: fundir la mantequilla, añadir la harina, cocinar 2 min, y añadir la leche poco a poco hasta espesar.",
      "Montar en capas: tomate, placas, verduras asadas, bechamel, repitiendo, y terminar con mozzarella y parmesano por encima.",
      "Hornear 25 min a 200 ºC hasta que esté dorada por encima.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 450,
        allergens: ["gluten", "lacteos"],
        ingredients: [
          { name: "Placas de lasaña", qty: 12, unit: "ud" },
          { name: "Calabacín", qty: 2, unit: "ud" },
          { name: "Berenjena", qty: 1, unit: "ud" },
          { name: "Espinacas frescas", qty: 200, unit: "g" },
          { name: "Tomate triturado", qty: 400, unit: "g" },
          { name: "Mozzarella", qty: 150, unit: "g" },
          { name: "Mantequilla", qty: 40, unit: "g" },
          { name: "Harina", qty: 40, unit: "g" },
          { name: "Leche", qty: 500, unit: "ml" },
          { name: "Parmesano", qty: 50, unit: "g" },
        ],
      },
    ],
  },
  {
    id: "r104",
    name: "Falafel con salsa de tahini",
    category: "Vegano",
    baseServings: 4,
    notes: "Los garbanzos se usan remojados, NUNCA cocidos, o la masa queda demasiado blanda para freír. Reposar la masa 30 min antes de formar las bolitas.",
    steps: [
      "Escurrir bien los garbanzos remojados, sin cocer.",
      "Triturar los garbanzos con la cebolla, el ajo, el perejil, el cilantro y el comino, hasta obtener una masa granulada, no una pasta fina.",
      "Añadir la harina para ligar y dejar reposar la masa 30 min en la nevera.",
      "Formar bolitas con las manos húmedas.",
      "Freír en aceite bien caliente 3-4 min hasta que estén doradas por fuera y hechas por dentro.",
      "Mezclar el tahini con el zumo de limón y agua para la salsa, y servir junto a los falafel.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 420,
        allergens: ["gluten", "frutos_secos"],
        ingredients: [
          { name: "Garbanzos secos remojados", qty: 300, unit: "g" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Ajo", qty: 3, unit: "diente" },
          { name: "Perejil fresco", qty: 1, unit: "taza" },
          { name: "Cilantro fresco", qty: 1, unit: "taza", opt: true },
          { name: "Comino", qty: 1, unit: "cdta" },
          { name: "Harina", qty: 2, unit: "cda" },
          { name: "Tahini", qty: 3, unit: "cda" },
          { name: "Limón", qty: 1, unit: "ud" },
          { name: "Aceite para freír", qty: 500, unit: "ml" },
        ],
      },
    ],
  },
  {
    id: "r105",
    name: "Chili vegano de boniato y alubias",
    category: "Vegano",
    baseServings: 4,
    notes: "El boniato en dados pequeños se cuece rápido. 25-30 min a fuego medio hasta que espese.",
    steps: [
      "Cortar el boniato en dados pequeños.",
      "Sofreír la cebolla, el pimiento y el ajo en aceite 8 min.",
      "Añadir el comino y el chile en polvo, remover 1 min.",
      "Incorporar el boniato, el tomate triturado y las alubias negras.",
      "Cocer a fuego suave 25-30 min, hasta que el boniato esté tierno y el chili haya espesado. Añadir el maíz los últimos 5 min si se usa.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 380,
        allergens: [],
        ingredients: [
          { name: "Boniato", qty: 500, unit: "g" },
          { name: "Alubias negras cocidas", qty: 2, unit: "lata" },
          { name: "Tomate triturado", qty: 400, unit: "g" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Pimiento rojo", qty: 1, unit: "ud" },
          { name: "Ajo", qty: 3, unit: "diente" },
          { name: "Comino", qty: 1, unit: "cdta" },
          { name: "Chile en polvo", qty: 1, unit: "cdta" },
          { name: "Maíz dulce", qty: 1, unit: "lata", opt: true },
        ],
      },
    ],
  },
  {
    id: "r106",
    name: "Hamburguesa vegana de garbanzos",
    category: "Vegano",
    baseServings: 4,
    notes: "Triturar los garbanzos dejando algo de textura, no una pasta fina. Enfriar la masa 20 min antes de formar las hamburguesas para que no se rompan.",
    steps: [
      "Triturar los garbanzos con la avena, la cebolla, el ajo, el comino y el pimentón, dejando algo de textura.",
      "Formar las hamburguesas y dejarlas enfriar en la nevera 20 min para que no se rompan.",
      "Cocinar en una sartén con un poco de aceite, 4-5 min por lado, hasta que estén doradas y firmes.",
      "Tostar ligeramente el pan de hamburguesa.",
      "Montar con la lechuga y el tomate al gusto.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 450,
        allergens: ["gluten"],
        ingredients: [
          { name: "Garbanzos cocidos", qty: 2, unit: "lata" },
          { name: "Copos de avena", qty: 60, unit: "g" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Ajo", qty: 2, unit: "diente" },
          { name: "Comino", qty: 1, unit: "cdta" },
          { name: "Pimentón dulce", qty: 1, unit: "cdta" },
          { name: "Pan de hamburguesa", qty: 4, unit: "ud" },
          { name: "Lechuga", qty: 1, unit: "ud" },
          { name: "Tomate", qty: 1, unit: "ud" },
        ],
      },
    ],
  },
  {
    id: "r107",
    name: "Boloñesa vegana de lentejas",
    category: "Vegano",
    baseServings: 4,
    notes: "Las lentejas cocidas hacen las veces de carne picada. Sofrito bien hecho de verdura, mínimo 15 min, para que dé cuerpo a la salsa.",
    steps: [
      "Picar la zanahoria, el apio y la cebolla muy finos.",
      "Sofreír en aceite de oliva a fuego medio 10-12 min, hasta que estén bien blandos.",
      "Añadir el ajo y las lentejas cocidas, rehogar 2 min.",
      "Incorporar el tomate triturado y cocer a fuego suave 20-25 min, hasta que espese como una boloñesa.",
      "Cocer los espaguetis en agua con sal y servir con la salsa por encima.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 420,
        allergens: ["gluten"],
        ingredients: [
          { name: "Lentejas cocidas", qty: 400, unit: "g" },
          { name: "Zanahoria", qty: 2, unit: "ud" },
          { name: "Apio", qty: 1, unit: "ud", opt: true },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Tomate triturado", qty: 400, unit: "g" },
          { name: "Ajo", qty: 2, unit: "diente" },
          { name: "Espaguetis", qty: 350, unit: "g" },
          { name: "Aceite de oliva", qty: 3, unit: "cda" },
          { name: "Orégano", qty: 1, unit: "cdta", opt: true },
        ],
      },
    ],
  },
  {
    id: "r108",
    name: "Tofu al horno con verduras asadas",
    category: "Vegano",
    baseServings: 4,
    notes: "Prensar el tofu 15 min antes (con peso encima) para que suelte agua y coja mejor la marinada. Horno a 200 ºC unos 25 min.",
    steps: [
      "Prensar el tofu con un peso encima 15 min para que suelte agua.",
      "Cortar el tofu en dados y marinarlo con la salsa de soja y el ajo 15 min.",
      "Cortar el calabacín, el pimiento y la berenjena en dados.",
      "Colocar el tofu y las verduras en una bandeja, regar con aceite de oliva.",
      "Hornear a 200 ºC 25 min, dando la vuelta a mitad de cocción, hasta que estén dorados.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 350,
        allergens: ["gluten", "soja"],
        ingredients: [
          { name: "Tofu firme", qty: 400, unit: "g" },
          { name: "Calabacín", qty: 2, unit: "ud" },
          { name: "Pimiento rojo", qty: 1, unit: "ud" },
          { name: "Berenjena", qty: 1, unit: "ud" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Salsa de soja", qty: 3, unit: "cda" },
          { name: "Aceite de oliva", qty: 3, unit: "cda" },
          { name: "Ajo", qty: 2, unit: "diente" },
        ],
      },
    ],
  },
  {
    id: "r109",
    name: "Curry vegano de garbanzos y espinacas",
    category: "Vegano",
    baseServings: 4,
    notes: "Sofreír bien las especias en el aceite antes de añadir el líquido, así sueltan todo el aroma.",
    steps: [
      "Sofreír la cebolla, el ajo y el jengibre en aceite 5 min.",
      "Añadir el curry en polvo, remover unos segundos.",
      "Incorporar el tomate triturado y la leche de coco, cocer 5 min.",
      "Añadir los garbanzos cocidos y las espinacas, cocer a fuego suave 10-12 min hasta que las espinacas reduzcan y la salsa espese.",
      "Servir con el arroz basmati.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 380,
        allergens: [],
        ingredients: [
          { name: "Garbanzos cocidos", qty: 2, unit: "lata" },
          { name: "Espinacas frescas", qty: 200, unit: "g" },
          { name: "Leche de coco", qty: 1, unit: "lata" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Ajo", qty: 3, unit: "diente" },
          { name: "Jengibre", qty: 1, unit: "cda" },
          { name: "Curry en polvo", qty: 2, unit: "cdta" },
          { name: "Tomate triturado", qty: 200, unit: "g" },
          { name: "Arroz basmati", qty: 250, unit: "g" },
        ],
      },
    ],
  },
  {
    id: "r110",
    name: "Buñuelos de calabacín",
    category: "Vegetariano",
    baseServings: 4,
    notes: "Escurrir bien el calabacín rallado (con un paño limpio, apretando) para que la masa no quede aguada. Freír en tandas pequeñas.",
    steps: [
      "Rallar el calabacín y escurrirlo bien con un paño limpio, apretando para quitar el exceso de agua.",
      "Mezclar el calabacín con los huevos, la harina, el queso rallado, el ajo picado y el perejil, hasta obtener una masa espesa.",
      "Calentar aceite abundante en una sartén.",
      "Freír cucharadas de la masa en tandas pequeñas, 2-3 min por lado, hasta que estén dorados.",
      "Escurrir sobre papel absorbente y servir calientes.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 320,
        allergens: ["gluten", "huevo", "lacteos"],
        ingredients: [
          { name: "Calabacín", qty: 2, unit: "ud" },
          { name: "Huevos", qty: 2, unit: "ud" },
          { name: "Harina", qty: 100, unit: "g" },
          { name: "Queso rallado", qty: 60, unit: "g" },
          { name: "Ajo", qty: 1, unit: "diente" },
          { name: "Perejil fresco", qty: 1, unit: "cda", opt: true },
          { name: "Aceite para freír", qty: 300, unit: "ml" },
        ],
      },
    ],
  },

  /* ---------- COMFORT FOOD / GUISOS DE CUCHARA ---------- */
  {
    id: "r111",
    name: "Estofado de ternera con patatas",
    category: "Guisos",
    baseServings: 4,
    notes: "Dorar bien la carne antes de mojar con el caldo, ahí está buena parte del sabor. Fuego lento mínimo 1 h 30 min.",
    steps: [
      "Salpimentar la carne y dorarla en una olla con aceite, por tandas, hasta que esté bien sellada.",
      "En la misma olla, sofreír la cebolla y el ajo 5 min.",
      "Devolver la carne, añadir el tomate triturado y el vino tinto, dejar reducir.",
      "Incorporar el caldo de carne y el laurel, cocer tapado a fuego lento 1 h.",
      "Añadir la patata y la zanahoria en trozos grandes, y cocer 30 min más, hasta que todo esté tierno.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 480,
        allergens: [],
        ingredients: [
          { name: "Carne de ternera para guisar", qty: 800, unit: "g" },
          { name: "Patata", qty: 4, unit: "ud" },
          { name: "Zanahoria", qty: 3, unit: "ud" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Ajo", qty: 2, unit: "diente" },
          { name: "Tomate triturado", qty: 200, unit: "g" },
          { name: "Vino tinto", qty: 100, unit: "ml", opt: true },
          { name: "Caldo de carne", qty: 500, unit: "ml" },
          { name: "Laurel", qty: 1, unit: "ud", opt: true },
        ],
      },
    ],
  },
  {
    id: "r112",
    name: "Callos a la madrileña",
    category: "Guisos",
    baseServings: 4,
    notes: "Mejor de un día para otro, gana sabor reposado. Cocción larga y lenta, mínimo 2 h si los callos no vienen precocidos.",
    steps: [
      "Si los callos no vienen cocidos, cocerlos en agua con laurel 2-3 h hasta que estén tiernos, y escurrir.",
      "Sofreír la cebolla y el ajo en una cazuela.",
      "Añadir el pimentón fuera del fuego, remover y volver a poner al fuego.",
      "Incorporar los callos, el chorizo, la morcilla y los garbanzos, cubrir con agua o caldo.",
      "Cocer a fuego lento 45-60 min, hasta que todo esté meloso e integrado. Mejor reposado de un día para otro.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 450,
        allergens: [],
        ingredients: [
          { name: "Callos de ternera cocidos", qty: 800, unit: "g" },
          { name: "Morcilla", qty: 150, unit: "g" },
          { name: "Chorizo", qty: 150, unit: "g" },
          { name: "Garbanzos cocidos", qty: 1, unit: "lata" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Ajo", qty: 2, unit: "diente" },
          { name: "Pimentón dulce", qty: 1, unit: "cda" },
          { name: "Pimentón picante", qty: 1, unit: "cdta", opt: true },
          { name: "Laurel", qty: 1, unit: "ud", opt: true },
        ],
      },
    ],
  },
  {
    id: "r113",
    name: "Potaje de alubias con chorizo y morcilla",
    category: "Guisos",
    baseServings: 4,
    notes: "Fuego suave y constante, sin que hierva a lo bruto o las alubias se rompen. Añadir la patata a media cocción.",
    steps: [
      "Sofreír la cebolla y el ajo en una olla con un poco de aceite.",
      "Añadir el pimentón fuera del fuego, remover y volver a poner al fuego.",
      "Incorporar las alubias cocidas, el chorizo, la morcilla y el laurel, cubrir con agua o caldo.",
      "Cocer a fuego suave 20 min, añadiendo la patata en trozos a media cocción.",
      "Dejar reposar unos minutos antes de servir para que espese ligeramente.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 520,
        allergens: [],
        ingredients: [
          { name: "Alubias blancas cocidas", qty: 500, unit: "g" },
          { name: "Chorizo", qty: 150, unit: "g" },
          { name: "Morcilla", qty: 150, unit: "g" },
          { name: "Patata", qty: 2, unit: "ud" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Ajo", qty: 2, unit: "diente" },
          { name: "Pimentón dulce", qty: 1, unit: "cdta" },
          { name: "Laurel", qty: 1, unit: "ud", opt: true },
        ],
      },
    ],
  },
  {
    id: "r114",
    name: "Pastel de carne con puré",
    category: "Guisos",
    baseServings: 4,
    notes: "Estilo cottage pie. El puré se marca con un tenedor por encima antes de hornear para que dore y quede crujiente en los picos.",
    steps: [
      "Precalentar el horno a 200 ºC.",
      "Sofreír la cebolla y la zanahoria, añadir la carne picada y dorar bien.",
      "Incorporar los guisantes y el caldo de carne, cocer 10 min hasta que reduzca.",
      "Cocer la patata hasta que esté tierna, hacer un puré con la mantequilla y la leche.",
      "Extender la carne en una fuente, cubrir con el puré marcando la superficie con un tenedor, y espolvorear queso si se usa.",
      "Hornear 20-25 min hasta que la superficie esté dorada.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 480,
        allergens: ["lacteos"],
        ingredients: [
          { name: "Carne picada", qty: 500, unit: "g" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Zanahoria", qty: 1, unit: "ud" },
          { name: "Guisantes", qty: 100, unit: "g" },
          { name: "Caldo de carne", qty: 200, unit: "ml" },
          { name: "Patata", qty: 800, unit: "g" },
          { name: "Mantequilla", qty: 40, unit: "g" },
          { name: "Leche", qty: 100, unit: "ml" },
          { name: "Queso rallado", qty: 60, unit: "g", opt: true },
        ],
      },
    ],
  },
  {
    id: "r115",
    name: "Sopa de pollo casera",
    category: "Guisos",
    baseServings: 4,
    notes: "El remedio de siempre. Espumar bien el caldo al principio de la cocción para que quede limpio y transparente.",
    steps: [
      "Poner el pollo, la zanahoria, el apio y la cebolla en una olla con agua fría.",
      "Llevar a ebullición y espumar la superficie para que el caldo quede limpio.",
      "Cocer a fuego suave 45-60 min, hasta que el pollo esté muy tierno.",
      "Retirar el pollo, desmenuzarlo y colar el caldo si se desea más limpio.",
      "Añadir los fideos finos al caldo y cocer 6-8 min, devolver el pollo desmenuzado y calentar 2 min más.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 250,
        allergens: ["gluten"],
        ingredients: [
          { name: "Muslos de pollo", qty: 4, unit: "ud" },
          { name: "Zanahoria", qty: 2, unit: "ud" },
          { name: "Apio", qty: 1, unit: "ud" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Fideos finos", qty: 100, unit: "g" },
          { name: "Caldo de pollo", qty: 1.5, unit: "l" },
          { name: "Perejil", qty: 1, unit: "cda", opt: true },
        ],
      },
    ],
  },
  {
    id: "r116",
    name: "Rabo de toro",
    category: "Guisos",
    baseServings: 4,
    notes: "Guiso lento por excelencia, mínimo 2-3 h a fuego bajo hasta que la carne se despegue sola del hueso. Mejor de un día para otro.",
    steps: [
      "Salpimentar el rabo y dorarlo en una olla con aceite por todos los lados.",
      "Añadir la cebolla, la zanahoria y el ajo, sofreír 10 min.",
      "Incorporar el tomate triturado y el vino tinto, dejar reducir a fuego medio 10 min.",
      "Cubrir con el caldo de carne y el laurel, cocer tapado a fuego muy lento 2-3 h, hasta que la carne se despegue del hueso.",
      "Si se quiere, dejar enfriar y retirar el exceso de grasa antes de recalentar y servir.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 520,
        allergens: [],
        ingredients: [
          { name: "Rabo de toro", qty: 1.2, unit: "kg" },
          { name: "Cebolla", qty: 2, unit: "ud" },
          { name: "Zanahoria", qty: 2, unit: "ud" },
          { name: "Ajo", qty: 3, unit: "diente" },
          { name: "Tomate triturado", qty: 300, unit: "g" },
          { name: "Vino tinto", qty: 400, unit: "ml" },
          { name: "Caldo de carne", qty: 300, unit: "ml" },
          { name: "Laurel", qty: 1, unit: "ud", opt: true },
        ],
      },
    ],
  },
  {
    id: "r117",
    name: "Judías verdes con patata y jamón",
    category: "Guisos",
    baseServings: 4,
    notes: "Cocer la judía verde y la patata juntas hasta que estén tiernas, luego un sofrito rápido de ajo y jamón por encima.",
    steps: [
      "Limpiar las judías verdes, quitando las puntas y las hebras.",
      "Cocer las judías y la patata en trozos en agua con sal, 15-18 min, hasta que estén tiernas.",
      "Escurrir bien.",
      "Sofreír el ajo y la cebolla en aceite, añadir el jamón en taquitos y rehogar 2 min.",
      "Mezclar las judías y la patata con el sofrito, y espolvorear con pimentón si se desea.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 280,
        allergens: [],
        ingredients: [
          { name: "Judía verde", qty: 500, unit: "g" },
          { name: "Patata", qty: 3, unit: "ud" },
          { name: "Jamón serrano", qty: 100, unit: "g" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Ajo", qty: 2, unit: "diente" },
          { name: "Aceite de oliva", qty: 3, unit: "cda" },
          { name: "Pimentón dulce", qty: 1, unit: "cdta", opt: true },
        ],
      },
    ],
  },
  {
    id: "r118",
    name: "Arroz caldoso con costillas",
    category: "Guisos",
    baseServings: 4,
    notes: "Más caldo que en una paella normal — el arroz debe quedar meloso, casi con sopa. Servir recién hecho, sigue cociendo fuera del fuego.",
    steps: [
      "Dorar las costillas en una olla con aceite hasta que estén bien selladas.",
      "Añadir el pimiento y el ajo, sofreír 5 min.",
      "Incorporar el tomate triturado y el pimentón, cocer 5 min.",
      "Añadir el arroz y el caldo caliente con el azafrán disuelto.",
      "Cocer a fuego medio 18-20 min sin tapar, removiendo de vez en cuando, hasta que el arroz esté meloso y caldoso. Servir enseguida.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 480,
        allergens: [],
        ingredients: [
          { name: "Arroz", qty: 300, unit: "g" },
          { name: "Costillas de cerdo", qty: 500, unit: "g" },
          { name: "Pimiento rojo", qty: 1, unit: "ud" },
          { name: "Tomate triturado", qty: 200, unit: "g" },
          { name: "Ajo", qty: 3, unit: "diente" },
          { name: "Caldo de carne", qty: 1.2, unit: "l" },
          { name: "Azafrán", qty: 1, unit: "pinch", opt: true },
          { name: "Pimentón dulce", qty: 1, unit: "cdta" },
        ],
      },
    ],
  },

  /* ---------- PARRILLA Y BARBACOA ---------- */
  {
    id: "r119",
    name: "Costillas de cerdo a la barbacoa",
    category: "Parrilla",
    baseServings: 4,
    notes: "Al horno bajo (150 ºC) tapadas con papel de aluminio 2 h, luego a la parrilla o grill fuerte 10 min con la salsa para que caramelice.",
    steps: [
      "Precalentar el horno a 150 ºC.",
      "Mezclar el pimentón ahumado, el ajo en polvo, la sal y la pimienta, y frotar el costillar con la mezcla.",
      "Envolver en papel de aluminio y hornear 2 h, hasta que la carne esté muy tierna.",
      "Destapar y pincelar con la salsa barbacoa mezclada con el azúcar moreno.",
      "Terminar en el grill del horno o en la parrilla 8-10 min, pincelando de nuevo, hasta que la salsa caramelice.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 550,
        allergens: [],
        ingredients: [
          { name: "Costillar de cerdo", qty: 1.5, unit: "kg" },
          { name: "Salsa barbacoa", qty: 200, unit: "g" },
          { name: "Azúcar moreno", qty: 2, unit: "cda" },
          { name: "Pimentón ahumado", qty: 1, unit: "cda" },
          { name: "Ajo en polvo", qty: 1, unit: "cdta" },
          { name: "Sal", qty: 1, unit: "cdta" },
          { name: "Pimienta", qty: 1, unit: "cdta" },
        ],
      },
    ],
  },
  {
    id: "r120",
    name: "Chuletón a la parrilla",
    category: "Parrilla",
    baseServings: 4,
    notes: "Sacar de la nevera 1 h antes para que esté a temperatura ambiente. Parrilla muy caliente, pocos minutos por lado, reposar antes de cortar.",
    steps: [
      "Sacar el chuletón de la nevera 1 h antes para que esté a temperatura ambiente.",
      "Calentar la parrilla o plancha al máximo.",
      "Salar la carne justo antes de ponerla, y marcar 3-4 min por lado para un punto poco hecho, más tiempo si se prefiere más hecho.",
      "Poner de pie sobre el hueso unos minutos para que se haga por igual.",
      "Dejar reposar 5 min antes de cortar, para que los jugos se redistribuyan.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 500,
        allergens: [],
        ingredients: [
          { name: "Chuletón de ternera", qty: 1.2, unit: "kg" },
          { name: "Sal gorda", qty: 1, unit: "cda" },
          { name: "Aceite de oliva", qty: 2, unit: "cda" },
          { name: "Ajo", qty: 2, unit: "diente", opt: true },
          { name: "Romero", qty: 1, unit: "cdta", opt: true },
        ],
      },
    ],
  },
  {
    id: "r121",
    name: "Pollo a la brasa",
    category: "Parrilla",
    baseServings: 4,
    notes: "Marinar mínimo 2 h (mejor toda la noche). Brasa o parrilla a fuego medio para que se haga por dentro sin quemarse fuera.",
    steps: [
      "Mezclar el zumo de limón, el ajo, el pimentón, el orégano y el aceite para la marinada.",
      "Marinar el pollo troceado mínimo 2 h, mejor toda la noche.",
      "Preparar la brasa o parrilla a fuego medio.",
      "Asar el pollo 25-30 min, dando vueltas, hasta que esté dorado por fuera y hecho por dentro.",
      "Dejar reposar unos minutos antes de servir.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 420,
        allergens: [],
        ingredients: [
          { name: "Pollo troceado", qty: 1.5, unit: "kg" },
          { name: "Limón", qty: 2, unit: "ud" },
          { name: "Ajo", qty: 4, unit: "diente" },
          { name: "Pimentón dulce", qty: 1, unit: "cda" },
          { name: "Orégano", qty: 1, unit: "cdta" },
          { name: "Aceite de oliva", qty: 3, unit: "cda" },
          { name: "Sal", qty: 1, unit: "cdta" },
        ],
      },
    ],
  },
  {
    id: "r122",
    name: "Brochetas de solomillo",
    category: "Parrilla",
    baseServings: 4,
    notes: "Cortar la carne en dados de tamaño uniforme para que se hagan por igual. Parrilla fuerte, poco tiempo, para que quede jugosa por dentro.",
    steps: [
      "Cortar el solomillo, el pimiento y la cebolla en dados de tamaño similar.",
      "Marinar la carne con el aceite, el ajo y el pimentón 30 min.",
      "Montar las brochetas alternando carne y verdura.",
      "Asar a la parrilla a fuego fuerte 2-3 min por cada lado, para que quede jugosa por dentro.",
      "Dejar reposar 3 min antes de servir.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 380,
        allergens: [],
        ingredients: [
          { name: "Solomillo de ternera", qty: 600, unit: "g" },
          { name: "Pimiento rojo", qty: 1, unit: "ud" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Aceite de oliva", qty: 2, unit: "cda" },
          { name: "Ajo", qty: 2, unit: "diente" },
          { name: "Pimentón dulce", qty: 1, unit: "cdta" },
        ],
      },
    ],
  },
  {
    id: "r123",
    name: "Panceta a la parrilla",
    category: "Parrilla",
    baseServings: 4,
    notes: "Fuego medio para que la grasa se derrita despacio y quede crujiente sin quemarse. Vigilar de cerca, se dora rápido al final.",
    steps: [
      "Salpimentar las lonchas de panceta.",
      "Calentar la parrilla a fuego medio.",
      "Colocar la panceta y cocinar 3-4 min por lado, vigilando de cerca porque la grasa se dora rápido al final.",
      "Espolvorear con pimentón si se desea, justo antes de retirar.",
      "Escurrir sobre papel absorbente y servir caliente y crujiente.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 450,
        allergens: [],
        ingredients: [
          { name: "Panceta de cerdo en lonchas", qty: 600, unit: "g" },
          { name: "Sal", qty: 1, unit: "cdta" },
          { name: "Pimienta", qty: 1, unit: "cdta" },
          { name: "Pimentón dulce", qty: 1, unit: "cdta", opt: true },
        ],
      },
    ],
  },
  {
    id: "r124",
    name: "Choripán",
    category: "Parrilla",
    baseServings: 4,
    notes: "Clásico argentino de asador. El chorizo se abre en mariposa antes de la parrilla para que se haga más rápido y quede crujiente.",
    steps: [
      "Abrir el chorizo en mariposa, sin llegar a cortarlo del todo.",
      "Preparar el chimichurri: mezclar el perejil y el ajo picados con el vinagre, el aceite y el orégano.",
      "Asar el chorizo a la parrilla a fuego medio, 4-5 min por lado, hasta que esté bien hecho y dorado.",
      "Tostar el pan de baguette ligeramente en la parrilla.",
      "Montar el choripán con el chorizo dentro del pan y el chimichurri por encima.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 480,
        allergens: ["gluten"],
        ingredients: [
          { name: "Chorizo parrillero", qty: 4, unit: "ud" },
          { name: "Pan de baguette", qty: 4, unit: "ud" },
          { name: "Perejil fresco", qty: 1, unit: "taza" },
          { name: "Ajo", qty: 3, unit: "diente" },
          { name: "Vinagre", qty: 2, unit: "cda" },
          { name: "Aceite de oliva", qty: 4, unit: "cda" },
          { name: "Orégano", qty: 1, unit: "cdta" },
        ],
      },
    ],
  },
  {
    id: "r125",
    name: "Costillar de cordero a la parrilla",
    category: "Parrilla",
    baseServings: 4,
    notes: "Marinar mínimo 1 h con ajo, romero y limón. Parrilla a fuego medio-fuerte, pocos minutos por lado para que quede rosado por dentro.",
    steps: [
      "Mezclar el ajo picado, el romero, el aceite y el zumo de limón para la marinada.",
      "Marinar el costillar mínimo 1 h.",
      "Calentar la parrilla a fuego medio-fuerte.",
      "Asar el costillar 4-5 min por lado, hasta que esté dorado por fuera y rosado por dentro.",
      "Dejar reposar 5 min antes de cortar entre los huesos.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 520,
        allergens: [],
        ingredients: [
          { name: "Costillar de cordero", qty: 1, unit: "kg" },
          { name: "Ajo", qty: 4, unit: "diente" },
          { name: "Romero", qty: 1, unit: "cda" },
          { name: "Aceite de oliva", qty: 3, unit: "cda" },
          { name: "Limón", qty: 1, unit: "ud" },
          { name: "Sal", qty: 1, unit: "cdta" },
        ],
      },
    ],
  },
  {
    id: "r126",
    name: "Maíz asado a la parrilla",
    category: "Parrilla",
    baseServings: 4,
    notes: "Con la piel puesta al principio para que se cueza al vapor por dentro, luego sin piel unos minutos más para que dore.",
    steps: [
      "Calentar la parrilla a fuego medio.",
      "Asar las mazorcas con su piel 15 min, dando vueltas, para que se cuezan al vapor por dentro.",
      "Retirar la piel y asar sin ella 5 min más, hasta que dore ligeramente.",
      "Untar con mantequilla mientras aún están calientes.",
      "Espolvorear con sal, pimentón y queso rallado si se desea.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 220,
        allergens: ["lacteos"],
        ingredients: [
          { name: "Mazorcas de maíz", qty: 4, unit: "ud" },
          { name: "Mantequilla", qty: 40, unit: "g" },
          { name: "Sal", qty: 1, unit: "cdta" },
          { name: "Pimentón dulce", qty: 1, unit: "cdta", opt: true },
          { name: "Queso rallado", qty: 40, unit: "g", opt: true },
        ],
      },
    ],
  },

  /* ---------- SORPRÉNDEME ---------- */
  {
    id: "r127",
    name: "Ceviche peruano",
    category: "Peruana",
    baseServings: 4,
    notes: "El pescado se \"cuece\" con el ácido de la lima, no con calor — 10-15 min en la nevera es suficiente. Servir muy frío.",
    steps: [
      "Cortar el pescado en dados no muy grandes.",
      "Colocar el pescado en un bol y cubrir con el zumo de lima recién exprimido.",
      "Añadir la cebolla morada en juliana fina, el cilantro picado y el chile si se usa.",
      "Dejar marinar en la nevera 10-15 min, hasta que el pescado se vea opaco: se \"cuece\" con el ácido.",
      "Servir muy frío, con el boniato cocido y el maíz por encima si se desea.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 250,
        allergens: ["pescado"],
        ingredients: [
          { name: "Pescado blanco fresco", qty: 600, unit: "g" },
          { name: "Lima", qty: 6, unit: "ud" },
          { name: "Cebolla morada", qty: 1, unit: "ud" },
          { name: "Cilantro fresco", qty: 1, unit: "taza" },
          { name: "Ají o chile fresco", qty: 1, unit: "ud", opt: true },
          { name: "Boniato", qty: 1, unit: "ud", opt: true },
          { name: "Maíz dulce", qty: 1, unit: "lata", opt: true },
        ],
      },
    ],
  },
  {
    id: "r128",
    name: "Empanadas argentinas de carne",
    category: "Argentina",
    baseServings: 6,
    notes: "Repulgue (el borde trenzado) bien apretado para que no se abran al hornear. Horno a 200 ºC unos 20 min hasta dorar.",
    steps: [
      "Sofreír la cebolla y el pimiento en aceite hasta que estén blandos.",
      "Añadir la carne picada, el pimentón y el comino, dorar bien.",
      "Dejar enfriar el relleno por completo antes de montar las empanadas, así no humedece la masa.",
      "Rellenar cada disco de masa con el relleno, el huevo duro y las aceitunas picadas.",
      "Doblar por la mitad y hacer el repulgue, apretando bien el borde.",
      "Hornear a 200 ºC 18-20 min hasta que estén doradas.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 380,
        allergens: ["gluten", "huevo"],
        ingredients: [
          { name: "Masa de empanada", qty: 12, unit: "ud" },
          { name: "Carne picada", qty: 500, unit: "g" },
          { name: "Cebolla", qty: 2, unit: "ud" },
          { name: "Pimiento rojo", qty: 1, unit: "ud" },
          { name: "Huevo duro", qty: 2, unit: "ud", opt: true },
          { name: "Aceitunas", qty: 60, unit: "g", opt: true },
          { name: "Pimentón dulce", qty: 1, unit: "cda" },
          { name: "Comino", qty: 1, unit: "cdta" },
        ],
      },
    ],
  },
  {
    id: "r129",
    name: "Feijoada brasileña",
    category: "Brasileña",
    baseServings: 4,
    notes: "Guiso lento, mínimo 1 h 30 min, para que las carnes queden tiernas y las alubias absorban el sabor. Se sirve con arroz blanco y naranja.",
    steps: [
      "Dorar la panceta, el chorizo y las costillas en una olla grande con un poco de aceite.",
      "Añadir la cebolla y el ajo, sofreír 5 min.",
      "Incorporar las alubias negras cocidas y el laurel, cubrir con agua o caldo.",
      "Cocer a fuego lento 1 h 30 min, removiendo de vez en cuando, hasta que las carnes estén muy tiernas y el guiso espese.",
      "Servir con arroz blanco y gajos de naranja.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 550,
        allergens: [],
        ingredients: [
          { name: "Alubias negras cocidas", qty: 600, unit: "g" },
          { name: "Panceta", qty: 200, unit: "g" },
          { name: "Chorizo", qty: 200, unit: "g" },
          { name: "Costillas de cerdo", qty: 300, unit: "g" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Ajo", qty: 3, unit: "diente" },
          { name: "Laurel", qty: 1, unit: "ud", opt: true },
          { name: "Naranja", qty: 1, unit: "ud", opt: true },
        ],
      },
    ],
  },
  {
    id: "r130",
    name: "Pierogi polacos",
    category: "Polaca",
    baseServings: 4,
    notes: "Masa fina, no demasiado harinosa al estirar. Se cuecen en agua hirviendo hasta que suben a la superficie, luego un pase por la sartén con mantequilla.",
    steps: [
      "Cocer la patata hasta que esté tierna y hacer un puré, mezclándolo con el queso y la cebolla pochada.",
      "Amasar la harina con agua y sal hasta obtener una masa lisa y elástica; dejar reposar 20 min.",
      "Estirar la masa fina y cortar círculos con un vaso o cortapastas.",
      "Rellenar cada círculo con el puré, doblar por la mitad y sellar bien los bordes.",
      "Cocer en agua hirviendo hasta que suban a la superficie, unos 3-4 min.",
      "Saltear en mantequilla unos minutos antes de servir para que doren ligeramente.",
    ],
    variants: [
      {
        id: "v1",
        name: "De patata y queso",
        calories: 420,
        allergens: ["gluten", "lacteos"],
        ingredients: [
          { name: "Harina", qty: 400, unit: "g" },
          { name: "Patata", qty: 500, unit: "g" },
          { name: "Queso", qty: 150, unit: "g" },
          { name: "Cebolla", qty: 1, unit: "ud" },
          { name: "Mantequilla", qty: 50, unit: "g" },
          { name: "Sal", qty: 1, unit: "cdta" },
        ],
      },
    ],
  },
  {
    id: "r131",
    name: "Baklava",
    category: "Postres",
    baseServings: 12,
    notes: "Pincelar cada capa de masa filo con mantequilla derretida, sin saltarse ninguna. El almíbar de miel se vierte frío sobre el baklava recién horneado y caliente.",
    steps: [
      "Precalentar el horno a 170 ºC.",
      "Picar las nueces y los pistachos, mezclar con la canela.",
      "Engrasar un molde y colocar una capa de masa filo, pincelando con mantequilla derretida; repetir con varias capas.",
      "Repartir la mitad de los frutos secos, añadir más capas de masa filo pincelada, y repetir con el resto del relleno.",
      "Terminar con varias capas más de masa filo pincelada, y cortar en forma de rombos antes de hornear.",
      "Hornear 40-45 min hasta que esté dorado.",
      "Preparar un almíbar con la miel calentada, y verterlo frío sobre el baklava recién horneado y caliente.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 320,
        allergens: ["gluten", "frutos_secos", "lacteos"],
        ingredients: [
          { name: "Masa filo", qty: 500, unit: "g" },
          { name: "Nueces", qty: 200, unit: "g" },
          { name: "Pistachos", qty: 100, unit: "g" },
          { name: "Mantequilla", qty: 200, unit: "g" },
          { name: "Miel", qty: 200, unit: "g" },
          { name: "Canela", qty: 1, unit: "cdta", opt: true },
        ],
      },
    ],
  },
  {
    id: "r132",
    name: "Pad see ew",
    category: "Asiática",
    baseServings: 4,
    notes: "Wok muy caliente, fideos anchos con cuidado al remover para que no se rompan. Todo el proceso es rápido, tener los ingredientes preparados antes.",
    steps: [
      "Marinar la ternera en tiras con un poco de salsa de soja 10 min.",
      "Calentar el wok a fuego muy fuerte, saltear la ternera hasta que esté dorada, y reservar.",
      "Saltear el ajo y el brócoli 2 min.",
      "Apartar a un lado y cuajar el huevo batido en el hueco libre.",
      "Añadir los fideos de arroz anchos y la salsa de soja, saltear todo junto con cuidado para no romper los fideos, 2-3 min.",
      "Devolver la ternera, mezclar bien y servir caliente.",
    ],
    variants: [
      {
        id: "v1",
        name: "De ternera",
        calories: 450,
        allergens: ["gluten", "huevo", "soja"],
        ingredients: [
          { name: "Fideos de arroz anchos", qty: 350, unit: "g" },
          { name: "Solomillo de ternera", qty: 300, unit: "g" },
          { name: "Brócoli", qty: 200, unit: "g" },
          { name: "Huevos", qty: 2, unit: "ud" },
          { name: "Salsa de soja", qty: 4, unit: "cda" },
          { name: "Ajo", qty: 3, unit: "diente" },
        ],
      },
    ],
  },
  {
    id: "r133",
    name: "Tostones",
    category: "Latina",
    baseServings: 4,
    notes: "Fritura doble: primero para cocer el plátano, se aplasta, y segunda fritura más fuerte para que quede crujiente por fuera.",
    steps: [
      "Pelar el plátano macho y cortarlo en rodajas gruesas.",
      "Freír en aceite a fuego medio 3-4 min por lado, hasta que estén tiernos pero sin dorar del todo.",
      "Retirar y aplastar cada rodaja con un plato o prensa de tostones, hasta que queden aplanadas.",
      "Freír de nuevo en aceite bien caliente 2-3 min por lado, hasta que estén crujientes y dorados.",
      "Escurrir sobre papel absorbente y salar al momento.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 220,
        allergens: [],
        ingredients: [
          { name: "Plátano macho", qty: 3, unit: "ud" },
          { name: "Aceite para freír", qty: 400, unit: "ml" },
          { name: "Sal", qty: 1, unit: "cdta" },
          { name: "Ajo", qty: 1, unit: "diente", opt: true },
        ],
      },
    ],
  },
  {
    id: "r134",
    name: "Churros con chocolate",
    category: "Postres",
    baseServings: 4,
    notes: "La masa se escalfa en agua hirviendo con sal antes de freír. Chocolate a la taza bien espeso, con maicena o harina para que ligue.",
    steps: [
      "Llevar el agua a ebullición con una pizca de sal.",
      "Añadir la harina de golpe fuera del fuego, removiendo enérgicamente hasta obtener una masa lisa que se despegue de las paredes.",
      "Dejar templar la masa unos minutos y meterla en una manga con boquilla de estrella.",
      "Formar los churros directamente sobre el aceite bien caliente, cortando con unas tijeras.",
      "Freír 3-4 min hasta que estén dorados y crujientes, escurrir y espolvorear con azúcar si se desea.",
      "Para el chocolate, calentar la leche con el chocolate troceado y el azúcar, removiendo hasta que espese.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 380,
        allergens: ["gluten", "lacteos"],
        ingredients: [
          { name: "Harina", qty: 250, unit: "g" },
          { name: "Agua", qty: 250, unit: "ml" },
          { name: "Sal", qty: 1, unit: "pinch" },
          { name: "Aceite para freír", qty: 500, unit: "ml" },
          { name: "Chocolate negro", qty: 150, unit: "g" },
          { name: "Leche", qty: 400, unit: "ml" },
          { name: "Azúcar", qty: 2, unit: "cda" },
        ],
      },
    ],
  },
  {
    id: "r135",
    name: "Poutine canadiense",
    category: "Canadiense",
    baseServings: 4,
    notes: "Las patatas fritas deben quedar muy crujientes para aguantar la salsa sin ablandarse del todo. La salsa gravy y el queso van bien calientes, encima justo antes de servir.",
    steps: [
      "Cortar las patatas en bastones y freírlas en dos tandas: primero a fuego medio para cocerlas por dentro, luego a fuego fuerte para que doren y queden crujientes.",
      "Preparar la salsa gravy: fundir la mantequilla, añadir la harina, cocinar 1 min, y añadir el caldo de carne poco a poco hasta espesar.",
      "Escurrir las patatas fritas sobre papel absorbente y salar.",
      "Repartir el queso en grano sobre las patatas calientes para que empiece a fundirse.",
      "Cubrir con la salsa gravy bien caliente justo antes de servir.",
    ],
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 550,
        allergens: ["gluten", "lacteos"],
        ingredients: [
          { name: "Patata", qty: 800, unit: "g" },
          { name: "Queso en grano", qty: 200, unit: "g" },
          { name: "Caldo de carne", qty: 300, unit: "ml" },
          { name: "Harina", qty: 2, unit: "cda" },
          { name: "Mantequilla", qty: 30, unit: "g" },
          { name: "Aceite para freír", qty: 500, unit: "ml" },
        ],
      },
    ],
  },
];
const RECIPE_LIBRARY = seedRecipes;

/* ---------- helpers de fecha ---------- */
function startOfWeek(offset) {
  const d = new Date();
  const day = (d.getDay() + 6) % 7; // lunes = 0
  d.setDate(d.getDate() - day + offset * 7);
  d.setHours(0, 0, 0, 0);
  return d;
}
function fmtRange(monday) {
  const end = new Date(monday);
  end.setDate(end.getDate() + 6);
  const o = { day: "numeric", month: "short" };
  return `${monday.toLocaleDateString("es-ES", o)} – ${end.toLocaleDateString("es-ES", o)}`;
}
function localDateKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function keyFor(monday, dayIdx) {
  const d = new Date(monday);
  d.setDate(d.getDate() + dayIdx);
  return localDateKey(d);
}
const uid = () => Math.random().toString(36).slice(2, 9);
// Formatear cantidades sin decimales feos: 250.0 → 250, 2.5 → 2,5
function fmtQty(n) {
  if (typeof n !== "number" || Number.isNaN(n)) return String(n ?? "");
  if (Math.abs(n - Math.round(n)) < 0.01) return String(Math.round(n));
  return n.toFixed(2).replace(/\.?0+$/, "").replace(".", ",");
}
// Convierte una cantidad de una unidad a otra cuando es posible (peso g↔kg, volumen ml↔l).
// Devuelve null si las unidades no son compatibles (p. ej. "ud" a "g").
function convertQty(qty, fromUnit, toUnit) {
  if (fromUnit === toUnit) return qty;
  const toBase = { g: 1, kg: 1000, ml: 1, l: 1000 };
  const weightUnits = ["g", "kg"];
  const volUnits = ["ml", "l"];
  const sameGroup =
    (weightUnits.includes(fromUnit) && weightUnits.includes(toUnit)) ||
    (volUnits.includes(fromUnit) && volUnits.includes(toUnit));
  if (!sameGroup) return null;
  return (qty * toBase[fromUnit]) / toBase[toUnit];
}
// Compara los ingredientes NO opcionales de una variante con lo que hay en la despensa.
// Devuelve cuántos están cubiertos, cuáles faltan (o están cortos de cantidad), y si se
// puede hacer el plato entero tal cual está la despensa ahora mismo.
function pantryMatchScore(variant, pantryItems) {
  const required = variant.ingredients.filter((i) => !i.opt);
  if (required.length === 0) return { canMake: true, missing: [], have: 0, total: 0 };
  let have = 0;
  const missing = [];
  for (const ing of required) {
    const matches = pantryItems.filter(
      (p) => p.name.trim().toLowerCase() === ing.name.trim().toLowerCase()
    );
    const alwaysHave = matches.some((p) => p.qty == null);
    if (alwaysHave) {
      have++;
      continue;
    }
    let available = 0;
    for (const p of matches) {
      const converted = convertQty(p.qty, p.unit, ing.unit);
      if (converted != null) available += converted;
    }
    if (available + 1e-6 >= ing.qty) have++;
    else missing.push(ing.name);
  }
  return { canMake: missing.length === 0, missing, have, total: required.length };
}

/* ---------- clasificación de platos para el recomendador ---------- */
// Rol de cada categoría: primer/segundo plato, plato único, postre, desayuno.
const CATEGORY_ROLES = {
  Legumbres: "primer",
  Pasta: "primer",
  Arroz: "primer",
  Ensaladas: "primer",
  "Sopas frías": "primer",
  "Cremas y sopas": "primer",
  Verduras: "primer",
  Carne: "segundo",
  Pescado: "segundo",
  Huevos: "segundo",
  "Tex-Mex": "unico",
  Pizza: "unico",
  China: "unico",
  Japonesa: "unico",
  Coreana: "unico",
  Asiática: "unico",
  Marroquí: "unico",
  Hornear: "unico",
  Rápidas: "unico",
  Tapas: "acompañamiento",
  Postres: "postre",
  Desayuno: "desayuno",
};
const roleOf = (r) => (r ? CATEGORY_ROLES[r.category] || "unico" : "unico");

function computeRecommendations(recipes, plan, monday, dateKey, slot, currentDishes) {
  // Uso de categorías en la semana visible
  const weekUsage = {};
  for (let d = 0; d < 7; d++) {
    const dk = keyFor(monday, d);
    const day = plan[dk];
    if (!day) continue;
    for (const s of SLOTS) {
      for (const e of slotDishes(day[s])) {
        const r = recipes.find((x) => x.id === e.recipeId);
        if (r?.category) weekUsage[r.category] = (weekUsage[r.category] || 0) + 1;
      }
    }
  }

  // Roles ya presentes en esta comida
  const currentRoles = currentDishes
    .map((d) => roleOf(recipes.find((r) => r.id === d.recipeId)))
    .filter(Boolean);
  const has = { primer: 0, segundo: 0, unico: 0, postre: 0, acompañamiento: 0, desayuno: 0 };
  currentRoles.forEach((r) => (has[r] = (has[r] || 0) + 1));
  const alreadyIds = new Set(currentDishes.map((d) => d.recipeId));

  function fitScore(role) {
    if (slot === "Desayuno") return role === "desayuno" ? 12 : role === "postre" ? 3 : 0;
    if (currentDishes.length === 0) {
      if (["primer", "segundo", "unico"].includes(role)) return 6;
      return 0;
    }
    if (has.unico) return role === "postre" ? 14 : 0;
    if (has.primer && has.segundo) return role === "postre" ? 12 : 0;
    if (has.primer && !has.segundo) return role === "segundo" ? 14 : role === "postre" ? 4 : 0;
    if (has.segundo && !has.primer) return role === "primer" ? 14 : role === "postre" ? 4 : 0;
    if (has.postre && !has.primer && !has.segundo && !has.unico)
      return ["primer", "segundo", "unico"].includes(role) ? 8 : 0;
    return 0;
  }

  function varietyBoost(cat) {
    const n = weekUsage[cat] || 0;
    if (n === 0) return 4;
    if (n === 1) return 1;
    return -2 * (n - 1);
  }

  function reasonFor(role, cat) {
    if (slot === "Desayuno" && role === "desayuno") return "para desayunar";
    if (role === "postre") return "de postre";
    if (has.primer && !has.segundo && role === "segundo") return "de segundo";
    if (has.segundo && !has.primer && role === "primer") return "de primero";
    if ((weekUsage[cat] || 0) === 0) return "no toca aún";
    return null;
  }

  const scored = recipes
    .filter((r) => !alreadyIds.has(r.id))
    .map((r) => {
      const role = roleOf(r);
      const fit = fitScore(role);
      if (fit <= 0) return null;
      const variety = varietyBoost(r.category);
      const fav = r.fav ? 2 : 0;
      return { recipe: r, score: fit + variety + fav, reason: reasonFor(role, r.category) };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);

  // Diversificar: no dejar 3 de la misma categoría
  const picked = [];
  const catCount = {};
  for (const cand of scored) {
    const c = cand.recipe.category || "";
    if ((catCount[c] || 0) >= 1 && picked.length >= 2) continue;
    picked.push(cand);
    catCount[c] = (catCount[c] || 0) + 1;
    if (picked.length >= 4) break;
  }
  return picked;
}
// Un hueco de comida puede tener varios platos. Compatibilidad con el formato antiguo (un solo objeto).
const slotDishes = (e) => (Array.isArray(e) ? e : e ? [e] : []);
// Suma las calorías (por ración) de los platos planificados en un día. "missing" cuenta
// los platos sin dato de calorías (o con receta borrada), para avisar de que el total es parcial.
function dayCalorieInfo(day, recipeById) {
  let total = 0;
  let missing = 0;
  let hasAny = false;
  for (const slot of SLOTS) {
    for (const d of slotDishes(day?.[slot])) {
      const rec = recipeById(d.recipeId);
      const variant = rec && (rec.variants.find((v) => v.id === d.variantId) || rec.variants[0]);
      if (variant && variant.calories != null) {
        total += variant.calories;
        hasAny = true;
      } else {
        missing += 1;
      }
    }
  }
  return { total, missing, hasAny };
}
const cloneRecipe = (r) => ({
  ...JSON.parse(JSON.stringify(r)),
  id: uid(),
  name: `${r.name} (copia)`,
  fav: false,
  variants: (r.variants || []).map((v) => ({ ...JSON.parse(JSON.stringify(v)), id: uid() })),
});

/* ---------- storage ---------- */
async function loadKey(key, fallback) {
  try {
    const r = localStorage.getItem(key);
    return r ? JSON.parse(r) : fallback;
  } catch {
    return fallback;
  }
}
async function saveKey(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("No se pudo guardar", e);
  }
}

/* ---------- dibujitos para estados vacíos ---------- */
function Doodle({ kind, size = 110 }) {
  const s = { width: size, height: size, display: "block" };
  if (kind === "no-recipes") {
    return (
      <svg viewBox="0 0 140 140" style={s} className="doodle-float">
        {/* cuaderno abierto */}
        <path d="M18 38 Q70 30 122 38 L120 108 Q70 100 20 108 Z" fill={c.card} stroke={c.muted} strokeWidth="2" strokeLinejoin="round"/>
        <path d="M70 34 Q70 70 70 104" stroke={c.muted} strokeWidth="1.5" strokeDasharray="3,3" fill="none"/>
        {/* renglones */}
        <g stroke={c.rule} strokeWidth="1.5" strokeLinecap="round">
          <line x1="28" y1="58" x2="60" y2="58"/>
          <line x1="28" y1="72" x2="60" y2="72"/>
          <line x1="28" y1="86" x2="55" y2="86"/>
          <line x1="80" y1="58" x2="112" y2="58"/>
          <line x1="80" y1="72" x2="112" y2="72"/>
        </g>
        {/* lápiz cruzado */}
        <g transform="rotate(-25 100 82)">
          <rect x="70" y="79" width="34" height="7" rx="1" fill={c.highlight} stroke={c.muted} strokeWidth="1.5"/>
          <path d="M104 79 L114 82.5 L104 86 Z" fill={c.ink}/>
          <path d="M70 79 L66 82.5 L70 86 Z" fill={c.paprika}/>
        </g>
        {/* squiggle sobre la página derecha */}
        <path d="M82 86 q4 -3 8 0 t8 0 t8 0" stroke={c.paprika} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      </svg>
    );
  }
  if (kind === "no-plan") {
    return (
      <svg viewBox="0 0 140 140" style={s} className="doodle-float">
        {/* plato */}
        <circle cx="70" cy="70" r="36" fill={c.card} stroke={c.muted} strokeWidth="2"/>
        <circle cx="70" cy="70" r="26" fill="none" stroke={c.muted} strokeWidth="1" strokeDasharray="1.5,2.5"/>
        {/* tenedor a la izquierda */}
        <g stroke={c.ink} strokeWidth="2" strokeLinecap="round" fill="none">
          <line x1="18" y1="30" x2="18" y2="115"/>
          <line x1="13" y1="30" x2="13" y2="52"/>
          <line x1="23" y1="30" x2="23" y2="52"/>
        </g>
        {/* cuchillo a la derecha */}
        <path d="M122 30 L122 65 Q122 75 118 82 L118 115" stroke={c.ink} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {/* vaporcillo */}
        <path d="M60 32 q3 -6 6 0 t6 0 t6 0" stroke={c.paprika} strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      </svg>
    );
  }
  if (kind === "no-search") {
    return (
      <svg viewBox="0 0 140 140" style={s} className="doodle-float">
        {/* lupa */}
        <circle cx="58" cy="58" r="28" fill={c.card} stroke={c.ink} strokeWidth="3"/>
        <line x1="80" y1="80" x2="112" y2="112" stroke={c.ink} strokeWidth="5" strokeLinecap="round"/>
        {/* signo de interrogación dentro */}
        <text x="58" y="68" textAnchor="middle" fontFamily="'Caveat', cursive" fontSize="40" fontWeight="700" fill={c.paprika}>?</text>
      </svg>
    );
  }
  if (kind === "no-shopping") {
    return (
      <svg viewBox="0 0 140 140" style={s} className="doodle-float">
        {/* bolsa/cesta */}
        <path d="M30 55 L110 55 L100 115 Q70 122 40 115 Z" fill={c.card} stroke={c.muted} strokeWidth="2" strokeLinejoin="round"/>
        {/* asas */}
        <path d="M50 55 Q50 30 70 30 Q90 30 90 55" stroke={c.ink} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {/* rayas de la cesta */}
        <g stroke={c.muted} strokeWidth="1.2" strokeLinecap="round">
          <line x1="45" y1="70" x2="42" y2="105"/>
          <line x1="60" y1="70" x2="59" y2="108"/>
          <line x1="80" y1="70" x2="81" y2="108"/>
          <line x1="95" y1="70" x2="98" y2="105"/>
          <line x1="34" y1="80" x2="105" y2="80"/>
          <line x1="36" y1="95" x2="102" y2="95"/>
        </g>
        {/* hoja decorativa */}
        <path d="M70 40 q-8 -12 -18 -6 q6 6 18 10 z" fill={c.herbSoft} stroke={c.herb} strokeWidth="1.5"/>
      </svg>
    );
  }
  if (kind === "no-pantry") {
    return (
      <svg viewBox="0 0 140 140" style={s} className="doodle-float">
        {/* balda */}
        <line x1="18" y1="98" x2="122" y2="98" stroke={c.muted} strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="18" y1="98" x2="14" y2="106" stroke={c.muted} strokeWidth="2" strokeLinecap="round"/>
        <line x1="122" y1="98" x2="126" y2="106" stroke={c.muted} strokeWidth="2" strokeLinecap="round"/>
        {/* tarro 1 */}
        <rect x="30" y="60" width="24" height="38" rx="4" fill={c.card} stroke={c.ink} strokeWidth="2"/>
        <rect x="35" y="52" width="14" height="10" rx="2" fill={c.herbSoft} stroke={c.ink} strokeWidth="1.5"/>
        <line x1="30" y1="78" x2="54" y2="78" stroke={c.rule} strokeWidth="1.5"/>
        {/* tarro 2, más alto */}
        <rect x="60" y="46" width="26" height="52" rx="4" fill={c.card} stroke={c.ink} strokeWidth="2"/>
        <rect x="66" y="38" width="14" height="10" rx="2" fill={c.paprikaSoft} stroke={c.ink} strokeWidth="1.5"/>
        <line x1="60" y1="66" x2="86" y2="66" stroke={c.rule} strokeWidth="1.5"/>
        <line x1="60" y1="82" x2="86" y2="82" stroke={c.rule} strokeWidth="1.5"/>
        {/* tarro 3 */}
        <rect x="94" y="66" width="22" height="32" rx="4" fill={c.card} stroke={c.ink} strokeWidth="2"/>
        <rect x="99" y="58" width="12" height="10" rx="2" fill={c.highlight} stroke={c.ink} strokeWidth="1.5"/>
        {/* squiggle encima, como si faltara algo */}
        <path d="M55 30 q4 -5 8 0 t8 0" stroke={c.paprika} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      </svg>
    );
  }
  return null;
}

/* ---------- estado vacío completo (dibujito + texto) ---------- */
function EmptyState({ kind, title, subtitle, children }) {
  return (
    <div style={{ textAlign: "center", padding: "24px 20px 32px", color: c.muted }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
        <Doodle kind={kind} />
      </div>
      <div style={{ fontFamily: display, fontSize: 15, fontWeight: 700, color: c.ink, marginBottom: 4 }}>
        {title}
      </div>
      {subtitle && (
        <div style={{ fontSize: 14, color: c.muted, fontStyle: "italic", lineHeight: 1.4, maxWidth: 280, margin: "0 auto" }}>
          {subtitle}
        </div>
      )}
      {children && <div style={{ marginTop: 14 }}>{children}</div>}
    </div>
  );
}

// Rellena "calories" y "allergens" en recetas ya guardadas que coincidan por id con la
// biblioteca de fábrica (RECIPE_LIBRARY), solo cuando ese dato falta de verdad (undefined).
// Nunca toca recetas propias del usuario (no están en la biblioteca) ni pisa un valor ya puesto,
// ni siquiera un array de alérgenos vacío (eso significa "revisado, sin alérgenos", no "sin rellenar").
function backfillCalories(storedRecipes) {
  let anyChanged = false;
  const next = storedRecipes.map((r) => {
    const libRecipe = RECIPE_LIBRARY.find((lr) => lr.id === r.id);
    if (!libRecipe) return r;
    let recipeChanged = false;
    const newVariants = r.variants.map((v) => {
      const libVariant = libRecipe.variants.find((lv) => lv.id === v.id);
      if (!libVariant) return v;
      let patch = {};
      if (v.calories == null && libVariant.calories != null) {
        patch.calories = libVariant.calories;
        recipeChanged = true;
      }
      if (v.allergens === undefined && libVariant.allergens !== undefined) {
        patch.allergens = libVariant.allergens;
        recipeChanged = true;
      }
      return Object.keys(patch).length ? { ...v, ...patch } : v;
    });
    if (recipeChanged) anyChanged = true;
    return recipeChanged ? { ...r, variants: newVariants } : r;
  });
  return { next, changed: anyChanged };
}

// Corrige un fallo de una versión anterior: "leche de coco" y otras leches vegetales
// contienen la palabra "leche" y se marcaron por error como lácteos. Solo quita la
// etiqueta si NINGÚN otro ingrediente de esa opción es lácteo de verdad, y solo si esa
// opción tiene realmente un ingrediente de leche vegetal (no toca nada más).
function fixPlantMilkFalsePositive(storedRecipes) {
  const PLANT_MILK = ["leche de coco", "leche vegetal", "leche de almendra", "leche de avena", "leche de arroz", "leche de soja"];
  const REAL_DAIRY_WORDS = ["queso", "mantequilla", "nata", "yogur", "quesito", "mozzarella", "parmesano", "feta", "helado", "pecorino"];
  let anyChanged = false;
  const next = storedRecipes.map((r) => {
    let recipeChanged = false;
    const newVariants = r.variants.map((v) => {
      if (!v.allergens || !v.allergens.includes("lacteos")) return v;
      const hasPlantMilk = (v.ingredients || []).some((ing) =>
        PLANT_MILK.some((p) => ing.name.toLowerCase().includes(p))
      );
      if (!hasPlantMilk) return v;
      const hasRealDairy = (v.ingredients || []).some((ing) => {
        const low = ing.name.toLowerCase();
        if (PLANT_MILK.some((p) => low.includes(p))) return false;
        return REAL_DAIRY_WORDS.some((d) => low.includes(d)) || /\bleche\b/.test(low);
      });
      if (hasRealDairy) return v;
      recipeChanged = true;
      return { ...v, allergens: v.allergens.filter((a) => a !== "lacteos") };
    });
    if (recipeChanged) anyChanged = true;
    return recipeChanged ? { ...r, variants: newVariants } : r;
  });
  return { next, changed: anyChanged };
}

// Corrige otro descuido: el tahini (pasta de sésamo) no se marcaba como fruto seco/sésamo.
// Añade "frutos_secos" solo cuando la opción lleva tahini de verdad y aún no estaba marcada.
function fixMissingSesameAllergen(storedRecipes) {
  let anyChanged = false;
  const next = storedRecipes.map((r) => {
    let recipeChanged = false;
    const newVariants = r.variants.map((v) => {
      if (!v.allergens || v.allergens.includes("frutos_secos")) return v;
      const hasTahini = (v.ingredients || []).some((ing) => ing.name.toLowerCase().includes("tahini"));
      if (!hasTahini) return v;
      recipeChanged = true;
      return { ...v, allergens: [...v.allergens, "frutos_secos"] };
    });
    if (recipeChanged) anyChanged = true;
    return recipeChanged ? { ...r, variants: newVariants } : r;
  });
  return { next, changed: anyChanged };
}

// Rellena "steps" (preparación paso a paso) en recetas ya guardadas que coincidan por id
// con la biblioteca de fábrica, solo cuando ese dato falta (undefined). Igual que con
// calorías y alérgenos: nunca toca recetas propias ni pisa unos pasos que ya hubiera.
function backfillSteps(storedRecipes) {
  let anyChanged = false;
  const next = storedRecipes.map((r) => {
    if (r.steps !== undefined) return r;
    const libRecipe = RECIPE_LIBRARY.find((lr) => lr.id === r.id);
    if (!libRecipe || libRecipe.steps === undefined) return r;
    anyChanged = true;
    return { ...r, steps: libRecipe.steps };
  });
  return { next, changed: anyChanged };
}

export default function App() {
  const [view, setView] = useState("menu");
  const [recipes, setRecipes] = useState([]);
  const [plan, setPlan] = useState({});
  const [weekOffset, setWeekOffset] = useState(0);
  const [ready, setReady] = useState(false);

  const [pickerCell, setPickerCell] = useState(null); // {dateKey, slot}
  const [editing, setEditing] = useState(null); // recipe object o null
  const [checked, setChecked] = useState({});
  const [pantryItems, setPantryItems] = useState([]); // [{id, name, qty, unit}] qty/unit null = "siempre disponible"
  const [extras, setExtras] = useState([]); // productos sueltos añadidos a mano
  const [reviewedDays, setReviewedDays] = useState({}); // { [dateKey]: true } días ya confirmados (cocinado o no)
  const [reviewingDate, setReviewingDate] = useState(null); // dateKey del día que se está revisando ahora mismo

  const monday = useMemo(() => startOfWeek(weekOffset), [weekOffset]);

  useEffect(() => {
    (async () => {
      const r = await loadKey("recipes", null);
      const p = await loadKey("plan", {});
      const pan = await loadKey("pantry", []);
      const ext = await loadKey("extras", []);
      const rev = await loadKey("reviewedDays", {});
      // migrar huecos antiguos (objeto único) a array de platos
      let migrated = false;
      for (const dk of Object.keys(p)) {
        for (const slot of Object.keys(p[dk])) {
          if (!Array.isArray(p[dk][slot])) {
            p[dk][slot] = p[dk][slot] ? [p[dk][slot]] : [];
            migrated = true;
          }
          if (p[dk][slot].length === 0) {
            delete p[dk][slot];
            migrated = true;
          }
        }
      }
      // migrar despensa antigua (array de nombres) a objetos con cantidad opcional
      const pantryMigrated = (pan || []).map((entry) =>
        typeof entry === "string" ? { id: uid(), name: entry, qty: null, unit: null } : entry
      );
      setRecipes(r || seedRecipes);
      if (!r) saveKey("recipes", seedRecipes);
      else {
        const { next: step1, changed: c1 } = backfillCalories(r);
        const { next: step2, changed: c2 } = fixPlantMilkFalsePositive(step1);
        const { next: step3, changed: c3 } = fixMissingSesameAllergen(step2);
        const { next: step4, changed: c4 } = backfillSteps(step3);
        if (c1 || c2 || c3 || c4) {
          setRecipes(step4);
          saveKey("recipes", step4);
        }
      }
      setPlan(p);
      if (migrated) saveKey("plan", p);
      setPantryItems(pantryMigrated);
      if (pantryMigrated.length !== (pan || []).length || pantryMigrated.some((x, i) => typeof pan[i] === "string")) {
        saveKey("pantry", pantryMigrated);
      }
      setExtras(ext);
      setReviewedDays(rev || {});
      setReady(true);
    })();
  }, []);

  const persistRecipes = (next) => {
    setRecipes(next);
    saveKey("recipes", next);
  };
  const persistPlan = (next) => {
    setPlan(next);
    saveKey("plan", next);
  };
  const persistPantryItems = (next) => {
    setPantryItems(next);
    saveKey("pantry", next);
  };
  const addPantryItem = ({ name, qty, unit }) => {
    const n = name.trim();
    if (!n) return;
    persistPantryItems([
      ...pantryItems,
      { id: uid(), name: n, qty: qty || null, unit: qty ? unit : null },
    ]);
  };
  const updatePantryItem = (id, patch) =>
    persistPantryItems(pantryItems.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  const removePantryItem = (id) => persistPantryItems(pantryItems.filter((it) => it.id !== id));
  // Añadido rápido desde la lista de la compra: marca "siempre disponible" (sin cantidad)
  const quickAddToPantry = (name) => {
    const n = name.trim();
    const already = pantryItems.some((it) => it.name.trim().toLowerCase() === n.toLowerCase());
    if (already || !n) return;
    persistPantryItems([...pantryItems, { id: uid(), name: n, qty: null, unit: null }]);
  };
  const quickRemoveFromPantry = (name) =>
    persistPantryItems(pantryItems.filter((it) => it.name.trim().toLowerCase() !== name.trim().toLowerCase()));
  // Al marcar un producto de la compra como comprado, se suma esa cantidad a la despensa
  // (y al desmarcarlo, se deshace). Solo aplica a productos con cantidad medible (no a "otros productos").
  // Usa la forma funcional de setState para que sea seguro llamarla varias veces
  // seguidas (p. ej. al confirmar el consumo de un día con varios ingredientes),
  // sin que una llamada pise el resultado de la anterior.
  const applyPurchaseToPantry = (item, bought) => {
    if (!item || !item.unit || !item.remaining || item.remaining <= 0) return;
    const delta = bought ? item.remaining : -item.remaining;
    setPantryItems((prev) => {
      const existing = prev.find(
        (it) =>
          it.qty != null &&
          it.unit === item.unit &&
          it.name.trim().toLowerCase() === item.name.trim().toLowerCase()
      );
      let next;
      if (existing) {
        const newQty = existing.qty + delta;
        next =
          newQty <= 0.01
            ? prev.filter((it) => it.id !== existing.id)
            : prev.map((it) => (it.id === existing.id ? { ...it, qty: newQty } : it));
      } else if (bought) {
        next = [...prev, { id: uid(), name: item.name, qty: item.remaining, unit: item.unit }];
      } else {
        next = prev;
      }
      saveKey("pantry", next);
      return next;
    });
  };

  // Días pasados con algún plato planificado que aún no se han confirmado.
  const pendingDays = useMemo(() => {
    const todayKey = localDateKey(new Date());
    return Object.keys(plan)
      .filter((dk) => dk < todayKey && !reviewedDays[dk])
      .filter((dk) => SLOTS.some((slot) => slotDishes(plan[dk][slot]).length > 0))
      .sort();
  }, [plan, reviewedDays]);

  const persistReviewedDays = (next) => {
    setReviewedDays(next);
    saveKey("reviewedDays", next);
  };
  const markDayReviewed = (dateKey) => {
    const next = { ...reviewedDays, [dateKey]: true };
    persistReviewedDays(next);
    const stillPending = pendingDays.filter((dk) => dk !== dateKey);
    setReviewingDate(stillPending.length ? stillPending[0] : null);
  };
  const startReview = () => {
    if (pendingDays.length) setReviewingDate(pendingDays[0]);
  };
  // Descuenta de la despensa los ingredientes de los platos confirmados (checkedKeys) de un día,
  // escalados por los comensales de cada plato, y marca el día como revisado.
  const confirmDayConsumption = (dateKey, checkedKeys) => {
    const day = plan[dateKey] || {};
    const usage = {};
    for (const slot of SLOTS) {
      slotDishes(day[slot]).forEach((d, idx) => {
        const dishKey = `${slot}-${idx}`;
        if (!checkedKeys.has(dishKey)) return;
        const rec = recipeById(d.recipeId);
        if (!rec) return;
        const variant = rec.variants.find((v) => v.id === d.variantId) || rec.variants[0];
        if (!variant) return;
        const base = rec.baseServings || 4;
        const factor = (d.servings || base) / base;
        for (const ing of variant.ingredients) {
          const k = `${ing.name.trim().toLowerCase()}|${ing.unit}`;
          if (!usage[k]) usage[k] = { name: ing.name.trim(), unit: ing.unit, qty: 0 };
          usage[k].qty += (Number(ing.qty) || 0) * factor;
        }
      });
    }
    Object.values(usage).forEach((u) => {
      applyPurchaseToPantry({ name: u.name, unit: u.unit, remaining: u.qty }, false);
    });
    markDayReviewed(dateKey);
  };

  const persistExtras = (next) => {
    setExtras(next);
    saveKey("extras", next);
  };
  const addExtra = (name) => {
    const n = name.trim();
    if (!n) return;
    persistExtras([...extras, { id: uid(), name: n, done: false }]);
  };
  const toggleExtra = (id) =>
    persistExtras(extras.map((e) => (e.id === id ? { ...e, done: !e.done } : e)));
  const removeExtra = (id) => persistExtras(extras.filter((e) => e.id !== id));
  const clearDoneExtras = () => persistExtras(extras.filter((e) => !e.done));

  const addDish = (dateKey, slot, recipeId, variantId, servings) => {
    if (!recipeId) return;
    const next = { ...plan };
    next[dateKey] = { ...(next[dateKey] || {}) };
    const entry = { recipeId, variantId };
    if (servings != null) entry.servings = servings;
    next[dateKey][slot] = [...slotDishes(next[dateKey][slot]), entry];
    persistPlan(next);
  };
  const removeDish = (dateKey, slot, index) => {
    const next = { ...plan };
    next[dateKey] = { ...(next[dateKey] || {}) };
    const arr = slotDishes(next[dateKey][slot]).filter((_, i) => i !== index);
    if (arr.length) next[dateKey][slot] = arr;
    else delete next[dateKey][slot];
    persistPlan(next);
  };
  const setDishServings = (dateKey, slot, index, servings) => {
    const next = { ...plan };
    next[dateKey] = { ...(next[dateKey] || {}) };
    const arr = slotDishes(next[dateKey][slot]).map((d, i) =>
      i === index ? { ...d, servings: Math.max(1, servings) } : d
    );
    next[dateKey][slot] = arr;
    persistPlan(next);
  };

  const recipeById = (id) => recipes.find((r) => r.id === id);

  /* ---------- lista de la compra de la semana visible ---------- */
  const shopping = useMemo(() => {
    const map = {};
    for (let d = 0; d < 7; d++) {
      const dk = keyFor(monday, d);
      const day = plan[dk];
      if (!day) continue;
      for (const slot of SLOTS) {
        for (const entry of slotDishes(day[slot])) {
          const rec = recipeById(entry.recipeId);
          if (!rec) continue;
          const variant =
            rec.variants.find((v) => v.id === entry.variantId) || rec.variants[0];
          if (!variant) continue;
          const base = rec.baseServings || 4;
          const factor = (entry.servings || base) / base;
          for (const ing of variant.ingredients) {
            const k = `${ing.name.trim().toLowerCase()}|${ing.unit}`;
            if (!map[k])
              map[k] = { name: ing.name.trim(), unit: ing.unit, qty: 0, count: 0, req: 0 };
            map[k].qty += (Number(ing.qty) || 0) * factor;
            map[k].count += 1;
            if (!ing.opt) map[k].req += 1; // alguna receta lo necesita sí o sí
          }
        }
      }
    }
    return Object.entries(map)
      .map(([k, v]) => {
        const optional = v.req === 0;
        // Buscar cobertura en la despensa: por nombre, con conversión de unidad si aplica.
        const matches = pantryItems.filter(
          (it) => it.name.trim().toLowerCase() === v.name.trim().toLowerCase()
        );
        const alwaysHave = matches.some((it) => it.qty == null);
        let have = 0;
        if (!alwaysHave) {
          for (const it of matches) {
            const converted = convertQty(it.qty, it.unit, v.unit);
            if (converted != null) have += converted;
          }
        }
        const remaining = alwaysHave ? 0 : Math.max(0, v.qty - have);
        const fullyCovered = alwaysHave || remaining <= 0.01;
        return { k, ...v, optional, have: alwaysHave ? null : have, remaining, fullyCovered };
      })
      .sort((a, b) => a.name.localeCompare(b.name, "es"));
  }, [plan, recipes, monday, pantryItems]);

  const toBuyCount = useMemo(
    () =>
      shopping.filter((i) => !i.fullyCovered).length + extras.filter((e) => !e.done).length,
    [shopping, extras]
  );

  const missingLibrary = useMemo(
    () => RECIPE_LIBRARY.filter((lib) => !recipes.some((r) => r.id === lib.id)),
    [recipes]
  );
  const addLibrary = () => {
    if (missingLibrary.length === 0) return;
    persistRecipes([...recipes, ...missingLibrary.map((r) => JSON.parse(JSON.stringify(r)))]);
  };

  if (!ready)
    return (
      <div
        style={{
          background: c.paper,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: c.muted,
          fontFamily: body,
        }}
      >
        Cargando tu cocina…
      </div>
    );

  return (
    <div
      style={{
        background: c.paper,
        minHeight: "100vh",
        color: c.ink,
        fontFamily: body,
        paddingBottom: 84,
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Special+Elite&display=swap');
        * { box-sizing: border-box; }
        button { font-family: inherit; cursor: pointer; }
        ::-webkit-scrollbar { height: 6px; width: 6px; }
        ::-webkit-scrollbar-thumb { background: ${c.line}; border-radius: 3px; }
        @keyframes despensaScribble {
          0%   { transform: scale(0.4) rotate(-22deg); opacity: 0; color: ${c.paprika}; }
          35%  { transform: scale(1.3) rotate(10deg); opacity: 1; color: ${c.paprika}; }
          60%  { transform: scale(0.92) rotate(-5deg); color: ${c.paprika}; }
          85%  { transform: scale(1.04) rotate(2deg); color: ${c.ink}; }
          100% { transform: scale(1) rotate(0); opacity: 1; color: ${c.ink}; }
        }
        .scribble-num {
          display: inline-block;
          animation: despensaScribble 0.36s ease-out;
          transform-origin: center;
        }
        @keyframes postItLand {
          0%   { opacity: 0; transform: rotate(-12deg) translateY(-30px) scale(0.85); }
          70%  { opacity: 1; }
          100% { opacity: 1; }
        }
        @keyframes sheetSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sheet-content {
          animation: sheetSlideUp 0.3s cubic-bezier(.22,1,.36,1) both;
        }
        @keyframes fadeBackdrop {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .sheet-backdrop {
          animation: fadeBackdrop 0.22s ease-out both;
        }
        @keyframes dishAppear {
          from { opacity: 0; transform: scale(0.85) translateY(-4px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .dish-tag {
          animation: dishAppear 0.28s cubic-bezier(.34,1.3,.64,1) both;
          transform-origin: left center;
        }
        @keyframes checkPop {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.4); }
          100% { transform: scale(1); }
        }
        .check-pop {
          animation: checkPop 0.28s ease-out;
          transform-origin: center;
        }
        @keyframes doodleFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-3px); }
        }
        .doodle-float {
          animation: doodleFloat 3.2s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .scribble-num, .post-it, .sheet-content, .sheet-backdrop,
          .dish-tag, .check-pop, .doodle-float { animation: none !important; }
        }
      `}</style>

      {/* cabecera: tapa de cuaderno */}
      <header
        style={{
          background: c.kraft,
          backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.10), rgba(0,0,0,0.05))`,
          borderBottom: `2px dashed ${c.paprika}99`,
          position: "sticky",
          top: 0,
          zIndex: 5,
          boxShadow: "0 2px 6px rgba(44,54,80,0.10)",
        }}
      >
        {/* anillas de la espiral */}
        <div style={{ display: "flex", justifyContent: "space-around", padding: "5px 18px 0" }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <span
              key={i}
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: c.paper,
                boxShadow: "inset 0 1px 2px rgba(0,0,0,0.35)",
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "6px 18px 14px" }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: c.paper,
              border: `2px solid ${c.paprika}`,
              display: "grid",
              placeItems: "center",
              color: c.paprika,
              transform: "rotate(-6deg)",
            }}
          >
            <NotebookPen size={19} />
          </div>
          <div>
            <div style={{ fontFamily: display, fontSize: 32, fontWeight: 700, lineHeight: 0.95, color: c.ink }}>
              La Despensa
            </div>
            <div style={{ fontFamily: display, fontSize: 14, color: c.paprika, lineHeight: 1, marginTop: 1 }}>
              mi cuaderno de cocina
            </div>
          </div>
        </div>
      </header>

      <main style={{ padding: "16px 14px" }}>
        {view === "menu" && (
          <Planner
            monday={monday}
            weekOffset={weekOffset}
            setWeekOffset={setWeekOffset}
            plan={plan}
            recipeById={recipeById}
            onCell={(dateKey, slot) => setPickerCell({ dateKey, slot })}
            onRemoveDish={removeDish}
            onSetServings={setDishServings}
            pendingCount={pendingDays.length}
            onStartReview={startReview}
          />
        )}

        {view === "recetas" && (
          <Library
            recipes={recipes}
            pantryItems={pantryItems}
            onAdd={() => setEditing({ id: uid(), name: "", category: "", notes: "", baseServings: 4, variants: [{ id: uid(), name: "Estándar", ingredients: [{ name: "", qty: 1, unit: "ud" }] }], _new: true })}
            onEdit={(r) => setEditing(JSON.parse(JSON.stringify(r)))}
            onDelete={(id) => persistRecipes(recipes.filter((r) => r.id !== id))}
            onDuplicate={(r) => setEditing({ ...cloneRecipe(r), _new: true })}
            onToggleFav={(id) => persistRecipes(recipes.map((r) => (r.id === id ? { ...r, fav: !r.fav } : r)))}
            missingCount={missingLibrary.length}
            onAddLibrary={addLibrary}
          />
        )}

        {view === "compra" && (
          <Shopping
            items={shopping}
            range={fmtRange(monday)}
            checked={checked}
            setChecked={setChecked}
            quickAddToPantry={quickAddToPantry}
            quickRemoveFromPantry={quickRemoveFromPantry}
            onPurchaseToggle={applyPurchaseToPantry}
            onGoToPantry={() => setView("despensa")}
            extras={extras}
            addExtra={addExtra}
            toggleExtra={toggleExtra}
            removeExtra={removeExtra}
            clearDoneExtras={clearDoneExtras}
          />
        )}

        {view === "despensa" && (
          <Pantry
            items={pantryItems}
            recipes={recipes}
            onAdd={addPantryItem}
            onUpdate={updatePantryItem}
            onRemove={removePantryItem}
          />
        )}
      </main>

      {/* navegación inferior */}
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: c.kraft,
          borderTop: `2px dashed ${c.paprika}99`,
          display: "flex",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {[
          { id: "menu", label: "Menú", icon: CalendarDays },
          { id: "recetas", label: "Recetas", icon: BookOpen },
          { id: "compra", label: "Compra", icon: ShoppingCart },
          { id: "despensa", label: "Despensa", icon: Package },
        ].map(({ id, label, icon: Icon }) => {
          const active = view === id;
          return (
            <button
              key={id}
              onClick={() => setView(id)}
              style={{
                flex: 1,
                background: "none",
                border: "none",
                padding: "10px 0 12px",
                color: active ? c.ink : "#7a6a4d",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                position: "relative",
              }}
            >
              <Icon size={20} />
              <span style={{ fontFamily: display, fontSize: 15, fontWeight: active ? 700 : 600, lineHeight: 1 }}>{label}</span>
              {active && (
                <svg width="34" height="6" viewBox="0 0 34 6" style={{ marginTop: -1 }}>
                  <path d="M1 4 Q 9 1, 17 3 T 33 3" stroke={c.paprika} strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
              )}
              {id === "compra" && toBuyCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: 4,
                    right: "calc(50% - 24px)",
                    background: c.paprika,
                    color: "#fff",
                    fontSize: 10,
                    minWidth: 16,
                    height: 16,
                    borderRadius: 8,
                    display: "grid",
                    placeItems: "center",
                    padding: "0 4px",
                    fontFamily: body,
                    fontWeight: 700,
                  }}
                >
                  {toBuyCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {pickerCell && (
        <SlotPicker
          recipes={recipes}
          slot={pickerCell.slot}
          plan={plan}
          monday={monday}
          dateKey={pickerCell.dateKey}
          currentDishes={slotDishes(plan[pickerCell.dateKey]?.[pickerCell.slot])}
          existingCount={slotDishes(plan[pickerCell.dateKey]?.[pickerCell.slot]).length}
          onPick={(rid, vid) => {
            addDish(pickerCell.dateKey, pickerCell.slot, rid, vid);
            setPickerCell(null);
          }}
          onClose={() => setPickerCell(null)}
        />
      )}

      {editing && (
        <RecipeEditor
          recipe={editing}
          onClose={() => setEditing(null)}
          onSave={(r) => {
            const exists = recipes.some((x) => x.id === r.id);
            const clean = { ...r };
            delete clean._new;
            persistRecipes(exists ? recipes.map((x) => (x.id === r.id ? clean : x)) : [...recipes, clean]);
            setEditing(null);
          }}
        />
      )}

      {reviewingDate && (
        <DayReviewSheet
          key={reviewingDate}
          dateKey={reviewingDate}
          day={plan[reviewingDate] || {}}
          recipeById={recipeById}
          remainingCount={pendingDays.length}
          onConfirm={(checkedKeys) => confirmDayConsumption(reviewingDate, checkedKeys)}
          onSkip={() => markDayReviewed(reviewingDate)}
          onClose={() => setReviewingDate(null)}
        />
      )}
    </div>
  );
}

/* ===================== PLANIFICADOR ===================== */
function Planner({ monday, weekOffset, setWeekOffset, plan, recipeById, onCell, onRemoveDish, onSetServings, pendingCount, onStartReview }) {
  const weekCal = useMemo(() => {
    let total = 0, missing = 0, hasAny = false;
    for (let d = 0; d < 7; d++) {
      const info = dayCalorieInfo(plan[keyFor(monday, d)], recipeById);
      total += info.total;
      missing += info.missing;
      if (info.hasAny) hasAny = true;
    }
    return { total, missing, hasAny };
  }, [plan, monday, recipeById]);

  return (
    <div>
      {pendingCount > 0 && (
        <button
          onClick={onStartReview}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 9,
            background: c.highlight,
            border: `1px solid ${c.line}`,
            borderLeft: `4px solid ${c.paprika}`,
            borderRadius: "3px 8px 8px 3px",
            padding: "10px 14px",
            marginBottom: 14,
            color: c.ink,
            textAlign: "left",
            boxShadow: "1px 1px 0 rgba(44,54,80,0.08)",
          }}
        >
          <ClipboardCheck size={18} style={{ color: c.paprika, flexShrink: 0 }} />
          <span style={{ flex: 1, fontFamily: display, fontWeight: 700, fontSize: 15.5 }}>
            ¿Cocinaste lo planificado? Tienes {pendingCount} {pendingCount === 1 ? "día" : "días"} por confirmar
          </span>
          <ChevronRight size={17} style={{ flexShrink: 0, color: c.muted }} />
        </button>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <button onClick={() => setWeekOffset(weekOffset - 1)} style={navBtn}>
          <ChevronLeft size={20} />
        </button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: display, fontSize: 21, fontWeight: 700, color: c.ink, lineHeight: 1 }}>
            {fmtRange(monday)}
          </div>
          {weekCal.hasAny && (
            <div style={{ fontSize: 12, color: c.muted, marginTop: 3, fontFamily: "'Special Elite', monospace" }}>
              <Flame size={11} style={{ verticalAlign: -1, color: c.paprika, marginRight: 3 }} />
              ~{weekCal.total.toLocaleString("es-ES")} kcal esta semana
              {weekCal.missing > 0 && <span style={{ fontStyle: "italic" }}> (faltan datos de {weekCal.missing})</span>}
            </div>
          )}
          {weekOffset !== 0 && (
            <button
              onClick={() => setWeekOffset(0)}
              style={{ background: "none", border: "none", color: c.paprika, fontSize: 12, marginTop: 2, fontWeight: 600 }}
            >
              Volver a esta semana
            </button>
          )}
        </div>
        <button onClick={() => setWeekOffset(weekOffset + 1)} style={navBtn}>
          <ChevronRight size={20} />
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {DAYS.map((dayName, di) => {
          const dk = keyFor(monday, di);
          const date = new Date(monday);
          date.setDate(date.getDate() + di);
          const isToday = dk === localDateKey(new Date());
          const dayCal = dayCalorieInfo(plan[dk], recipeById);
          return (
            <div
              key={dk}
              style={{
                ...ruled,
                border: `1px solid ${isToday ? c.herb : c.line}`,
                boxShadow: isToday ? `0 0 0 1px ${c.herb}, 0 2px 5px rgba(44,54,80,0.06)` : "0 1px 3px rgba(44,54,80,0.05)",
                borderRadius: 12,
                padding: "10px 12px 12px 34px",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 9, marginBottom: 6 }}>
                <span style={{ fontFamily: display, fontSize: 21, fontWeight: 700, color: c.ink, lineHeight: 1 }}>{dayName}</span>
                <span style={{ fontSize: 12, color: c.muted, fontWeight: 600 }}>{date.getDate()}</span>
                {isToday && (
                  <span style={{ fontFamily: display, fontSize: 14, color: "#fff", background: c.paprika, padding: "0 9px", borderRadius: 4, fontWeight: 700, transform: "rotate(-3deg)" }}>
                    ¡hoy!
                  </span>
                )}
                {dayCal.hasAny && (
                  <span style={{ marginLeft: "auto", fontSize: 11, color: c.muted, fontFamily: "'Special Elite', monospace", whiteSpace: "nowrap" }}>
                    <Flame size={10} style={{ verticalAlign: -1, color: c.paprika, marginRight: 2 }} />
                    ~{dayCal.total.toLocaleString("es-ES")} kcal
                  </span>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {SLOTS.map((slot) => {
                  const dishes = slotDishes(plan[dk]?.[slot]);
                  return (
                    <div key={slot} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span
                        style={{
                          fontFamily: display,
                          fontSize: 11,
                          color: c.paprika,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          width: 62,
                          flexShrink: 0,
                          paddingTop: 9,
                          textAlign: "right",
                          lineHeight: 1,
                        }}
                      >
                        {slot}
                      </span>
                      <div style={{ flex: 1, display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {dishes.map((d, idx) => {
                          const rec = recipeById(d.recipeId);
                          const variant = rec && (rec.variants.find((v) => v.id === d.variantId) || rec.variants[0]);
                          const base = rec ? (rec.baseServings || 4) : 4;
                          const servings = d.servings || base;
                          return (
                            <span
                              key={`${d.recipeId}-${idx}`}
                              className="dish-tag"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 5,
                                background: c.herbSoft,
                                border: `1px solid ${c.herb}3a`,
                                borderRadius: 7,
                                padding: "5px 5px 5px 9px",
                                maxWidth: "100%",
                              }}
                            >
                              <span style={{ minWidth: 0 }}>
                                <span style={{ fontSize: 14, fontWeight: 700, color: c.ink, lineHeight: 1.15 }}>
                                  {rec ? rec.name : "Receta borrada"}
                                </span>
                                {rec && rec.variants.length > 1 && variant && (
                                  <span style={{ fontSize: 11, color: c.herb, marginLeft: 5, fontWeight: 600 }}>{variant.name}</span>
                                )}
                              </span>
                              {rec && (
                                <span
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    background: c.card,
                                    border: `1px solid ${c.line}`,
                                    borderRadius: 12,
                                    marginLeft: 4,
                                    overflow: "hidden",
                                  }}
                                >
                                  <button
                                    onClick={() => onSetServings(dk, slot, idx, servings - 1)}
                                    disabled={servings <= 1}
                                    style={{
                                      background: "none",
                                      border: "none",
                                      padding: "1px 6px",
                                      color: servings <= 1 ? c.line : c.ink,
                                      fontSize: 14,
                                      lineHeight: 1,
                                      fontWeight: 700,
                                      cursor: servings <= 1 ? "default" : "pointer",
                                    }}
                                    title="Menos comensales"
                                  >
                                    −
                                  </button>
                                  <span
                                    key={servings}
                                    className="scribble-num"
                                    style={{ fontSize: 11, fontWeight: 700, color: c.ink, padding: "0 2px", fontFamily: "'Special Elite', monospace", minWidth: 16, textAlign: "center" }}
                                  >
                                    {servings}
                                  </span>
                                  <button
                                    onClick={() => onSetServings(dk, slot, idx, servings + 1)}
                                    style={{
                                      background: "none",
                                      border: "none",
                                      padding: "1px 6px",
                                      color: c.ink,
                                      fontSize: 14,
                                      lineHeight: 1,
                                      fontWeight: 700,
                                    }}
                                    title="Más comensales"
                                  >
                                    +
                                  </button>
                                </span>
                              )}
                              <button
                                onClick={() => onRemoveDish(dk, slot, idx)}
                                style={{ ...iconBtn, padding: 2, color: c.herb, flexShrink: 0 }}
                                title="Quitar plato"
                              >
                                <X size={14} />
                              </button>
                            </span>
                          );
                        })}
                        <button
                          onClick={() => onCell(dk, slot)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            background: "transparent",
                            border: `1.5px dashed ${c.muted}88`,
                            borderRadius: 7,
                            padding: dishes.length ? "6px 9px" : "7px 11px",
                            color: c.muted,
                            fontSize: 13,
                            fontWeight: 600,
                          }}
                        >
                          <Plus size={14} /> {dishes.length ? "Añadir" : "Añadir plato"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ===================== BIBLIOTECA DE RECETAS ===================== */
function Library({ recipes, pantryItems, onAdd, onEdit, onDelete, onDuplicate, onToggleFav, missingCount, onAddLibrary }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState(null); // null = todas, "__fav" = favoritas
  const [excludeAllergens, setExcludeAllergens] = useState([]); // alérgenos a excluir ("sin gluten"...)
  const [onlyCookable, setOnlyCookable] = useState(false); // solo "puedo hacerlo ya" con la despensa
  const [expandedSteps, setExpandedSteps] = useState(null); // id de la receta con la preparación abierta

  const categories = useMemo(() => {
    const s = new Set();
    recipes.forEach((r) => r.category && s.add(r.category));
    return [...s].sort((a, b) => a.localeCompare(b, "es"));
  }, [recipes]);

  const toggleExcludeAllergen = (key) =>
    setExcludeAllergens((prev) => (prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recipes
      .filter((r) => {
        if (cat === "__fav" && !r.fav) return false;
        if (cat && cat !== "__fav" && r.category !== cat) return false;
        if (excludeAllergens.length > 0) {
          // se enseña la receta si AL MENOS UNA opción no lleva ninguno de los alérgenos excluidos
          const hasSafeVariant = r.variants.some(
            (v) => !(v.allergens || []).some((a) => excludeAllergens.includes(a))
          );
          if (!hasSafeVariant) return false;
        }
        if (onlyCookable) {
          const canMakeAny = r.variants.some((v) => pantryMatchScore(v, pantryItems || []).canMake);
          if (!canMakeAny) return false;
        }
        if (!q) return true;
        const inName = r.name.toLowerCase().includes(q);
        const inIng = r.variants.some((v) =>
          v.ingredients.some((i) => i.name.toLowerCase().includes(q))
        );
        return inName || inIng;
      })
      .sort((a, b) => (b.fav ? 1 : 0) - (a.fav ? 1 : 0) || a.name.localeCompare(b.name, "es"));
  }, [recipes, query, cat, excludeAllergens, onlyCookable, pantryItems]);

  const favCount = recipes.filter((r) => r.fav).length;

  const chip = (active) => ({
    fontSize: 13,
    padding: "6px 12px",
    borderRadius: 20,
    border: `1px solid ${active ? c.herb : c.line}`,
    background: active ? c.herb : c.card,
    color: active ? "#fff" : c.ink,
    whiteSpace: "nowrap",
    fontWeight: active ? 600 : 500,
  });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <h2 style={{ fontFamily: display, fontSize: 15, fontWeight: 700, margin: 0, color: c.ink }}>
          Recetas ({recipes.length})
        </h2>
        <button onClick={onAdd} style={primaryBtn}>
          <Plus size={16} /> Nueva
        </button>
      </div>

      {missingCount > 0 && (
        <button
          onClick={onAddLibrary}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            background: c.herbSoft,
            color: c.herb,
            border: `1px dashed ${c.herb}`,
            borderRadius: 12,
            padding: "11px 14px",
            marginBottom: 14,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          <BookOpen size={16} /> Añadir {missingCount} recetas de ejemplo
        </button>
      )}

      {recipes.length === 0 ? (
        <EmptyState
          kind="no-recipes"
          title="Todavía en blanco"
          subtitle={<>Pulsa <strong style={{ color: c.herb }}>Nueva</strong> para empezar tu primer receta: nombre, ingredientes y notas.</>}
        />
      ) : (
        <>
          {/* buscador */}
          <div style={{ position: "relative", marginBottom: 10 }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: c.muted }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre o ingrediente…"
              style={{ ...inp, margin: 0, paddingLeft: 36, paddingRight: query ? 36 : 12 }}
            />
            {query && (
              <button onClick={() => setQuery("")} style={{ ...iconBtn, position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)" }}>
                <X size={16} />
              </button>
            )}
          </div>

          {/* filtros por categoría */}
          <div style={{ display: "flex", gap: 7, overflowX: "auto", paddingBottom: 4, marginBottom: 8, WebkitOverflowScrolling: "touch" }}>
            <button onClick={() => setCat(null)} style={chip(cat === null)}>Todas</button>
            {favCount > 0 && (
              <button onClick={() => setCat("__fav")} style={chip(cat === "__fav")}>
                ★ Favoritas
              </button>
            )}
            <button
              onClick={() => setOnlyCookable(!onlyCookable)}
              style={{
                fontSize: 13,
                padding: "6px 12px",
                borderRadius: 20,
                border: `1px solid ${onlyCookable ? c.herb : c.line}`,
                background: onlyCookable ? c.herb : c.card,
                color: onlyCookable ? "#fff" : c.ink,
                whiteSpace: "nowrap",
                fontWeight: onlyCookable ? 700 : 500,
                flexShrink: 0,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <ChefHat size={13} /> Puedo hacerlo
            </button>
            {categories.map((ct) => (
              <button key={ct} onClick={() => setCat(ct)} style={chip(cat === ct)}>{ct}</button>
            ))}
          </div>

          {/* filtros por alérgeno a excluir */}
          <div style={{ display: "flex", gap: 7, overflowX: "auto", paddingBottom: 4, marginBottom: 14, WebkitOverflowScrolling: "touch" }}>
            {ALLERGENS.map((a) => {
              const active = excludeAllergens.includes(a.key);
              return (
                <button
                  key={a.key}
                  onClick={() => toggleExcludeAllergen(a.key)}
                  style={{
                    fontSize: 12,
                    padding: "5px 11px",
                    borderRadius: 20,
                    border: `1px solid ${active ? c.paprika : c.line}`,
                    background: active ? c.paprika : c.card,
                    color: active ? "#fff" : c.muted,
                    fontWeight: active ? 700 : 500,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  Sin {a.label.toLowerCase()}
                </button>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <EmptyState
              kind="no-search"
              title="Nada por aquí"
              subtitle="Prueba con otra palabra o quita el filtro."
            />
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((r) => (
              <div key={r.id} style={{ ...ruled, border: `1px solid ${r.fav ? c.paprika : c.line}`, boxShadow: r.fav ? `0 1px 4px ${c.paprika}33` : "0 1px 3px rgba(44,54,80,0.05)", borderRadius: 12, padding: "12px 14px 14px 34px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                    <button onClick={() => onToggleFav(r.id)} style={{ ...iconBtn, padding: 2, color: r.fav ? c.paprika : c.muted }} title="Favorita">
                      <Star size={18} fill={r.fav ? c.paprika : "none"} />
                    </button>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: display, fontSize: 24, fontWeight: 700, color: c.ink, lineHeight: 1 }}>{r.name}</div>
                      {r.category && <div style={{ fontSize: 12, color: c.muted, marginTop: 2, fontWeight: 600 }}>{r.category}</div>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
                    <button onClick={() => onDuplicate(r)} style={iconBtn} title="Duplicar"><Copy size={16} /></button>
                    <button onClick={() => onEdit(r)} style={iconBtn} title="Editar"><Pencil size={16} /></button>
                    <button onClick={() => onDelete(r.id)} style={iconBtn} title="Borrar"><Trash2 size={16} /></button>
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                  <span
                    style={{ fontSize: 11, color: c.paprika, background: c.paprikaSoft, padding: "4px 9px", borderRadius: 20, fontWeight: 600 }}
                  >
                    para {r.baseServings || 4}
                  </span>
                  {r.variants.map((v) => (
                    <React.Fragment key={v.id}>
                      <span
                        style={{ fontSize: 11, color: c.herb, background: c.herbSoft, padding: "4px 9px", borderRadius: 20 }}
                      >
                        {v.name} · {v.ingredients.length} ing.
                        {v.calories != null && <> · ~{v.calories} kcal</>}
                      </span>
                      {(v.allergens || []).map((ak) => {
                        const a = ALLERGENS.find((x) => x.key === ak);
                        if (!a) return null;
                        return (
                          <span
                            key={ak}
                            style={{ fontSize: 10, color: c.paprika, background: c.paprikaSoft, padding: "3px 8px", borderRadius: 20, fontWeight: 600 }}
                          >
                            {a.label}
                          </span>
                        );
                      })}
                    </React.Fragment>
                  ))}
                  {r.variants.length === 0 && (
                    <span style={{ fontSize: 12, color: c.paprika }}>Sin opciones de ingredientes</span>
                  )}
                </div>
                {r.notes && r.notes.trim() && (
                  <div style={{ display: "flex", gap: 7, marginTop: 11, paddingTop: 10, borderTop: `1px dashed ${c.line}` }}>
                    <PenLine size={15} style={{ color: c.paprika, flexShrink: 0, marginTop: 3 }} />
                    <p style={{ margin: 0, fontFamily: display, fontSize: 15, color: c.ink, lineHeight: 1.25, whiteSpace: "pre-wrap" }}>
                      {r.notes}
                    </p>
                  </div>
                )}
                {(r.steps || []).length > 0 && (
                  <div style={{ marginTop: 11, paddingTop: 10, borderTop: r.notes && r.notes.trim() ? "none" : `1px dashed ${c.line}` }}>
                    <button
                      onClick={() => setExpandedSteps(expandedSteps === r.id ? null : r.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: 6, background: "none", border: "none",
                        padding: 0, color: c.herb, fontSize: 13, fontWeight: 700,
                      }}
                    >
                      <ChefHat size={14} />
                      {expandedSteps === r.id ? "Ocultar preparación" : "Ver preparación"}
                      <ChevronRight size={14} style={{ transform: expandedSteps === r.id ? "rotate(90deg)" : "none", transition: "transform .15s" }} />
                    </button>
                    {expandedSteps === r.id && (
                      <ol style={{ margin: "10px 0 0", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 7 }}>
                        {r.steps.map((step, i) => (
                          <li key={i} style={{ fontSize: 14, color: c.ink, lineHeight: 1.45 }}>{step}</li>
                        ))}
                      </ol>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ===================== LISTA DE LA COMPRA ===================== */
function Shopping({ items, range, checked, setChecked, quickAddToPantry, quickRemoveFromPantry, onPurchaseToggle, onGoToPantry, extras, addExtra, toggleExtra, removeExtra, clearDoneExtras }) {
  const [copied, setCopied] = useState(false);
  const [newExtra, setNewExtra] = useState("");
  // Al marcar, guardamos la cantidad comprada (para poder deshacerlo bien y mostrarla
  // tachada aunque, tras sumarse a la despensa, ya no quede nada pendiente de ese producto).
  const toggle = (item) => {
    if (checked[item.k]) {
      const snap = checked[item.k];
      const next = { ...checked };
      delete next[item.k];
      setChecked(next);
      onPurchaseToggle({ name: item.name, unit: snap.unit, remaining: snap.qty }, false);
    } else {
      const next = { ...checked, [item.k]: { qty: item.remaining, unit: item.unit } };
      setChecked(next);
      onPurchaseToggle(item, true);
    }
  };

  // Un producto marcado se queda visible (tachado) aunque al sumarse a la despensa
  // ya esté cubierto; solo pasa a "ya tienes" si estaba cubierto sin que tú lo marcaras.
  const toBuy = items.filter((i) => !i.fullyCovered || checked[i.k]);
  const haveFromMenu = items.filter((i) => i.fullyCovered && !checked[i.k]);
  const doneExtras = extras.filter((e) => e.done).length;

  const copyText = () => {
    const lines = toBuy.map(
      (i) => `${checked[i.k] ? "✓ " : "□ "}${i.name} — ${fmtQty(checked[i.k] ? checked[i.k].qty : i.remaining)} ${i.unit}${i.optional ? " (opcional)" : ""}`
    );
    if (extras.length) {
      lines.push("", "Otros productos:");
      extras.forEach((e) => lines.push(`${e.done ? "✓ " : "□ "}${e.name}`));
    }
    navigator.clipboard?.writeText(`Lista de la compra (${range})\n\n${lines.join("\n")}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const addExtraNow = () => {
    if (newExtra.trim()) {
      addExtra(newExtra);
      setNewExtra("");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <h2 style={{ fontFamily: display, fontSize: 15, fontWeight: 700, margin: 0, color: c.ink }}>Lista de la compra</h2>
        {(toBuy.length > 0 || extras.length > 0) && (
          <button onClick={copyText} style={ghostBtn}>
            {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? "Copiada" : "Copiar"}
          </button>
        )}
      </div>
      <p style={{ fontSize: 13, color: c.muted, marginTop: 2, marginBottom: 12, fontStyle: "italic" }}>
        Generada con el menú de {range}, descontando lo que ya tienes. Marca lo comprado y se añade solo a tu despensa.
      </p>

      <button
        onClick={onGoToPantry}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          background: c.highlight,
          border: `1px solid ${c.line}`,
          borderLeft: `4px solid ${c.paprika}`,
          borderRadius: "3px 8px 8px 3px",
          padding: "8px 14px 8px 11px",
          marginBottom: 16,
          color: c.ink,
          fontFamily: display,
          fontWeight: 700,
          fontSize: 16.5,
          boxShadow: "1px 1px 0 rgba(44,54,80,0.08)",
        }}
      >
        <Package size={15} /> Gestionar mi despensa
        <ChevronRight size={15} style={{ marginLeft: 2 }} />
      </button>

      {items.length === 0 ? (
        <EmptyState
          kind="no-shopping"
          title="Cesta vacía"
          subtitle="Planifica algún plato del menú, o añade tú mismo productos ahí abajo."
        />
      ) : (
        <>
          {toBuy.length > 0 && (
            <div style={{ background: c.card, border: `1px solid ${c.line}`, borderRadius: 14, overflow: "hidden" }}>
              {toBuy.map((i, idx) => {
                const on = checked[i.k];
                return (
                  <div
                    key={i.k}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "11px 12px 11px 14px",
                      borderTop: idx === 0 ? "none" : `1px solid ${c.line}`,
                    }}
                  >
                    <button
                      onClick={() => toggle(i)}
                      style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, background: "none", border: "none", textAlign: "left", padding: 0, minWidth: 0 }}
                    >
                      <span
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 6,
                          border: `2px solid ${on ? c.herb : c.line}`,
                          background: on ? c.herb : "transparent",
                          display: "grid",
                          placeItems: "center",
                          flexShrink: 0,
                        }}
                      >
                        {on && <span className="check-pop" style={{ display: "inline-flex" }}><Check size={14} color="#fff" /></span>}
                      </span>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ fontSize: 15, color: on ? c.muted : c.ink, textDecoration: on ? "line-through" : "none" }}>
                          {i.name}
                          {i.optional && (
                            <span
                              style={{
                                fontSize: 10,
                                color: c.paprika,
                                background: c.paprikaSoft,
                                padding: "2px 6px",
                                borderRadius: 10,
                                marginLeft: 7,
                                fontWeight: 600,
                                verticalAlign: "middle",
                                textDecoration: "none",
                              }}
                            >
                              opcional
                            </span>
                          )}
                        </span>
                        {!on && i.have > 0 && (
                          <div style={{ fontSize: 11, color: c.herb, marginTop: 1, fontStyle: "italic" }}>
                            ya tienes {fmtQty(i.have)} {i.unit} en la despensa
                          </div>
                        )}
                      </span>
                      <span style={{ fontSize: 13, color: c.muted, fontFamily: "'Special Elite', monospace", letterSpacing: 0.2, flexShrink: 0 }}>
                        {fmtQty(on ? on.qty : i.remaining)} {i.unit}
                        {i.count > 1 && <span style={{ color: c.paprika }}> ×{i.count}</span>}
                      </span>
                    </button>
                    <button
                      onClick={() => quickAddToPantry(i.name)}
                      title="Ya lo tengo en casa"
                      style={{ ...iconBtn, color: c.paprika, flexShrink: 0 }}
                    >
                      <Package size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {haveFromMenu.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12, color: c.muted, fontWeight: 600, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <Package size={13} /> Ya tienes en casa ({haveFromMenu.length})
              </div>
              <div style={{ background: c.card, border: `1px solid ${c.line}`, borderRadius: 14, overflow: "hidden" }}>
                {haveFromMenu.map((i, idx) => (
                  <div
                    key={i.k}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "11px 12px 11px 14px",
                      borderTop: idx === 0 ? "none" : `1px solid ${c.line}`,
                    }}
                  >
                    <span style={{ flex: 1, fontSize: 14, color: c.muted, textDecoration: "line-through" }}>{i.name}</span>
                    <button
                      onClick={() => quickRemoveFromPantry(i.name)}
                      style={{ ...ghostBtn, padding: "5px 10px", fontSize: 12 }}
                    >
                      Necesito comprarlo
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* otros productos añadidos a mano */}
      <div style={{ marginTop: 22 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <h3 style={{ fontFamily: display, fontSize: 16.5, fontWeight: 700, margin: 0, color: c.ink }}>Otros productos</h3>
          {doneExtras > 0 && (
            <button onClick={clearDoneExtras} style={{ ...ghostBtn, padding: "5px 10px", fontSize: 12 }}>
              Quitar comprados
            </button>
          )}
        </div>
        <p style={{ fontSize: 13, color: c.muted, marginTop: 4, marginBottom: 10, fontStyle: "italic" }}>
          Lo que no viene de recetas: papel, detergente, fruta… Se guarda hasta que lo borres.
        </p>

        <div style={{ display: "flex", gap: 6, marginBottom: extras.length ? 12 : 0 }}>
          <input
            value={newExtra}
            onChange={(e) => setNewExtra(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addExtraNow()}
            placeholder="Añadir producto…"
            style={{ ...inp, margin: 0, flex: 1 }}
          />
          <button onClick={addExtraNow} style={{ ...primaryBtn, padding: "0 14px" }}>
            <Plus size={16} />
          </button>
        </div>

        {extras.length > 0 && (
          <div style={{ background: c.card, border: `1px solid ${c.line}`, borderRadius: 14, overflow: "hidden" }}>
            {extras.map((e, idx) => (
              <div
                key={e.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "11px 12px 11px 14px",
                  borderTop: idx === 0 ? "none" : `1px solid ${c.line}`,
                }}
              >
                <button
                  onClick={() => toggleExtra(e.id)}
                  style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, background: "none", border: "none", textAlign: "left", padding: 0 }}
                >
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 6,
                      border: `2px solid ${e.done ? c.herb : c.line}`,
                      background: e.done ? c.herb : "transparent",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    {e.done && <span className="check-pop" style={{ display: "inline-flex" }}><Check size={14} color="#fff" /></span>}
                  </span>
                  <span style={{ flex: 1, fontSize: 15, color: e.done ? c.muted : c.ink, textDecoration: e.done ? "line-through" : "none" }}>
                    {e.name}
                  </span>
                </button>
                <button onClick={() => removeExtra(e.id)} title="Borrar" style={{ ...iconBtn, flexShrink: 0 }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
/* ===================== MI DESPENSA ===================== */
function Pantry({ items, recipes, onAdd, onUpdate, onRemove }) {
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState("ud");
  const [editingId, setEditingId] = useState(null);
  const [editQty, setEditQty] = useState("");
  const [editUnit, setEditUnit] = useState("ud");
  const [expandedDish, setExpandedDish] = useState(null); // `${recipeId}-${variantId}` expandido

  const sorted = useMemo(
    () => [...items].sort((a, b) => a.name.localeCompare(b.name, "es")),
    [items]
  );

  // Qué se puede cocinar ya (o casi) con lo que hay en la despensa ahora mismo.
  const { canMakeList, almostList } = useMemo(() => {
    const canMake = [];
    const almost = [];
    for (const r of recipes || []) {
      for (const v of r.variants) {
        const score = pantryMatchScore(v, items);
        if (score.total === 0) continue; // receta sin ingredientes obligatorios, no aporta
        const entry = { recipe: r, variant: v, score };
        if (score.canMake) canMake.push(entry);
        else if (score.missing.length <= 2) almost.push(entry);
      }
    }
    const sortFn = (a, b) =>
      (b.recipe.fav ? 1 : 0) - (a.recipe.fav ? 1 : 0) ||
      a.score.missing.length - b.score.missing.length ||
      a.recipe.name.localeCompare(b.recipe.name, "es");
    canMake.sort(sortFn);
    almost.sort(sortFn);
    return { canMakeList: canMake.slice(0, 8), almostList: almost.sort(sortFn).slice(0, 6) };
  }, [items, recipes]);

  const submitAdd = () => {
    if (!name.trim()) return;
    onAdd({ name, qty: qty ? Number(qty) : null, unit });
    setName("");
    setQty("");
    setUnit("ud");
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditQty(item.qty != null ? String(item.qty) : "");
    setEditUnit(item.unit || "ud");
  };
  const saveEdit = (item) => {
    const q = editQty.trim() ? Number(editQty) : null;
    onUpdate(item.id, { qty: q, unit: q ? editUnit : null });
    setEditingId(null);
  };

  return (
    <div>
      <h2 style={{ fontFamily: display, fontSize: 15, fontWeight: 700, margin: 0, color: c.ink }}>
        Mi despensa
      </h2>
      <p style={{ fontSize: 13, color: c.muted, marginTop: 4, marginBottom: 16, fontStyle: "italic" }}>
        Lo que anotes aquí se descuenta de la lista de la compra. Sin cantidad = "siempre lo tengo" (sal, aceite, especias…). Con cantidad, la compra solo te pedirá lo que te falte.
      </p>

      {(canMakeList.length > 0 || almostList.length > 0) && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <ChefHat size={16} style={{ color: c.paprika }} />
            <span style={{ fontFamily: display, fontSize: 18, fontWeight: 700, color: c.ink }}>
              Con esto puedes cocinar
            </span>
          </div>

          {canMakeList.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: 6,
                overflowX: "auto",
                WebkitOverflowScrolling: "touch",
                margin: "0 -14px",
                padding: "6px 14px 10px",
              }}
            >
              {canMakeList.map(({ recipe, variant }, idx) => {
                const key = `${recipe.id}-${variant.id}`;
                const rotations = [-3, 2.2, -1.6, 2.8, -2.2, 1.8, -3.2, 2.4];
                const colors = [c.highlight, "#F6C99A", "#E6EEDD", "#F1DA8B"];
                return (
                  <button
                    key={key}
                    onClick={() => setExpandedDish(expandedDish === key ? null : key)}
                    className="post-it"
                    style={{
                      flexShrink: 0,
                      width: 138,
                      minHeight: 84,
                      background: colors[idx % colors.length],
                      border: `1px solid ${c.line}`,
                      borderRadius: "2px 2px 2px 14px",
                      padding: "9px 10px 10px",
                      textAlign: "left",
                      transform: `rotate(${rotations[idx % rotations.length]}deg)`,
                      boxShadow: "2px 3px 6px rgba(44,54,80,0.15)",
                      animation: `postItLand 0.4s cubic-bezier(.34,1.3,.64,1) both`,
                      animationDelay: `${idx * 60}ms`,
                    }}
                  >
                    <span style={{ fontFamily: display, fontSize: 16, fontWeight: 700, color: c.ink, lineHeight: 1.05, display: "block" }}>
                      {recipe.name}
                    </span>
                    {recipe.variants.length > 1 && (
                      <span style={{ fontSize: 10, color: c.herb, fontWeight: 600 }}>{variant.name}</span>
                    )}
                    <span style={{ display: "block", fontSize: 10, color: c.herb, background: "rgba(255,255,255,0.6)", padding: "2px 6px", borderRadius: 10, marginTop: 5, fontWeight: 700, width: "fit-content" }}>
                      ✓ lo tienes todo
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {almostList.length > 0 && (
            <>
              <div style={{ fontSize: 12, color: c.muted, fontWeight: 600, margin: "10px 0 6px" }}>
                Te falta poco
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {almostList.map(({ recipe, variant, score }) => {
                  const key = `${recipe.id}-${variant.id}`;
                  const open = expandedDish === key;
                  return (
                    <div key={key} style={{ background: c.card, border: `1px solid ${c.line}`, borderRadius: 10, overflow: "hidden" }}>
                      <button
                        onClick={() => setExpandedDish(open ? null : key)}
                        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "10px 12px", background: "none", border: "none", textAlign: "left" }}
                      >
                        <span style={{ minWidth: 0 }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: c.ink }}>{recipe.name}</span>
                          {recipe.variants.length > 1 && (
                            <span style={{ fontSize: 11, color: c.herb, marginLeft: 6 }}>{variant.name}</span>
                          )}
                        </span>
                        <span style={{ fontSize: 11, color: c.paprika, fontWeight: 600, flexShrink: 0 }}>
                          falta: {score.missing.join(", ")}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {expandedDish && (() => {
            const found =
              canMakeList.find((e) => `${e.recipe.id}-${e.variant.id}` === expandedDish) ||
              almostList.find((e) => `${e.recipe.id}-${e.variant.id}` === expandedDish);
            if (!found) return null;
            const { recipe, variant } = found;
            return (
              <div style={{ background: c.card, border: `1px solid ${c.herb}`, borderRadius: 12, padding: 13, marginTop: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                  <span style={{ fontFamily: display, fontSize: 16, fontWeight: 700, color: c.ink }}>
                    {recipe.name}{recipe.variants.length > 1 && <span style={{ fontSize: 12, color: c.herb, marginLeft: 6 }}>{variant.name}</span>}
                  </span>
                  <button onClick={() => setExpandedDish(null)} style={iconBtn}><X size={15} /></button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {variant.ingredients.map((ing, i) => {
                    const matches = items.filter((p) => p.name.trim().toLowerCase() === ing.name.trim().toLowerCase());
                    const alwaysHave = matches.some((p) => p.qty == null);
                    let available = 0;
                    for (const p of matches) {
                      const conv = convertQty(p.qty, p.unit, ing.unit);
                      if (conv != null) available += conv;
                    }
                    const covered = ing.opt || alwaysHave || available + 1e-6 >= ing.qty;
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                        {covered ? <Check size={14} style={{ color: c.herb, flexShrink: 0 }} /> : <X size={14} style={{ color: c.paprika, flexShrink: 0 }} />}
                        <span style={{ color: covered ? c.ink : c.paprika }}>
                          {ing.name} <span style={{ color: c.muted }}>({fmtQty(ing.qty)} {ing.unit}{ing.opt ? ", opcional" : ""})</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* alta de producto */}
      <div style={{ background: c.card, border: `1px solid ${c.line}`, borderRadius: 12, padding: 14, marginBottom: 18 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitAdd()}
          placeholder="Nombre del producto…"
          style={{ ...inp, margin: "0 0 8px" }}
        />
        <div style={{ display: "flex", gap: 6 }}>
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitAdd()}
            placeholder="Cantidad (opcional)"
            style={{ ...inp, margin: 0, flex: 1 }}
          />
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            disabled={!qty}
            style={{ ...inp, margin: 0, width: 90, padding: "10px 6px", opacity: qty ? 1 : 0.5 }}
          >
            {UNITS.map((u) => <option key={u}>{u}</option>)}
          </select>
        </div>
        <button onClick={submitAdd} style={{ ...primaryBtn, width: "100%", justifyContent: "center", marginTop: 10 }}>
          <Plus size={16} /> Añadir a la despensa
        </button>
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          kind="no-pantry"
          title="Despensa vacía"
          subtitle="Añade lo que tengas en casa: así la compra solo te pedirá lo que de verdad te falte."
        />
      ) : (
        <div style={{ background: c.card, border: `1px solid ${c.line}`, borderRadius: 14, overflow: "hidden" }}>
          {sorted.map((item, idx) => {
            const editing = editingId === item.id;
            return (
              <div
                key={item.id}
                className="dish-tag"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "11px 12px 11px 14px",
                  borderTop: idx === 0 ? "none" : `1px solid ${c.line}`,
                }}
              >
                {editing ? (
                  <>
                    <span style={{ flex: 1, fontSize: 15, color: c.ink }}>{item.name}</span>
                    <input
                      type="number"
                      autoFocus
                      value={editQty}
                      onChange={(e) => setEditQty(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit(item)}
                      placeholder="cantidad"
                      style={{ ...inp, margin: 0, width: 78, textAlign: "center" }}
                    />
                    <select
                      value={editUnit}
                      onChange={(e) => setEditUnit(e.target.value)}
                      disabled={!editQty}
                      style={{ ...inp, margin: 0, width: 82, padding: "10px 4px", opacity: editQty ? 1 : 0.5 }}
                    >
                      {UNITS.map((u) => <option key={u}>{u}</option>)}
                    </select>
                    <button onClick={() => saveEdit(item)} style={{ ...iconBtn, color: c.herb, flexShrink: 0 }} title="Guardar">
                      <Check size={18} />
                    </button>
                  </>
                ) : (
                  <>
                    <span style={{ flex: 1, fontSize: 15, color: c.ink, minWidth: 0 }}>{item.name}</span>
                    {item.qty != null ? (
                      <span
                        style={{
                          fontSize: 12,
                          color: c.muted,
                          fontFamily: "'Special Elite', monospace",
                          background: c.paper,
                          border: `1px solid ${c.line}`,
                          padding: "3px 9px",
                          borderRadius: 20,
                          flexShrink: 0,
                        }}
                      >
                        {fmtQty(item.qty)} {item.unit}
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: 11,
                          color: c.herb,
                          background: c.herbSoft,
                          padding: "4px 10px",
                          borderRadius: 20,
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        siempre disponible
                      </span>
                    )}
                    <button onClick={() => startEdit(item)} style={{ ...iconBtn, flexShrink: 0 }} title="Editar cantidad">
                      <Pencil size={15} />
                    </button>
                  </>
                )}
                <button onClick={() => onRemove(item.id)} style={{ ...iconBtn, flexShrink: 0 }} title="Quitar de la despensa">
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ===================== REVISAR UN DÍA: ¿QUÉ COCINASTE? ===================== */
function DayReviewSheet({ dateKey, day, recipeById, remainingCount, onConfirm, onSkip, onClose }) {
  const dishes = [];
  for (const slot of SLOTS) {
    slotDishes(day[slot]).forEach((d, idx) => {
      const rec = recipeById(d.recipeId);
      const variant = rec && (rec.variants.find((v) => v.id === d.variantId) || rec.variants[0]);
      dishes.push({
        key: `${slot}-${idx}`,
        slot,
        recipeName: rec ? rec.name : "Receta borrada",
        variantName: rec && rec.variants.length > 1 && variant ? variant.name : null,
        valid: !!rec,
      });
    });
  }

  const [checkedKeys, setCheckedKeys] = useState(
    () => new Set(dishes.filter((d) => d.valid).map((d) => d.key))
  );

  const toggleDish = (key) => {
    setCheckedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const dateObj = new Date(dateKey + "T00:00:00");
  const rawLabel = dateObj.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
  const dayLabel = rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1);

  return (
    <Sheet onClose={onClose} title="¿Qué cocinaste?">
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: display, fontSize: 19, fontWeight: 700, color: c.ink }}>{dayLabel}</div>
        <p style={{ fontSize: 13, color: c.muted, marginTop: 4, fontStyle: "italic" }}>
          Desmarca lo que no hiciste. Lo demás se descontará de tu despensa.
          {remainingCount > 1 && ` Quedan ${remainingCount - 1} día${remainingCount - 1 === 1 ? "" : "s"} más por confirmar.`}
        </p>
      </div>

      {dishes.length === 0 ? (
        <p style={{ color: c.muted, fontSize: 14, textAlign: "center", padding: "16px 0" }}>
          No había nada planificado este día.
        </p>
      ) : (
        <div style={{ background: c.card, border: `1px solid ${c.line}`, borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
          {dishes.map((d, idx) => {
            const on = checkedKeys.has(d.key);
            return (
              <button
                key={d.key}
                onClick={() => d.valid && toggleDish(d.key)}
                disabled={!d.valid}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  background: "none",
                  border: "none",
                  borderTop: idx === 0 ? "none" : `1px solid ${c.line}`,
                  textAlign: "left",
                  opacity: d.valid ? 1 : 0.5,
                }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    border: `2px solid ${on ? c.herb : c.line}`,
                    background: on ? c.herb : "transparent",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  {on && <span className="check-pop" style={{ display: "inline-flex" }}><Check size={14} color="#fff" /></span>}
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 10, color: c.paprika, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {d.slot}
                  </span>
                  <div style={{ fontSize: 15, color: c.ink, textDecoration: on ? "none" : "line-through" }}>
                    {d.recipeName}
                    {d.variantName && <span style={{ fontSize: 12, color: c.herb, marginLeft: 6 }}>{d.variantName}</span>}
                  </div>
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onSkip} style={{ ...ghostBtn, flex: 1, justifyContent: "center", padding: "11px" }}>
          No cociné nada
        </button>
        <button onClick={() => onConfirm(checkedKeys)} style={{ ...primaryBtn, flex: 1, justifyContent: "center", padding: "11px" }}>
          Confirmar
        </button>
      </div>
    </Sheet>
  );
}

function SlotPicker({ recipes, slot, plan, monday, dateKey, currentDishes, existingCount, onPick, onClose }) {
  const [expanded, setExpanded] = useState(null);
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recipes
      .filter((r) => {
        if (!q) return true;
        return (
          r.name.toLowerCase().includes(q) ||
          (r.category || "").toLowerCase().includes(q) ||
          r.variants.some((v) => v.ingredients.some((i) => i.name.toLowerCase().includes(q)))
        );
      })
      .sort((a, b) => (b.fav ? 1 : 0) - (a.fav ? 1 : 0) || a.name.localeCompare(b.name, "es"));
  }, [recipes, query]);

  const recommendations = useMemo(() => {
    if (!plan || !monday || !dateKey) return [];
    return computeRecommendations(recipes, plan, monday, dateKey, slot, currentDishes || []);
  }, [recipes, plan, monday, dateKey, slot, currentDishes]);

  const showRecs = !query.trim() && recommendations.length > 0;

  return (
    <Sheet onClose={onClose} title={existingCount > 0 ? `Añadir a ${slot.toLowerCase()}` : `Plato para ${slot.toLowerCase()}`}>
      {recipes.length === 0 ? (
        <p style={{ color: c.muted, fontSize: 14 }}>Crea recetas primero en la pestaña Recetas.</p>
      ) : (
        <>
          {existingCount > 0 && (
            <p style={{ fontSize: 12, color: c.muted, marginTop: 0, marginBottom: 12 }}>
              Ya hay {existingCount} {existingCount === 1 ? "plato" : "platos"} en esta comida. Elige otro para añadirlo (primero, segundo, postre…).
            </p>
          )}

          {showRecs && (
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 8,
                  fontFamily: display,
                  fontSize: 20,
                  fontWeight: 700,
                  color: c.ink,
                }}
              >
                <Sparkles size={16} style={{ color: c.paprika }} />
                Sugerencias para hoy
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  overflowX: "auto",
                  WebkitOverflowScrolling: "touch",
                  margin: "0 -14px",
                  padding: "10px 18px 18px",
                }}
              >
                {recommendations.map(({ recipe, reason }, idx) => {
                  const single = recipe.variants.length <= 1;
                  // rotaciones y colores variados: cada post-it un poco distinto
                  const rotations = [-3.2, 2.4, -1.5, 3.1, -2.6];
                  const colors = [c.highlight, "#F6C99A", "#F1DA8B", "#E9D08F", "#F0BC7D"];
                  const rot = rotations[idx % rotations.length];
                  const bg = colors[idx % colors.length];
                  const offsetY = idx % 2 === 0 ? 0 : 6;
                  return (
                    <button
                      key={recipe.id}
                      onClick={() => single ? onPick(recipe.id, recipe.variants[0]?.id) : setExpanded(recipe.id)}
                      className="post-it"
                      style={{
                        flexShrink: 0,
                        width: 148,
                        minHeight: 96,
                        background: bg,
                        border: `1px solid ${c.line}`,
                        borderTop: `1px solid ${c.line}`,
                        borderRadius: "2px 2px 2px 14px",
                        padding: "10px 11px 11px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        textAlign: "left",
                        transform: `rotate(${rot}deg) translateY(${offsetY}px)`,
                        boxShadow: "2px 3px 6px rgba(44,54,80,0.15), 0 1px 2px rgba(44,54,80,0.08)",
                        transformOrigin: "center top",
                        animation: `postItLand 0.42s cubic-bezier(.34,1.3,.64,1) both`,
                        animationDelay: `${idx * 70}ms`,
                        position: "relative",
                      }}
                    >
                      {/* pequeño trocito de "cinta" arriba */}
                      <span
                        style={{
                          position: "absolute",
                          top: -6,
                          left: "42%",
                          width: 22,
                          height: 10,
                          background: "rgba(255,255,255,0.55)",
                          border: `1px solid rgba(44,54,80,0.06)`,
                          borderRadius: 1,
                          transform: `rotate(${-rot * 0.6}deg)`,
                        }}
                      />
                      <span style={{ fontFamily: display, fontSize: 16.5, fontWeight: 700, color: c.ink, lineHeight: 1.05 }}>
                        {recipe.name}
                      </span>
                      <span style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {reason && (
                          <span style={{ fontSize: 10, color: c.paprika, background: "rgba(255,255,255,0.75)", padding: "2px 7px", borderRadius: 10, fontWeight: 700 }}>
                            {reason}
                          </span>
                        )}
                        {!single && (
                          <span style={{ fontSize: 10, color: c.muted, background: "rgba(255,255,255,0.75)", padding: "2px 7px", borderRadius: 10 }}>
                            {recipe.variants.length} opciones
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ position: "relative", marginBottom: 12 }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: c.muted }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar plato…"
              style={{ ...inp, margin: 0, paddingLeft: 36 }}
            />
          </div>
        </>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {list.map((r) => {
          const open = expanded === r.id;
          const single = r.variants.length <= 1;
          return (
            <div key={r.id} style={{ border: `1px solid ${c.line}`, borderRadius: 12, overflow: "hidden" }}>
              <button
                onClick={() => (single ? onPick(r.id, r.variants[0]?.id) : setExpanded(open ? null : r.id))}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 8,
                  padding: "13px 14px",
                  background: c.card,
                  border: "none",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
                  {r.fav && <Star size={14} fill={c.paprika} color={c.paprika} style={{ flexShrink: 0 }} />}
                  <span style={{ fontWeight: 600, fontSize: 15 }}>{r.name}</span>
                  {r.category && <span style={{ fontSize: 12, color: c.muted }}>{r.category}</span>}
                </span>
                <span style={{ fontSize: 12, color: c.herb, flexShrink: 0 }}>
                  {single ? "Elegir" : `${r.variants.length} opciones`}
                </span>
              </button>
              {single && (r.variants[0]?.allergens || []).length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: "0 14px 10px" }}>
                  {r.variants[0].allergens.map((ak) => {
                    const a = ALLERGENS.find((x) => x.key === ak);
                    return a ? (
                      <span key={ak} style={{ fontSize: 10, color: c.paprika, background: c.paprikaSoft, padding: "2px 7px", borderRadius: 20, fontWeight: 600 }}>
                        {a.label}
                      </span>
                    ) : null;
                  })}
                </div>
              )}
              {open && !single && (
                <div style={{ padding: "4px 10px 10px", display: "flex", flexDirection: "column", gap: 6 }}>
                  {r.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => onPick(r.id, v.id)}
                      style={{
                        textAlign: "left",
                        padding: "9px 11px",
                        borderRadius: 9,
                        border: `1px solid ${c.line}`,
                        background: c.paper,
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{v.name}</div>
                      <div style={{ fontSize: 11, color: c.muted, marginTop: 2 }}>
                        {v.ingredients.map((x) => (x.opt ? `${x.name} (opc.)` : x.name)).join(", ") || "Sin ingredientes"}
                      </div>
                      {(v.allergens || []).length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 5 }}>
                          {v.allergens.map((ak) => {
                            const a = ALLERGENS.find((x) => x.key === ak);
                            return a ? (
                              <span key={ak} style={{ fontSize: 10, color: c.paprika, background: c.paprikaSoft, padding: "2px 7px", borderRadius: 20, fontWeight: 600 }}>
                                {a.label}
                              </span>
                            ) : null;
                          })}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {recipes.length > 0 && list.length === 0 && (
          <EmptyState
            kind="no-search"
            title="Sin resultado"
            subtitle={`Ningún plato coincide con "${query}".`}
          />
        )}
      </div>
    </Sheet>
  );
}

/* ===================== MODAL: EDITAR RECETA ===================== */
function RecipeEditor({ recipe, onClose, onSave }) {
  const [r, setR] = useState(recipe);
  const set = (patch) => setR({ ...r, ...patch });

  const addStep = () => set({ steps: [...(r.steps || []), ""] });
  const updateStep = (i, text) =>
    set({ steps: (r.steps || []).map((s, idx) => (idx === i ? text : s)) });
  const removeStep = (i) => set({ steps: (r.steps || []).filter((_, idx) => idx !== i) });

  const addVariant = () =>
    set({ variants: [...r.variants, { id: uid(), name: r.variants.length ? `Opción ${r.variants.length + 1}` : "Estándar", ingredients: [] }] });

  const updateVariant = (vid, patch) =>
    set({ variants: r.variants.map((v) => (v.id === vid ? { ...v, ...patch } : v)) });

  const removeVariant = (vid) => set({ variants: r.variants.filter((v) => v.id !== vid) });

  const duplicateVariant = (vid) => {
    const v = r.variants.find((x) => x.id === vid);
    if (!v) return;
    const copy = { ...JSON.parse(JSON.stringify(v)), id: uid(), name: `${v.name} (copia)` };
    const idx = r.variants.findIndex((x) => x.id === vid);
    const next = [...r.variants];
    next.splice(idx + 1, 0, copy);
    set({ variants: next });
  };

  const addIng = (vid) => {
    const v = r.variants.find((x) => x.id === vid);
    updateVariant(vid, { ingredients: [...v.ingredients, { name: "", qty: 1, unit: "ud" }] });
  };
  const updateIng = (vid, i, patch) => {
    const v = r.variants.find((x) => x.id === vid);
    updateVariant(vid, { ingredients: v.ingredients.map((ing, idx) => (idx === i ? { ...ing, ...patch } : ing)) });
  };
  const removeIng = (vid, i) => {
    const v = r.variants.find((x) => x.id === vid);
    updateVariant(vid, { ingredients: v.ingredients.filter((_, idx) => idx !== i) });
  };

  const canSave = r.name.trim() && r.variants.length > 0;

  return (
    <Sheet onClose={onClose} title={recipe._new ? "Nueva receta" : "Editar receta"}>
      <label style={lbl}>Nombre del plato</label>
      <input
        value={r.name}
        onChange={(e) => set({ name: e.target.value })}
        placeholder="Ej. Curry de garbanzos"
        style={inp}
      />
      <label style={lbl}>Categoría (opcional)</label>
      <input
        value={r.category}
        onChange={(e) => set({ category: e.target.value })}
        placeholder="Ej. Vegetariano"
        style={inp}
      />
      <label style={lbl}>Cantidades para… (comensales)</label>
      <input
        type="number"
        min="1"
        value={r.baseServings || 4}
        onChange={(e) => set({ baseServings: Math.max(1, Number(e.target.value) || 4) })}
        style={{ ...inp, fontFamily: "'Special Elite', monospace" }}
      />
      <p style={{ fontSize: 13, color: c.muted, marginTop: -2, fontStyle: "italic" }}>
        Las cantidades de abajo son para este número de personas. Al planificar puedes ajustarlas con el +/− del plato.
      </p>
      <label style={lbl}>Nota rápida (opcional)</label>
      <textarea
        value={r.notes || ""}
        onChange={(e) => set({ notes: e.target.value })}
        placeholder="Un apunte breve o truco rápido — el paso a paso completo va abajo."
        rows={2}
        style={{ ...inp, resize: "vertical", lineHeight: 1.45 }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "16px 0 8px" }}>
        <span style={{ fontFamily: display, fontSize: 15, fontWeight: 700, color: c.ink, lineHeight: 1 }}>Preparación paso a paso</span>
        <button onClick={addStep} style={ghostBtn}><Plus size={14} /> Paso</button>
      </div>
      {(r.steps || []).length === 0 && (
        <p style={{ fontSize: 13, color: c.muted, fontStyle: "italic", marginTop: 0 }}>
          Sin pasos todavía. Añade el primero para empezar la receta.
        </p>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 8 }}>
        {(r.steps || []).map((step, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <span
              style={{
                width: 24, height: 24, borderRadius: "50%", background: c.herbSoft, color: c.herb,
                fontWeight: 700, fontSize: 12, display: "grid", placeItems: "center", flexShrink: 0, marginTop: 6,
              }}
            >
              {i + 1}
            </span>
            <textarea
              value={step}
              onChange={(e) => updateStep(i, e.target.value)}
              rows={2}
              placeholder={`Paso ${i + 1}…`}
              style={{ ...inp, margin: 0, flex: 1, resize: "vertical", lineHeight: 1.4, fontSize: 14 }}
            />
            <button onClick={() => removeStep(i)} style={{ ...iconBtn, marginTop: 4 }}><X size={15} /></button>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "18px 0 8px" }}>
        <span style={{ fontFamily: display, fontSize: 15, fontWeight: 700, color: c.ink, lineHeight: 1 }}>Opciones de ingredientes</span>
        <button onClick={addVariant} style={ghostBtn}><Plus size={14} /> Opción</button>
      </div>
      <p style={{ fontSize: 13, color: c.muted, marginTop: 0 }}>
        Cada opción es una versión del plato (p. ej. "con carne" / "vegana") con su propia lista.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {r.variants.map((v) => (
          <div key={v.id} style={{ border: `1px solid ${c.line}`, borderRadius: 12, padding: 12, background: c.paper }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
              <input
                value={v.name}
                onChange={(e) => updateVariant(v.id, { name: e.target.value })}
                placeholder="Nombre de la opción"
                style={{ ...inp, margin: 0, fontWeight: 600 }}
              />
              <button onClick={() => duplicateVariant(v.id)} style={iconBtn} title="Duplicar opción"><Copy size={16} /></button>
              <button onClick={() => removeVariant(v.id)} style={iconBtn} title="Borrar opción"><Trash2 size={16} /></button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <Flame size={15} style={{ color: c.paprika, flexShrink: 0 }} />
              <input
                type="number"
                value={v.calories ?? ""}
                onChange={(e) => updateVariant(v.id, { calories: e.target.value ? Number(e.target.value) : null })}
                placeholder="Calorías por ración (opcional)"
                style={{ ...inp, margin: 0, flex: 1, fontFamily: "'Special Elite', monospace" }}
              />
              <span style={{ fontSize: 12, color: c.muted, flexShrink: 0 }}>kcal</span>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <TriangleAlert size={14} style={{ color: c.paprika, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: c.muted, fontWeight: 600 }}>Alérgenos presentes</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {ALLERGENS.map((a) => {
                  const active = (v.allergens || []).includes(a.key);
                  return (
                    <button
                      key={a.key}
                      onClick={() =>
                        updateVariant(v.id, {
                          allergens: active
                            ? (v.allergens || []).filter((x) => x !== a.key)
                            : [...(v.allergens || []), a.key],
                        })
                      }
                      style={{
                        fontSize: 12,
                        padding: "5px 11px",
                        borderRadius: 20,
                        border: `1px solid ${active ? c.paprika : c.line}`,
                        background: active ? c.paprikaSoft : c.card,
                        color: active ? c.paprika : c.muted,
                        fontWeight: active ? 700 : 500,
                      }}
                    >
                      {a.label}
                    </button>
                  );
                })}
              </div>
              <p style={{ fontSize: 11, color: c.muted, fontStyle: "italic", marginTop: 6, marginBottom: 0 }}>
                Orientativo, revisado a partir de los ingredientes — no es un dato certificado. Si la alergia es grave, comprueba siempre las etiquetas.
              </p>
            </div>

            {v.ingredients.map((ing, i) => (
              <div
                key={i}
                style={{
                  border: `1px solid ${ing.opt ? c.line : "transparent"}`,
                  background: ing.opt ? c.card : "transparent",
                  borderRadius: 9,
                  padding: ing.opt ? "7px 7px 8px" : "0 0 6px",
                  marginBottom: 6,
                }}
              >
                <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
                  <input
                    value={ing.name}
                    onChange={(e) => updateIng(v.id, i, { name: e.target.value })}
                    placeholder="Ingrediente"
                    style={{ ...inp, margin: 0, flex: 1 }}
                  />
                  <input
                    type="number"
                    value={ing.qty}
                    onChange={(e) => updateIng(v.id, i, { qty: e.target.value })}
                    style={{ ...inp, margin: 0, width: 52, textAlign: "center" }}
                  />
                  <select
                    value={ing.unit}
                    onChange={(e) => updateIng(v.id, i, { unit: e.target.value })}
                    style={{ ...inp, margin: 0, width: 70, padding: "10px 4px" }}
                  >
                    {UNITS.map((u) => <option key={u}>{u}</option>)}
                  </select>
                  <button onClick={() => removeIng(v.id, i)} style={iconBtn}><X size={15} /></button>
                </div>
                <button
                  onClick={() => updateIng(v.id, i, { opt: !ing.opt })}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "none",
                    border: "none",
                    padding: "2px 2px 0",
                    color: ing.opt ? c.paprika : c.muted,
                    fontSize: 12,
                    fontWeight: ing.opt ? 600 : 500,
                  }}
                >
                  {ing.opt ? <CheckSquare size={15} /> : <Square size={15} />}
                  Opcional
                </button>
              </div>
            ))}
            <button onClick={() => addIng(v.id)} style={{ ...ghostBtn, marginTop: 4 }}>
              <Plus size={14} /> Ingrediente
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={() => canSave && onSave(r)}
        disabled={!canSave}
        style={{ ...primaryBtn, width: "100%", justifyContent: "center", marginTop: 18, padding: "13px", opacity: canSave ? 1 : 0.5 }}
      >
        Guardar receta
      </button>
    </Sheet>
  );
}

/* ===================== HOJA MODAL ===================== */
function Sheet({ title, children, onClose }) {
  return (
    <div
      onClick={onClose}
      className="sheet-backdrop"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(42,38,32,0.4)",
        zIndex: 20,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="sheet-content"
        style={{
          background: c.paper,
          width: "100%",
          maxWidth: 520,
          maxHeight: "90vh",
          borderRadius: "20px 20px 0 0",
          overflowY: "auto",
          padding: "8px 16px 24px",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            background: c.paper,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 0 12px",
            zIndex: 2,
          }}
        >
          <span style={{ fontFamily: display, fontSize: 21, fontWeight: 700, color: c.ink, lineHeight: 1 }}>{title}</span>
          <button onClick={onClose} style={iconBtn}><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ---------- estilos compartidos ---------- */
const navBtn = {
  width: 40,
  height: 40,
  borderRadius: 10,
  border: `1px solid ${c.line}`,
  background: c.card,
  color: c.ink,
  display: "grid",
  placeItems: "center",
};
const primaryBtn = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  background: c.herb,
  color: "#fff",
  border: `1px solid ${c.herb}`,
  borderRadius: 8,
  padding: "9px 14px",
  fontSize: 14,
  fontWeight: 700,
  boxShadow: "1px 1px 0 rgba(44,54,80,0.15)",
};
const ghostBtn = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  background: c.herbSoft,
  color: c.herb,
  border: "none",
  borderRadius: 9,
  padding: "8px 12px",
  fontSize: 13,
  fontWeight: 600,
};
const iconBtn = {
  background: "none",
  border: "none",
  color: c.muted,
  padding: 6,
  display: "grid",
  placeItems: "center",
  borderRadius: 8,
};
const inp = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 9,
  border: `1px solid ${c.line}`,
  background: c.card,
  fontSize: 14,
  color: c.ink,
  margin: "4px 0 4px",
  outline: "none",
  fontFamily: body,
};
const lbl = {
  display: "block",
  fontSize: 12,
  color: c.muted,
  fontWeight: 600,
  marginTop: 10,
};
