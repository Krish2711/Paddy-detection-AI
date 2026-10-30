import { DiseaseDetail } from '../types';

export const DISEASE_DATA: Record<string, DiseaseDetail> = {
  Bacterialblight: {
    id: 'Bacterialblight',
    name: 'Bacterial Leaf Blight',
    scientificName: 'Xanthomonas oryzae pv. oryzae',
    category: 'Bacterial Infection',
    severity: 'Severe',
    color: '#ef4444', // Red
    symptoms: [
      'Water-soaked lesions on leaf margins near tip.',
      'Lesions enlarge and turn wavy yellow-to-white strips along leaf veins.',
      'Bacterial ooze droplets (milky dew drops) on young lesions in morning.',
      'Leaves eventually dry up, wilt, and turn grayish-white (Kresek phase in seedlings).'
    ],
    environmentalFactors: [
      'High relative humidity (80–100%) and warm temperatures (25–34°C).',
      'Heavy rain, strong winds, or flood irrigation favoring bacterial spread.',
      'Excessive nitrogen fertilizer application without balanced potassium.'
    ],
    prevention: [
      'Use certified disease-resistant paddy varieties (e.g., IR64, Swarna Sub1).',
      'Ensure balanced fertilization; avoid excess nitrogen top-dressing.',
      'Practice crop rotation and field sanitation by destroying infected stubble.',
      'Avoid deep standing water during early tillering stage.'
    ],
    management: [
      'Spray Copper Hydroxide (2g/L) or Streptocycline (0.1g/L) at early symptom onset.',
      'Apply potassium fertilizers to enhance crop systemic resistance.',
      'Drain standing water from infected field for 3-4 days to arrest bacterial multiplication.'
    ],
    whenToSeekExpert: 'If more than 15% of plants show Kresek (seedling wilting) or leaf margin necrosis across entire field.'
  },

  Blast: {
    id: 'Blast',
    name: 'Rice Blast Disease',
    scientificName: 'Magnaporthe oryzae (Pyricularia oryzae)',
    category: 'Fungal Infection',
    severity: 'Severe',
    color: '#f97316', // Orange
    symptoms: [
      'Spindle-shaped or diamond-shaped lesions with grayish-white center and reddish-brown margin.',
      'Lesions enlarge and coalesce, causing entire leaf blade to wither.',
      'Node blast causing stem collapse and dark brown girdling.',
      'Neck blast causing broken panicles and empty spikelets (chaffy grain).'
    ],
    environmentalFactors: [
      'Cool night temperatures (17–22°C) combined with high relative humidity (>90%).',
      'Long leaf wetness duration (dew drops lasting >10 hours).',
      'High plant density and excessive nitrogen application.'
    ],
    prevention: [
      'Plant resistant rice cultivars recommended by local agricultural research stations.',
      'Treat seeds with Tricyclazole 75% WP (2g/kg seed) prior to sowing.',
      'Avoid late night irrigation to reduce leaf wetness duration.',
      'Maintain proper plant spacing for sunlight penetration and airflow.'
    ],
    management: [
      'Foliar spray of Tricyclazole 75% WP (0.6 g/L) or Isoprothiolane (1.5 ml/L).',
      'Repeat spray at boot-leaf stage if neck blast conditions persist.',
      'Split nitrogen fertilizer application into 3-4 smaller doses.'
    ],
    whenToSeekExpert: 'If spindle lesions cover >10% of flag leaf area before panicle emergence.'
  },

  Brownspot: {
    id: 'Brownspot',
    name: 'Brown Spot Disease',
    scientificName: 'Bipolaris oryzae (Cochliobolus miyabeanus)',
    category: 'Fungal Infection',
    severity: 'Moderate',
    color: '#eab308', // Amber/Yellow
    symptoms: [
      'Small oval or round brown spots with yellow halo on leaves.',
      'Fully developed spots have light brown to gray center with dark reddish-brown margin.',
      'Infected seeds display dark brown discolored spots on glumes.',
      'Weakens seedlings and causes poor seedling vigor and lower grain weight.'
    ],
    environmentalFactors: [
      'Nutrient-deficient, unfertile, or sandy soils lacking potassium and manganese.',
      'Drought stress or poor water management.',
      'Moderate temperatures (25–30°C) with high relative humidity.'
    ],
    prevention: [
      'Soil testing and adequate application of potassium, phosphorus, and organic manure.',
      'Soak seeds in Carbendazim solution (2g/L) for 12 hours before sowing.',
      'Maintain adequate soil moisture during tillering and flowering stages.',
      'Use healthy, disinfected seed lots.'
    ],
    management: [
      'Apply foliar spray of Mancozeb 75% WP (2.5 g/L) or Propiconazole 25% EC (1 ml/L).',
      'Top-dress with Potash (MOP) to improve plant vigor and cell wall strength.',
      'Ensure balanced irrigation to prevent soil drying out.'
    ],
    whenToSeekExpert: 'If brown spot lesions cover >25% of leaf surface during grain filling.'
  },

  Tungro: {
    id: 'Tungro',
    name: 'Rice Tungro Disease',
    scientificName: 'Rice Tungro Spherical Virus (RTSV) & Bacilliform Virus (RTBV)',
    category: 'Viral Infection (Vector-borne)',
    severity: 'High',
    color: '#a855f7', // Purple
    symptoms: [
      'Stunting of plant growth and reduced tillering.',
      'Leaves turn yellow to orange-yellow starting from tip extending downwards.',
      'Young leaves show rust-colored mottling or speckling along leaf blade.',
      'Delayed flowering, incomplete panicle emergence, and sterile grains.'
    ],
    environmentalFactors: [
      'High population density of Green Leafhopper (GLH - Nephotettix virescens) vectors.',
      'Continuous staggered rice cropping without fallow period.',
      'Presence of infected volunteer rice plants or weed hosts nearby.'
    ],
    prevention: [
      'Practice synchronized planting within a community to break vector life cycle.',
      'Plant GLH-resistant cultivars (e.g., IR36, IR64, Rajendra Sweta).',
      'Monitor Green Leafhopper population using light traps or sweep nets.',
      'Maintain a 1-month crop-free fallow period between cropping seasons.'
    ],
    management: [
      'Rogue (pull out) and destroy infected yellow/orange stunted plants immediately.',
      'Apply systemic insecticide (e.g., Imidacloprid 17.8% SL @ 0.5 ml/L or Thiamethoxam 25% WG) to control GLH vector.',
      'Foliar spray of micronutrient mixture to help surviving plants recover.'
    ],
    whenToSeekExpert: 'Immediate notification to local extension office if orange leaf stunting spreads rapidly across adjacent plots.'
  }
};
