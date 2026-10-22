import React, { useState, useMemo, useEffect } from 'react';
import { 
  Activity, Flame, Utensils, Plus, Trash2, RefreshCw, 
  CheckCircle2, Info, Sliders, Zap, ShieldCheck, 
  Dumbbell, Target, Wind, Music, Trophy, Sparkles, 
  HeartPulse, PlusCircle, TrendingDown, Calendar, 
  ArrowRight, Repeat, Search, X, ChefHat, Replace,
  BookOpen, Printer, Layers, Compass, Award, HelpCircle,
  ExternalLink, Share2, Smartphone, Copy, Check, Sparkle, MessageSquare
} from 'lucide-react';

// ============================================================================
// BASE DE DATOS DE ALIMENTOS (100% Sin Lactosa, Sin Café, 0% Alcohol)
// Incluye palabras clave (keywords) y fichas técnicas de Air Fryer
// ============================================================================
const INITIAL_FOOD_DB = [
  // INFUSIONES Y BEBIDAS (Sin Café, Sin Lactosa)
  { 
    id: 'mate_amargo', 
    name: 'Mate Amargo Tradicional (Termo)', 
    category: 'desayuno', 
    unit: 'termo', 
    baseAmount: 1, 
    cal: 15, p: 1, c: 3, f: 0, 
    airFryer: false, 
    tag: 'Energizante Natural',
    keywords: 'mate amargo yerba termo infusion desayuno merienda'
  },
  { 
    id: 'mate_cocido', 
    name: 'Mate Cocido en Saquito o Hebras (Sin Azúcar)', 
    category: 'desayuno', 
    unit: 'taza', 
    baseAmount: 1, 
    cal: 5, p: 0.3, c: 1, f: 0, 
    airFryer: false, 
    tag: 'Infusión Clásica',
    keywords: 'mate cocido taza saquito yerba infusion desayuno merienda'
  },
  { 
    id: 'te_verde', 
    name: 'Té Verde / Hierbas Digestivas con Limón', 
    category: 'desayuno', 
    unit: 'taza', 
    baseAmount: 1, 
    cal: 2, p: 0, c: 0.5, f: 0, 
    airFryer: false, 
    tag: 'Antioxidante',
    keywords: 'te verde hierbas manzanilla tilo cedron infusion'
  },
  { 
    id: 'leche_almendras', 
    name: 'Bebida de Almendras Sin Azúcar', 
    category: 'desayuno', 
    unit: 'ml', 
    baseAmount: 200, 
    cal: 26, p: 1, c: 0.6, f: 2.2, 
    airFryer: false, 
    tag: '0% Lactosa',
    keywords: 'leche almendras vegetal sin lactosa bebida'
  },
  { 
    id: 'leche_deslactosada', 
    name: 'Leche Descremada 0% Lactosa (Deslactosada)', 
    category: 'desayuno', 
    unit: 'ml', 
    baseAmount: 200, 
    cal: 70, p: 6.6, c: 9.6, f: 0.6, 
    airFryer: false, 
    tag: 'Deslactosada',
    keywords: 'leche deslactosada sin lactosa descremada'
  },

  // DESAYUNO Y MERIENDA
  { 
    id: 'huevos_revueltos', 
    name: 'Huevos Enteros (Revueltos, Poché o Duros)', 
    category: 'desayuno', 
    unit: 'unid (60g)', 
    baseAmount: 2, 
    cal: 155, p: 13, c: 1.1, f: 11, 
    airFryer: true, 
    tag: 'Proteína Completa',
    airFryerTip: 'En cazuela apta o molde de silicona a 180°C por 8-10 min.',
    keywords: 'huevo huevos revueltos duro poche omelette proteina'
  },
  { 
    id: 'claras_huevo', 
    name: 'Claras de Huevo Extras (Omelette / Revuelto)', 
    category: 'desayuno', 
    unit: 'unid (35g)', 
    baseAmount: 3, 
    cal: 52, p: 11, c: 0.7, f: 0.2, 
    airFryer: false, 
    tag: '100% Albúmina Magra',
    keywords: 'huevo claras clara omelette albumina proteina'
  },
  { 
    id: 'pan_integral', 
    name: 'Pan Integral de Semillas', 
    category: 'desayuno', 
    unit: 'rebanada (35g)', 
    baseAmount: 2, 
    cal: 175, p: 7, c: 28, f: 3.5, 
    airFryer: true, 
    tag: 'Tostado Air Fryer (180°C 3m)',
    airFryerTip: '180°C por 3-4 min para un tostado parejo y crocante.',
    keywords: 'pan integral semillas tostada tostadas carbohidrato'
  },
  { 
    id: 'tostadas_arroz', 
    name: 'Tostadas / Galletas de Arroz Integral', 
    category: 'desayuno', 
    unit: 'unid (10g)', 
    baseAmount: 3, 
    cal: 110, p: 2.4, c: 23, f: 0.8, 
    airFryer: false, 
    tag: 'Liviano y Crocante',
    keywords: 'tostadas arroz galletas merienda desayuno'
  },
  { 
    id: 'palta', 
    name: 'Palta (Aguacate) Hass Fresca', 
    category: 'desayuno', 
    unit: 'g', 
    baseAmount: 60, 
    cal: 96, p: 1.2, c: 5, f: 9, 
    airFryer: false, 
    tag: 'Grasa Saludable',
    keywords: 'palta aguacate grasa saludable desayuno ensalada'
  },
  { 
    id: 'jamon_natural', 
    name: 'Jamón Cocido Natural Magro / Lomito', 
    category: 'desayuno', 
    unit: 'g', 
    baseAmount: 60, 
    cal: 66, p: 12.6, c: 0.6, f: 1.4, 
    airFryer: false, 
    tag: 'Alto en Proteína / 0% Lactosa',
    keywords: 'jamon cocido natural lomito cerdo fiambre magro proteina'
  },
  { 
    id: 'avena', 
    name: 'Avena Arrollada Tradicional', 
    category: 'desayuno', 
    unit: 'g', 
    baseAmount: 50, 
    cal: 194, p: 8.5, c: 33, f: 3.5, 
    airFryer: false, 
    tag: 'Energía Sostenida',
    keywords: 'avena porridge cereal desayuno fibra'
  },
  { 
    id: 'frutos_secos', 
    name: 'Mix de Nueces y Almendras Naturales', 
    category: 'desayuno', 
    unit: 'g', 
    baseAmount: 25, 
    cal: 154, p: 4.6, c: 4.2, f: 13.8, 
    airFryer: false, 
    tag: 'Omega 3 + Saciedad',
    keywords: 'frutos secos nueces almendras castañas mani grasa'
  },
  { 
    id: 'banana', 
    name: 'Banana Mediana (Pre-Entreno Tenis/Gym)', 
    category: 'desayuno', 
    unit: 'unid (110g)', 
    baseAmount: 1, 
    cal: 98, p: 1.2, c: 25, f: 0.3, 
    airFryer: false, 
    tag: 'Potasio / Energía',
    keywords: 'banana fruta potasio tenis pre entreno'
  },
  { 
    id: 'manzana', 
    name: 'Manzana Verde o Roja con Cáscara', 
    category: 'desayuno', 
    unit: 'unid (150g)', 
    baseAmount: 1, 
    cal: 78, p: 0.4, c: 21, f: 0.2, 
    airFryer: true, 
    tag: 'Pectina / Saciedad',
    airFryerTip: 'En gajos con canela a 180°C por 10 min como colación tibia.',
    keywords: 'manzana fruta verde roja colacion merienda'
  },
  { 
    id: 'arandanos', 
    name: 'Arándanos o Frutillas Frescas', 
    category: 'desayuno', 
    unit: 'g', 
    baseAmount: 100, 
    cal: 52, p: 0.7, c: 12, f: 0.3, 
    airFryer: false, 
    tag: 'Antioxidante',
    keywords: 'arandanos frutillas frutos rojos fruta'
  },

  // PROTEÍNAS PRINCIPALES (Almuerzo y Cena - Especiales Air Fryer)
  { 
    id: 'pechuga_pollo', 
    name: 'Suprema / Pechuga de Pollo sin Piel', 
    category: 'principal', 
    unit: 'g (crudo)', 
    baseAmount: 230, 
    cal: 253, p: 52.5, c: 0, f: 3.0, 
    airFryer: true, 
    tag: 'Air Fryer (190°C 15m)',
    airFryerTip: '190°C por 14-16 min (dar vuelta a los 8 min). Marinar con limón, mostaza, ajo y pimentón para máxima jugosidad.',
    keywords: 'pollo pechuga suprema ave carne blanca magro air fryer'
  },
  { 
    id: 'pata_muslo_pollo', 
    name: 'Pata y Muslo de Pollo Deshuesado (Sin Piel)', 
    category: 'principal', 
    unit: 'g (crudo)', 
    baseAmount: 220, 
    cal: 275, p: 44.0, c: 0, f: 9.8, 
    airFryer: true, 
    tag: 'Air Fryer (200°C 18m)',
    airFryerTip: '200°C por 18-20 min con orégano, limón y provenzal. Corte súper jugoso.',
    keywords: 'pollo pata muslo deshuesado ave air fryer'
  },
  { 
    id: 'brochette_pollo', 
    name: 'Brochettes de Pollo con Morrón y Cebolla', 
    category: 'principal', 
    unit: 'g (crudo)', 
    baseAmount: 240, 
    cal: 260, p: 46.5, c: 6.0, f: 4.2, 
    airFryer: true, 
    tag: 'Air Fryer (195°C 14m)',
    airFryerTip: '195°C por 14 min girando a mitad de cocción.',
    keywords: 'pollo brochette pinchos pechuga morron cebolla air fryer'
  },
  { 
    id: 'solomillo_cerdo', 
    name: 'Solomillo de Cerdo Magro (Medallones)', 
    category: 'principal', 
    unit: 'g (crudo)', 
    baseAmount: 220, 
    cal: 264, p: 46.2, c: 0, f: 7.7, 
    airFryer: true, 
    tag: 'Air Fryer (200°C 15m)',
    airFryerTip: '200°C por 14-15 min en medallones gruesos con mostaza, romero y limón.',
    keywords: 'cerdo solomillo medallones lomo magro carne air fryer'
  },
  { 
    id: 'bondiola_magra', 
    name: 'Bondiola de Cerdo (Desgrasada a Cuchillo)', 
    category: 'principal', 
    unit: 'g (crudo)', 
    baseAmount: 180, 
    cal: 288, p: 35, c: 0, f: 16, 
    airFryer: true, 
    tag: 'Air Fryer (195°C 16m)',
    airFryerTip: '195°C por 16-18 min retirando antes la grasa visible.',
    keywords: 'cerdo bondiola churrasquito carne air fryer'
  },
  { 
    id: 'carré_cerdo', 
    name: 'Carré / Costillitas de Cerdo Magras sin Hueso', 
    category: 'principal', 
    unit: 'g (crudo)', 
    baseAmount: 210, 
    cal: 268, p: 45.0, c: 0, f: 8.5, 
    airFryer: true, 
    tag: 'Air Fryer (195°C 14m)',
    airFryerTip: '195°C por 14 min con toque de limón y hierbas.',
    keywords: 'cerdo carre costillita bife magro air fryer'
  },
  { 
    id: 'bife_lomo', 
    name: 'Corte Vacuno Magro (Lomo / Bife Angosto / Peceto)', 
    category: 'principal', 
    unit: 'g (crudo)', 
    baseAmount: 210, 
    cal: 283, p: 46.2, c: 0, f: 10, 
    airFryer: true, 
    tag: 'Air Fryer (200°C 12m)',
    airFryerTip: 'Precalentar Air Fryer a 200°C y cocinar 10-12 min para punto jugoso.',
    keywords: 'carne vacuna vaca bife lomo peceto cuadril nalga angosto hierro'
  },
  { 
    id: 'hamburguesa_casera', 
    name: 'Medallones Caseros de Carne Magra / Roast Beef', 
    category: 'principal', 
    unit: 'g (crudo)', 
    baseAmount: 200, 
    cal: 290, p: 42.0, c: 1.0, f: 12.5, 
    airFryer: true, 
    tag: 'Air Fryer (200°C 11m)',
    airFryerTip: '200°C por 11-12 min sin agregado de grasa.',
    keywords: 'carne vacuna hamburguesa medallon picada magra air fryer'
  },
  { 
    id: 'merluza', 
    name: 'Filet de Merluza / Pescado Blanco a las Hierbas', 
    category: 'principal', 
    unit: 'g (crudo)', 
    baseAmount: 250, 
    cal: 205, p: 43, c: 0, f: 3, 
    airFryer: true, 
    tag: 'Air Fryer (180°C 12m)',
    airFryerTip: '180°C por 11-12 min con limón, ajo deshidratado y perejil.',
    keywords: 'pescado merluza filet blanco mar air fryer'
  },
  { 
    id: 'salmon', 
    name: 'Salmón Rosado o Trucha Patagónica', 
    category: 'principal', 
    unit: 'g (crudo)', 
    baseAmount: 180, 
    cal: 340, p: 36, c: 0, f: 21, 
    airFryer: true, 
    tag: 'Air Fryer (190°C 11m)',
    airFryerTip: '190°C por 10-12 min con piel hacia abajo.',
    keywords: 'pescado salmon trucha omega 3 air fryer'
  },
  { 
    id: 'atun_natural', 
    name: 'Atún al Natural en Lomos (Escurrido)', 
    category: 'principal', 
    unit: 'lata (120g)', 
    baseAmount: 1, 
    cal: 130, p: 29, c: 0, f: 1, 
    airFryer: false, 
    tag: 'Rápido y Magro',
    keywords: 'atun pescado lata natural proteina rapida'
  },

  // CARBOHIDRATOS Y GUARNICIONES (Almuerzo y Cena)
  { 
    id: 'papas_airfryer', 
    name: 'Papas Rústicas en Cubos o Bastones', 
    category: 'guarnicion', 
    unit: 'g (crudo)', 
    baseAmount: 180, 
    cal: 139, p: 3.6, c: 31.5, f: 0.2, 
    airFryer: true, 
    tag: 'Air Fryer (200°C 18m)',
    airFryerTip: '200°C por 18-20 min agitando el canasto a los 10 min con pimentón y romero.',
    keywords: 'papa papas rusticas bastones fritas air fryer guarnicion carbohidrato'
  },
  { 
    id: 'batata_airfryer', 
    name: 'Batata / Boniato Asado en Cubos', 
    category: 'guarnicion', 
    unit: 'g (crudo)', 
    baseAmount: 170, 
    cal: 146, p: 2.6, c: 34, f: 0.2, 
    airFryer: true, 
    tag: 'Air Fryer (190°C 20m)',
    airFryerTip: '190°C por 18-20 min en cubos medianos.',
    keywords: 'batata boniato camote papa dulce air fryer guarnicion'
  },
  { 
    id: 'calabaza_asada', 
    name: 'Calabaza / Zapallo Cabutia o Anquito Asado', 
    category: 'guarnicion', 
    unit: 'g (crudo)', 
    baseAmount: 250, 
    cal: 65, p: 2.5, c: 16, f: 0.3, 
    airFryer: true, 
    tag: 'Gran Volumen / Air Fryer',
    airFryerTip: '195°C por 15-17 min en rodajas o cubos con orégano.',
    keywords: 'calabaza zapallo cabutia anco verdura vegetal air fryer'
  },
  { 
    id: 'vegetales_grillados', 
    name: 'Mix de Zucchini, Morrón, Cebolla y Brócoli', 
    category: 'guarnicion', 
    unit: 'g', 
    baseAmount: 250, 
    cal: 75, p: 5, c: 14, f: 0.6, 
    airFryer: true, 
    tag: 'Air Fryer (200°C 12m)',
    airFryerTip: '200°C por 10-12 min para que queden al dente y dorados.',
    keywords: 'vegetales verduras zucchini morron cebolla brocoli asados air fryer'
  },
  { 
    id: 'ensalada_completa', 
    name: 'Ensalada Fresca (Rúcula, Tomate, Pepino, Zanahoria)', 
    category: 'guarnicion', 
    unit: 'bowl (250g)', 
    baseAmount: 1, 
    cal: 55, p: 2.2, c: 11, f: 0.4, 
    airFryer: false, 
    tag: 'Fibra y Saciedad',
    keywords: 'ensalada verdura tomate lechuga rucula zanahoria fresca'
  },
  { 
    id: 'arroz_integral', 
    name: 'Arroz Integral o Yamaní (Cocido)', 
    category: 'guarnicion', 
    unit: 'g (cocido)', 
    baseAmount: 140, 
    cal: 156, p: 3.7, c: 32.5, f: 1.3, 
    airFryer: false, 
    tag: 'Energía Compleja',
    keywords: 'arroz integral yamani grano guarnicion carbohidrato'
  },
  { 
    id: 'lentejas', 
    name: 'Lentejas en Ensalada o Guisadas (Cocidas)', 
    category: 'guarnicion', 
    unit: 'g (cocido)', 
    baseAmount: 140, 
    cal: 162, p: 12.6, c: 28, f: 0.6, 
    airFryer: false, 
    tag: 'Hierro + Fibra',
    keywords: 'lentejas legumbres porotos garbanzos hierro fibra'
  },
  { 
    id: 'aceite_oliva', 
    name: 'Aceite de Oliva Virgen Extra (En crudo/Spray)', 
    category: 'guarnicion', 
    unit: 'cdita (5ml)', 
    baseAmount: 1, 
    cal: 44, p: 0, c: 0, f: 5, 
    airFryer: false, 
    tag: 'Cardioprotector',
    keywords: 'aceite oliva grasa saludable aderezo'
  }
];

// ============================================================================
// ACTIVIDADES FÍSICAS PRECONFIGURADAS PARA 88 KG (VALORES MET REALES)
// ============================================================================
const INITIAL_ACTIVITIES = [
  { id: 'gym', name: 'Gimnasio (Fuerza / Musculación)', freqPerWeek: 2.0, durationMin: 60, met: 5.5, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: 'Dumbbell' },
  { id: 'tenis', name: 'Tenis (Partido / Peloteo Intenso)', freqPerWeek: 1.5, durationMin: 80, met: 7.3, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: 'Trophy' },
  { id: 'taichi', name: 'Tai Chi (Práctica Marcial / Fluidez)', freqPerWeek: 1.0, durationMin: 60, met: 3.3, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: 'Wind' },
  { id: 'ritmo', name: 'Clase de Ritmo / Cardio Coreográfico', freqPerWeek: 1.0, durationMin: 60, met: 5.8, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', icon: 'Music' },
  { id: 'arqueria', name: 'Arquería Tradicional (Postura y Tiro)', freqPerWeek: 1.0, durationMin: 60, met: 3.8, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', icon: 'Target' }
];

// ============================================================================
// OPCIONES RÁPIDAS DE PLATOS POR COMIDA (Para intercambiar o buscar por palabra clave)
// ============================================================================
const QUICK_SWAPS_BY_MEAL = {
  desayuno: [
    {
      label: 'Opción 1: Mate Amargo + Revuelto Proteico de Huevos con Palta y Pan Integral',
      keywords: 'mate amargo huevo huevos revuelto palta pan integral tostadas',
      items: [
        { foodId: 'mate_amargo', amount: 1 },
        { foodId: 'huevos_revueltos', amount: 2 },
        { foodId: 'pan_integral', amount: 2 },
        { foodId: 'palta', amount: 50 }
      ]
    },
    {
      label: 'Opción 2: Mate Cocido + Tostadas con Jamón Natural Magro, Huevo y Manzana',
      keywords: 'mate cocido jamon huevo pan tostadas manzana',
      items: [
        { foodId: 'mate_cocido', amount: 1 },
        { foodId: 'pan_integral', amount: 2 },
        { foodId: 'jamon_natural', amount: 60 },
        { foodId: 'huevos_revueltos', amount: 1 },
        { foodId: 'manzana', amount: 1 }
      ]
    },
    {
      label: 'Opción 3: Porridge de Avena con Leche de Almendras, Claras y Arándanos + Mate',
      keywords: 'mate avena leche almendras claras huevo arandanos',
      items: [
        { foodId: 'mate_amargo', amount: 1 },
        { foodId: 'avena', amount: 50 },
        { foodId: 'leche_almendras', amount: 200 },
        { foodId: 'claras_huevo', amount: 3 },
        { foodId: 'arandanos', amount: 80 }
      ]
    }
  ],
  almuerzo: [
    {
      label: 'Opción 1 (Pollo): Suprema de Pollo en Air Fryer + Papas Rústicas y Ensalada',
      keywords: 'pollo suprema pechuga papas rusticas air fryer ensalada',
      items: [
        { foodId: 'pechuga_pollo', amount: 230 },
        { foodId: 'papas_airfryer', amount: 180 },
        { foodId: 'ensalada_completa', amount: 1 },
        { foodId: 'aceite_oliva', amount: 1 }
      ]
    },
    {
      label: 'Opción 2 (Cerdo): Solomillo de Cerdo Magro + Papas Rústicas Air Fryer',
      keywords: 'cerdo solomillo papas rusticas air fryer ensalada',
      items: [
        { foodId: 'solomillo_cerdo', amount: 230 },
        { foodId: 'papas_airfryer', amount: 180 },
        { foodId: 'ensalada_completa', amount: 1 },
        { foodId: 'aceite_oliva', amount: 1 }
      ]
    },
    {
      label: 'Opción 3 (Vacuna): Bife de Lomo Magro Grillado + Batatas Asadas en Air Fryer',
      keywords: 'carne vacuna bife lomo batata boniato air fryer ensalada',
      items: [
        { foodId: 'bife_lomo', amount: 210 },
        { foodId: 'batata_airfryer', amount: 160 },
        { foodId: 'ensalada_completa', amount: 1 },
        { foodId: 'aceite_oliva', amount: 1 }
      ]
    },
    {
      label: 'Opción 4 (Pollo Jugoso): Pata Muslo sin Piel en Air Fryer + Arroz Integral y Vegetales',
      keywords: 'pollo pata muslo arroz integral vegetales air fryer',
      items: [
        { foodId: 'pata_muslo_pollo', amount: 220 },
        { foodId: 'arroz_integral', amount: 130 },
        { foodId: 'vegetales_grillados', amount: 200 }
      ]
    }
  ],
  merienda: [
    {
      label: 'Opción 1: Mate de la Tarde + Tostadas de Arroz con Jamón Magro y Nueces',
      keywords: 'mate amargo tostadas arroz jamon frutos secos nueces',
      items: [
        { foodId: 'mate_amargo', amount: 1 },
        { foodId: 'tostadas_arroz', amount: 3 },
        { foodId: 'jamon_natural', amount: 60 },
        { foodId: 'frutos_secos', amount: 20 }
      ]
    },
    {
      label: 'Opción 2: Pre-Entreno Tenis/Gym (Banana + Huevos Revueltos + Té Verde)',
      keywords: 'te verde banana huevo huevos tostadas arroz tenis gym',
      items: [
        { foodId: 'te_verde', amount: 1 },
        { foodId: 'banana', amount: 1 },
        { foodId: 'huevos_revueltos', amount: 2 },
        { foodId: 'tostadas_arroz', amount: 2 }
      ]
    },
    {
      label: 'Opción 3: Liviana Saciante (Mate Cocido + Manzana + Frutos Secos + Claras)',
      keywords: 'mate cocido manzana frutos secos claras huevo',
      items: [
        { foodId: 'mate_cocido', amount: 1 },
        { foodId: 'manzana', amount: 1 },
        { foodId: 'frutos_secos', amount: 25 },
        { foodId: 'claras_huevo', amount: 3 }
      ]
    }
  ],
  cena: [
    {
      label: 'Opción 1 (Pollo): Suprema de Pollo en Air Fryer + Calabaza y Vegetales Asados',
      keywords: 'pollo suprema pechuga calabaza zapallo vegetales air fryer',
      items: [
        { foodId: 'pechuga_pollo', amount: 230 },
        { foodId: 'calabaza_asada', amount: 250 },
        { foodId: 'vegetales_grillados', amount: 250 },
        { foodId: 'aceite_oliva', amount: 1 }
      ]
    },
    {
      label: 'Opción 2 (Pescado): Filet de Merluza en Air Fryer + Vegetales Grillados y Palta',
      keywords: 'pescado merluza vegetales palta air fryer',
      items: [
        { foodId: 'merluza', amount: 260 },
        { foodId: 'vegetales_grillados', amount: 300 },
        { foodId: 'palta', amount: 60 },
        { foodId: 'aceite_oliva', amount: 1 }
      ]
    },
    {
      label: 'Opción 3 (Cerdo): Medallones de Solomillo de Cerdo + Ensalada Completa y Calabaza',
      keywords: 'cerdo solomillo calabaza ensalada air fryer',
      items: [
        { foodId: 'solomillo_cerdo', amount: 220 },
        { foodId: 'calabaza_asada', amount: 250 },
        { foodId: 'ensalada_completa', amount: 1 },
        { foodId: 'aceite_oliva', amount: 1 }
      ]
    },
    {
      label: 'Opción 4 (Atún/Huevo): Ensalada Tibia de Atún al Natural, Huevos y Papas Air Fryer',
      keywords: 'atun pescado huevo huevos papa papas air fryer ensalada',
      items: [
        { foodId: 'atun_natural', amount: 1.5 },
        { foodId: 'huevos_revueltos', amount: 2 },
        { foodId: 'papas_airfryer', amount: 150 },
        { foodId: 'ensalada_completa', amount: 1 }
      ]
    }
  ]
};

// ============================================================================
// PLANTILLAS DE DÍAS COMPLETOS DE 4 COMIDAS (CALIBRADAS PARA 88 KG EN DÉFICIT)
// ============================================================================
const PRESET_MEALS = {
  promedio: {
    name: 'Día Equilibrado (Air Fryer + Mate)',
    items: [
      { meal: 'desayuno', foodId: 'mate_amargo', amount: 1 },
      { meal: 'desayuno', foodId: 'huevos_revueltos', amount: 2 },
      { meal: 'desayuno', foodId: 'pan_integral', amount: 2 },
      { meal: 'desayuno', foodId: 'palta', amount: 50 },
      { meal: 'almuerzo', foodId: 'pechuga_pollo', amount: 230 },
      { meal: 'almuerzo', foodId: 'papas_airfryer', amount: 180 },
      { meal: 'almuerzo', foodId: 'ensalada_completa', amount: 1 },
      { meal: 'almuerzo', foodId: 'aceite_oliva', amount: 1 },
      { meal: 'merienda', foodId: 'mate_amargo', amount: 1 },
      { meal: 'merienda', foodId: 'tostadas_arroz', amount: 3 },
      { meal: 'merienda', foodId: 'jamon_natural', amount: 60 },
      { meal: 'merienda', foodId: 'frutos_secos', amount: 20 },
      { meal: 'cena', foodId: 'solomillo_cerdo', amount: 220 },
      { meal: 'cena', foodId: 'vegetales_grillados', amount: 250 },
      { meal: 'cena', foodId: 'calabaza_asada', amount: 250 },
      { meal: 'cena', foodId: 'aceite_oliva', amount: 1 }
    ]
  },
  alto_gasto: {
    name: 'Día de Tenis o Gimnasio (Recuperación Muscular)',
    items: [
      { meal: 'desayuno', foodId: 'mate_amargo', amount: 1 },
      { meal: 'desayuno', foodId: 'huevos_revueltos', amount: 2 },
      { meal: 'desayuno', foodId: 'avena', amount: 50 },
      { meal: 'desayuno', foodId: 'leche_almendras', amount: 200 },
      { meal: 'desayuno', foodId: 'arandanos', amount: 80 },
      { meal: 'almuerzo', foodId: 'bife_lomo', amount: 220 },
      { meal: 'almuerzo', foodId: 'papas_airfryer', amount: 200 },
      { meal: 'almuerzo', foodId: 'ensalada_completa', amount: 1 },
      { meal: 'almuerzo', foodId: 'aceite_oliva', amount: 1 },
      { meal: 'merienda', foodId: 'te_verde', amount: 1 },
      { meal: 'merienda', foodId: 'banana', amount: 1 },
      { meal: 'merienda', foodId: 'pan_integral', amount: 2 },
      { meal: 'merienda', foodId: 'jamon_natural', amount: 70 },
      { meal: 'cena', foodId: 'pechuga_pollo', amount: 230 },
      { meal: 'cena', foodId: 'batata_airfryer', amount: 160 },
      { meal: 'cena', foodId: 'vegetales_grillados', amount: 250 }
    ]
  },
  descanso_moderado: {
    name: 'Día Tai Chi / Arquería / Descanso (Low-Carb Saciante)',
    items: [
      { meal: 'desayuno', foodId: 'mate_amargo', amount: 1 },
      { meal: 'desayuno', foodId: 'huevos_revueltos', amount: 3 },
      { meal: 'desayuno', foodId: 'palta', amount: 60 },
      { meal: 'desayuno', foodId: 'tostadas_arroz', amount: 2 },
      { meal: 'almuerzo', foodId: 'pechuga_pollo', amount: 240 },
      { meal: 'almuerzo', foodId: 'calabaza_asada', amount: 250 },
      { meal: 'almuerzo', foodId: 'ensalada_completa', amount: 1 },
      { meal: 'almuerzo', foodId: 'aceite_oliva', amount: 1.5 },
      { meal: 'merienda', foodId: 'mate_cocido', amount: 1 },
      { meal: 'merienda', foodId: 'jamon_natural', amount: 60 },
      { meal: 'merienda', foodId: 'frutos_secos', amount: 25 },
      { meal: 'merienda', foodId: 'manzana', amount: 1 },
      { meal: 'cena', foodId: 'merluza', amount: 260 },
      { meal: 'cena', foodId: 'vegetales_grillados', amount: 300 },
      { meal: 'cena', foodId: 'aceite_oliva', amount: 1 }
    ]
  }
};

// 4 COMIDAS DIARIAS PRINCIPALES
const MEAL_SECTIONS = [
  { id: 'desayuno', label: '1. Desayuno + Mate Matutino', shortLabel: 'Desayuno', time: '07:30 - 09:00', icon: '☀️' },
  { id: 'almuerzo', label: '2. Almuerzo Principal (Air Fryer)', shortLabel: 'Almuerzo', time: '12:30 - 14:00', icon: '🍽️' },
  { id: 'merienda', label: '3. Merienda / Pre-Práctica', shortLabel: 'Merienda', time: '17:00 - 18:30', icon: '🧉' },
  { id: 'cena', label: '4. Cena Reparadora Liviana', shortLabel: 'Cena', time: '20:30 - 22:00', icon: '🌙' }
];

// CHIPS RÁPIDOS DE PALABRA CLAVE EN SECCIÓN 3
const QUICK_KEYWORD_CHIPS = [
  { label: '🍗 Pollo', query: 'pollo' },
  { label: '🥩 Cerdo', query: 'cerdo' },
  { label: '🐄 Vacuna', query: 'vacuna' },
  { label: '🐟 Pescado/Atún', query: 'pescado' },
  { label: '🥔 Papa/Batata', query: 'papa' },
  { label: '🥚 Huevo', query: 'huevo' },
  { label: '🧉 Mate', query: 'mate' }
];

// Función auxiliar para normalizar acentos en las búsquedas
const normalizeText = (str = '') =>
  str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

// ============================================================================
// TABLA RESUMEN DE COCCIÓN AIR FRYER PARA EL PASO 5 DEL MANUAL
// ============================================================================
const AIR_FRYER_GUIDE_TABLE = [
  { cut: 'Suprema / Pechuga de Pollo sin Piel (230g)', temp: '190 °C', time: '14 - 16 min', action: 'Dar vuelta a los 8 min. Marinar con limón, mostaza y pimentón.' },
  { cut: 'Pata y Muslo Deshuesado sin Piel (220g)', temp: '200 °C', time: '18 - 20 min', action: 'Condimentar con orégano, ajo y limón. Corte de máxima jugosidad.' },
  { cut: 'Solomillo de Cerdo en Medallones (220g)', temp: '200 °C', time: '14 - 15 min', action: 'Medallones de 2.5 cm con toque de mostaza, romero y pimienta.' },
  { cut: 'Bife de Lomo / Angosto Vacuno Magro (210g)', temp: '200 °C', time: '10 - 12 min', action: 'Precalentar 3 min antes para sellar por fuera y mantener jugoso.' },
  { cut: 'Filet de Merluza / Pescado Blanco (250g)', temp: '180 °C', time: '11 - 12 min', action: 'Rociar con limón, perejil y ajo deshidratado. No requiere dar vuelta.' },
  { cut: 'Papas Rústicas o Batatas en Cubos (180g)', temp: '200 °C', time: '18 - 20 min', action: 'Agitar el canasto a los 10 min con 1 cdita de oliva en spray y romero.' },
  { cut: 'Mix de Zucchini, Morrón, Cebolla y Brócoli', temp: '200 °C', time: '10 - 12 min', action: 'Corte parejo para que queden dorados por fuera y al dente.' }
];

export default function App() {
  // MODO DE VISTA PRINCIPAL: 'app' | 'manual' | 'combined' | 'flyer'
  const [viewMode, setViewMode] = useState('flyer');
  const [highlightedSection, setHighlightedSection] = useState(null);

  // ESTADOS DEL FLYER PROMOCIONAL PARA WHATSAPP
  const [flyerTheme, setFlyerTheme] = useState('emerald'); // 'emerald' | 'amber' | 'indigo'
  const [flyerFormat, setFlyerFormat] = useState('story'); // 'story' (vertical) | 'post' (compacto)
  const [selectedCaptionIdx, setSelectedCaptionIdx] = useState(0);
  const [copiedCaption, setCopiedCaption] = useState(false);

  // 1. ESTADOS BIOMÉTRICOS REALES POR DEFECTO (Hombre, 88 kg, 169 cm, 59 años)
  const [age, setAge] = useState(59);
  const [weight, setWeight] = useState(88);
  const [targetWeight, setTargetWeight] = useState(78);
  const [height, setHeight] = useState(169);
  const [neatFactor] = useState(1.25);
  const [deficitTarget, setDeficitTarget] = useState(500);

  // Estrategia de cálculo de proteínas para 88 kg:
  const [proteinBasis, setProteinBasis] = useState('target_weight');
  const [proteinMultiplier, setProteinMultiplier] = useState(2.0);

  // Selector de "¿Qué entrenás hoy?"
  const [dayMode, setDayMode] = useState('promedio');

  // 2. ESTADO DE ACTIVIDADES DEPORTIVAS
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);

  // 3. ESTADO DE BASE DE DATOS DE ALIMENTOS Y PLAN DIARIO DE 4 COMIDAS
  const [foodDb, setFoodDb] = useState(INITIAL_FOOD_DB);
  const [dailyLog, setDailyLog] = useState(() => {
    return PRESET_MEALS.promedio.items.map((item, idx) => ({
      ...item,
      uid: `init-${idx}-${Date.now()}`
    }));
  });

  // 4. ESTADOS DE UI Y BUSCADOR POR PALABRA CLAVE EN SECCIÓN 3
  const [selectedMealToAdd, setSelectedMealToAdd] = useState('almuerzo');
  const [selectedFoodIdToAdd, setSelectedFoodIdToAdd] = useState('pechuga_pollo');
  const [customAmountToAdd, setCustomAmountToAdd] = useState(230);
  const [onlyAirFryerFilter, setOnlyAirFryerFilter] = useState(false);

  // Estado del Buscador por Palabra Clave en la Sección 3 ("1. Elegir Comida" -> "2. Alimento Apto")
  const [plannerKeyword, setPlannerKeyword] = useState('');

  // Estado del Buscador Individual dentro de cada una de las 4 tarjetas de Comida
  const [mealCardSearch, setMealCardSearch] = useState({
    desayuno: '',
    almuerzo: '',
    merienda: '',
    cena: ''
  });

  // Mensaje de confirmación visual al agregar o reemplazar desde el buscador
  const [actionFeedback, setActionFeedback] = useState(null);

  const [showCustomFoodModal, setShowCustomFoodModal] = useState(false);
  const [newCustomFood, setNewCustomFood] = useState({
    name: '', unit: 'g', baseAmount: 100, cal: 150, p: 15, c: 10, f: 5, airFryer: false
  });

  const triggerFeedback = (msg) => {
    setActionFeedback(msg);
    setTimeout(() => {
      setActionFeedback(prev => (prev === msg ? null : prev));
    }, 3200);
  };

  // Navegación interactiva desde los botones del Manual hacia cada sección de la App
  const handleJumpToSection = (sectionId, optionalAction) => {
    if (viewMode === 'manual') {
      setViewMode('combined');
    }
    if (optionalAction) {
      optionalAction();
    }
    setHighlightedSection(sectionId);
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
    setTimeout(() => {
      setHighlightedSection(prev => (prev === sectionId ? null : prev));
    }, 2800);
  };

  // Sincronizar cantidad por defecto cuando cambia el alimento seleccionado
  useEffect(() => {
    const food = foodDb.find(f => f.id === selectedFoodIdToAdd);
    if (food) {
      setCustomAmountToAdd(food.baseAmount);
    }
  }, [selectedFoodIdToAdd, foodDb]);

  // Filtrado de alimentos para el selector de la Sección 3 (combina palabra clave + filtro Air Fryer)
  const filteredFoodsForSelector = useMemo(() => {
    const q = normalizeText(plannerKeyword.trim());
    return foodDb.filter(f => {
      if (onlyAirFryerFilter && !f.airFryer) return false;
      if (!q) return true;
      const haystack = normalizeText(`${f.name} ${f.tag || ''} ${f.keywords || ''} ${f.category || ''}`);
      return haystack.includes(q);
    });
  }, [foodDb, plannerKeyword, onlyAirFryerFilter]);

  // Si al filtrar por palabra clave el alimento seleccionado ya no está en la lista filtrada, seleccionar el primero disponible
  useEffect(() => {
    if (filteredFoodsForSelector.length > 0) {
      const exists = filteredFoodsForSelector.some(f => f.id === selectedFoodIdToAdd);
      if (!exists) {
        setSelectedFoodIdToAdd(filteredFoodsForSelector[0].id);
      }
    }
  }, [filteredFoodsForSelector, selectedFoodIdToAdd]);

  // Platos completos prearmados que coinciden con la palabra clave escrita en la Sección 3
  const matchingCompleteDishesInPlanner = useMemo(() => {
    const q = normalizeText(plannerKeyword.trim());
    if (!q) return [];
    const results = [];
    MEAL_SECTIONS.forEach(sec => {
      const swaps = QUICK_SWAPS_BY_MEAL[sec.id] || [];
      swaps.forEach(swap => {
        const hay = normalizeText(`${swap.label} ${swap.keywords || ''}`);
        if (hay.includes(q)) {
          results.push({
            mealId: sec.id,
            mealLabel: sec.shortLabel,
            mealIcon: sec.icon,
            label: swap.label,
            items: swap.items
          });
        }
      });
    });
    return results;
  }, [plannerKeyword]);

  // CÁLCULO ENERGÉTICO Y DE MACRONUTRIENTES (Mifflin-St Jeor + METs para 88 kg)
  const energyMetrics = useMemo(() => {
    // TMB Varón: (10 x peso) + (6.25 x altura) - (5 x edad) + 5
    const bmr = Math.round(10 * weight + 6.25 * height - 5 * age + 5);
    const neatKcal = Math.round(bmr * (neatFactor - 1));

    const activitiesBreakdown = activities.map(act => {
      // Fórmula MET: (MET * 3.5 * peso_kg / 200) * minutos
      const kcalPerSession = Math.round(((act.met * 3.5 * weight) / 200) * act.durationMin);
      const kcalPerWeek = Math.round(kcalPerSession * act.freqPerWeek);
      return {
        ...act,
        kcalPerSession,
        kcalPerWeek
      };
    });

    const totalWeeklySportKcal = activitiesBreakdown.reduce((acc, item) => acc + item.kcalPerWeek, 0);
    const avgDailySportKcal = Math.round(totalWeeklySportKcal / 7);

    let activeSportKcalForToday = avgDailySportKcal;
    let activeModeLabel = 'Promedio Semanal (6.5 sesiones)';

    if (dayMode === 'tenis') {
      const tenisObj = activitiesBreakdown.find(a => a.id === 'tenis');
      activeSportKcalForToday = tenisObj ? tenisObj.kcalPerSession : avgDailySportKcal;
      activeModeLabel = 'Día de Partido / Entreno de Tenis';
    } else if (dayMode === 'gym') {
      const gymObj = activitiesBreakdown.find(a => a.id === 'gym');
      activeSportKcalForToday = gymObj ? gymObj.kcalPerSession : avgDailySportKcal;
      activeModeLabel = 'Día de Gimnasio (Fuerza)';
    } else if (dayMode === 'taichi_ritmo_arq') {
      const tc = activitiesBreakdown.find(a => a.id === 'taichi')?.kcalPerSession || 250;
      const ar = activitiesBreakdown.find(a => a.id === 'arqueria')?.kcalPerSession || 280;
      activeSportKcalForToday = Math.round((tc + ar) / 2);
      activeModeLabel = 'Día de Tai Chi / Ritmo / Arquería';
    } else if (dayMode === 'descanso') {
      activeSportKcalForToday = 0;
      activeModeLabel = 'Día de Descanso Total';
    }

    const tdee = bmr + neatKcal + activeSportKcalForToday;
    const targetCalories = Math.max(1550, tdee - deficitTarget);
    const actualDeficit = tdee - targetCalories;

    // Cálculo de proteínas según peso de referencia
    const referenceWeightForProtein = proteinBasis === 'target_weight' ? targetWeight : weight;
    const targetProteinG = Math.round(referenceWeightForProtein * proteinMultiplier);
    const proteinCalories = targetProteinG * 4;

    // Grasas saludables: ~0.9g por kg de peso meta (~25-28% de las kcal)
    const targetFatG = Math.round(Math.max(55, (targetCalories * 0.27) / 9));
    const fatCalories = targetFatG * 9;

    // Carbohidratos: el resto de las calorías disponibles
    const remainingCalForCarbs = Math.max(400, targetCalories - proteinCalories - fatCalories);
    const targetCarbsG = Math.round(remainingCalForCarbs / 4);

    // IMC actual y proyectado
    const heightM = height / 100;
    const currentBmi = (weight / (heightM * heightM)).toFixed(1);
    const targetBmi = (targetWeight / (heightM * heightM)).toFixed(1);

    // Proyección de pérdida de peso (7700 kcal ≈ 1 kg de tejido adiposo)
    const estimatedWeeklyLossKg = ((actualDeficit * 7) / 7700).toFixed(2);
    const kgToLose = Math.max(0, +(weight - targetWeight).toFixed(1));
    const weeksToGoal = kgToLose > 0 && parseFloat(estimatedWeeklyLossKg) > 0
      ? Math.ceil(kgToLose / parseFloat(estimatedWeeklyLossKg))
      : 0;

    return {
      bmr,
      neatKcal,
      activitiesBreakdown,
      totalWeeklySportKcal,
      avgDailySportKcal,
      activeSportKcalForToday,
      activeModeLabel,
      tdee,
      targetCalories,
      actualDeficit,
      referenceWeightForProtein,
      targetProteinG,
      targetFatG,
      targetCarbsG,
      currentBmi,
      targetBmi,
      estimatedWeeklyLossKg,
      kgToLose,
      weeksToGoal
    };
  }, [age, weight, targetWeight, height, neatFactor, deficitTarget, proteinBasis, proteinMultiplier, activities, dayMode]);

  // TOTALES CONSUMIDOS EN LAS 4 COMIDAS DIARIAS
  const consumedTotals = useMemo(() => {
    let cal = 0, p = 0, c = 0, f = 0;
    const byMeal = { desayuno: 0, almuerzo: 0, merienda: 0, cena: 0 };

    const enrichedItems = dailyLog.map(entry => {
      const food = foodDb.find(item => item.id === entry.foodId) || foodDb[0];
      const ratio = (parseFloat(entry.amount) || 0) / (food.baseAmount || 1);
      const itemCal = Math.round(food.cal * ratio);
      const itemP = +(food.p * ratio).toFixed(1);
      const itemC = +(food.c * ratio).toFixed(1);
      const itemF = +(food.f * ratio).toFixed(1);

      cal += itemCal;
      p += itemP;
      c += itemC;
      f += itemF;
      if (byMeal[entry.meal] !== undefined) {
        byMeal[entry.meal] += itemCal;
      }

      return {
        ...entry,
        food,
        itemCal,
        itemP,
        itemC,
        itemF
      };
    });

    return {
      cal: Math.round(cal),
      p: Math.round(p),
      c: Math.round(c),
      f: Math.round(f),
      byMeal,
      enrichedItems
    };
  }, [dailyLog, foodDb]);

  const calDiff = consumedTotals.cal - energyMetrics.targetCalories;
  const isCalorieOnTrack = Math.abs(calDiff) <= 110;
  const isProteinMet = consumedTotals.p >= energyMetrics.targetProteinG * 0.92;

  const currentlySelectedFoodObj = useMemo(
    () => foodDb.find(f => f.id === selectedFoodIdToAdd) || null,
    [foodDb, selectedFoodIdToAdd]
  );

  // MANEJADORES DE EVENTOS DE ACTIVIDADES Y PLANIFICADOR
  const handleActivityChange = (id, field, value) => {
    const num = parseFloat(value) || 0;
    setActivities(prev =>
      prev.map(act => (act.id === id ? { ...act, [field]: num } : act))
    );
  };

  const handleAddFoodToMeal = (mealOverride, foodIdOverride, amountOverride) => {
    const targetMeal = mealOverride || selectedMealToAdd;
    const targetFoodId = foodIdOverride || selectedFoodIdToAdd;
    const foodObj = foodDb.find(f => f.id === targetFoodId);
    if (!foodObj) return;

    const finalAmount = amountOverride !== undefined
      ? parseFloat(amountOverride) || foodObj.baseAmount
      : parseFloat(customAmountToAdd) || foodObj.baseAmount;

    const newEntry = {
      uid: `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      meal: targetMeal,
      foodId: targetFoodId,
      amount: finalAmount
    };

    setDailyLog(prev => [...prev, newEntry]);
    const mealName = MEAL_SECTIONS.find(m => m.id === targetMeal)?.shortLabel || targetMeal;
    triggerFeedback(`✅ Sumado: ${foodObj.name} (${finalAmount} ${foodObj.unit}) en ${mealName}`);
  };

  const handleReplaceMainInMeal = (mealId, newFoodId, newAmount) => {
    const newFood = foodDb.find(f => f.id === newFoodId);
    if (!newFood) return;
    const finalAmount = parseFloat(newAmount) || newFood.baseAmount;

    setDailyLog(prev => {
      const mealItems = prev.filter(item => item.meal === mealId);
      const itemToReplace = mealItems.find(item => {
        const f = foodDb.find(dbItem => dbItem.id === item.foodId);
        return f && f.category === newFood.category;
      }) || mealItems[0];

      if (!itemToReplace) {
        return [
          ...prev,
          {
            uid: `rep-${Date.now()}`,
            meal: mealId,
            foodId: newFoodId,
            amount: finalAmount
          }
        ];
      }

      return prev.map(item =>
        item.uid === itemToReplace.uid
          ? { ...item, foodId: newFoodId, amount: finalAmount }
          : item
      );
    });

    const mealName = MEAL_SECTIONS.find(m => m.id === mealId)?.shortLabel || mealId;
    triggerFeedback(`🔄 Reemplazado por ${newFood.name} (${finalAmount} ${newFood.unit}) en ${mealName}`);
  };

  const handleSwapSingleMeal = (mealId, newItemsList, dishLabel = '') => {
    setDailyLog(prev => {
      const otherMeals = prev.filter(item => item.meal !== mealId);
      const added = newItemsList.map((it, idx) => ({
        uid: `swap-${mealId}-${idx}-${Date.now()}`,
        meal: mealId,
        foodId: it.foodId,
        amount: it.amount
      }));
      return [...otherMeals, ...added];
    });
    const mealName = MEAL_SECTIONS.find(m => m.id === mealId)?.shortLabel || mealId;
    triggerFeedback(`🍽️ Plato actualizado en ${mealName}${dishLabel ? `: ${dishLabel}` : ''}`);
  };

  const handleScaleSingleMeal = (mealId, factor) => {
    setDailyLog(prev =>
      prev.map(item => {
        if (item.meal !== mealId) return item;
        const food = foodDb.find(f => f.id === item.foodId);
        const isGramOrMl = food && (food.unit.includes('g') || food.unit.includes('ml'));
        const rawNew = item.amount * factor;
        const rounded = isGramOrMl
          ? Math.max(10, Math.round(rawNew / 10) * 10)
          : Math.max(0.5, Math.round(rawNew * 2) / 2);
        return { ...item, amount: rounded };
      })
    );
    const mealName = MEAL_SECTIONS.find(m => m.id === mealId)?.shortLabel || mealId;
    triggerFeedback(`⚖️ Porciones ajustadas (${factor > 1 ? '+15%' : '-15%'}) en ${mealName}`);
  };

  const handleUpdateAmount = (uid, newVal) => {
    const val = parseFloat(newVal);
    setDailyLog(prev =>
      prev.map(item => (item.uid === uid ? { ...item, amount: isNaN(val) ? 0 : val } : item))
    );
  };

  const handleRemoveItem = (uid) => {
    setDailyLog(prev => prev.filter(item => item.uid !== uid));
  };

  const handleLoadPreset = (presetKey) => {
    const preset = PRESET_MEALS[presetKey];
    if (!preset) return;
    setDailyLog(
      preset.items.map((item, idx) => ({
        ...item,
        uid: `preset-${presetKey}-${idx}-${Date.now()}`
      }))
    );
    triggerFeedback(`✨ Cargado menú completo: ${preset.name}`);
  };

  const handleAutoCalibrateCurrentMenu = () => {
    if (consumedTotals.cal <= 0) return;
    const factor = energyMetrics.targetCalories / consumedTotals.cal;

    setDailyLog(prev =>
      prev.map(item => {
        const food = foodDb.find(f => f.id === item.foodId);
        if (!food) return item;
        // No escalar infusiones acalóricas como mate o té
        if (food.cal <= 15) return item;

        const isGramOrMl = food.unit.includes('g') || food.unit.includes('ml');
        const scaled = item.amount * factor;
        const newAmount = isGramOrMl
          ? Math.max(20, Math.round(scaled / 10) * 10)
          : Math.max(0.5, Math.round(scaled * 2) / 2);

        return { ...item, amount: newAmount };
      })
    );
    triggerFeedback(`⚖️ Porciones auto-calibradas para clavar tu meta de ${energyMetrics.targetCalories} kcal`);
  };

  const handleCreateCustomFood = (e) => {
    e.preventDefault();
    if (!newCustomFood.name.trim()) return;
    const customId = `custom_${Date.now()}`;
    const created = {
      id: customId,
      name: newCustomFood.name.trim(),
      category: 'principal',
      unit: newCustomFood.unit || 'g',
      baseAmount: parseFloat(newCustomFood.baseAmount) || 100,
      cal: parseFloat(newCustomFood.cal) || 100,
      p: parseFloat(newCustomFood.p) || 0,
      c: parseFloat(newCustomFood.c) || 0,
      f: parseFloat(newCustomFood.f) || 0,
      airFryer: Boolean(newCustomFood.airFryer),
      tag: newCustomFood.airFryer ? 'Air Fryer Personalizado' : 'Personalizado 0% Lactosa',
      keywords: normalizeText(newCustomFood.name)
    };

    setFoodDb(prev => [created, ...prev]);
    setSelectedFoodIdToAdd(customId);
    setCustomAmountToAdd(created.baseAmount);
    setShowCustomFoodModal(false);
    setNewCustomFood({ name: '', unit: 'g', baseAmount: 100, cal: 150, p: 15, c: 10, f: 5, airFryer: false });
    triggerFeedback(`✅ Alimento creado y seleccionado: ${created.name}`);
  };

  const renderActivityIcon = (iconName, className = "w-5 h-5") => {
    switch (iconName) {
      case 'Dumbbell': return <Dumbbell className={className} />;
      case 'Trophy': return <Trophy className={className} />;
      case 'Wind': return <Wind className={className} />;
      case 'Music': return <Music className={className} />;
      case 'Target': return <Target className={className} />;
      default: return <Activity className={className} />;
    }
  };

  const WHATSAPP_CAPTIONS = [
    {
      title: 'Opción 1: Directa y Deportiva (Ideal Grupos de Tenis / Gym / Club)',
      text: `🔥 *¡Les comparto NutriSport 88kg Plan!* 🎾🏋️‍♂️🏹\n\nUna calculadora nutricional y planificador interactivo de *4 comidas diarias* diseñado a medida para perder peso protegiendo la masa muscular.\n\n✅ *Cálculo real para 5 disciplinas:* Gimnasio, Tenis, Tai Chi, Ritmo y Arquería.\n🔥 *Especial Air Fryer:* Tiempos y temperaturas exactas para pollo, cerdo, carnes magras y papas rústicas.\n🔍 *Buscador inteligente por palabra clave:* Cambiá platos o reemplazá proteínas con 1 clic.\n🛡️ *100% Sin Lactosa • 🧉 Sin Café (con Mate) • 💧 0% Alcohol.*\n\n¡Pruébenla acá y armen su menú del día en segundos! 👇`
    },
    {
      title: 'Opción 2: Corta y Visual (Ideal para Estado de WhatsApp)',
      text: `🚀 *NutriSport Plan: Déficit Calórico Inteligente + Cocina en Air Fryer* 🔥\n\n📊 Calibrá tus 4 comidas del día según qué deporte entrenás hoy (Tenis, Gym, Tai Chi, Ritmo o Arquería).\n🥩 Buscador rápido por ingrediente ("pollo", "cerdo", "papa", "huevo", "mate").\n🛡️ 100% Libre de Lactosa • Sin Café • 0% Alcohol.\n\n¡Escribime y te paso el acceso para probarla! 📲✨`
    },
    {
      title: 'Opción 3: Enfoque Salud y Cocina Práctica (Familiar / Amigos)',
      text: `🧉 *¿Querés comer sano, bajar de peso sin pasar hambre y aprovechar la Air Fryer al máximo?* 🔥\n\nEstoy usando *NutriSport Plan*, una app interactiva que:\n1️⃣ Calcula tus calorías y proteínas exactas por día.\n2️⃣ Arma tus *4 comidas diarias* 100% sin lactosa, sin café (¡con buen mate!) y 0% alcohol.\n3️⃣ Trae buscador por palabra clave y botón de *Auto-Calibración de porciones*.\n4️⃣ Incluye Manual Paso a Paso y tabla de cocción en Freidora de Aire.\n\n¡Te la comparto para que la chusmees! 👇`
    }
  ];

  const handleCopyWhatsappText = (textToCopy) => {
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopiedCaption(true);
      triggerFeedback('📲 ¡Texto copiado al portapapeles! Listo para pegar en WhatsApp.');
      setTimeout(() => setCopiedCaption(false), 3000);
    } catch (err) {
      triggerFeedback('Seleccioná el texto manualmente para copiarlo.');
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16 selection:bg-emerald-500 selection:text-slate-950">
      {/* HEADER SUPERIOR CON PERFIL REAL PRECARGADO Y SELECTOR DE MODO (APP / MANUAL / COMBINADO) */}
      <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Flame className="w-6 h-6 text-slate-950 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                    NutriSport <span className="text-emerald-400 font-light">88kg Plan</span>
                  </h1>
                  <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-800 text-emerald-300 border border-slate-700 font-semibold">
                    Varón • {age} años • {weight} kg • {(height / 100).toFixed(2)} m
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400">
                  Déficit Calórico Inteligente, 4 Comidas Diarias y Gasto Real para tus 5 Disciplinas
                </p>
              </div>
            </div>

            {/* INSIGNIAS DE RESTRICCIONES ESTRICTAS */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Sin Lactosa
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30">
                🧉 Sin Café (Mate / Té)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                💧 0% Alcohol
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-500/15 text-rose-300 border border-rose-500/30">
                <Flame className="w-3.5 h-3.5" /> Especial Air Fryer
              </span>
            </div>
          </div>

          {/* BARRA DE NAVEGACIÓN SUPERIOR: CONMUTADOR DE MODOS Y EXPORTACIÓN DEL MANUAL */}
          <div className="pt-2.5 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('app')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'app'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Utensils className="w-3.5 h-3.5" /> 🧮 Calculadora y Planificador
              </button>
              <button
                type="button"
                onClick={() => setViewMode('manual')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'manual'
                    ? 'bg-indigo-500 text-white font-bold shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" /> 📘 Manual de Uso Paso a Paso
              </button>
              <button
                type="button"
                onClick={() => setViewMode('combined')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'combined'
                    ? 'bg-gradient-to-r from-indigo-500 to-emerald-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> ⚡ Vista Combinada (Guía + App)
              </button>
              <button
                type="button"
                onClick={() => setViewMode('flyer')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'flyer'
                    ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-extrabold shadow-lg shadow-emerald-500/20'
                    : 'text-emerald-300 hover:text-white hover:bg-slate-900 border border-emerald-500/30'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" /> 📲 Flyer para WhatsApp
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-slate-400 mr-1">
                <span>Accesos rápidos:</span>
                <button
                  type="button"
                  onClick={() => handleJumpToSection('seccion-biometria')}
                  className="px-2 py-1 rounded bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 border border-indigo-500/20 font-medium"
                >
                  1. Biometría
                </button>
                <button
                  type="button"
                  onClick={() => handleJumpToSection('seccion-deportes')}
                  className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/20 font-medium"
                >
                  2. Deportes
                </button>
                <button
                  type="button"
                  onClick={() => handleJumpToSection('planificador-comidas')}
                  className="px-2 py-1 rounded bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/20 font-medium"
                >
                  3. Buscador y 4 Comidas
                </button>
                <button
                  type="button"
                  onClick={() => handleJumpToSection('seccion-semaforo')}
                  className="px-2 py-1 rounded bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 border border-purple-500/20 font-medium"
                >
                  4. Semáforo Macros
                </button>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
                title="Imprimir o guardar como PDF el Manual y tu Plan Diario"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-400" /> 🖨️ Imprimir / Exportar Manual
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-8">

        {/* ============================================================================
            📲 MÓDULO FLYER PROMOCIONAL PROFESIONAL PARA WHATSAPP
            Diseñado en proporción móvil vertical para capturar pantalla o compartir
            ============================================================================ */}
        {viewMode === 'flyer' && (
          <section className="space-y-6">
            {/* Barra de Controles del Estudio de Flyer */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                  <Smartphone className="w-4 h-4" /> Estudio de Difusión para WhatsApp
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  Flyer Oficial de Alta Conversión + Mensajes Listos para Enviar
                </h2>
                <p className="text-xs text-slate-400">
                  Elegí el estilo de color, hacé captura de pantalla al póster de la izquierda (o imprimilo en PDF) y copiá el mensaje promocional con un clic.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Selector de Tema de Color del Flyer */}
                <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 px-2">Paleta:</span>
                  <button
                    type="button"
                    onClick={() => setFlyerTheme('emerald')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      flyerTheme === 'emerald'
                        ? 'bg-emerald-500 text-slate-950 shadow'
                        : 'text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    🟢 Esmeralda Sport
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlyerTheme('amber')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      flyerTheme === 'amber'
                        ? 'bg-amber-500 text-slate-950 shadow'
                        : 'text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    🟠 Fuego Air Fryer
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlyerTheme('indigo')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      flyerTheme === 'indigo'
                        ? 'bg-indigo-500 text-white shadow'
                        : 'text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    🔵 Índigo Pro
                  </button>
                </div>

                {/* Selector de Formato */}
                <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setFlyerFormat('story')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      flyerFormat === 'story'
                        ? 'bg-slate-800 text-emerald-300 border border-emerald-500/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    📱 Vertical Estado/Chat
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlyerFormat('post')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      flyerFormat === 'post'
                        ? 'bg-slate-800 text-emerald-300 border border-emerald-500/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🖼️ Compacto Cuadrado
                  </button>
                </div>
              </div>
            </div>

            {/* Notificación de copiado */}
            {actionFeedback && (
              <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-between">
                <span>{actionFeedback}</span>
                <button onClick={() => setActionFeedback(null)} className="text-emerald-300 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* GRILLA PRINCIPAL: LIENZO DEL FLYER (IZQUIERDA) + KIT DE TEXTOS WHATSAPP (DERECHA) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* COLUMNA IZQUIERDA: EL FLYER GRÁFICO LISTO PARA CAPTURAR EN CELULAR O PC */}
              <div className="lg:col-span-7 flex flex-col items-center">
                <div
                  id="whatsapp-flyer-canvas"
                  className={`w-full ${
                    flyerFormat === 'story' ? 'max-w-[460px]' : 'max-w-[540px]'
                  } rounded-[32px] p-6 sm:p-7 relative overflow-hidden shadow-2xl border-2 transition-all duration-300 ${
                    flyerTheme === 'emerald'
                      ? 'bg-gradient-to-b from-slate-900 via-emerald-950/90 to-slate-950 border-emerald-400/60 shadow-emerald-500/20'
                      : flyerTheme === 'amber'
                      ? 'bg-gradient-to-b from-slate-900 via-rose-950/85 to-slate-950 border-amber-400/60 shadow-amber-500/20'
                      : 'bg-gradient-to-b from-slate-900 via-indigo-950/90 to-slate-950 border-indigo-400/60 shadow-indigo-500/20'
                  }`}
                >
                  {/* Luces de neón decorativas de fondo */}
                  <div className={`absolute -top-24 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
                    flyerTheme === 'emerald' ? 'bg-emerald-500/25' : flyerTheme === 'amber' ? 'bg-amber-500/25' : 'bg-indigo-500/30'
                  }`} />
                  <div className={`absolute -bottom-24 -left-20 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
                    flyerTheme === 'emerald' ? 'bg-cyan-500/20' : flyerTheme === 'amber' ? 'bg-rose-500/25' : 'bg-purple-500/25'
                  }`} />

                  {/* 1. CABECERA DEL FLYER */}
                  <div className="relative z-10 flex items-center justify-between gap-2 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg ${
                        flyerTheme === 'emerald'
                          ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950'
                          : flyerTheme === 'amber'
                          ? 'bg-gradient-to-br from-amber-400 to-rose-500 text-slate-950'
                          : 'bg-gradient-to-br from-indigo-400 to-cyan-400 text-slate-950'
                      }`}>
                        <Flame className="w-6 h-6 stroke-[2.5]" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300 block">
                          Web App Interactiva
                        </span>
                        <h3 className="text-xl font-black tracking-tight text-white leading-none">
                          NutriSport <span className="text-emerald-400">Plan</span>
                        </h3>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-white/10 text-white border border-white/20 backdrop-blur-md">
                      ⚡ 100% Personalizable
                    </span>
                  </div>

                  {/* 2. TITULAR DE IMPACTO */}
                  <div className="relative z-10 text-center my-5 space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-[11px] font-extrabold uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" /> Nutrición Deportiva + Cocina Práctica
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
                      Transformá tu Energía y Perdé Peso{' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300">
                        Sin Pasar Hambre
                      </span>
                    </h2>
                    <p className="text-xs text-slate-200/90 max-w-sm mx-auto leading-relaxed">
                      Calculadora inteligente de macronutrientes y planificador diario de <strong>4 comidas</strong> adaptado a tu entrenamiento real.
                    </p>
                  </div>

                  {/* 3. INSIGNIAS DE LAS 3 REGLAS DE ORO + AIR FRYER (2x2 A Todo Color) */}
                  <div className="relative z-10 grid grid-cols-2 gap-2.5 my-4">
                    <div className="bg-emerald-500/20 border border-emerald-400/40 rounded-2xl p-3 flex items-center gap-2.5 backdrop-blur-sm">
                      <span className="text-xl">🛡️</span>
                      <div>
                        <div className="text-xs font-black text-emerald-200 uppercase">100% Sin Lactosa</div>
                        <div className="text-[10px] text-emerald-100/80">Digestión liviana y desinflamatoria</div>
                      </div>
                    </div>

                    <div className="bg-amber-500/20 border border-amber-400/40 rounded-2xl p-3 flex items-center gap-2.5 backdrop-blur-sm">
                      <span className="text-xl">🧉</span>
                      <div>
                        <div className="text-xs font-black text-amber-200 uppercase">Sin Café (Con Mate)</div>
                        <div className="text-[10px] text-amber-100/80">Energía natural con Mate y Té Verde</div>
                      </div>
                    </div>

                    <div className="bg-cyan-500/20 border border-cyan-400/40 rounded-2xl p-3 flex items-center gap-2.5 backdrop-blur-sm">
                      <span className="text-xl">💧</span>
                      <div>
                        <div className="text-xs font-black text-cyan-200 uppercase">0% Alcohol</div>
                        <div className="text-[10px] text-cyan-100/80">Hidratación y oxidación de grasa</div>
                      </div>
                    </div>

                    <div className="bg-rose-500/25 border border-rose-400/50 rounded-2xl p-3 flex items-center gap-2.5 backdrop-blur-sm">
                      <span className="text-xl">🔥</span>
                      <div>
                        <div className="text-xs font-black text-rose-200 uppercase">Especial Air Fryer</div>
                        <div className="text-[10px] text-rose-100/80">Tiempos y °C exactos de cocción</div>
                      </div>
                    </div>
                  </div>

                  {/* 4. BLOQUE DE LAS 5 DISCIPLINAS DEPORTIVAS */}
                  <div className="relative z-10 bg-slate-950/80 border border-white/15 rounded-2xl p-3.5 my-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5" /> Calibrada para 5 Disciplinas Reales
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        6.5 sesiones / sem
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-1.5 text-center">
                      <div className="bg-blue-500/15 border border-blue-400/30 rounded-xl p-2">
                        <div className="text-base">🏋️‍♂️</div>
                        <div className="text-[10px] font-bold text-blue-200 mt-0.5">Gym</div>
                        <div className="text-[9px] text-blue-300/80">Fuerza</div>
                      </div>
                      <div className="bg-emerald-500/15 border border-emerald-400/30 rounded-xl p-2">
                        <div className="text-base">🎾</div>
                        <div className="text-[10px] font-bold text-emerald-200 mt-0.5">Tenis</div>
                        <div className="text-[9px] text-emerald-300/80">Potencia</div>
                      </div>
                      <div className="bg-amber-500/15 border border-amber-400/30 rounded-xl p-2">
                        <div className="text-base">🧘‍♂️</div>
                        <div className="text-[10px] font-bold text-amber-200 mt-0.5">Tai Chi</div>
                        <div className="text-[9px] text-amber-300/80">Fluidez</div>
                      </div>
                      <div className="bg-purple-500/15 border border-purple-400/30 rounded-xl p-2">
                        <div className="text-base">🎶</div>
                        <div className="text-[10px] font-bold text-purple-200 mt-0.5">Ritmo</div>
                        <div className="text-[9px] text-purple-300/80">Cardio</div>
                      </div>
                      <div className="bg-rose-500/15 border border-rose-400/30 rounded-xl p-2">
                        <div className="text-base">🏹</div>
                        <div className="text-[10px] font-bold text-rose-200 mt-0.5">Arquería</div>
                        <div className="text-[9px] text-rose-300/80">Foco</div>
                      </div>
                    </div>
                  </div>

                  {/* 5. FUNCIONES ESTRELLA DE LA APP */}
                  <div className="relative z-10 space-y-2 my-4 text-xs">
                    <div className="bg-slate-950/75 border border-amber-400/30 rounded-xl p-3 flex items-start gap-3">
                      <span className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 font-black flex items-center justify-center shrink-0 text-sm">
                        🔍
                      </span>
                      <div>
                        <strong className="text-amber-300 block">Buscador Inteligente por Palabra Clave</strong>
                        <span className="text-slate-300 text-[11px]">
                          Escribí <em>"pollo"</em>, <em>"cerdo"</em>, <em>"papa"</em>, <em>"huevo"</em> o <em>"mate"</em> y reemplazá proteínas o platos enteros con 1 clic.
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-950/75 border border-purple-400/30 rounded-xl p-3 flex items-start gap-3">
                      <span className="w-7 h-7 rounded-lg bg-purple-400 text-slate-950 font-black flex items-center justify-center shrink-0 text-sm">
                        ⚖️
                      </span>
                      <div>
                        <strong className="text-purple-300 block">Auto-Calibración Exacta de Porciones</strong>
                        <span className="text-slate-300 text-[11px]">
                          Ajusta automáticamente los gramos de tus 4 comidas para clavar tu meta de déficit calórico y proteger el músculo.
                        </span>
                      </div>
                    </div>

                    {flyerFormat === 'story' && (
                      <div className="bg-slate-950/75 border border-indigo-400/30 rounded-xl p-3 flex items-start gap-3">
                        <span className="w-7 h-7 rounded-lg bg-indigo-400 text-slate-950 font-black flex items-center justify-center shrink-0 text-sm">
                          📘
                        </span>
                        <div>
                          <strong className="text-indigo-300 block">Incluye Manual Paso a Paso + Tabla Air Fryer</strong>
                          <span className="text-slate-300 text-[11px]">
                            Guía visual por colores con temperaturas y minutos exactos para que cada corte salga jugoso y dorado.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 6. CASO DE ÉXITO / CALIBRACIÓN BASE + CALL TO ACTION PARA WHATSAPP */}
                  <div className="relative z-10 mt-5 pt-4 border-t border-white/15 flex flex-col gap-3">
                    <div className="flex items-center justify-between text-[11px] bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                      <span className="text-slate-300">🎯 Ejemplo Calibrado:</span>
                      <span className="font-extrabold text-emerald-300">
                        88 kg → 78 kg • {energyMetrics.targetCalories} kcal • {energyMetrics.targetProteinG}g Prot
                      </span>
                    </div>

                    <div className="bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-300 text-slate-950 rounded-2xl p-3.5 text-center shadow-lg">
                      <div className="text-[10px] font-black uppercase tracking-widest opacity-80">
                        📲 ¡Solicitá el enlace por WhatsApp!
                      </div>
                      <div className="text-sm sm:text-base font-black tracking-tight mt-0.5">
                        Probá la Calculadora y Armá tu Menú Hoy
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 mt-3 text-center">
                  💡 <strong>Tip para enviar por WhatsApp:</strong> En el celular o en la compu, hacé una captura de pantalla al recuadro del flyer de arriba y pegala junto con uno de los mensajes de la derecha.
                </p>
              </div>

              {/* COLUMNA DERECHA: GENERADOR DE MENSAJES DE WHATSAPP LISTOS PARA COPIAR */}
              <div className="lg:col-span-5 space-y-5">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-emerald-400" />
                      <h3 className="text-base font-bold text-white">
                        Mensajes con Formato WhatsApp
                      </h3>
                    </div>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
                      Con Negritas y Emojis
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Elegí el estilo de mensaje según a quién se lo quieras mandar (grupos de tenis/gimnasio, estado de WhatsApp o amigos) y tocá <strong>"Copiar Texto para WhatsApp"</strong>:
                  </p>

                  {/* Pestañas de selección de mensaje */}
                  <div className="space-y-2">
                    {WHATSAPP_CAPTIONS.map((cap, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedCaptionIdx(idx)}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                          selectedCaptionIdx === idx
                            ? 'bg-emerald-500/15 border-emerald-500 text-white font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <span>{cap.title}</span>
                        {selectedCaptionIdx === idx && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Vista previa tipo burbuja de WhatsApp */}
                  <div className="bg-[#0b141a] border border-emerald-500/30 rounded-2xl p-4 space-y-2 relative">
                    <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                      <span>Vista Previa en Chat de WhatsApp</span>
                      <span>20:51 ✓✓</span>
                    </div>
                    <pre className="text-xs text-slate-100 whitespace-pre-wrap font-sans leading-relaxed bg-[#005c4b]/40 p-3.5 rounded-xl border border-emerald-500/20">
                      {WHATSAPP_CAPTIONS[selectedCaptionIdx].text}
                    </pre>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyWhatsappText(WHATSAPP_CAPTIONS[selectedCaptionIdx].text)}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    {copiedCaption ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" /> ¡Texto Copiado! Pegalo en WhatsApp
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 stroke-[2.5]" /> Copiar Texto para WhatsApp
                      </>
                    )}
                  </button>
                </div>

                {/* Guía rápida en 3 pasos para compartir por WSP */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Sparkle className="w-4 h-4" /> Cómo compartirlo en 30 segundos
                  </h4>
                  <ol className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                      <span>Elegí arriba tu paleta favorita (<strong>Esmeralda Sport</strong>, <strong>Fuego Air Fryer</strong> o <strong>Índigo Pro</strong>).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                      <span>Hacé una <strong>captura de pantalla</strong> al póster de la izquierda (está diseñado sin bordes distractores para que entre perfecto en la pantalla del teléfono).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                      <span>Tocá <strong>"Copiar Texto para WhatsApp"</strong> y pegalo como comentario de la foto en tus grupos o estados.</span>
                    </li>
                  </ol>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setViewMode('combined')}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                    >
                      ← Volver a la Calculadora y Manual
                    </button>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="text-xs text-slate-300 hover:text-white flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" /> Guardar Flyer en PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ============================================================================
            📘 MANUAL DE USO PROFESIONAL (GUÍA PASO A PASO CON COLORES E INTERACCIÓN)
            Visible en modo 'manual' o 'combined'
            ============================================================================ */}
        {(viewMode === 'manual' || viewMode === 'combined') && (
          <section id="manual-uso-profesional" className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-7 relative overflow-hidden">
            {/* Decoración de fondo sutil */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Encabezado Principal del Manual */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5 relative z-10">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                  <BookOpen className="w-3.5 h-3.5" /> Documentación Interactiva del Sistema
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  📘 Manual de Uso Profesional <span className="text-emerald-400 font-normal text-lg sm:text-xl">— Guía Paso a Paso</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
                  Aprendé a dominar tu calculadora nutricional y planificador deportivo calibrado para <strong className="text-white">{weight} kg y {(height / 100).toFixed(2)} m</strong> en 5 pasos codificados por color. Cada tarjeta incluye botones interactivos para probar la función en vivo.
                </p>
              </div>

              {/* Índice Rápido por Colores */}
              <div className="flex flex-wrap gap-1.5 bg-slate-950/90 p-2.5 rounded-2xl border border-slate-800 shrink-0">
                <a href="#paso-1-manual" className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold hover:bg-indigo-500/30">
                  Paso 1: Biometría
                </a>
                <a href="#paso-2-manual" className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold hover:bg-emerald-500/30">
                  Paso 2: 5 Deportes
                </a>
                <a href="#paso-3-manual" className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold hover:bg-amber-500/30">
                  Paso 3: Buscador y Comidas
                </a>
                <a href="#paso-4-manual" className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-bold hover:bg-purple-500/30">
                  Paso 4: Auto-Calibración
                </a>
                <a href="#paso-5-manual" className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-bold hover:bg-rose-500/30">
                  Paso 5: Air Fryer y Reglas
                </a>
              </div>
            </div>

            {/* GRILLA DE PASOS 1 Y 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
              
              {/* PASO 1: AZUL / ÍNDIGO - CONFIGURACIÓN BIOLÓGICA Y META DE PESO */}
              <div id="paso-1-manual" className="bg-gradient-to-br from-indigo-950/50 via-slate-950 to-slate-900 border-2 border-indigo-500/40 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-lg">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-indigo-500 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
                        1
                      </span>
                      <div>
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-400 block">
                          Módulo Antropométrico (Color Índigo)
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-white">
                          Configuración Biológica y Meta de Peso
                        </h3>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
                      88 kg → 78 kg
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Define el punto de partida metabólico calculando tu <strong>Tasa Metabólica Basal (TMB: {energyMetrics.bmr} kcal)</strong> y el tiempo estimado en semanas para alcanzar tu objetivo de peso saludable.
                  </p>

                  <ul className="space-y-2.5 text-xs text-slate-200 bg-slate-950/80 p-4 rounded-xl border border-indigo-500/20">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400 font-bold">1.1.</span>
                      <span>
                        <strong>Peso Actual, Altura y Meta:</strong> Ya viene calibrado con tus <strong>88 kg</strong>, <strong>169 cm</strong> (IMC 30.8) y una meta inicial sugerida de <strong>78 kg</strong> (IMC 27.3). Podés mover el deslizador para proyectar cualquier peso meta.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400 font-bold">1.2.</span>
                      <span>
                        <strong>Selector de Déficit Diario:</strong> Elegí entre <span className="text-indigo-300 font-semibold">Leve (-350 kcal)</span>, <span className="text-emerald-300 font-semibold">Moderado (-500 kcal, recomendado para perder ~0.45 kg/sem sin fatiga)</span> o <span className="text-amber-300 font-semibold">Intenso (-650 kcal)</span>.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400 font-bold">1.3.</span>
                      <span>
                        <strong>Estrategia Inteligente de Proteínas:</strong> Recomendamos dejar activa la opción <em>"Sobre Peso Meta (78 kg)"</em> (~156 g de proteína diaria) para proteger tu masa muscular sin robar calorías del déficit.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 mt-4 border-t border-indigo-500/20 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] text-indigo-300 font-medium">
                    🎯 Meta actual activa: {energyMetrics.targetCalories} kcal/día | {energyMetrics.targetProteinG}g Proteína
                  </span>
                  <button
                    type="button"
                    onClick={() => handleJumpToSection('seccion-biometria')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs shadow-md transition-all"
                  >
                    Ir al Paso 1 en la App <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* PASO 2: ESMERALDA / VERDE - CRONOGRAMA DEPORTIVO Y "¿QUÉ ENTRENÁS HOY?" */}
              <div id="paso-2-manual" className="bg-gradient-to-br from-emerald-950/50 via-slate-950 to-slate-900 border-2 border-emerald-500/40 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-lg">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 font-black text-lg flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
                        2
                      </span>
                      <div>
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 block">
                          Módulo de Gasto por Ejercicio (Color Esmeralda)
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-white">
                          Cronograma de 5 Deportes y "¿Qué entrenás hoy?"
                        </h3>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                      6.5 sesiones/sem
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Tus 5 disciplinas están cargadas con su gasto real en METs para un cuerpo de <strong>88 kg</strong>, sumando <strong>+{energyMetrics.totalWeeklySportKcal} kcal semanales</strong> (+{energyMetrics.avgDailySportKcal} kcal/día en promedio).
                  </p>

                  <div className="bg-slate-950/80 p-4 rounded-xl border border-emerald-500/20 space-y-2.5 text-xs text-slate-200">
                    <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                      <Compass className="w-4 h-4" /> ¿Cómo elegir el modo del día en el tablero superior?
                    </div>
                    <p className="text-[11px] text-slate-300">
                      En la tarjeta superior derecha tenés la botonera <strong>"¿Qué entrenás hoy?"</strong> con dos estrategias válidas:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-emerald-500/30">
                        <span className="font-bold text-emerald-300 block">📊 Promedio Semanal (Recomendado)</span>
                        <span className="text-[11px] text-slate-400">
                          Reparte el gasto de tus 6.5 sesiones de forma pareja todos los días para comer siempre la misma cantidad de calorías sin complicarte.
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="font-bold text-blue-300 block">🎾 / 🏋️ Ajuste por Día Específico</span>
                        <span className="text-[11px] text-slate-400">
                          Si tocás <em>"Día de Tenis"</em> o <em>"Día de Gym"</em>, la app sube tu techo de carbohidratos ese día para reponer glucógeno en cancha.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-emerald-500/20 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleJumpToSection('seccion-semaforo', () => setDayMode('tenis'))}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold"
                    >
                      🎾 Simular Día de Tenis
                    </button>
                    <button
                      type="button"
                      onClick={() => handleJumpToSection('seccion-semaforo', () => setDayMode('promedio'))}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold"
                    >
                      📊 Volver a Promedio
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleJumpToSection('seccion-deportes')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all"
                  >
                    Ir al Paso 2 (Deportes) <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* PASO 3: ÁMBAR / NARANJA (ANCHO COMPLETO) - BUSCADOR POR PALABRA CLAVE Y PLANIFICADOR DE 4 COMIDAS */}
            <div id="paso-3-manual" className="bg-gradient-to-br from-amber-950/40 via-slate-950 to-slate-900 border-2 border-amber-500/50 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-xl bg-amber-500 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
                    3
                  </span>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 block">
                      Corazón Operativo de la App (Color Ámbar / Naranja)
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      Cómo usar el Buscador por Palabra Clave y el Planificador de 4 Comidas
                    </h3>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleJumpToSection('planificador-comidas', () => {
                        setSelectedMealToAdd('almuerzo');
                        setPlannerKeyword('pollo');
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
                  >
                    <Search className="w-3.5 h-3.5" /> Probar búsqueda "pollo" ahora
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleJumpToSection('planificador-comidas', () => {
                        setSelectedMealToAdd('cena');
                        setPlannerKeyword('cerdo');
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs transition-all"
                  >
                    🥩 Probar búsqueda "cerdo"
                  </button>
                </div>
              </div>

              {/* Los 4 Sub-pasos de la Sección 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 3.1 */}
                <div className="bg-slate-950/90 border border-amber-500/30 rounded-xl p-4 space-y-2">
                  <span className="inline-block px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-xs">
                    Paso 3.1 • Destino
                  </span>
                  <h4 className="text-sm font-bold text-white">
                    1. Elegir Comida (1 a 4)
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    En el desplegable <strong>"1. Elegir Comida (1 a 4)"</strong> seleccioná en qué momento del día querés actuar: <strong>☀️ 1. Desayuno</strong>, <strong>🍽️ 2. Almuerzo Principal</strong>, <strong>🧉 3. Merienda</strong> o <strong>🌙 4. Cena</strong>.
                  </p>
                </div>

                {/* 3.2 */}
                <div className="bg-slate-950/90 border border-amber-500/30 rounded-xl p-4 space-y-2">
                  <span className="inline-block px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-xs">
                    Paso 3.2 • Palabra Clave
                  </span>
                  <h4 className="text-sm font-bold text-white">
                    Buscar "pollo", "cerdo", "papa"...
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Escribí en la barra de búsqueda o tocá los chips rápidos (<code>🍗 Pollo</code>, <code>🥩 Cerdo</code>, <code>🥔 Papa</code>, <code>🥚 Huevo</code>, <code>🧉 Mate</code>) y el botón <strong>🔥 Solo Air Fryer</strong>. El selector <strong>"2. Alimento Apto"</strong> se filtrará al instante.
                  </p>
                </div>

                {/* 3.3 */}
                <div className="bg-slate-950/90 border border-amber-500/30 rounded-xl p-4 space-y-2">
                  <span className="inline-block px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-xs">
                    Paso 3.3 • 3 Botones de Acción
                  </span>
                  <h4 className="text-sm font-bold text-white">
                    Sumar vs. Reemplazar vs. Plato
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Elegí si querés <strong>agregar</strong> un ítem extra, <strong>reemplazar solo la proteína principal</strong> (manteniendo tu guarnición intacta) o <strong>cargar un plato completo</strong> ya armado.
                  </p>
                </div>

                {/* 3.4 */}
                <div className="bg-slate-950/90 border border-amber-500/30 rounded-xl p-4 space-y-2">
                  <span className="inline-block px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-xs">
                    Paso 3.4 • Dentro de Cada Comida
                  </span>
                  <h4 className="text-sm font-bold text-white">
                    Buscador Local y Porciones
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Cada una de las 4 tarjetas de comida tiene su propio buscador rápido interno, botones <strong>-15% / +15%</strong> para escalar la porción y ajuste manual de gramos.
                  </p>
                </div>
              </div>

              {/* Cuadro Comparativo Visual: Diferencia entre "+ Sumar", "🔄 Reemplazar" y "Usar Plato" */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-3 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" /> Guía Visual de Botones: ¿Cuál debo tocar al buscar un alimento?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5">
                    <span className="px-2 py-1 rounded-lg bg-emerald-500 text-slate-950 font-extrabold text-[11px] shrink-0">
                      + Sumar
                    </span>
                    <div>
                      <strong className="text-emerald-300 block">Agrega un ingrediente adicional</strong>
                      <span className="text-slate-300 text-[11px]">
                        Úsalo cuando quieras sumar una guarnición, fruta o infusión sin borrar lo que ya está en esa comida (ej: sumar <em>1 Banana</em> o <em>Papas Rústicas</em>).
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-start gap-2.5">
                    <span className="px-2 py-1 rounded-lg bg-blue-500/30 text-blue-200 border border-blue-400/40 font-extrabold text-[11px] shrink-0">
                      🔄 Reemplazar
                    </span>
                    <div>
                      <strong className="text-blue-300 block">Intercambia solo el corte principal</strong>
                      <span className="text-slate-300 text-[11px]">
                        Ideal para variar el menú: si tenías <em>Suprema de Pollo con Papas</em> y tocás <strong>🔄 Reemplazar</strong> en <em>Solomillo de Cerdo</em>, cambia el pollo por cerdo y conserva tus papas y ensalada.
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5">
                    <span className="px-2 py-1 rounded-lg bg-amber-500/30 text-amber-200 border border-amber-400/40 font-extrabold text-[11px] shrink-0">
                      🍽️ Usar Plato
                    </span>
                    <div>
                      <strong className="text-amber-300 block">Renueva toda esa comida completa</strong>
                      <span className="text-slate-300 text-[11px]">
                        Carga una combinación completa (Proteína + Guarnición + Aderezo saludable) en un solo paso para esa comida.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* GRILLA DE PASOS 4 Y 5 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
              
              {/* PASO 4: VIOLETA / PÚRPURA - SEMÁFORO DE MACRONUTRIENTES Y AUTO-CALIBRACIÓN */}
              <div id="paso-4-manual" className="lg:col-span-5 bg-gradient-to-br from-purple-950/50 via-slate-950 to-slate-900 border-2 border-purple-500/40 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-lg">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-purple-500 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-purple-500/30 shrink-0">
                      4
                    </span>
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-400 block">
                        Control de Precisión (Color Violeta)
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        Semáforo de Macros y Auto-Calibración
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Después de elegir o cambiar tus platos, mirá las barras de progreso superiores. Si cambiaste varios ingredientes y las calorías quedaron por arriba o por debajo de tu meta, no hace falta hacer cuentas a mano:
                  </p>

                  <div className="space-y-2 text-xs bg-slate-950/85 p-4 rounded-xl border border-purple-500/20">
                    <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      Verde (En Rango ±110 kcal): Déficit perfecto para perder grasa.
                    </div>
                    <div className="flex items-center gap-2 text-amber-300 font-semibold">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      Ámbar (Faltan kcal): Podés sumar porción o tocar Auto-Calibrar.
                    </div>
                    <div className="flex items-center gap-2 text-rose-300 font-semibold">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                      Rojo (Exceso calórico): Reduce el ritmo de descenso semanal.
                    </div>
                    <p className="text-[11px] text-slate-300 pt-2 border-t border-slate-800">
                      💡 <strong>Botón Mágico "⚖️ Auto-Calibrar Porciones":</strong> Ajusta matemáticamente los gramos de tus carnes y guarniciones (en múltiplos prácticos de 10 g) para clavar exactamente tus <strong>{energyMetrics.targetCalories} kcal</strong> del día.
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-purple-500/20 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleJumpToSection('seccion-semaforo', handleAutoCalibrateCurrentMenu)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs shadow-md transition-all"
                  >
                    <RefreshCw className="w-4 h-4" /> Probar Auto-Calibración Ahora ({energyMetrics.targetCalories} kcal)
                  </button>
                </div>
              </div>

              {/* PASO 5: ROJO CORAL / TERRACOTA - TABLA DE COCCIÓN AIR FRYER Y 3 REGLAS DE ORO */}
              <div id="paso-5-manual" className="lg:col-span-7 bg-gradient-to-br from-rose-950/40 via-slate-950 to-slate-900 border-2 border-rose-500/40 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-lg">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-rose-500 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-rose-500/30 shrink-0">
                        5
                      </span>
                      <div>
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-400 block">
                          Ejecución Culinaria (Color Coral / Terracota)
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-white">
                          Tabla Maestra de Cocción en Air Fryer y Reglas de Oro
                        </h3>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 self-start sm:self-auto">
                      🔥 Tiempos Exactos
                    </span>
                  </div>

                  {/* Tabla de temperaturas y tiempos en Air Fryer */}
                  <div className="overflow-x-auto rounded-xl border border-rose-500/20 bg-slate-950/90">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-[11px] text-rose-300 bg-rose-500/10">
                          <th className="py-2 px-3 font-bold">Corte / Guarnición</th>
                          <th className="py-2 px-2.5 font-bold">Temp.</th>
                          <th className="py-2 px-2.5 font-bold">Tiempo</th>
                          <th className="py-2 px-3 font-bold">Secreto de Jugosidad (0% Lactosa)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/70 text-[11px]">
                        {AIR_FRYER_GUIDE_TABLE.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-900/60">
                            <td className="py-2 px-3 font-semibold text-white">{row.cut}</td>
                            <td className="py-2 px-2.5 text-amber-300 font-bold whitespace-nowrap">{row.temp}</td>
                            <td className="py-2 px-2.5 text-emerald-300 font-bold whitespace-nowrap">{row.time}</td>
                            <td className="py-2 px-3 text-slate-300">{row.action}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* 3 Reglas de Oro */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-200">
                      <strong className="block text-emerald-300">🛡️ Regla 1: 0% Lactosa</strong>
                      Cero quesos, manteca o cremas comunes. Usá palta, aceite de oliva y leches vegetales o deslactosadas.
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200">
                      <strong className="block text-amber-300">🧉 Regla 2: Sin Café</strong>
                      Energía enfocada con Mate Amargo, Mate Cocido y Té Verde con limón antes de Tenis o Gimnasio.
                    </div>
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-200">
                      <strong className="block text-cyan-300">💧 Regla 3: 0% Alcohol</strong>
                      Meta de hidratación: <strong>{(weight * 0.038).toFixed(1)} L de agua/día</strong> para oxidar grasa eficientemente.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ============================================================================
            CALCULADORA Y PLANIFICADOR INTERACTIVO COMPLETO
            Visible en modo 'app' o 'combined'
            ============================================================================ */}
        {(viewMode === 'app' || viewMode === 'combined') && (
          <>
            {/* SECCIÓN 1: TABLERO DE COMANDO ENERGÉTICO, PROYECCIÓN DE PESO Y MACROS */}
            <section
              id="seccion-semaforo"
              className={`grid grid-cols-1 lg:grid-cols-12 gap-6 transition-all duration-500 rounded-3xl ${
                highlightedSection === 'seccion-semaforo' ? 'ring-2 ring-purple-500 ring-offset-4 ring-offset-slate-950' : ''
              }`}
            >
              
              {/* Tarjeta Principal de Balance Energético y Proyección de Peso Meta */}
              <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <Zap className="w-4 h-4" /> Balance Calórico Diario
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold">
                      Déficit Activo: -{energyMetrics.actualDeficit} kcal/día
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 mb-3">
                    Modo activo: <strong className="text-slate-200">{energyMetrics.activeModeLabel}</strong> (TMB {energyMetrics.bmr} + Base + Deporte {energyMetrics.activeSportKcalForToday} kcal)
                  </p>

                  <div className="grid grid-cols-3 gap-3 my-3 text-center bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
                    <div>
                      <p className="text-xs text-slate-400">Gasto Total (TDEE)</p>
                      <p className="text-lg sm:text-xl font-bold text-slate-200 mt-0.5">{energyMetrics.tdee}</p>
                      <p className="text-[10px] text-slate-500">kcal quemadas</p>
                    </div>
                    <div className="border-x border-slate-800">
                      <p className="text-xs text-emerald-400 font-semibold">Objetivo Déficit</p>
                      <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-0.5">{energyMetrics.targetCalories}</p>
                      <p className="text-[10px] text-emerald-500/80">kcal meta hoy</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Planificado Hoy</p>
                      <p className={`text-lg sm:text-xl font-bold mt-0.5 ${
                        isCalorieOnTrack ? 'text-emerald-300' : calDiff > 110 ? 'text-rose-400' : 'text-amber-300'
                      }`}>
                        {consumedTotals.cal}
                      </p>
                      <p className="text-[10px] text-slate-500">en tus 4 comidas</p>
                    </div>
                  </div>

                  {/* Barra de progreso de Calorías */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-300 font-medium">Cuadre del Menú vs. Meta</span>
                      <span className="font-semibold text-slate-200">
                        {Math.round((consumedTotals.cal / energyMetrics.targetCalories) * 100)}% ({consumedTotals.cal} / {energyMetrics.targetCalories} kcal)
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className={`h-full transition-all duration-300 rounded-full ${
                          calDiff > 110 
                            ? 'bg-gradient-to-r from-amber-500 to-rose-500' 
                            : isCalorieOnTrack 
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                            : 'bg-gradient-to-r from-blue-500 to-emerald-400'
                        }`}
                        style={{ width: `${Math.min(100, (consumedTotals.cal / energyMetrics.targetCalories) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Panel de Proyección de Pérdida de Peso y Evolución de IMC */}
                <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <TrendingDown className="w-4 h-4 text-emerald-400" />
                      Proyección de Peso ({weight} kg → {targetWeight} kg):
                    </span>
                    <span className="font-bold text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                      -{energyMetrics.estimatedWeeklyLossKg} kg / semana
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Evolución IMC ({height} cm)</span>
                      <div className="font-bold text-slate-200 flex items-center gap-1.5 mt-0.5">
                        <span className="text-amber-400">{energyMetrics.currentBmi}</span>
                        <ArrowRight className="w-3 h-3 text-slate-500" />
                        <span className="text-emerald-400">{energyMetrics.targetBmi}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Tiempo Estimado Meta (-{energyMetrics.kgToLose} kg)</span>
                      <div className="font-bold text-white flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        {energyMetrics.weeksToGoal > 0 ? `~${energyMetrics.weeksToGoal} semanas` : '¡En peso meta!'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tarjeta de Distribución de Macronutrientes y Selector de Entreno de Hoy */}
              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                        <HeartPulse className="w-5 h-5 text-emerald-400" />
                        Macronutrientes para 88 kg en Déficit
                      </h2>
                      <p className="text-xs text-slate-400">
                        Proteína calculada sobre <strong className="text-slate-200">{energyMetrics.referenceWeightForProtein} kg</strong> ({proteinMultiplier}g/kg) para máxima saciedad y retención muscular.
                      </p>
                    </div>

                    {/* Botón de Calibración Instantánea */}
                    <button
                      onClick={handleAutoCalibrateCurrentMenu}
                      className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all shrink-0"
                      title="Ajusta automáticamente los gramos del menú actual para clavar las calorías objetivo"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> ⚖️ Auto-Calibrar Porciones ({energyMetrics.targetCalories} kcal)
                    </button>
                  </div>

                  {/* Selector de "¿Qué entrenás hoy?" */}
                  <div className="mb-4">
                    <label className="block text-[11px] text-slate-400 mb-1.5 font-medium">
                      ¿Qué entrenás hoy? (Adapta tu techo calórico y de carbohidratos del día):
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                      {[
                        { id: 'promedio', label: '📊 Promedio Semanal' },
                        { id: 'tenis', label: '🎾 Día de Tenis' },
                        { id: 'gym', label: '🏋️ Día de Gym' },
                        { id: 'taichi_ritmo_arq', label: '🏹 Tai Chi / Ritmo / Arq' },
                        { id: 'descanso', label: '🛋️ Día Descanso' }
                      ].map(mode => (
                        <button
                          key={mode.id}
                          onClick={() => setDayMode(mode.id)}
                          className={`px-2 py-1.5 rounded-lg text-[11px] font-medium transition-all text-center ${
                            dayMode === mode.id 
                              ? 'bg-emerald-500 text-slate-950 font-bold shadow' 
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                          }`}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3 Tarjetas de Macros con Barras en Tiempo Real */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-2">
                    {/* PROTEÍNAS */}
                    <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Proteínas</span>
                          <p className="text-[11px] text-slate-400">Fuerza y Saciedad</p>
                        </div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                          {Math.round((energyMetrics.targetProteinG * 4 / energyMetrics.targetCalories) * 100)}%
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1 my-2">
                        <span className="text-2xl font-extrabold text-white">{consumedTotals.p}g</span>
                        <span className="text-xs text-slate-400">/ {energyMetrics.targetProteinG}g meta</span>
                      </div>
                      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, (consumedTotals.p / energyMetrics.targetProteinG) * 100)}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-2">
                        {consumedTotals.p >= energyMetrics.targetProteinG * 0.95
                          ? '✅ Masa muscular protegida' 
                          : `Faltan ${energyMetrics.targetProteinG - consumedTotals.p}g de proteína`}
                      </p>
                    </div>

                    {/* CARBOHIDRATOS */}
                    <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Carbohidratos</span>
                          <p className="text-[11px] text-slate-400">Energía Deportiva</p>
                        </div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          {Math.round((energyMetrics.targetCarbsG * 4 / energyMetrics.targetCalories) * 100)}%
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1 my-2">
                        <span className="text-2xl font-extrabold text-white">{consumedTotals.c}g</span>
                        <span className="text-xs text-slate-400">/ {energyMetrics.targetCarbsG}g meta</span>
                      </div>
                      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, (consumedTotals.c / energyMetrics.targetCarbsG) * 100)}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-2">
                        {consumedTotals.c > energyMetrics.targetCarbsG + 20
                          ? `⚠️ +${consumedTotals.c - energyMetrics.targetCarbsG}g sobre el objetivo`
                          : `Restan ${Math.max(0, energyMetrics.targetCarbsG - consumedTotals.c)}g disponibles`}
                      </p>
                    </div>

                    {/* GRASAS SALUDABLES */}
                    <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Grasas Nobles</span>
                          <p className="text-[11px] text-slate-400">Hormonal / 0% Lactosa</p>
                        </div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          {Math.round((energyMetrics.targetFatG * 9 / energyMetrics.targetCalories) * 100)}%
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1 my-2">
                        <span className="text-2xl font-extrabold text-white">{consumedTotals.f}g</span>
                        <span className="text-xs text-slate-400">/ {energyMetrics.targetFatG}g meta</span>
                      </div>
                      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-500 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, (consumedTotals.f / energyMetrics.targetFatG) * 100)}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-2">
                        Palta, huevo, oliva y frutos secos
                      </p>
                    </div>
                  </div>
                </div>

                {/* Diagnóstico inteligente en una línea */}
                <div className={`mt-3 px-4 py-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                  isCalorieOnTrack && isProteinMet
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}>
                  <div className="flex items-center gap-2">
                    {isCalorieOnTrack && isProteinMet ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Info className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                    <span>
                      {isCalorieOnTrack && isProteinMet 
                        ? `¡Excelente! Tus 4 comidas cuadran con tu meta de ${energyMetrics.targetCalories} kcal y ${energyMetrics.targetProteinG}g de proteína.`
                        : calDiff < -110 
                        ? `Estás ${Math.abs(calDiff)} kcal por debajo de tu meta. Podés tocar "Auto-Calibrar Porciones" arriba o buscar un alimento abajo.`
                        : calDiff > 110
                        ? `Te pasaste por ${calDiff} kcal del objetivo de déficit. Tocá "Auto-Calibrar Porciones" para ajustar gramos automáticamente.`
                        : `Calorías en rango óptimo, pero te sugerimos reforzar la proteína magra (buscá "pollo", "cerdo" o "claras" abajo).`}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* SECCIÓN 2: CONFIGURACIÓN BIOMÉTRICA (88kg / 169cm) Y CRONOGRAMA DE 5 DISCIPLINAS */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Panel de Parámetros Físicos, Peso Meta y Estrategia Proteica */}
              <div
                id="seccion-biometria"
                className={`lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4 transition-all duration-500 ${
                  highlightedSection === 'seccion-biometria' ? 'ring-2 ring-indigo-500 ring-offset-4 ring-offset-slate-950' : ''
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-indigo-400" />
                    1. Datos Antropométricos y Meta
                  </h3>
                  <span className="text-xs text-emerald-400 font-semibold">IMC: {energyMetrics.currentBmi}</span>
                </div>

                {/* Peso Actual, Peso Meta, Altura y Edad */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-emerald-500/40">
                    <label className="block text-[10px] text-emerald-400 font-semibold mb-1">Peso Actual (kg)</label>
                    <input 
                      type="number" 
                      min="50" max="160" step="0.5"
                      value={weight} 
                      onChange={(e) => setWeight(parseFloat(e.target.value) || 88)}
                      className="w-full bg-transparent text-base font-extrabold text-white focus:outline-none"
                    />
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <label className="block text-[10px] text-slate-400 mb-1">Peso Meta (kg)</label>
                    <input 
                      type="number" 
                      min="55" max="120" step="0.5"
                      value={targetWeight} 
                      onChange={(e) => setTargetWeight(parseFloat(e.target.value) || 78)}
                      className="w-full bg-transparent text-base font-bold text-emerald-300 focus:outline-none"
                    />
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <label className="block text-[10px] text-slate-400 mb-1">Altura (cm)</label>
                    <input 
                      type="number" 
                      min="140" max="220"
                      value={height} 
                      onChange={(e) => setHeight(parseInt(e.target.value) || 169)}
                      className="w-full bg-transparent text-base font-bold text-white focus:outline-none"
                    />
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <label className="block text-[10px] text-slate-400 mb-1">Edad (años)</label>
                    <input 
                      type="number" 
                      min="18" max="95"
                      value={age} 
                      onChange={(e) => setAge(parseInt(e.target.value) || 59)}
                      className="w-full bg-transparent text-base font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Control deslizable de Peso Meta rápido */}
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Ajustar Peso Meta Proyectado: <strong className="text-emerald-300">{targetWeight} kg</strong> (IMC {energyMetrics.targetBmi})</span>
                    <span className="text-slate-300">Bajar {energyMetrics.kgToLose} kg</span>
                  </div>
                  <input 
                    type="range" min="68" max="86" step="0.5"
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer h-1.5"
                  />
                </div>

                {/* Nivel de Déficit Calórico (-350, -500 por defecto, -650) */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">Nivel de Déficit Diario</span>
                    <span className="text-amber-400 font-semibold">-{deficitTarget} kcal / día</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: 350, label: 'Leve (-350)', desc: ' ~0.32 kg/sem' },
                      { val: 500, label: 'Moderado (-500)', desc: ' ~0.45 kg/sem' },
                      { val: 650, label: 'Intenso (-650)', desc: ' ~0.60 kg/sem' }
                    ].map(opt => (
                      <button
                        key={opt.val}
                        onClick={() => setDeficitTarget(opt.val)}
                        className={`p-2 rounded-xl border text-left transition-all ${
                          deficitTarget === opt.val 
                            ? 'bg-emerald-500/15 border-emerald-500 text-white' 
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-xs font-bold">{opt.label}</div>
                        <div className="text-[10px] opacity-80 mt-0.5">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cálculo Inteligente de Proteínas para 88 kg */}
                <div className="pt-1">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">Cálculo Inteligente de Proteínas</span>
                    <span className="text-blue-400 font-bold">{energyMetrics.targetProteinG}g / día</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setProteinBasis('target_weight')}
                      className={`p-2 rounded-xl border text-left text-[11px] transition-all ${
                        proteinBasis === 'target_weight'
                          ? 'bg-blue-500/15 border-blue-500 text-blue-200 font-semibold'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div>Sobre Peso Meta ({targetWeight} kg)</div>
                      <div className="text-[10px] opacity-80">Óptimo (~{Math.round(targetWeight * proteinMultiplier)}g) sin exceder kcal</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setProteinBasis('total_weight')}
                      className={`p-2 rounded-xl border text-left text-[11px] transition-all ${
                        proteinBasis === 'total_weight'
                          ? 'bg-blue-500/15 border-blue-500 text-blue-200 font-semibold'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div>Sobre Peso Total ({weight} kg)</div>
                      <div className="text-[10px] opacity-80">Alta exigencia (~{Math.round(weight * proteinMultiplier)}g)</div>
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="range" min="1.7" max="2.2" step="0.1"
                      value={proteinMultiplier}
                      onChange={(e) => setProteinMultiplier(parseFloat(e.target.value))}
                      className="flex-1 accent-blue-500 cursor-pointer h-1.5"
                    />
                    <span className="text-xs font-bold text-blue-300 min-w-[55px] text-right">{proteinMultiplier} g/kg</span>
                  </div>
                </div>
              </div>

              {/* Panel de Disciplinas Semanales Preconfiguradas (Gasto Exacto para 88 kg) */}
              <div
                id="seccion-deportes"
                className={`lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between transition-all duration-500 ${
                  highlightedSection === 'seccion-deportes' ? 'ring-2 ring-emerald-500 ring-offset-4 ring-offset-slate-950' : ''
                }`}
              >
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-400" />
                        2. Gasto Deportivo Semanal Exacto (Base {weight} kg)
                      </h3>
                      <p className="text-xs text-slate-400">
                        Gimnasio (2x), Tenis (1.5x), Tai Chi (1x), Ritmo (1x) y Arquería (1x) = 6.5 sesiones semanales.
                      </p>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-right shrink-0">
                      <span className="block text-[10px] text-emerald-300 uppercase">Promedio Diario Deporte</span>
                      <span className="text-sm font-extrabold text-emerald-400">+{energyMetrics.avgDailySportKcal} kcal / día</span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {energyMetrics.activitiesBreakdown.map((act) => (
                      <div 
                        key={act.id} 
                        className={`p-3 rounded-xl border ${act.border} ${act.bg} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-slate-950/80 ${act.color}`}>
                            {renderActivityIcon(act.icon, "w-5 h-5")}
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-white">{act.name}</h4>
                            <p className="text-[11px] text-slate-400">
                              {act.met} METs a {weight} kg • <span className="text-slate-200 font-semibold">{act.kcalPerSession} kcal</span> por sesión
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-center">
                          <div className="bg-slate-950/90 px-2.5 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1.5">
                            <input 
                              type="number" 
                              min="0" max="10" step="0.5"
                              value={act.freqPerWeek}
                              onChange={(e) => handleActivityChange(act.id, 'freqPerWeek', e.target.value)}
                              className="w-10 bg-transparent text-xs font-bold text-center text-white focus:outline-none"
                            />
                            <span className="text-[11px] text-slate-400">veces/sem</span>
                          </div>

                          <div className="bg-slate-950/90 px-2.5 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1.5">
                            <input 
                              type="number" 
                              min="15" max="240" step="5"
                              value={act.durationMin}
                              onChange={(e) => handleActivityChange(act.id, 'durationMin', e.target.value)}
                              className="w-11 bg-transparent text-xs font-bold text-center text-white focus:outline-none"
                            />
                            <span className="text-[11px] text-slate-400">min</span>
                          </div>

                          <div className="text-right min-w-[75px]">
                            <span className={`text-xs font-bold ${act.color}`}>{act.kcalPerWeek} kcal</span>
                            <span className="block text-[10px] text-slate-400">semanales</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                  <span>Quema deportiva semanal: <strong className="text-white">{energyMetrics.totalWeeklySportKcal} kcal/semana</strong></span>
                  <span>Hidratación recomendada ({weight} kg): <strong className="text-cyan-300">{(weight * 0.038).toFixed(1)} Litros de agua/día</strong> + Mate</span>
                </div>
              </div>
            </section>

            {/* ============================================================================
                SECCIÓN 3: PLANIFICADOR INTERACTIVO DE 4 COMIDAS DIARIAS CON BUSCADOR INTEGRADO
                ============================================================================ */}
            <section
              id="planificador-comidas"
              className={`space-y-6 transition-all duration-500 rounded-3xl ${
                highlightedSection === 'planificador-comidas' ? 'ring-2 ring-amber-500 ring-offset-4 ring-offset-slate-950' : ''
              }`}
            >
              
              {/* PANEL CENTRAL DE LA SECCIÓN 3: PLANTILLAS + BUSCADOR POR PALABRA CLAVE + SELECTOR */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
                
                {/* Encabezado de Sección 3 y Plantillas de Día Completo */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                      <Utensils className="w-5 h-5 text-emerald-400" />
                      3. Planificador de 4 Comidas Diarias (Calibrado para {weight} kg)
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Buscá alimentos o platos por palabra clave (ej: <strong className="text-emerald-300">pollo</strong>, <strong className="text-emerald-300">cerdo</strong>, <strong className="text-emerald-300">papa</strong>, <strong className="text-emerald-300">huevo</strong>, <strong className="text-emerald-300">mate</strong>), reemplazá la proteína con 1 clic o sumá al menú.
                    </p>
                  </div>

                  {/* Botones de Plantillas Automáticas */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Cargar Menú Completo:
                    </span>
                    <button
                      onClick={() => handleLoadPreset('promedio')}
                      className="px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all"
                    >
                      ⚡ Día Equilibrado (Air Fryer)
                    </button>
                    <button
                      onClick={() => handleLoadPreset('alto_gasto')}
                      className="px-3 py-2 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 text-xs font-semibold transition-all"
                    >
                      🎾 Día de Tenis / Gym
                    </button>
                    <button
                      onClick={() => handleLoadPreset('descanso_moderado')}
                      className="px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all"
                    >
                      🏹 Día Tai Chi / Arquería (Low-Carb)
                    </button>
                  </div>
                </div>

                {/* Notificación flotante de acción en el Planificador */}
                {actionFeedback && (
                  <div className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between animate-pulse">
                    <span>{actionFeedback}</span>
                    <button onClick={() => setActionFeedback(null)} className="text-emerald-300 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* BLOQUE DE BÚSQUEDA POR PALABRA CLAVE + SELECTOR 1, 2 Y 3 INTEGRADO EN SECCIÓN 3 */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
                  
                  {/* Fila Superior: Barra de Búsqueda por Palabra Clave + Chips Rápidos + Filtro Air Fryer */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={plannerKeyword}
                        onChange={(e) => setPlannerKeyword(e.target.value)}
                        placeholder="🔍 Buscar alimento o plato por palabra clave (ej: pollo, cerdo, papa, huevo, mate)..."
                        className="w-full bg-slate-900 border border-emerald-500/40 focus:border-emerald-400 rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none shadow-inner"
                      />
                      {plannerKeyword && (
                        <button
                          type="button"
                          onClick={() => setPlannerKeyword('')}
                          title="Limpiar búsqueda"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Chips Rápidos de Palabra Clave con 1 Clic */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] text-slate-400 mr-1">Filtro rápido:</span>
                      {QUICK_KEYWORD_CHIPS.map(chip => {
                        const isActive = normalizeText(plannerKeyword) === chip.query;
                        return (
                          <button
                            key={chip.query}
                            type="button"
                            onClick={() => setPlannerKeyword(isActive ? '' : chip.query)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                              isActive
                                ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow'
                                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                            }`}
                          >
                            {chip.label}
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => setOnlyAirFryerFilter(!onlyAirFryerFilter)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 border transition-all ${
                          onlyAirFryerFilter 
                            ? 'bg-rose-500/20 border-rose-500 text-rose-300' 
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Flame className="w-3 h-3" /> Solo Air Fryer
                      </button>
                    </div>
                  </div>

                  {/* Fila Principal: 1. Elegir Comida (1 a 4) | 2. Alimento Apto (Filtrado por palabra clave) | 3. Cantidad y Botones */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end pt-1">
                    <div className="md:col-span-3">
                      <label className="block text-xs text-slate-300 mb-1.5 font-semibold">
                        1. Elegir Comida (1 a 4)
                      </label>
                      <select
                        value={selectedMealToAdd}
                        onChange={(e) => setSelectedMealToAdd(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-medium text-white focus:outline-none focus:border-emerald-500"
                      >
                        {MEAL_SECTIONS.map(m => (
                          <option key={m.id} value={m.id}>{m.icon} {m.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-5">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs text-slate-300 font-semibold">
                          2. Alimento Apto (0% Lactosa / Sin Café)
                        </label>
                        <span className="text-[11px] text-emerald-400 font-medium">
                          {filteredFoodsForSelector.length} {filteredFoodsForSelector.length === 1 ? 'opción encontrada' : 'opciones disponibles'}
                        </span>
                      </div>
                      <select
                        value={selectedFoodIdToAdd}
                        onChange={(e) => setSelectedFoodIdToAdd(e.target.value)}
                        disabled={filteredFoodsForSelector.length === 0}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-medium text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                      >
                        {filteredFoodsForSelector.length === 0 ? (
                          <option value="">Sin resultados para "{plannerKeyword}"</option>
                        ) : (
                          filteredFoodsForSelector.map(f => (
                            <option key={f.id} value={f.id}>
                              {f.airFryer ? '🔥 ' : ''}{f.name} ({f.cal} kcal / {f.baseAmount} {f.unit})
                            </option>
                          ))
                        )}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs text-slate-300 mb-1.5 font-semibold">
                        3. Cantidad ({currentlySelectedFoodObj?.unit || 'g'})
                      </label>
                      <input
                        type="number"
                        min="0.5"
                        step="any"
                        value={customAmountToAdd}
                        onChange={(e) => setCustomAmountToAdd(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="md:col-span-2 flex gap-1.5">
                      <button
                        onClick={() => handleAddFoodToMeal()}
                        disabled={filteredFoodsForSelector.length === 0}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-xs py-2.5 px-2.5 rounded-xl flex items-center justify-center gap-1 shadow-lg shadow-emerald-500/10 transition-all"
                        title="Sumar este alimento a la comida elegida"
                      >
                        <Plus className="w-4 h-4 stroke-[2.5]" /> Sumar
                      </button>
                      <button
                        onClick={() => handleReplaceMainInMeal(selectedMealToAdd, selectedFoodIdToAdd, customAmountToAdd)}
                        disabled={filteredFoodsForSelector.length === 0}
                        className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 font-semibold text-xs py-2.5 px-2.5 rounded-xl flex items-center justify-center transition-all"
                        title="Reemplazar el corte/alimento de la misma categoría en la comida elegida"
                      >
                        <Replace className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowCustomFoodModal(true)}
                        title="Crear alimento personalizado"
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-2.5 rounded-xl border border-slate-700 transition-all"
                      >
                        <PlusCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Ficha Técnica Instantánea del Alimento Seleccionado (Especial Air Fryer) */}
                  {currentlySelectedFoodObj && (
                    <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl px-3.5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-emerald-300">{currentlySelectedFoodObj.name}:</span>
                        <span className="text-slate-300">
                          {Math.round(currentlySelectedFoodObj.cal * (customAmountToAdd / currentlySelectedFoodObj.baseAmount))} kcal
                        </span>
                        <span className="text-blue-400 font-medium">
                          • Prot: {(currentlySelectedFoodObj.p * (customAmountToAdd / currentlySelectedFoodObj.baseAmount)).toFixed(1)}g
                        </span>
                        <span className="text-emerald-400 font-medium">
                          • Carbs: {(currentlySelectedFoodObj.c * (customAmountToAdd / currentlySelectedFoodObj.baseAmount)).toFixed(1)}g
                        </span>
                        <span className="text-amber-400 font-medium">
                          • Grasas: {(currentlySelectedFoodObj.f * (customAmountToAdd / currentlySelectedFoodObj.baseAmount)).toFixed(1)}g
                        </span>
                      </div>
                      {currentlySelectedFoodObj.airFryerTip && (
                        <div className="text-[11px] text-rose-300 flex items-center gap-1.5">
                          <ChefHat className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                          <span><strong>Tip Air Fryer:</strong> {currentlySelectedFoodObj.airFryerTip}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* PANEL DESPLEGABLE DE RESULTADOS EN VIVO CUANDO EL USUARIO ESCRIBE UNA PALABRA CLAVE (ej: "pollo") */}
                  {plannerKeyword.trim() !== '' && (
                    <div className="pt-3 border-t border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                          <Search className="w-3.5 h-3.5" />
                          Resultados rápidos para "{plannerKeyword}" (Destino activo: {MEAL_SECTIONS.find(m => m.id === selectedMealToAdd)?.icon} {MEAL_SECTIONS.find(m => m.id === selectedMealToAdd)?.shortLabel})
                        </span>
                        <button
                          onClick={() => setPlannerKeyword('')}
                          className="text-[11px] text-slate-400 hover:text-white underline"
                        >
                          Cerrar resultados
                        </button>
                      </div>

                      {/* Tarjetas de Alimentos Individuales encontrados */}
                      {filteredFoodsForSelector.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                          {filteredFoodsForSelector.map(food => (
                            <div
                              key={food.id}
                              className={`p-3 rounded-xl border transition-all flex flex-col justify-between gap-2 ${
                                selectedFoodIdToAdd === food.id
                                  ? 'bg-emerald-500/10 border-emerald-500/50'
                                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              <div>
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="text-xs font-bold text-white leading-snug">{food.name}</h4>
                                  {food.airFryer && (
                                    <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                      🔥 Air Fryer
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-400 mt-1">
                                  Porción base: <strong className="text-slate-200">{food.baseAmount} {food.unit}</strong> ({food.cal} kcal • P:{food.p}g • C:{food.c}g • G:{food.f}g)
                                </p>
                                {food.airFryerTip && (
                                  <p className="text-[10px] text-rose-300/90 mt-1 bg-rose-500/10 px-2 py-1 rounded border border-rose-500/20">
                                    🔥 {food.airFryerTip}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-1.5 pt-1">
                                <button
                                  type="button"
                                  onClick={() => handleAddFoodToMeal(selectedMealToAdd, food.id, food.baseAmount)}
                                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-all"
                                >
                                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" /> Sumar a {MEAL_SECTIONS.find(m => m.id === selectedMealToAdd)?.shortLabel}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleReplaceMainInMeal(selectedMealToAdd, food.id, food.baseAmount)}
                                  className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 font-semibold text-[11px] py-1.5 px-2.5 rounded-lg flex items-center justify-center gap-1 transition-all"
                                  title="Reemplaza el ingrediente de la misma categoría en esta comida"
                                >
                                  <Replace className="w-3 h-3" /> Reemplazar Proteína
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 py-3 text-center bg-slate-900 rounded-xl border border-slate-800">
                          No encontramos alimentos con "{plannerKeyword}". Podés crearlo con el botón <strong>+</strong> o probar otra palabra.
                        </div>
                      )}

                      {/* Platos Completos Armados que contienen la palabra clave */}
                      {matchingCompleteDishesInPlanner.length > 0 && (
                        <div className="pt-2">
                          <span className="block text-[11px] font-semibold text-slate-400 mb-2">
                            🍽️ Platos completos armados que incluyen "{plannerKeyword}":
                          </span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {matchingCompleteDishesInPlanner.map((dish, idx) => (
                              <div
                                key={idx}
                                className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between gap-2"
                              >
                                <div className="text-xs">
                                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300 mr-1.5">
                                    {dish.mealIcon} {dish.mealLabel}
                                  </span>
                                  <span className="text-slate-200 font-medium">{dish.label}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleSwapSingleMeal(dish.mealId, dish.items, dish.label)}
                                  className="shrink-0 px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold transition-all"
                                >
                                  Usar Plato en {dish.mealLabel}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* GRILLA SIMÉTRICA 2x2 DE LAS 4 COMIDAS DIARIAS (Cada una con su propio buscador rápido integrado) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MEAL_SECTIONS.map((section) => {
                  const sectionItems = consumedTotals.enrichedItems.filter(item => item.meal === section.id);
                  const sectionCal = consumedTotals.byMeal[section.id] || 0;
                  const sectionP = Math.round(sectionItems.reduce((a, b) => a + b.itemP, 0));
                  const sectionC = Math.round(sectionItems.reduce((a, b) => a + b.itemC, 0));
                  const sectionF = Math.round(sectionItems.reduce((a, b) => a + b.itemF, 0));
                  const swapOptions = QUICK_SWAPS_BY_MEAL[section.id] || [];

                  // Búsqueda local dentro de esta tarjeta de comida
                  const cardQuery = normalizeText((mealCardSearch[section.id] || '').trim());
                  const cardMatchedFoods = cardQuery
                    ? foodDb.filter(f => {
                        const hay = normalizeText(`${f.name} ${f.tag || ''} ${f.keywords || ''}`);
                        return hay.includes(cardQuery);
                      }).slice(0, 6)
                    : [];
                  const cardMatchedSwaps = cardQuery
                    ? swapOptions.filter(opt =>
                        normalizeText(`${opt.label} ${opt.keywords || ''}`).includes(cardQuery)
                      )
                    : [];

                  return (
                    <div 
                      key={section.id} 
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between"
                    >
                      <div>
                        {/* Cabecera de la Comida */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl">{section.icon}</span>
                            <div>
                              <h3 className="text-sm sm:text-base font-bold text-white">{section.label}</h3>
                              <span className="text-[11px] text-slate-400">{section.time}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs">
                            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 font-medium">P: {sectionP}g</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-medium">C: {sectionC}g</span>
                            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-medium">G: {sectionF}g</span>
                            <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 font-bold text-white">
                              {sectionCal} kcal
                            </span>
                          </div>
                        </div>

                        {/* BUSCADOR INTEGRADO DENTRO DE LA TARJETA DE ESTA COMIDA + SELECTOR DE PLATO */}
                        <div className="space-y-2 mb-3 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/90">
                          {/* Buscador directo por palabra clave para esta comida */}
                          <div className="relative">
                            <Search className="w-3.5 h-3.5 text-emerald-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              value={mealCardSearch[section.id] || ''}
                              onChange={(e) =>
                                setMealCardSearch(prev => ({ ...prev, [section.id]: e.target.value }))
                              }
                              placeholder={`Buscar en ${section.shortLabel} por palabra clave (ej: pollo, cerdo, huevo)...`}
                              className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-lg pl-8 pr-7 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                            />
                            {mealCardSearch[section.id] && (
                              <button
                                type="button"
                                onClick={() =>
                                  setMealCardSearch(prev => ({ ...prev, [section.id]: '' }))
                                }
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          {/* Resultados instantáneos dentro de la tarjeta cuando escribe (ej: "pollo") */}
                          {cardQuery !== '' && (
                            <div className="bg-slate-900 border border-emerald-500/30 rounded-lg p-2 space-y-1.5">
                              <div className="flex items-center justify-between text-[10px] text-emerald-300 font-semibold px-1">
                                <span>Coincidencias para "{mealCardSearch[section.id]}" en {section.shortLabel}:</span>
                                <button
                                  type="button"
                                  onClick={() => setMealCardSearch(prev => ({ ...prev, [section.id]: '' }))}
                                  className="text-slate-400 hover:text-white"
                                >
                                  Cerrar
                                </button>
                              </div>

                              {/* Si hay platos completos que coinciden */}
                              {cardMatchedSwaps.map((opt, i) => (
                                <div
                                  key={`swap-${i}`}
                                  className="flex items-center justify-between gap-2 bg-slate-950/90 px-2.5 py-1.5 rounded-lg border border-slate-800 text-[11px]"
                                >
                                  <span className="text-emerald-200 font-medium">🍽️ {opt.label}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleSwapSingleMeal(section.id, opt.items, opt.label);
                                      setMealCardSearch(prev => ({ ...prev, [section.id]: '' }));
                                    }}
                                    className="shrink-0 px-2 py-1 rounded bg-emerald-500 text-slate-950 font-bold text-[10px]"
                                  >
                                    Usar Plato
                                  </button>
                                </div>
                              ))}

                              {/* Alimentos individuales que coinciden */}
                              {cardMatchedFoods.map(food => (
                                <div
                                  key={food.id}
                                  className="flex items-center justify-between gap-2 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800/80 text-[11px]"
                                >
                                  <div>
                                    <span className="font-semibold text-white">
                                      {food.airFryer ? '🔥 ' : ''}{food.name}
                                    </span>
                                    <span className="text-[10px] text-slate-400 block">
                                      {food.baseAmount} {food.unit} • {food.cal} kcal (P:{food.p}g)
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        handleAddFoodToMeal(section.id, food.id, food.baseAmount);
                                        setMealCardSearch(prev => ({ ...prev, [section.id]: '' }));
                                      }}
                                      className="px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-semibold text-[10px]"
                                    >
                                      + Sumar
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        handleReplaceMainInMeal(section.id, food.id, food.baseAmount);
                                        setMealCardSearch(prev => ({ ...prev, [section.id]: '' }));
                                      }}
                                      className="px-2 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 font-semibold text-[10px]"
                                      title="Reemplazar corte o ingrediente de la misma categoría"
                                    >
                                      🔄 Reemplazar Proteína
                                    </button>
                                  </div>
                                </div>
                              ))}

                              {cardMatchedSwaps.length === 0 && cardMatchedFoods.length === 0 && (
                                <div className="text-[11px] text-slate-400 py-1.5 px-2">
                                  Sin resultados para "{mealCardSearch[section.id]}".
                                </div>
                              )}
                            </div>
                          )}

                          {/* Selector de Intercambio Rápido de Plato y Multiplicador de Porción */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                            <div className="flex items-center gap-1.5 flex-1 min-w-[180px]">
                              <Repeat className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <select
                                onChange={(e) => {
                                  const idx = parseInt(e.target.value);
                                  if (!isNaN(idx) && swapOptions[idx]) {
                                    handleSwapSingleMeal(section.id, swapOptions[idx].items, swapOptions[idx].label);
                                  }
                                  e.target.value = "";
                                }}
                                defaultValue=""
                                className="w-full bg-transparent text-[11px] text-slate-300 focus:outline-none cursor-pointer"
                              >
                                <option value="" disabled className="bg-slate-900">
                                  Cambiar plato completo de {section.shortLabel}...
                                </option>
                                {swapOptions.map((opt, i) => (
                                  <option key={i} value={i} className="bg-slate-900 text-slate-200">
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="flex items-center gap-1 text-[10px]">
                              <span className="text-slate-500 mr-1">Porción:</span>
                              <button
                                onClick={() => handleScaleSingleMeal(section.id, 0.85)}
                                className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                                title="Reducir porción un 15%"
                              >
                                -15%
                              </button>
                              <button
                                onClick={() => handleScaleSingleMeal(section.id, 1.15)}
                                className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                                title="Aumentar porción un 15%"
                              >
                                +15%
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Lista de Alimentos de esa Comida */}
                        {sectionItems.length === 0 ? (
                          <div className="py-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                            Sin alimentos asignados. Buscá por palabra clave arriba (ej: "pollo") o elegí un plato.
                          </div>
                        ) : (
                          <div className="space-y-2.5">
                            {sectionItems.map((entry) => (
                              <div 
                                key={entry.uid}
                                className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-all"
                              >
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs sm:text-sm font-semibold text-slate-100">
                                      {entry.food.name}
                                    </span>
                                    {entry.food.airFryer && (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-rose-500/15 text-rose-300 border border-rose-500/30">
                                        <Flame className="w-2.5 h-2.5" /> {entry.food.tag}
                                      </span>
                                    )}
                                    {!entry.food.airFryer && entry.food.tag && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300">
                                        {entry.food.tag}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-slate-400 flex items-center gap-3">
                                    <span className="text-blue-400">Prot: {entry.itemP}g</span>
                                    <span className="text-emerald-400">Carbs: {entry.itemC}g</span>
                                    <span className="text-amber-400">Grasas: {entry.itemF}g</span>
                                  </div>
                                  {entry.food.airFryerTip && (
                                    <p className="text-[10px] text-rose-300/80 pt-0.5">
                                      🔥 {entry.food.airFryerTip}
                                    </p>
                                  )}
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-3">
                                  {/* Input interactivo de cantidad */}
                                  <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1">
                                    <input
                                      type="number"
                                      min="0"
                                      step={entry.food.unit.includes('g') || entry.food.unit.includes('ml') ? "10" : "0.5"}
                                      value={entry.amount}
                                      onChange={(e) => handleUpdateAmount(entry.uid, e.target.value)}
                                      className="w-14 bg-transparent text-xs font-bold text-center text-white focus:outline-none"
                                    />
                                    <span className="text-[10px] text-slate-400">{entry.food.unit}</span>
                                  </div>

                                  <span className="text-xs font-bold text-slate-200 min-w-[60px] text-right">
                                    {entry.itemCal} kcal
                                  </span>

                                  <button
                                    onClick={() => handleRemoveItem(entry.uid)}
                                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                                    title="Quitar alimento"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Botón rápido para enfocar el buscador de esta comida */}
                      <div className="mt-4 pt-2 flex justify-between items-center text-[11px]">
                        <span className="text-slate-500">
                          100% libre de lactosa y sin café
                        </span>
                        <button
                          onClick={() => {
                            setSelectedMealToAdd(section.id);
                            const el = document.getElementById('planificador-comidas');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
                        >
                          + Usar buscador general para {section.shortLabel}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}

        {/* MODAL PARA AGREGAR ALIMENTO PERSONALIZADO */}
        {showCustomFoodModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">Crear Alimento Personalizado (Apto)</h3>
                <button 
                  onClick={() => setShowCustomFoodModal(false)}
                  className="text-slate-400 hover:text-white text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateCustomFood} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">Nombre del Alimento o Corte</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ej: Pollo al Limón en Tiras"
                    value={newCustomFood.name}
                    onChange={(e) => setNewCustomFood({...newCustomFood, name: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1">Porción de Referencia</label>
                    <input 
                      type="number" 
                      required
                      value={newCustomFood.baseAmount}
                      onChange={(e) => setNewCustomFood({...newCustomFood, baseAmount: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Unidad (g, ml, unid)</label>
                    <input 
                      type="text" 
                      required
                      value={newCustomFood.unit}
                      onChange={(e) => setNewCustomFood({...newCustomFood, unit: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-slate-400 mb-1">Kcal</label>
                    <input 
                      type="number" required
                      value={newCustomFood.cal}
                      onChange={(e) => setNewCustomFood({...newCustomFood, cal: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-blue-400 mb-1">Prot (g)</label>
                    <input 
                      type="number" step="0.1" required
                      value={newCustomFood.p}
                      onChange={(e) => setNewCustomFood({...newCustomFood, p: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-emerald-400 mb-1">Carbs (g)</label>
                    <input 
                      type="number" step="0.1" required
                      value={newCustomFood.c}
                      onChange={(e) => setNewCustomFood({...newCustomFood, c: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-amber-400 mb-1">Grasa (g)</label>
                    <input 
                      type="number" step="0.1" required
                      value={newCustomFood.f}
                      onChange={(e) => setNewCustomFood({...newCustomFood, f: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-white"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 pt-2 cursor-pointer text-slate-300">
                  <input 
                    type="checkbox"
                    checked={newCustomFood.airFryer}
                    onChange={(e) => setNewCustomFood({...newCustomFood, airFryer: e.target.checked})}
                    className="rounded accent-emerald-500"
                  />
                  <span>Ideal para cocción en Freidora de Aire (Air Fryer)</span>
                </label>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCustomFoodModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold"
                  >
                    Guardar Alimento
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}