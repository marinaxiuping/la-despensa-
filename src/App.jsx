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

/* ---------- datos de ejemplo (solo la 1ª vez) ---------- */
const seedRecipes = [
  {
    id: "r1",
    name: "Lentejas",
    category: "Legumbres",
    notes: "Pochar la verdura 10 min antes de añadir las lentejas. Cocer a fuego lento 35-40 min. Si quedan secas, añadir caldo caliente.",
    variants: [
      {
        id: "v1",
        name: "Clásica",
        calories: 350, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 520, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 380, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Con cebolla",
        calories: 320, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 150, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 320, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Con atún",
        calories: 430, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 350, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 520, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 380, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "De pollo",
        calories: 450, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 220, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 600, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 250, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 280, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 480, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Mixta (pollo y marisco)",
        calories: 520, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 650, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 300, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "De jamón",
        calories: 380, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Bravas + alioli",
        calories: 450, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "En salsa de tomate",
        calories: 420, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "De atún",
        calories: 430, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 650, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 150, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 320, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 520, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "De carne",
        calories: 380, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Margarita",
        calories: 550, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 550, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Con setas variadas",
        calories: 480, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "De gambas",
        calories: 480, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 450, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Con alubias",
        calories: 480, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "De verduras",
        calories: 380, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "De salmón",
        calories: 520, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Clásico",
        calories: 350, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Con pollo",
        calories: 450, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 480, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Clásica",
        calories: 480, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Clásico",
        calories: 520, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "César",
        calories: 450, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Mediterránea",
        calories: 420, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Mediterráneas",
        calories: 350, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Estándar",
        calories: 280, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Madrileño",
        calories: 550, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "De queso y jamón",
        calories: 350, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "De pollo",
        calories: 220, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Con jamón",
        calories: 320, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Con plátano y canela",
        calories: 380, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Tradicional",
        calories: 280, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Con nueces y miel",
        calories: 250, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Clásico",
        calories: 450, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Tradicional",
        calories: 420, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Estilo cantonés",
        calories: 380, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Con piña",
        calories: 520, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "De pollo y verduras",
        calories: 450, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Shoyu de cerdo",
        calories: 550, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "De cerdo y col",
        calories: 380, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Tradicional",
        calories: 480, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "California",
        calories: 380, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "De cerdo",
        calories: 600, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Con ternera",
        calories: 520, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "De ternera",
        calories: 520, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Tradicional",
        calories: 420, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Picante clásico",
        calories: 450, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Yangnyeom (dulce-picante)",
        calories: 650, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Tradicional (guanciale)",
        calories: 580, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Tradicional milanés",
        calories: 450, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "De pollo",
        calories: 480, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Tradicional de cordero",
        calories: 550, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Libanés",
        calories: 180, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Con feta",
        calories: 380, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Con frutos rojos",
        calories: 380, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "De limón",
        calories: 320, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Con huevo poché",
        calories: 350, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Espinaca y plátano",
        calories: 220, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Con frosting",
        calories: 420, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Con vino blanco",
        calories: 420, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Extremeñas",
        calories: 550, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Tradicional",
        calories: 380, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "De ajo con huevo",
        calories: 280, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Con garbanzos del cocido",
        calories: 420, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Con atún y huevo",
        calories: 420, // kcal/ración (estimado)
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
    variants: [
      {
        id: "v1",
        name: "Con cebolla morada",
        calories: 380, // kcal/ración (estimado)
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
function Library({ recipes, onAdd, onEdit, onDelete, onDuplicate, onToggleFav, missingCount, onAddLibrary }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState(null); // null = todas, "__fav" = favoritas

  const categories = useMemo(() => {
    const s = new Set();
    recipes.forEach((r) => r.category && s.add(r.category));
    return [...s].sort((a, b) => a.localeCompare(b, "es"));
  }, [recipes]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recipes
      .filter((r) => {
        if (cat === "__fav" && !r.fav) return false;
        if (cat && cat !== "__fav" && r.category !== cat) return false;
        if (!q) return true;
        const inName = r.name.toLowerCase().includes(q);
        const inIng = r.variants.some((v) =>
          v.ingredients.some((i) => i.name.toLowerCase().includes(q))
        );
        return inName || inIng;
      })
      .sort((a, b) => (b.fav ? 1 : 0) - (a.fav ? 1 : 0) || a.name.localeCompare(b.name, "es"));
  }, [recipes, query, cat]);

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
          <div style={{ display: "flex", gap: 7, overflowX: "auto", paddingBottom: 4, marginBottom: 14, WebkitOverflowScrolling: "touch" }}>
            <button onClick={() => setCat(null)} style={chip(cat === null)}>Todas</button>
            {favCount > 0 && (
              <button onClick={() => setCat("__fav")} style={chip(cat === "__fav")}>
                ★ Favoritas
              </button>
            )}
            {categories.map((ct) => (
              <button key={ct} onClick={() => setCat(ct)} style={chip(cat === ct)}>{ct}</button>
            ))}
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
                    <span
                      key={v.id}
                      style={{ fontSize: 11, color: c.herb, background: c.herbSoft, padding: "4px 9px", borderRadius: 20 }}
                    >
                      {v.name} · {v.ingredients.length} ing.
                      {v.calories != null && <> · ~{v.calories} kcal</>}
                    </span>
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
function Pantry({ items, onAdd, onUpdate, onRemove }) {
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState("ud");
  const [editingId, setEditingId] = useState(null);
  const [editQty, setEditQty] = useState("");
  const [editUnit, setEditUnit] = useState("ud");

  const sorted = useMemo(
    () => [...items].sort((a, b) => a.name.localeCompare(b.name, "es")),
    [items]
  );

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
      <label style={lbl}>Notas / preparación (opcional)</label>
      <textarea
        value={r.notes || ""}
        onChange={(e) => set({ notes: e.target.value })}
        placeholder="Pasos, tiempos, trucos… lo que quieras recordar."
        rows={4}
        style={{ ...inp, resize: "vertical", lineHeight: 1.45 }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "18px 0 8px" }}>
        <span style={{ fontFamily: display, fontSize: 15, fontWeight: 700, color: c.ink, lineHeight: 1 }}>Opciones de ingredientes</span>
        <button onClick={addVariant} style={ghostBtn}><Plus size={14} /> Opción</button>
      </div>
      <p style={{ fontSize: 12, color: c.muted, marginTop: 0 }}>
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
