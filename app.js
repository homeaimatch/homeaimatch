const { useState, useEffect, useRef } = React;

/* ═══════ LANGUAGE / i18n ═══════ */
var _initLang = new URLSearchParams(window.location.search).get('lang') || 'en';
var OPT_PT = {"Cork, Ireland":"Cork, Irlanda","Silver Coast, Portugal":"Costa de Prata, Portugal","Primary home":"Residência principal","Holiday home":"Casa de férias","Investment property":"Investimento","Relocation from abroad":"Mudança do estrangeiro","Pre-approved mortgage":"Crédito pré-aprovado","Will need a mortgage":"Vou precisar de crédito","Cash buyer — no mortgage needed":"Compro a pronto","Not sure yet":"Ainda não sei","Ready to buy now":"Pronto para comprar","Actively searching":"À procura ativa","Just exploring":"Só a explorar","Within 3 months":"Dentro de 3 meses","3-6 months":"3-6 meses","6-12 months":"6-12 meses","No rush":"Sem pressa","Within 10 km":"Até 10 km","Within 25 km":"Até 25 km","Within 50 km":"Até 50 km","Anywhere in the region":"Qualquer lugar na região","Fully remote":"Totalmente remoto","Hybrid (2-3 days office)":"Híbrido (2-3 dias escritório)","Full-time in office":"Tempo inteiro no escritório","Retired / not working":"Reformado / sem trabalho","City centre":"Centro da cidade","Tech hub / business park":"Parque tecnológico","Airport area":"Zona do aeroporto","Multiple locations":"Vários locais","Under 15 min":"Menos de 15 min","Under 30 min":"Menos de 30 min","Under 45 min":"Menos de 45 min","Don't mind":"Tanto faz","City buzz — walkable & alive":"Cidade vibrante","Suburban — space with access":"Suburbano","Countryside — nature & peace":"Campo","Flexible — wherever suits":"Flexível","Just me":"Só eu","Me and a partner":"Eu e parceiro/a","Small family (1-2 kids)":"Família pequena (1-2 filhos)","Larger family (3+ kids)":"Família maior (3+ filhos)","Housemates":"Colegas de casa","Under €200K":"Até €200K","€200K – €400K":"€200K – €400K","€400K – €600K":"€400K – €600K","€600K – €800K":"€600K – €800K","€800K+":"€800K+","Move-in ready only":"Pronto a habitar","Light cosmetic work ok":"Pequenas obras ok","Big project — bring it on!":"Grande projeto — aceito!","Don't care":"Não me importo","Family-friendly":"Familiar","Nightlife & dining":"Vida noturna","Artsy & creative":"Artístico","Quiet & peaceful":"Calmo e tranquilo","Close to nature":"Perto da natureza","Upscale":"Sofisticado","Dog(s) — need garden!":"Cão — preciso jardim!","Dog(s) — parks work":"Cão — parques servem","Cat(s) only":"Só gato(s)","No pets":"Sem animais","Getting one soon":"A pensar adotar","Garage must-have":"Garagem obrigatória","Driveway fine":"Entrada serve","Street ok":"Rua serve","EV charging":"Carregamento EV","No car":"Sem carro","Short commute":"Deslocação curta","Great schools":"Boas escolas","Outdoor space":"Espaço exterior","Modern finishes":"Acabamentos modernos","Walkable area":"Zona caminhável","Home office":"Escritório em casa","Energy efficient":"Eficiência energética","Great views":"Boas vistas","Cosy & warm":"Acolhedor","Sleek & modern":"Elegante e moderno","Rustic & charming":"Rústico e encantador","Luxurious & refined":"Luxuoso e refinado","Simple & practical":"Simples e prático"};
function optText(v,lang){return lang==='pt'?(OPT_PT[v]||v):v;}
var UI_EN={pricing:"Pricing",forAgents:"For Agents",findHome:"Find My Home \u2192",seePricing:"See pricing",heroTag:"AI-Powered Property Matching",heroH1a:"Find the home that",heroH1b:"fits ",heroH1c:"your life",heroP:"Stop scrolling through hundreds of listings. Answer a few questions about how you actually live, and our AI will match you with properties that truly fit \u2014 now live on the Silver Coast, Portugal.",heroSub:"Free \u00b7 No signup required \u00b7 2 min quiz",notAvg:"Not your average property search",notAvgSub:"We match your lifestyle, not just your filter criteria.",feat1t:"AI-Powered Matching",feat1d:"Our algorithm scores properties across 10+ criteria tailored to your unique lifestyle.",feat2t:"Lifestyle-First Approach",feat2d:"We don\u2019t just match bedrooms and budget \u2014 we match your commute, pets, neighbourhood vibe, and more.",feat3t:"Silver Coast, Portugal",feat3d:"Live now on the Silver Coast of Portugal. 1400+ properties across Lourinh\u00e3, Torres Vedras, Caldas da Rainha and more.",feat4t:"2-Minute Quiz",feat4d:"Answer a few conversational questions and get your personalised top matches instantly.",howTitle:"How it works",s1t:"Tell us about you",s1d:"Quick chat about your lifestyle, family, budget, and preferences.",s2t:"Our AI does the work",s2d:"We score every listing across 10 weighted criteria unique to you.",s3t:"Get your matches",s3d:"Receive your top matches with detailed comparisons, save & share.",ctaTitle:"Ready to find your perfect home?",ctaSub:"Live now in Cork, Ireland & Silver Coast, Portugal.",ctaBtn:"Take the 2-Minute Quiz \u2192",ctaPricing:"pricing",faq:"FAQs",cards:"\ud83d\udccb Cards",compare:"\ud83d\udcca Compare",mapV:"\ud83d\uddfa\ufe0f Map",matched:"Matched from real listings \u00b7 AI-powered scoring",step:"STEP",contBtn:"Continue \u2192",faqQ1:"Is homeAImatch free for buyers?",faqA1:"Yes, completely free. Always. Take the quiz, see your matches, contact agents \u2014 no payments, no card required.",faqQ2:"How does the matching work?",faqA2:"Our AI scores every property across 10+ lifestyle criteria \u2014 budget, commute, family, pets, walkability, neighbourhood vibe and more. You see only properties that truly fit.",faqQ3:"Is it available in my area?",faqA3:"Currently live on the Silver Coast of Portugal. Expanding to all of Portugal and Cork, Ireland in 2026\u20132027.",faqQ4:"How does agent pricing work?",faqA4:"Free until end of 2026 for all agencies. From January 2027, plans start at \u20ac25/month. There\u2019s always a free plan with basic leads.",faqQ5:"What makes this different from Idealista?",faqA5:"Traditional portals use basic filters. We use AI to match buyers\u2019 full lifestyle to properties. Agents get buyer profiles and urgency levels before the first call.",faqQ6:"What areas do you cover?",faqA6:"Silver Coast, Portugal (Lourinh\u00e3, Peniche, \u00d3bidos, Caldas, Nazar\u00e9). Expanding to all of Portugal and Cork, Ireland throughout 2026\u20132027."};
var UI_PT={pricing:"Pre\u00e7os",forAgents:"Para Agentes",findHome:"Encontrar Casa \u2192",seePricing:"Ver pre\u00e7os",heroTag:"Matching inteligente de Im\u00f3veis",heroH1a:"Encontre a casa que",heroH1b:"combina com ",heroH1c:"a sua vida",heroP:"Pare de percorrer centenas de an\u00fancios. Responda a algumas perguntas sobre o seu estilo de vida e a nossa IA encontrar\u00e1 os im\u00f3veis perfeitos \u2014 dispon\u00edvel em Costa de Prata, Portugal.",heroSub:"Gr\u00e1tis \u00b7 Sem registo \u00b7 Quiz de 2 minutos",notAvg:"N\u00e3o \u00e9 uma pesquisa de im\u00f3veis comum",notAvgSub:"Fazemos correspond\u00eancia pelo estilo de vida, n\u00e3o apenas por filtros.",feat1t:"Correspond\u00eancia com IA",feat1d:"O nosso algoritmo avalia im\u00f3veis em mais de 10 crit\u00e9rios adaptados ao seu estilo de vida.",feat2t:"Estilo de Vida em Primeiro",feat2d:"N\u00e3o fazemos s\u00f3 correspond\u00eancia por quartos e or\u00e7amento \u2014 consideramos desloca\u00e7\u00f5es, animais, bairro e mais.",feat3t:"Costa de Prata, Portugal",feat3d:"Disponível na Costa de Prata, Portugal. Mais regiões em breve.",ctaBtn:"Fa\u00e7a o Quiz de 2 Minutos \u2192",ctaPricing:"pre\u00e7os",faq:"Perguntas Frequentes",cards:"\ud83d\udccb Fichas",compare:"\ud83d\udcca Comparar",mapV:"\ud83d\uddfa\ufe0f Mapa",matched:"Correspond\u00eancia com im\u00f3veis reais \u00b7 Avalia\u00e7\u00e3o por IA",step:"PASSO",contBtn:"Continuar \u2192",faqQ1:"O homeAImatch \u00e9 gr\u00e1tis para compradores?",faqA1:"Sim, completamente gr\u00e1tis. Sempre. Fa\u00e7a o quiz, veja resultados, contacte agentes \u2014 sem pagamentos, sem cart\u00e3o.",faqQ2:"Como funciona a correspond\u00eancia?",faqA2:"A nossa IA avalia cada im\u00f3vel em mais de 10 crit\u00e9rios \u2014 or\u00e7amento, desloca\u00e7\u00e3o, fam\u00edlia, animais, caminhabilidade, ambiente e mais. V\u00ea apenas im\u00f3veis que realmente combinam consigo.",faqQ3:"Est\u00e1 dispon\u00edvel na minha zona?",faqA3:"Atualmente na Costa de Prata de Portugal. A expandir para todo o Portugal e Cork, Irlanda em 2026\u20132027.",faqQ4:"Pre\u00e7o para agentes?",faqA4:"Gr\u00e1tis at\u00e9 final de 2026 para todas as ag\u00eancias. A partir de Janeiro 2027, planos desde \u20ac25/m\u00eas. H\u00e1 sempre um plano gr\u00e1tis com leads b\u00e1sicos.",faqQ5:"Qual \u00e9 a diferen\u00e7a em rela\u00e7\u00e3o ao Idealista?",faqA5:"Os portais tradicionais usam filtros b\u00e1sicos. N\u00f3s usamos IA para corresponder o estilo de vida completo dos compradores com os im\u00f3veis. Os agentes recebem perfil e urg\u00eancia antes do primeiro contacto.",faqQ6:"Que \u00e1reas cobrem?",faqA6:"Costa de Prata, Portugal (Lourinh\u00e3, Peniche, \u00d3bidos, Caldas, Nazar\u00e9). A expandir para todo o Portugal e Cork, Irlanda ao longo de 2026\u20132027."};
function _T(lang){return lang==='pt'?UI_PT:UI_EN;}


/* ════════════════════════════════════════════════════════════════════
   API CONFIGURATION
   ════════════════════════════════════════════════════════════════════ */
const API_URL = 'https://homeaimatch-backend-production.up.railway.app';

async function apiCall(endpoint, body) {
  try {
    const res = await fetch(API_URL + endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch (err) {
    console.error('API error:', err);
    return null;
  }
}

// Transform API response to format existing Card/CompTable components expect
function adaptMatch(m) {
  const p = m.property;
  const currency = p.currency === 'EUR' ? '€' : '£';
  return {
    house: {
      id: p.id,
      name: p.title,
      price: p.price,
      currency: p.currency || 'EUR',
      beds: p.beds,
      baths: p.baths,
      sqm: p.sqm,
      sqft: p.sqft || Math.round((p.sqm || 0) * 10.764),
      type: p.property_type,
      style: p.style,
      yard: p.features?.includes('garden') ? 'medium' : 'none',
      neighborhood: (p.neighborhood_vibe || []).includes('urban') ? 'urban' : 'suburban',
      city: p.city,
      region: p.region || p.city,
      postcode: p.postcode,
      epc: p.epc_rating,
      commuteMins: { cityCenter: p.commute_city_center || null, techHub: p.commute_city_center ? p.commute_city_center + 5 : null, airport: p.nearest_airport?.distance_km ? Math.round(p.nearest_airport.distance_km * 1.2) : null },
      schools: p.schools_quality || 'good',
      walkability: p.walkability || 5,
      condition: p.condition || 'move-in',
      parking: p.parking || [],
      petFriendly: p.pet_friendly || false,
      nearbyDogPark: p.nearby_dog_park || false,
      neighborhoodVibe: p.neighborhood_vibe || [],
      amenities: {
        groceries: p.amenity_groceries_km || (p.shops_count_1km > 0 ? Math.round((1 / Math.max(p.shops_count_1km, 1)) * 10) / 10 : null),
        gyms: p.sports_count_2km > 0 ? 1 : null,
        parks: p.amenity_parks_km || (p.parks_count_1km > 0 ? 0.3 : null),
        hospitals: p.amenity_hospitals_km || (p.healthcare_count_1km > 0 ? 0.8 : null),
      },
      features: p.features || [],
      img: '🏡',
      tagline: p.tagline || `${p.property_type || 'Property'} in ${p.city}`,
      desc: p.description || '',
      source_url: p.source_url,
      latitude: p.latitude || null,
      longitude: p.longitude || null,
      image_urls: p.image_urls || [],
      beach_nearby: p.beach_nearby || false,
      nearest_beach: p.nearest_beach || null,
      nearest_airport: p.nearest_airport || null,
      neighborhood_type: p.neighborhood_type || null,
      walkability_label: p.walkability_label || null,
      restaurants_count_1km: p.restaurants_count_1km || 0,
      shops_count_1km: p.shops_count_1km || 0,
      transport_count_500m: p.transport_count_500m || 0,
      agent: p.agent ? {
        name: p.agent.name,
        agency: p.agent.agency,
        phone: p.agent.phone,
        ph: p.agent.initials || p.agent.name?.split(' ').map(n => n[0]).join(''),
      } : null,
    },
    pct: m.score || 0,
    reasons: m.highlights || [],
    concerns: m.concerns || [],
    reasoning: m.reasoning || '',
    commuteInfo: p.commute_city_center ? { mins: p.commute_city_center, to: 'City centre' } : null,
  };
}

/* ════════════════════════════════════════════════════════════════════
   BRAND SYSTEM
   ════════════════════════════════════════════════════════════════════ */
const B = {
  blue: "#1E96D1", blueD: "#1578A8", blueL: "#E8F4FB", blueXL: "#F2F9FD",
  orange: "#F5921B", orangeD: "#D97B0E", orangeL: "#FFF4E5",
  dark: "#1A2B3C", darkL: "#2C3E50", gray: "#6B7D8E", grayL: "#F4F6F8",
  border: "#E4E9EE", white: "#FFFFFF", green: "#2E8B57", red: "#C0392B", amepc: "#E65100",
};

/* ════════════════════════════════════════════════════════════════════
   PROPERTY IMAGE PLACEHOLDERS (SVG-based, unique per style)
   ════════════════════════════════════════════════════════════════════ */
const houseImages = {
  victorian: { bg: "#F0E6D3", accent: "#8B6F47", elements: (
    <g><rect x="25" y="45" width="50" height="40" fill="#D4C4A8" rx="1"/><polygon points="50,20 20,48 80,48" fill="#8B6F47"/><rect x="32" y="55" width="10" height="12" fill="#6B5035" rx="1"/><rect x="56" y="55" width="10" height="12" fill="#6B5035" rx="1"/><rect x="42" y="65" width="12" height="20" fill="#6B5035" rx="1"/><rect x="46" y="72" width="2" height="2" fill="#D4A843" rx="1"/><rect x="44" y="35" width="4" height="15" fill="#7A6040"/><rect x="40" y="30" width="12" height="5" fill="#7A6040" rx="1"/><circle cx="60" cy="38" r="6" fill="none" stroke="#8B6F47" strokeWidth="1.5"/><line x1="60" y1="38" x2="60" y2="32" stroke="#8B6F47" strokeWidth="0.5"/><line x1="60" y1="38" x2="63" y2="38" stroke="#8B6F47" strokeWidth="0.5"/></g>
  )},
  modern: { bg: "#E8EEF2", accent: "#4A6FA5", elements: (
    <g><rect x="20" y="40" width="55" height="35" fill="#CFD8E3" rx="2"/><rect x="22" y="42" width="20" height="20" fill="#A8C4E0" rx="1" opacity="0.6"/><rect x="45" y="42" width="20" height="20" fill="#A8C4E0" rx="1" opacity="0.6"/><rect x="70" y="40" width="10" height="35" fill="#B0BEC5" rx="1"/><rect x="22" y="65" width="12" height="10" fill="#4A6FA5" rx="1"/><rect x="20" y="37" width="60" height="3" fill="#4A6FA5" rx="1"/><circle cx="78" cy="30" r="8" fill="#FFD54F" opacity="0.4"/></g>
  )},
  cottage: { bg: "#E8F0E0", accent: "#5D7A3A", elements: (
    <g><rect x="25" y="50" width="45" height="30" fill="#D4C9A8" rx="2"/><polygon points="48,28 18,52 78,52" fill="#7A5C3A"/><rect x="36" y="60" width="10" height="12" fill="#5D4E37" rx="1"/><rect x="52" y="58" width="8" height="8" fill="#87CEEB" rx="1" opacity="0.5"/><ellipse cx="30" cy="80" rx="10" ry="5" fill="#5D7A3A" opacity="0.6"/><ellipse cx="65" cy="80" rx="12" ry="5" fill="#5D7A3A" opacity="0.5"/><circle cx="25" cy="76" r="2" fill="#E74C3C" opacity="0.7"/><circle cx="62" cy="77" r="2" fill="#F1C40F" opacity="0.7"/><circle cx="68" cy="76" r="1.5" fill="#E74C3C" opacity="0.6"/></g>
  )},
  historic: { bg: "#F2E8D8", accent: "#9B7A4A", elements: (
    <g><rect x="22" y="35" width="50" height="50" fill="#D4C4A0" rx="1"/><rect x="24" y="38" width="12" height="16" fill="#B8A882" rx="5 5 0 0"/><rect x="40" y="38" width="12" height="16" fill="#B8A882" rx="5 5 0 0"/><rect x="56" y="38" width="12" height="16" fill="#B8A882" rx="5 5 0 0"/><rect x="38" y="60" width="16" height="25" fill="#7A6040" rx="3 3 0 0"/><line x1="22" y1="57" x2="72" y2="57" stroke="#9B7A4A" strokeWidth="1.5"/><rect x="42" y="70" width="2" height="2" fill="#D4A843" rx="1"/><rect x="22" y="33" width="50" height="3" fill="#9B7A4A" rx="1"/></g>
  )},
  contemporary: { bg: "#E4ECF0", accent: "#3D5A80", elements: (
    <g><rect x="15" y="45" width="40" height="30" fill="#B8C9D8" rx="2"/><rect x="50" y="35" width="30" height="40" fill="#A0B8CC" rx="2"/><rect x="18" y="48" width="15" height="22" fill="#87CEEB" rx="1" opacity="0.5"/><rect x="53" y="38" width="24" height="15" fill="#87CEEB" rx="1" opacity="0.4"/><rect x="53" y="56" width="10" height="19" fill="#3D5A80" rx="1"/><rect x="15" y="42" width="65" height="3" fill="#3D5A80" rx="1"/></g>
  )},
  traditional: { bg: "#F0EBE0", accent: "#7A6050", elements: (
    <g><rect x="25" y="45" width="45" height="35" fill="#D8CDB8" rx="1"/><polygon points="48,25 18,47 78,47" fill="#A0846A"/><rect x="30" y="55" width="8" height="10" fill="#6B5545" rx="1"/><rect x="55" y="55" width="8" height="10" fill="#6B5545" rx="1"/><rect x="40" y="60" width="12" height="20" fill="#6B5545" rx="1"/><rect x="44" y="68" width="2" height="2" fill="#D4A843" rx="1"/><rect x="42" y="30" width="3" height="18" fill="#888"/></g>
  )},
  georgian: { bg: "#EDE8DF", accent: "#8B7355", elements: (
    <g><rect x="20" y="30" width="55" height="55" fill="#D4C8B0" rx="1"/><rect x="20" y="27" width="55" height="4" fill="#8B7355" rx="1"/><rect x="25" y="35" width="10" height="13" fill="#A09078" rx="4 4 0 0"/><rect x="42" y="35" width="10" height="13" fill="#A09078" rx="4 4 0 0"/><rect x="60" y="35" width="10" height="13" fill="#A09078" rx="4 4 0 0"/><rect x="25" y="52" width="10" height="13" fill="#A09078" rx="4 4 0 0"/><rect x="60" y="52" width="10" height="13" fill="#A09078" rx="4 4 0 0"/><rect x="42" y="60" width="12" height="25" fill="#6B5535" rx="4 4 0 0"/><circle cx="56" cy="72" r="1.5" fill="#D4A843"/></g>
  )},
  ranch: { bg: "#EBE4D4", accent: "#8B7355", elements: (
    <g><rect x="12" y="50" width="70" height="25" fill="#D4C4A0" rx="2"/><polygon points="50,38 8,52 92,52" fill="#A08060"/><rect x="40" y="55" width="12" height="20" fill="#7A6040" rx="1"/><rect x="18" y="55" width="8" height="8" fill="#87CEEB" rx="1" opacity="0.4"/><rect x="65" y="55" width="8" height="8" fill="#87CEEB" rx="1" opacity="0.4"/><rect x="44" y="62" width="2" height="2" fill="#D4A843" rx="1"/><line x1="85" y1="48" x2="85" y2="75" stroke="#8B7355" strokeWidth="2"/><rect x="82" y="46" width="6" height="4" fill="#8B7355" rx="1"/></g>
  )},
  luxury: { bg: "#E8E4EE", accent: "#6B5B8A", elements: (
    <g><rect x="15" y="40" width="65" height="38" fill="#D0C8DC" rx="3"/><rect x="18" y="43" width="25" height="25" fill="#B0C8E8" rx="1" opacity="0.5"/><rect x="48" y="43" width="25" height="25" fill="#B0C8E8" rx="1" opacity="0.4"/><rect x="35" y="55" width="14" height="23" fill="#6B5B8A" rx="1"/><rect x="15" y="36" width="65" height="4" fill="#6B5B8A" rx="2"/><ellipse cx="50" cy="82" rx="22" ry="5" fill="#6BB8E8" opacity="0.3"/></g>
  )},
  mediterranean: { bg: "#FFF5E6", accent: "#CC6633", elements: (
    <g><rect x="22" y="40" width="50" height="40" fill="#F5E6CC" rx="2"/><rect x="22" y="36" width="50" height="5" fill="#CC6633" rx="1"/><rect x="28" y="48" width="8" height="12" fill="#4A90D9" rx="3 3 0 0" opacity="0.5"/><rect x="44" y="48" width="8" height="12" fill="#4A90D9" rx="3 3 0 0" opacity="0.5"/><rect x="60" y="48" width="8" height="12" fill="#4A90D9" rx="3 3 0 0" opacity="0.5"/><rect x="38" y="62" width="14" height="18" fill="#8B6040" rx="3 3 0 0"/><circle cx="15" cy="60" r="8" fill="#2E7D32" opacity="0.4"/><circle cx="80" cy="55" r="6" fill="#2E7D32" opacity="0.3"/></g>
  )},
  industrial: { bg: "#E0E0E0", accent: "#555", elements: (
    <g><rect x="15" y="35" width="65" height="42" fill="#B0B0B0" rx="1"/><rect x="18" y="38" width="28" height="22" fill="#87CEEB" rx="1" opacity="0.4"/><rect x="50" y="38" width="28" height="22" fill="#87CEEB" rx="1" opacity="0.3"/><rect x="35" y="60" width="14" height="17" fill="#666" rx="1"/><line x1="15" y1="62" x2="80" y2="62" stroke="#888" strokeWidth="1"/><rect x="60" y="28" width="3" height="10" fill="#888"/><rect x="18" y="75" width="60" height="2" fill="#999" rx="1"/></g>
  )},
};

function PropertyImage({ style, size = 160 }) {
  const img = houseImages[style] || houseImages.traditional;
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 100 85" style={{ borderRadius: 10, flexShrink: 0 }}>
      <rect width="100" height="85" fill={img.bg} rx="4"/>
      {img.elements}
      <rect x="0" y="0" width="100" height="85" fill="url(#grain)" opacity="0.03" rx="4"/>
      <defs><filter id="grain"><feTurbulence baseFrequency="0.9" numOctaves="4"/></filter></defs>
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════
   LOGO COMPONENTS
   ════════════════════════════════════════════════════════════════════ */
const LogoIcon = ({ size = 36 }) => (
  <img src="logo-icon.png" alt="homeAImatch" width={size} height={size} style={{display:"block"}}/>
);

const LogoFull = ({ dark }) => (
  <img src="logo-full.png" alt="homeAImatch" style={{display:"block",height:"clamp(36px, 8vw, 56px)",maxWidth:"clamp(120px, 28vw, 200px)"}}/>
);

/* ════════════════════════════════════════════════════════════════════
   MARKETS & HOUSE DATABASE
   ════════════════════════════════════════════════════════════════════ */
const MARKETS = {
  uk: {
    flag: "🇬🇧", label: "United Kingdom",
    cities: ["London","Manchester","Birmingham","Leeds","Bristol","Liverpool","Edinburgh","Glasgow","Cardiff","Newcastle","Sheffield","Nottingham","Cambridge","Oxford","Bath","Brighton","York"]
  },
  ie: {
    flag: "🇮🇪", label: "Ireland",
    cities: ["Cork","Dublin","Limerick","Galway","Waterford","Killarney","Kinsale","Cobh","Midleton","Mallow","Bandon","Clonakilty","Fermoy","Youghal","Carrigaline"]
  },
  pt: {
    flag: "🇵🇹", label: "Portugal",
    cities: ["Lourinhã","Peniche","Torres Vedras","Óbidos","Caldas da Rainha","Ericeira","Mafra","Sintra","Cascais","Nazaré","Alcobaça","Bombarral","Cadaval","Atouguia da Baleia","Areia Branca","São Martinho do Porto"]
  }
};
const HOUSES_UK = [
  {id:"uk1",name:"Notting Hill Victorian",price:1250000,beds:4,baths:2,sqm:167,sqft:1798,type:"terraced",style:"victorian",yard:"medium",neighborhood:"urban",city:"London",region:"W11",postcode:"W11 2AA",epc:"D",commuteMins:{cityCenter:15,techHub:20,airport:45},schools:"excellent",walkability:9,condition:"move-in",parking:["on-street","permit"],petFriendly:true,nearbyDogPark:true,neighborhoodVibe:["artsy","upscale"],amenities:{groceries:0.1,gyms:0.2,parks:0.1,hospitals:1.5},features:["period-features","garden","updated-kitchen","bay-windows"],img:"🏡",tagline:"Pastel-painted Victorian on a Notting Hill crescent",desc:"Stunning 4-bed with original cornicing, sash windows, and a 30ft south-facing garden. Recently refitted kitchen with marble island. Steps from Portobello Road.",agent:{name:"James Ashworth",agency:"Foxtons",phone:"+44 20 7234 5678",ph:"JA"}},
  {id:"uk2",name:"Shoreditch Warehouse Loft",price:685000,beds:2,baths:2,sqm:102,sqft:1098,type:"flat",style:"modern",yard:"none",neighborhood:"urban",city:"London",region:"E1",postcode:"E1 6JE",epc:"B",commuteMins:{cityCenter:10,techHub:5,airport:35},schools:"good",walkability:10,condition:"move-in",parking:["ev-charging"],petFriendly:false,nearbyDogPark:true,neighborhoodVibe:["nightlife","artsy"],amenities:{groceries:0.1,gyms:0.1,parks:0.3,hospitals:1.0},features:["exposed-brick","double-height","smart-home","balcony"],img:"🏙️",tagline:"Converted warehouse loft in the heart of Tech City",desc:"Double-height 2-bed in a converted Victorian warehouse. Exposed brick, Crittall windows, Sonos throughout. Roof terrace with City skyline views.",agent:{name:"Sophie Chen",agency:"Hamptons",phone:"+44 20 7345 6789",ph:"SC"}},
  {id:"uk3",name:"Didsbury Family Semi",price:485000,beds:4,baths:3,sqm:158,sqft:1701,type:"semi-detached",style:"edwardian",yard:"large",neighborhood:"suburban",city:"Manchester",region:"Didsbury",postcode:"M20 2FW",epc:"C",commuteMins:{cityCenter:20,techHub:15,airport:15},schools:"excellent",walkability:7,condition:"move-in",parking:["driveway","garage"],petFriendly:true,nearbyDogPark:true,neighborhoodVibe:["family-friendly","quiet"],amenities:{groceries:0.3,gyms:0.5,parks:0.2,hospitals:2.0},features:["garden","home-office","period-features","conservatory"],img:"🌳",tagline:"Edwardian family home in leafy Didsbury",desc:"Beautifully extended 4-bed with 80ft garden, home office, and conservatory. Walk to Didsbury village restaurants. Excellent schools catchment.",agent:{name:"Tom Richardson",agency:"Gascoigne Halman",phone:"+44 161 234 5678",ph:"TR"}},
  {id:"uk4",name:"Clifton Georgian Townhouse",price:725000,beds:5,baths:3,sqm:214,sqft:2303,type:"terraced",style:"georgian",yard:"small",neighborhood:"urban",city:"Bristol",region:"Clifton",postcode:"BS8 4AA",epc:"D",commuteMins:{cityCenter:10,techHub:15,airport:25},schools:"excellent",walkability:9,condition:"renovation-light",parking:["on-street","permit"],petFriendly:true,nearbyDogPark:true,neighborhoodVibe:["upscale","artsy"],amenities:{groceries:0.2,gyms:0.3,parks:0.1,hospitals:1.5},features:["period-features","high-ceilings","original-fireplaces","garden"],img:"🏛️",tagline:"Elegant Georgian overlooking Clifton Suspension Bridge",desc:"5-bed Georgian with soaring ceilings, marble fireplaces, and views of the gorge. Needs cosmetic refresh. One of Bristol's finest addresses.",agent:{name:"Rachel Green",agency:"Savills Bristol",phone:"+44 117 234 5678",ph:"RG"}},
  {id:"uk5",name:"Headingley Cottage",price:295000,beds:3,baths:1,sqm:102,sqft:1098,type:"terraced",style:"cottage",yard:"medium",neighborhood:"suburban",city:"Leeds",region:"Headingley",postcode:"LS6 3AA",epc:"D",commuteMins:{cityCenter:15,techHub:20,airport:30},schools:"good",walkability:8,condition:"renovation-light",parking:["on-street"],petFriendly:true,nearbyDogPark:true,neighborhoodVibe:["artsy","family-friendly"],amenities:{groceries:0.2,gyms:0.4,parks:0.3,hospitals:2.5},features:["stone-walls","fireplace","garden","original-beams"],img:"⚓",tagline:"Stone cottage with bags of character in Headingley",desc:"Charming 3-bed stone terrace. Original beams, wood burner, walled garden. Walk to Headingley Carnegie Stadium. Kitchen needs updating.",agent:{name:"Hannah Moore",agency:"Manning Stainton",phone:"+44 113 234 5678",ph:"HM"}},
  {id:"uk6",name:"Edinburgh New Town Flat",price:550000,beds:3,baths:2,sqm:121,sqft:1302,type:"flat",style:"georgian",yard:"none",neighborhood:"urban",city:"Edinburgh",region:"New Town",postcode:"EH2 3AA",epc:"C",commuteMins:{cityCenter:5,techHub:10,airport:25},schools:"excellent",walkability:10,condition:"move-in",parking:["on-street","permit"],petFriendly:true,nearbyDogPark:true,neighborhoodVibe:["upscale","quiet"],amenities:{groceries:0.1,gyms:0.2,parks:0.2,hospitals:1.0},features:["period-features","high-ceilings","sash-windows","drawing-room"],img:"🏰",tagline:"Elegant New Town flat with Castle views",desc:"Stunning 3-bed in a Georgian crescent. 12ft ceilings, working shutters, dual aspect drawing room with Edinburgh Castle views. A/B listed.",agent:{name:"Ewan MacLeod",agency:"Rettie & Co",phone:"+44 131 234 5678",ph:"EM"}},
  {id:"uk7",name:"Moseley Arts Quarter",price:340000,beds:3,baths:2,sqm:111,sqft:1195,type:"semi-detached",style:"edwardian",yard:"medium",neighborhood:"suburban",city:"Birmingham",region:"Moseley",postcode:"B13 8AA",epc:"C",commuteMins:{cityCenter:15,techHub:12,airport:20},schools:"good",walkability:8,condition:"move-in",parking:["driveway"],petFriendly:true,nearbyDogPark:true,neighborhoodVibe:["artsy","family-friendly"],amenities:{groceries:0.2,gyms:0.5,parks:0.1,hospitals:2.0},features:["garden","bay-windows","modern-kitchen","home-office"],img:"🎨",tagline:"Arts & crafts semi in vibrant Moseley village",desc:"Beautifully updated 3-bed with landscaped garden. Open-plan kitchen-diner, dedicated home office. Walk to Moseley Farmers Market and independent cafés.",agent:{name:"Priya Patel",agency:"Rightmove Homes",phone:"+44 121 234 5678",ph:"PP"}},
  {id:"uk8",name:"Pontcanna Terrace",price:425000,beds:4,baths:2,sqm:140,sqft:1507,type:"terraced",style:"victorian",yard:"medium",neighborhood:"suburban",city:"Cardiff",region:"Pontcanna",postcode:"CF11 9AA",epc:"C",commuteMins:{cityCenter:10,techHub:15,airport:30},schools:"excellent",walkability:8,condition:"move-in",parking:["on-street"],petFriendly:true,nearbyDogPark:true,neighborhoodVibe:["family-friendly","quiet"],amenities:{groceries:0.2,gyms:0.4,parks:0.1,hospitals:1.5},features:["period-features","garden","updated-kitchen","loft-conversion"],img:"🏴",tagline:"Victorian terrace on a tree-lined Pontcanna street",desc:"4-bed Victorian with loft conversion, 50ft garden, and views of Bute Park. Walk to Chapter Arts Centre and Cardiff's best brunch spots.",agent:{name:"Rhys Davies",agency:"Moginie James",phone:"+44 29 2034 5678",ph:"RD"}},
  {id:"uk9",name:"Jesmond Renovation Project",price:225000,beds:4,baths:1,sqm:148,sqft:1593,type:"terraced",style:"victorian",yard:"small",neighborhood:"urban",city:"Newcastle",region:"Jesmond",postcode:"NE2 1AA",epc:"F",commuteMins:{cityCenter:10,techHub:15,airport:20},schools:"good",walkability:9,condition:"renovation-major",parking:["on-street"],petFriendly:true,nearbyDogPark:true,neighborhoodVibe:["artsy","nightlife"],amenities:{groceries:0.1,gyms:0.3,parks:0.2,hospitals:1.0},features:["high-ceilings","original-fireplaces","bay-windows","potential"],img:"🔨",tagline:"Unrenovated Victorian with massive potential in Jesmond",desc:"4-bed needing full renovation. Original cornicing, marble fireplaces, high ceilings intact. Huge upside at this price in one of Newcastle's best postcodes.",agent:{name:"Craig Wilson",agency:"Bradley Hall",phone:"+44 191 234 5678",ph:"CW"}},
  {id:"uk10",name:"Cambridge Riverside Modern",price:595000,beds:3,baths:2,sqm:112,sqft:1206,type:"flat",style:"modern",yard:"none",neighborhood:"suburban",city:"Cambridge",region:"Riverside",postcode:"CB5 8AA",epc:"A",commuteMins:{cityCenter:10,techHub:5,airport:55},schools:"excellent",walkability:8,condition:"move-in",parking:["underground","ev-charging"],petFriendly:true,nearbyDogPark:true,neighborhoodVibe:["quiet","family-friendly"],amenities:{groceries:0.3,gyms:0.4,parks:0.1,hospitals:2.0},features:["river-view","smart-home","terrace","heat-pump"],img:"🎓",tagline:"Contemporary riverside living near the colleges",desc:"3-bed in an award-winning development on the Cam. Floor-to-ceiling glazing, smart home, communal gardens. Cycle to the Science Park in 10 min. EPC A.",agent:{name:"Alice Thornton",agency:"Bidwells",phone:"+44 1223 234 567",ph:"AT"}},
  {id:"uk11",name:"Bath Crescent Apartment",price:460000,beds:2,baths:2,sqm:93,sqft:1001,type:"flat",style:"georgian",yard:"none",neighborhood:"urban",city:"Bath",region:"Royal Crescent",postcode:"BA1 2AA",epc:"D",commuteMins:{cityCenter:5,techHub:15,airport:90},schools:"good",walkability:10,condition:"move-in",parking:["on-street","permit"],petFriendly:false,nearbyDogPark:true,neighborhoodVibe:["upscale","quiet"],amenities:{groceries:0.2,gyms:0.3,parks:0.1,hospitals:1.0},features:["period-features","sash-windows","high-ceilings","view"],img:"🛁",tagline:"Georgian elegance overlooking Royal Victoria Park",desc:"Exquisite 2-bed apartment in a Grade I listed crescent. 10ft ceilings, restored sash windows, park views. One of the most beautiful addresses in England.",agent:{name:"Oliver Grant",agency:"Carter Jonas",phone:"+44 1225 234 567",ph:"OG"}},
  {id:"uk12",name:"Brighton Seafront House",price:875000,beds:4,baths:3,sqm:186,sqft:2002,type:"terraced",style:"victorian",yard:"small",neighborhood:"urban",city:"Brighton",region:"Hove",postcode:"BN3 2AA",epc:"C",commuteMins:{cityCenter:5,techHub:10,airport:45},schools:"good",walkability:9,condition:"move-in",parking:["on-street","permit"],petFriendly:true,nearbyDogPark:true,neighborhoodVibe:["nightlife","artsy"],amenities:{groceries:0.1,gyms:0.2,parks:0.2,hospitals:1.5},features:["sea-view","roof-terrace","garden","modern-kitchen"],img:"🏖️",tagline:"Sea-view Victorian with roof terrace in Hove",desc:"4-bed across 4 floors with uninterrupted sea views from the roof terrace. Contemporary kitchen, mature garden. Walk along the prom to the Lanes.",agent:{name:"Lucy Palmer",agency:"Mishon Mackay",phone:"+44 1273 234 567",ph:"LP"}},
];

/* ════════════════════════════════════════════════════════════════════
   QUESTIONS
   ════════════════════════════════════════════════════════════════════ */
function getQuestions(market, lang) {
  var p = lang==="pt";
  return [
    { id:"welcome",field:null,type:"info",text:p
      ?"🏡 Bem-vindo ao homeAImatch!\n\nVou encontrar os imóveis perfeitos para o seu estilo de vida na Costa de Prata. O quiz demora ~2 minutos.\n\n📊 Como avaliamos:\n🏠 Imóvel (quartos, área, estado) — 25%\n💰 Orçamento — 20%\n📍 Localização e envolvente — 20%\n🌿 Estilo de vida e prioridades — 20%\n🐾 Extras (animais, transporte, etc.) — 15%"
      :"🏡 Welcome to homeAImatch!\n\nI'll find properties that truly fit your lifestyle on the Silver Coast, Portugal. The quiz takes ~2 minutes.\n\n📊 How we score:\n🏠 Property (beds, size, condition) — 25%\n💰 Budget fit — 20%\n📍 Location & surroundings — 20%\n🌿 Lifestyle & priorities — 20%\n🐾 Extras (pets, transport, etc.) — 15%",
      cta:p?"Começar o Quiz 🚀":"Start the Quiz 🚀"},
    { id:"buyerType",field:"buyerType",type:"single",text:p?"👤 O que melhor descreve a sua situação?":"👤 What best describes you?",options:[
      p?"Reformado/a":"Retired / semi-retired",p?"Trabalhador/a remoto/a":"Remote worker",p?"Casal jovem":"Young couple",p?"Família com filhos":"Family with kids",p?"Estudante":"Student",p?"Profissional individual":"Individual professional",p?"Investidor/a":"Investor"]},
    { id:"transport",field:"transport",type:"single",text:p?"🚗 Como se desloca no dia-a-dia?":"🚗 How do you get around day-to-day?",options:[
      p?"🚗 Carro próprio":"🚗 Own car",p?"🛵 Moto ou scooter":"🛵 Motorbike / scooter",p?"🚌 Transportes públicos":"🚌 Public transport",p?"🚲 Bicicleta":"🚲 Bicycle",p?"🚶 A pé — quero tudo perto":"🚶 Walking — everything nearby",p?"🚗 Vou comprar carro":"🚗 Planning to buy a car"]},
    { id:"essentials",field:"essentials",type:"form",text:p?"🏠 Detalhes do imóvel":"🏠 Property essentials",
      fields:[
        {id:"minBeds",label:p?"🛏️ Quartos mín.":"🛏️ Min bedrooms",type:"select",options:["1","2","3","4","5+"],dflt:"2"},
        {id:"minBaths",label:p?"🚿 WC mín.":"🚿 Min bathrooms",type:"select",options:["1","2","3+"],dflt:"1"},
        {id:"minSqm",label:p?"📐 Área mín. (m²)":"📐 Min size (m²)",type:"select",options:[p?"Sem mínimo":"No minimum","50","80","100","120","150","200+"],dflt:p?"Sem mínimo":"No minimum"},
        {id:"budgetMin",label:p?"💰 Orçamento mín.":"💰 Min budget",type:"select",options:[p?"Sem mínimo":"No minimum","€50K","€100K","€150K","€200K","€300K"],dflt:p?"Sem mínimo":"No minimum"},
        {id:"budgetMax",label:p?"💰 Orçamento máx.":"💰 Max budget",type:"select",options:["€150K","€200K","€300K","€400K","€500K","€600K","€800K","€1M+"],dflt:"€400K"},
      ]},
    { id:"condition",field:"condition",type:"single",text:p?"🔧 Estado do imóvel?":"🔧 Property condition?",options:[
      p?"🆕 Construção nova":"🆕 New build",p?"✅ Pronto a habitar":"✅ Move-in ready",p?"🔧 Obras ligeiras ok":"🔧 Light renovation ok",p?"🔨 Renovação total":"🔨 Full renovation project",p?"🤷 Tanto faz":"🤷 Don't mind"]},
    { id:"outdoor",field:"outdoor",type:"single",text:p?"🌿 Espaço exterior?":"🌿 Outdoor space needed?",options:[
      p?"Não é importante":"Not important",p?"🏠 Varanda ou terraço":"🏠 Balcony / terrace",p?"🌿 Jardim":"🌿 Garden",p?"🌳 Terreno grande":"🌳 Large plot / land"]},
    { id:"features",field:"features",type:"multi",text:p?"✨ Características importantes? Selecione todas.":"✨ Important features? Select all that apply.",options:[
      "🌿 "+(p?"Jardim":"Garden"),"🏊 "+(p?"Piscina":"Pool"),"💻 "+(p?"Escritório":"Home office"),"🏠 "+(p?"Varanda":"Balcony"),"☀️ "+(p?"Terraço":"Terrace"),
      "🌊 "+(p?"Vista mar":"Sea view"),"🏛️ "+(p?"Época":"Period features"),"🍳 "+(p?"Cozinha moderna":"Modern kitchen"),"🔥 "+(p?"Lareira":"Fireplace"),
      "📱 "+(p?"Casa inteligente":"Smart home"),"🚗 "+(p?"Garagem":"Garage"),"⚡ "+(p?"Carregamento EV":"EV charging"),"☀️ "+(p?"Solar":"Solar"),"📦 "+(p?"Arrecadação":"Storage")]},
    { id:"setting",field:"setting",type:"single",text:p?"🏖️ Que tipo de zona prefere?":"🏖️ What area type do you prefer?",options:[
      p?"🏖️ Cidade de praia":"🏖️ Beach town",p?"🏰 Vila histórica":"🏰 Historic town",p?"🏙️ Centro urbano":"🏙️ Urban centre",p?"🌾 Campo e tranquilidade":"🌾 Countryside & quiet",p?"🎲 Flexível":"🎲 Flexible — surprise me"]},
    { id:"priorities",field:"priorities",type:"multi",text:p?"⭐ Top 3 prioridades no dia-a-dia?":"⭐ Top 3 daily life priorities?",options:[
      "🚶 "+(p?"Zona caminhável":"Walkable area"),"🏫 "+(p?"Boas escolas":"Great schools"),"🏖️ "+(p?"Perto da praia":"Near the beach"),
      "🍽️ "+(p?"Restaurantes e cafés":"Restaurants & cafes"),"🏥 "+(p?"Saúde perto":"Healthcare nearby"),"🚌 "+(p?"Transportes públicos":"Public transport"),
      "🤫 "+(p?"Paz e sossego":"Peace & quiet"),"🌳 "+(p?"Natureza":"Nature & green space")]},
    { id:"pets",field:"pets",type:"single",text:p?"🐾 Animais de estimação?":"🐾 Any pets?",options:[
      p?"🐕 Cão(s)":"🐕 Dog(s)",p?"🐈 Gato(s)":"🐈 Cat(s)",p?"❌ Sem animais":"❌ No pets",p?"🐾 A pensar adotar":"🐾 Planning to get one"]},
    { id:"parking",field:"parking",type:"single",text:p?"🅿️ Estacionamento?":"🅿️ Parking needs?",options:[
      p?"🏠 Garagem obrigatória":"🏠 Garage must-have",p?"🅿️ Rua serve":"🅿️ Street parking fine",p?"⚡ Preciso carregamento EV":"⚡ Need EV charging",p?"🚶 Sem carro":"🚶 No car"]},
    { id:"purpose",field:"purpose",type:"single",text:p?"🎯 Para que é este imóvel?":"🎯 What's this property for?",options:[
      p?"🏠 Residência principal":"🏠 Primary home",p?"🏖️ Casa de férias":"🏖️ Holiday home",p?"📈 Investimento":"📈 Investment",p?"✈️ Mudança do estrangeiro":"✈️ Relocation from abroad"]},
    { id:"mortgage",field:"mortgage",type:"single",text:p?"💳 Situação de crédito?":"💳 Mortgage situation?",options:[
      p?"✅ Crédito pré-aprovado":"✅ Pre-approved mortgage",p?"🏦 Vou precisar de crédito":"🏦 Will need a mortgage",p?"💰 Compro a pronto":"💰 Cash buyer",p?"🤔 Ainda não sei":"🤔 Not sure yet"]},
    { id:"intent",field:"intent",type:"single",text:p?"⏰ Quão pronto está?":"⏰ How ready are you?",options:[
      p?"🔥 Pronto para comprar":"🔥 Ready to buy now",p?"🔍 À procura ativa":"🔍 Actively searching",p?"👀 Só a explorar":"👀 Just exploring"]},
    { id:"timeline",field:"timeline",type:"single",text:p?"📅 Qual é o seu prazo?":"📅 What's your timeline?",options:[
      p?"⚡ Dentro de 3 meses":"⚡ Within 3 months",p?"📅 3-6 meses":"📅 3-6 months",p?"📆 6-12 meses":"📆 6-12 months",p?"🧘 Sem pressa":"🧘 No rush"]},
  ];
}
function getPersona(a, lang){
  var pt = lang==="pt";
  var bt = a.buyerType || "";
  if(bt.includes("Retired")||bt.includes("Reformado"))return{title:pt?"O Explorador da Reforma":"The Retirement Explorer",emoji:"🌅",desc:pt?"Tempo para viver onde sempre sonhou. Tranquilidade, saúde perto e qualidade de vida.":"Time to live where you've always dreamed. Peace, healthcare nearby, and quality of life."};
  if(bt.includes("Remote")||bt.includes("remoto"))return{title:pt?"O Nómada Digital":"The Digital Nomad",emoji:"💻",desc:pt?"Internet rápida, espaço para escritório e um café com vista — o mundo é o seu escritório.":"Fast internet, office space and a café with a view — the world is your office."};
  if(bt.includes("couple")||bt.includes("Casal"))return{title:pt?"O Casal Aventureiro":"The Adventure Couple",emoji:"💑",desc:pt?"Dois a construir um futuro juntos. Espaço, localização e um lar para chamar de vosso.":"Two building a future together. Space, location, and a place to call your own."};
  if(bt.includes("Family")||bt.includes("Família"))return{title:pt?"O Construtor de Lar":"The Family Builder",emoji:"👨‍👩‍👧‍👦",desc:pt?"Escolas, jardim, segurança — tudo para que a família cresça feliz.":"Schools, garden, safety — everything for a happy family life."};
  if(bt.includes("Student")||bt.includes("Estudante"))return{title:pt?"O Estudante Esperto":"The Smart Student",emoji:"🎓",desc:pt?"Orçamento inteligente, boa localização e perto de tudo o que importa.":"Smart budget, great location, close to everything that matters."};
  if(bt.includes("Investor")||bt.includes("Investidor"))return{title:pt?"O Investidor Estratégico":"The Strategic Investor",emoji:"📈",desc:pt?"Olho no retorno, análise de mercado e potencial de valorização.":"Eye on returns, market analysis, and appreciation potential."};
  return{title:pt?"O Comprador Inteligente":"The Smart Buyer",emoji:"🏡",desc:pt?"Metódico, informado e pronto para encontrar o encaixe perfeito.":"Methodical, informed, and ready to find the perfect fit."};
}

/* ════════════════════════════════════════════════════════════════════
   UI COMPONENTS
   ════════════════════════════════════════════════════════════════════ */
const Dots = () => <div style={{display:"flex",gap:5,padding:"8px 0"}}>{[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:"#a8b5c4",animation:`bounce 1.2s infinite ${i*.15}s`}}/>)}</div>;

const Progress = ({cur,tot,lang:_lg}) => {const p=Math.round((cur/tot)*100);return(<div style={{position:"sticky",top:61,zIndex:9,background:B.white,padding:"10px 24px 7px",borderBottom:`1px solid ${B.border}`}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:10,fontWeight:600,color:B.gray,letterSpacing:"0.08em",fontFamily:"'Outfit',sans-serif"}}>{(_T(_lg)).step} {cur} / {tot}</span><span style={{fontSize:10,fontWeight:700,color:B.dark,fontFamily:"'Outfit',sans-serif"}}>{p}%</span></div><div style={{height:3,background:B.grayL,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",background:`linear-gradient(90deg,${B.blue},${B.orange})`,borderRadius:3,width:`${p}%`,transition:"width 0.5s cubic-bezier(0.4,0,0.2,1)"}}/></div></div>);};

const Bubble = ({text,isUser,children}) => <div style={{display:"flex",justifyContent:isUser?"flex-end":"flex-start",marginBottom:9,animation:"fadeSlide 0.35s ease-out"}}>{!isUser&&<div style={{width:26,height:26,marginRight:7,flexShrink:0,marginTop:4}}><LogoIcon size={26}/></div>}<div style={{maxWidth:"78%",padding:"12px 16px",fontSize:13.5,lineHeight:1.6,borderRadius:isUser?"18px 18px 4px 18px":"18px 18px 18px 4px",background:isUser?B.dark:B.white,color:isUser?"#f0f4f8":B.dark,fontFamily:"'Outfit',sans-serif",whiteSpace:"pre-line",boxShadow:isUser?"none":"0 1px 3px rgba(0,0,0,0.04)",border:isUser?"none":`1px solid ${B.border}`}}>{text}{children}</div></div>;

const AmStat = ({icon,label,dist}) => <div style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:B.gray,fontFamily:"'Outfit',sans-serif"}}><span>{icon}</span><span>{label}</span><span style={{color:dist<=1?B.green:dist<=3?B.amepc:B.red,fontWeight:600}}>{dist<1?`${Math.round(dist*10)/10} km`:`${Math.round(dist)} km`}</span></div>;

/* ════════════════════════════════════════════════════════════════════
   COMPARISON TABLE
   ════════════════════════════════════════════════════════════════════ */
const CompTable = ({results}) => {
  const rows=[{l:"Price",f:m=>`${m.house.currency==='EUR'?'€':'£'}${(m.house.price/1e3).toFixed(0)}K`},{l:"Beds",f:m=>`${m.house.beds} / ${m.house.baths}`},{l:"Size",f:m=>`${m.house.sqm} m²`},{l:"Type",f:m=>m.house.type},{l:"Condition",f:m=>({"move-in":"✅ Ready","renovation-light":"🔧 Light","renovation-major":"🔨 Major"})[m.house.condition]},{l:"Walk",f:m=>`${m.house.walkability}/10`},{l:"Commute",f:m=>m.commuteInfo?`${m.commuteInfo.mins} min`:"—"},{l:"Pets",f:m=>m.house.petFriendly?"✅":"❌"},{l:"Energy",f:m=>m.house.epc||m.house.epc||"—"},{l:"Match",f:m=>`${m.pct}%`}];
  return(<div style={{overflowX:"auto",borderRadius:12,border:`1px solid ${B.border}`,background:B.white,animation:"fadeSlide 0.4s ease-out"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:11.5,fontFamily:"'Outfit',sans-serif"}}><thead><tr style={{background:B.dark}}><th style={{padding:"9px 10px",textAlign:"left",color:"#fff",fontWeight:600,fontSize:10.5,position:"sticky",left:0,background:B.dark,zIndex:1}}></th>{results.map((m,i)=><th key={i} style={{padding:"9px 10px",textAlign:"center",color:i===0?B.orange:"#fff",fontWeight:700,fontSize:10.5,minWidth:100}}>{m.house.img} {m.house.name.split(" ").slice(0,2).join(" ")}</th>)}</tr></thead><tbody>{rows.map((row,ri)=><tr key={ri} style={{background:ri%2===0?B.grayL:B.white}}><td style={{padding:"7px 10px",fontWeight:600,color:B.dark,whiteSpace:"nowrap",position:"sticky",left:0,background:ri%2===0?B.grayL:B.white,zIndex:1}}>{row.l}</td>{results.map((m,i)=><td key={i} style={{padding:"7px 10px",textAlign:"center",color:B.gray,fontWeight:row.l==="Match"?700:400,...(row.l==="Match"?{color:m.pct>=70?B.green:m.pct>=50?B.amepc:B.gray}:{})}}>{row.f(m)}</td>)}</tr>)}</tbody></table></div>);
};

/* ════════════════════════════════════════════════════════════════════
   MATCH CARD
   ════════════════════════════════════════════════════════════════════ */
const Card = ({match,rank,expanded,onToggle,saved,onSave,onContact,lang}) => {
  const pt=lang==="pt";
  const{house:h,pct,reasons,commuteInfo:ci}=match;const top=rank===0;
  return(<div style={{background:B.white,borderRadius:14,overflow:"hidden",border:top?`2px solid ${B.blue}`:`1px solid ${B.border}`,boxShadow:top?`0 6px 24px rgba(30,150,209,0.1)`:"0 2px 6px rgba(0,0,0,0.03)",animation:`fadeSlide 0.45s ease-out ${rank*0.1}s both`}}>
    <div onClick={onToggle} style={{padding:"16px 18px 12px",cursor:"pointer"}}>
      <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
        {h.image_urls && h.image_urls.length > 0 ? (
          <div style={{width:100,height:100,borderRadius:10,overflow:"hidden",flexShrink:0,background:B.grayL}}>
            <img src={h.image_urls[0]} alt={h.name} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{e.target.onerror=null;e.target.style.display='none';e.target.parentNode.insertAdjacentHTML('beforeend','<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:36px">🏠</div>');}}/>
          </div>
        ) : (
          <PropertyImage style={h.style} size={100}/>
        )}
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <div style={{fontSize:9.5,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:top?B.blue:"#a8b5c4",fontFamily:"'Outfit',sans-serif"}}>{top?(pt?"★ Melhor Resultado":"★ Best Match"):`#${rank+1} ${pt?"Resultado":"Match"}`}</div>
              <div style={{fontSize:15.5,fontWeight:700,color:B.dark,fontFamily:"'Outfit',sans-serif",letterSpacing:"-0.02em",marginTop:1}}>{h.name}</div>
            </div>
            <div style={{background:pct>=70?"#e8f5e9":pct>=50?"#fff8e1":B.grayL,color:pct>=70?B.green:pct>=50?"#f57f17":"#78909c",padding:"5px 12px",borderRadius:24,fontSize:13,fontWeight:800,fontFamily:"'Outfit',sans-serif",flexShrink:0}}>{pct}%</div>
          </div>
          <div style={{fontSize:12,color:B.gray,fontStyle:"italic",marginTop:3,fontFamily:"'Outfit',sans-serif"}}>{h.tagline}</div>
          <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
            {[`${h.currency==='EUR'?'€':'£'}${(h.price/1e3).toFixed(0)}K`,`${h.beds} bed · ${h.baths} bath`,`${h.sqm} m²`,h.region||h.city].map((t,i)=><span key={i} style={{fontSize:11,color:B.gray,background:B.grayL,padding:"2px 8px",borderRadius:5,fontFamily:"'Outfit',sans-serif",fontWeight:500}}>{t}</span>)}
          </div>
          {ci&&<div style={{marginTop:6,display:"inline-flex",alignItems:"center",gap:4,background:ci.mins<=20?"#e8f5e9":ci.mins<=35?"#fff8e1":"#fbe9e7",padding:"3px 10px",borderRadius:16,fontSize:11,fontWeight:600,color:ci.mins<=20?B.green:ci.mins<=35?B.amepc:B.red,fontFamily:"'Outfit',sans-serif"}}>🚗 {ci.mins} min → {ci.to}</div>}
        </div>
      </div>
    </div>
    {expanded&&(<div style={{animation:"fadeSlide 0.3s ease-out"}}>
      {h.image_urls && h.image_urls.length > 1 && (
        <div style={{padding:"0 18px 12px",borderTop:`1px solid ${B.border}`,paddingTop:12}}>
          <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:6,scrollSnapType:"x mandatory"}}>
            {h.image_urls.map((url,i)=>(
              <div key={i} style={{flexShrink:0,width:200,height:140,borderRadius:10,overflow:"hidden",background:B.grayL,scrollSnapAlign:"start",border:`1px solid ${B.border}`}}>
                <img src={url} alt={`${h.name} photo ${i+1}`} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{e.target.onerror=null;e.target.style.display='none';}}/>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{padding:"0 18px 12px",...(!(h.image_urls && h.image_urls.length > 1)?{borderTop:`1px solid ${B.border}`,paddingTop:12}:{})}}><p style={{fontSize:12.5,color:"#4a5a6a",lineHeight:1.65,fontFamily:"'Outfit',sans-serif",margin:0}}>{h.desc}</p></div>
      <div style={{padding:"0 18px 10px",display:"flex",gap:6,flexWrap:"wrap"}}>
        <span style={{fontSize:11,fontWeight:600,fontFamily:"'Outfit',sans-serif",padding:"3px 10px",borderRadius:16,background:h.condition==="move-in"?"#e8f5e9":h.condition==="renovation-light"?"#fff8e1":"#fbe9e7",color:h.condition==="move-in"?B.green:h.condition==="renovation-light"?B.amepc:B.red}}>{h.condition==="move-in"?(pt?"✅ Pronto a Habitar":"✅ Move-in Ready"):h.condition==="renovation-light"?(pt?"🔧 Obras Ligeiras":"🔧 Light Reno"):(pt?"🔨 Obras Maiores":"🔨 Major Reno")}</span>
        {(h.epc||h.epc)&&<span style={{fontSize:11,fontWeight:600,fontFamily:"'Outfit',sans-serif",padding:"3px 10px",borderRadius:16,background:B.blueL,color:B.blue}}>⚡ {h.epc?`EPC ${h.epc}`:`EPC ${h.epc}`}</span>}
      </div>
      <div style={{padding:"0 18px 12px",display:"flex",gap:14,flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:130}}>
          <div style={{fontSize:9.5,fontWeight:700,color:"#a8b5c4",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:5,fontFamily:"'Outfit',sans-serif"}}>{pt?"Bairro":"Neighbourhood"}</div>
          {h.walkability_label&&<span style={{fontSize:10.5,color:h.walkability>=7?B.green:h.walkability>=4?B.amepc:B.red,fontWeight:600,fontFamily:"'Outfit',sans-serif",display:"block",marginBottom:3}}>🚶 {pt?(h.walkability>=8?"Muito Caminhável":h.walkability>=6?"Caminhável":h.walkability>=4?"Algo Caminhável":h.walkability>=2?"Dependente de Carro":"Muito Dependente de Carro"):h.walkability_label} ({h.walkability}/10)</span>}
          {h.neighborhood_type&&<span style={{fontSize:10.5,color:B.gray,fontFamily:"'Outfit',sans-serif",display:"block",marginBottom:3}}>📍 {pt?(h.neighborhood_type==="urban"?"Urbano":h.neighborhood_type==="suburban"?"Suburbano":"Rural"):(h.neighborhood_type.charAt(0).toUpperCase()+h.neighborhood_type.slice(1))}</span>}
          <div style={{display:"flex",flexWrap:"wrap",gap:3}}>{(Array.isArray(h.neighborhoodVibe)?h.neighborhoodVibe:[]).map((v,i)=><span key={i} style={{fontSize:10.5,color:B.blue,background:B.blueL,padding:"2px 8px",borderRadius:14,fontFamily:"'Outfit',sans-serif",fontWeight:500}}>{v}</span>)}</div>
        </div>
        <div style={{flex:1,minWidth:130}}>
          <div style={{fontSize:9.5,fontWeight:700,color:"#a8b5c4",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:5,fontFamily:"'Outfit',sans-serif"}}>{pt?"Comodidades":"Amenities"}</div>
          <div style={{display:"flex",flexDirection:"column",gap:2}}>
            {h.amenities.groceries!=null&&<AmStat icon="🛒" label={pt?"Mercearias":"Groceries"} dist={h.amenities.groceries}/>}
            {h.amenities.parks!=null&&<AmStat icon="🌳" label={pt?"Parques":"Parks"} dist={h.amenities.parks}/>}
            {h.amenities.hospitals!=null&&<AmStat icon="🏥" label={pt?"Saúde":"Healthcare"} dist={h.amenities.hospitals}/>}
            {h.beach_nearby&&<span style={{fontSize:11,color:B.blue,fontFamily:"'Outfit',sans-serif"}}>🏖️ {pt?"Praia":"Beach"} {h.nearest_beach?.distance_km||''}km</span>}
            {h.restaurants_count_1km>0&&<span style={{fontSize:11,color:B.gray,fontFamily:"'Outfit',sans-serif"}}>🍽️ {h.restaurants_count_1km} {pt?"restaurantes perto":"restaurants nearby"}</span>}
            {h.transport_count_500m>0&&<span style={{fontSize:11,color:B.gray,fontFamily:"'Outfit',sans-serif"}}>🚌 {h.transport_count_500m} {pt?"paragens de transporte":"transport stops"}</span>}
            {h.nearest_airport&&<span style={{fontSize:11,color:B.gray,fontFamily:"'Outfit',sans-serif"}}>✈️ {h.nearest_airport.name} ({h.nearest_airport.distance_km}km)</span>}
            {(!h.amenities.groceries&&!h.amenities.parks&&!h.amenities.hospitals&&!h.beach_nearby)&&<span style={{fontSize:11,color:"#b0bec5",fontFamily:"'Outfit',sans-serif"}}>{pt?"Dados ainda não disponíveis":"Data not yet available"}</span>}
          </div>
        </div>
      </div>
      <div style={{padding:"0 18px 12px",display:"flex",gap:14,flexWrap:"wrap"}}>
        <div><div style={{fontSize:9.5,fontWeight:700,color:"#a8b5c4",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4,fontFamily:"'Outfit',sans-serif"}}>{pt?"Estacionamento":"Parking"}</div><div style={{display:"flex",flexWrap:"wrap",gap:3}}>{h.parking.map((p,i)=><span key={i} style={{fontSize:10.5,color:B.gray,background:B.grayL,padding:"2px 8px",borderRadius:14,fontFamily:"'Outfit',sans-serif"}}>🅿️ {p.replace(/-/g," ")}</span>)}</div></div>
        <div><div style={{fontSize:9.5,fontWeight:700,color:"#a8b5c4",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4,fontFamily:"'Outfit',sans-serif"}}>{pt?"Animais":"Pets"}</div><span style={{fontSize:10.5,fontFamily:"'Outfit',sans-serif",color:h.petFriendly?B.green:B.red}}>{h.petFriendly?(pt?"🐾 Aceita animais":"🐾 Pet-friendly"):(pt?"🚫 Não aceita animais":"🚫 No pets")}{h.nearbyDogPark?(pt?" · 🐕 Parque canino perto":" · 🐕 Dog park nearby"):""}</span></div>
      </div>
      <div style={{padding:"0 18px 12px",borderTop:`1px solid ${B.border}`,paddingTop:10}}>
        <div style={{fontSize:9.5,fontWeight:700,color:"#a8b5c4",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:5,fontFamily:"'Outfit',sans-serif"}}>{pt?"Porque correspondemos consigo":"Why we matched you"}</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:4}}>{reasons.map((r,i)=><span key={i} style={{fontSize:11,color:B.dark,background:B.grayL,padding:"3px 9px",borderRadius:14,fontFamily:"'Outfit',sans-serif",fontWeight:500}}>{r}</span>)}</div>
      </div>
      {h.agent&&<div style={{padding:"0 18px 12px",borderTop:`1px solid ${B.border}`,paddingTop:10}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
          <div style={{width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${B.blue},${B.blueD})`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:13,fontWeight:700,fontFamily:"'Outfit',sans-serif"}}>{h.agent.ph}</div>
          <div><div style={{fontSize:13,fontWeight:700,color:B.dark,fontFamily:"'Outfit',sans-serif"}}>{h.agent.name}</div><div style={{fontSize:11,color:B.gray,fontFamily:"'Outfit',sans-serif"}}>{h.agent.agency}</div></div>
        </div>
      </div>}
      <div style={{padding:"0 18px 14px",display:"flex",gap:8}}>
        {h.agent?<button onClick={e=>{e.stopPropagation();onContact(h);}} style={{flex:2,padding:"9px",borderRadius:10,fontSize:12.5,fontWeight:700,fontFamily:"'Outfit',sans-serif",cursor:"pointer",background:`linear-gradient(135deg,${B.orange},${B.orangeD})`,color:"#fff",border:"none"}}>✉ Contact Agent</button>
        :<button onClick={e=>{e.stopPropagation();onContact({...h,agent:{name:"homeAImatch Team",agency:"homeAImatch",phone:"",ph:"HA"}});}} style={{flex:2,padding:"9px",borderRadius:10,fontSize:12.5,fontWeight:700,fontFamily:"'Outfit',sans-serif",cursor:"pointer",background:`linear-gradient(135deg,${B.blue},${B.blueD})`,color:"#fff",border:"none"}}>✉ Enquire</button>}
        <button onClick={e=>{e.stopPropagation();onSave(h.id);}} style={{flex:1,padding:"9px",borderRadius:10,fontSize:12.5,fontWeight:600,fontFamily:"'Outfit',sans-serif",cursor:"pointer",background:saved?B.orange:B.white,color:saved?"#fff":B.orange,border:`1.5px solid ${B.orange}`,transition:"all 0.2s"}}>{saved?"♥ Saved":"♡ Save"}</button>
        <button onClick={e=>{e.stopPropagation();const cur=h.currency==='EUR'?'€':'£';const t=`${h.name} in ${h.city} — ${cur}${(h.price/1e3).toFixed(0)}K, ${h.beds} bed, ${h.sqm}m². Found on homeaimatch.com`;if(navigator.share)navigator.share({title:h.name,text:t});else{navigator.clipboard?.writeText(t);alert("Copied!");}}} style={{flex:1,padding:"9px",borderRadius:10,fontSize:12.5,fontWeight:600,fontFamily:"'Outfit',sans-serif",cursor:"pointer",background:B.white,color:B.blue,border:`1.5px solid ${B.blue}`}}>↗ Share</button>
      </div>
    </div>)}
    <div onClick={onToggle} style={{textAlign:"center",padding:"5px 0 10px",fontSize:10.5,color:"#c0cad6",fontFamily:"'Outfit',sans-serif",cursor:"pointer"}}>{expanded?"collapse ▲":"details ▼"}</div>
  </div>);
};

/* ════════════════════════════════════════════════════════════════════
   LANDING PAGE
   ════════════════════════════════════════════════════════════════════ */
const LandingPage = ({onStart, onPricing, email, setEmail, emailSubmitted, onEmailSubmit, lang, setLang}) => {
  var T = _T(lang);
  const features = [
    {icon:"🧠",title:T.feat1t,desc:T.feat1d},
    {icon:"🎯",title:T.feat2t,desc:T.feat2d},
    {icon:"🇮🇪🇵🇹",title:T.feat3t,desc:T.feat3d},
    {icon:"⚡",title:T.feat4t,desc:T.feat4d},
  ];
  const steps = [
    {n:"01",title:T.s1t,desc:T.s1d},
    {n:"02",title:T.s2t,desc:T.s2d},
    {n:"03",title:T.s3t,desc:T.s3d},
  ];
  return(
    <div style={{minHeight:"100vh",background:B.white,fontFamily:"'Outfit',sans-serif"}}>
      {/* Nav */}
      <nav style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",maxWidth:1000,margin:"0 auto",flexWrap:"wrap",gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}><LogoFull/><div style={{display:"flex",gap:2,background:"#f0f2f5",borderRadius:8,padding:2}}><button onClick={function(){setLang("en")}} style={{fontSize:11,padding:"3px 8px",borderRadius:6,border:"none",background:lang==="en"?"#1a2b3c":"transparent",color:lang==="en"?"#fff":"#6b7d8e",fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>EN</button><button onClick={function(){setLang("pt")}} style={{fontSize:11,padding:"3px 8px",borderRadius:6,border:"none",background:lang==="pt"?"#1a2b3c":"transparent",color:lang==="pt"?"#fff":"#6b7d8e",fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>PT</button></div></div>
        <div style={{display:"flex",gap:14,alignItems:"center",flexWrap:"wrap"}}>
          <span onClick={onPricing} style={{fontSize:13,color:B.dark,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>{T.pricing}</span>
          <a href={lang==="pt"?"para-agentes.html":"for-agents.html"} style={{fontSize:13,color:B.blue,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif",textDecoration:"none"}}>{T.forAgents}</a>
          <button onClick={onStart} style={{background:B.orange,color:"#fff",border:"none",padding:"8px 18px",borderRadius:28,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif",transition:"transform 0.2s",letterSpacing:"0.01em",whiteSpace:"nowrap"}} onMouseOver={e=>e.target.style.transform="scale(1.04)"} onMouseOut={e=>e.target.style.transform="scale(1)"}>{T.findHome}</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{maxWidth:1000,margin:"0 auto",padding:"60px 24px 40px",display:"flex",alignItems:"center",gap:50,flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:280}}>
          <div style={{fontSize:11,fontWeight:700,color:B.orange,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>{T.heroTag}</div>
          <h1 style={{fontSize:42,fontWeight:800,color:B.dark,lineHeight:1.12,letterSpacing:"-0.035em",marginBottom:16}}>
            {T.heroH1a}<br/>{T.heroH1b}<span style={{color:B.blue}}>{T.heroH1c}</span>
          </h1>
          <p style={{fontSize:16,color:B.gray,lineHeight:1.65,marginBottom:28,maxWidth:420}}>
            {T.heroP}
          </p>
          {/* Direct CTA — no email friction */}
          <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
            <button onClick={onStart} style={{padding:"16px 36px",borderRadius:14,fontSize:16,fontWeight:700,border:"none",cursor:"pointer",fontFamily:"'Outfit',sans-serif",background:`linear-gradient(135deg,${B.orange},${B.orangeD})`,color:"#fff",boxShadow:"0 4px 16px rgba(245,146,27,0.3)",transition:"transform 0.2s",letterSpacing:"0.01em"}} onMouseOver={e=>e.target.style.transform="scale(1.04)"} onMouseOut={e=>e.target.style.transform="scale(1)"}>
              {T.findHome}
            </button>
            <span onClick={onPricing} style={{fontSize:13.5,color:B.blue,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>{T.seePricing}</span>
          </div>
          <p style={{fontSize:11.5,color:"#b0bec5",marginTop:12}}>{T.heroSub}</p>
        </div>
        {/* Hero Visual */}
        <div style={{flex:1,minWidth:280,display:"flex",justifyContent:"center"}}>
          <div style={{position:"relative",width:300,height:300}}>
            <div style={{position:"absolute",top:0,left:30,animation:"fadeSlide 0.6s ease-out 0.2s both"}}><PropertyImage style="victorian" size={180}/></div>
            <div style={{position:"absolute",bottom:10,right:10,animation:"fadeSlide 0.6s ease-out 0.4s both"}}><PropertyImage style="modern" size={160}/></div>
            <div style={{position:"absolute",bottom:60,left:0,animation:"fadeSlide 0.6s ease-out 0.6s both"}}><PropertyImage style="mediterranean" size={140}/></div>
            <div style={{position:"absolute",top:30,right:0,background:B.orange,color:"#fff",padding:"8px 14px",borderRadius:20,fontSize:12,fontWeight:700,fontFamily:"'Outfit',sans-serif",boxShadow:"0 4px 16px rgba(245,146,27,0.3)",animation:"fadeSlide 0.6s ease-out 0.8s both"}}>94% match ★</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{maxWidth:1000,margin:"0 auto",padding:"50px 24px"}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <h2 style={{fontSize:28,fontWeight:800,color:B.dark,letterSpacing:"-0.03em",marginBottom:8}}>{T.notAvg}</h2>
          <p style={{fontSize:15,color:B.gray}}>{T.notAvgSub}</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))",gap:20}}>
          {features.map((f,i)=>(
            <div key={i} style={{background:B.grayL,borderRadius:14,padding:24,animation:`fadeSlide 0.5s ease-out ${i*0.1}s both`}}>
              <div style={{fontSize:28,marginBottom:10}}>{f.icon}</div>
              <div style={{fontSize:15,fontWeight:700,color:B.dark,marginBottom:6,letterSpacing:"-0.01em"}}>{f.title}</div>
              <div style={{fontSize:13,color:B.gray,lineHeight:1.55}}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{background:B.dark,padding:"56px 24px",marginTop:30}}>
        <div style={{maxWidth:1000,margin:"0 auto"}}>
          <h2 style={{fontSize:28,fontWeight:800,color:B.white,letterSpacing:"-0.03em",marginBottom:8,textAlign:"center"}}>{T.howTitle}</h2>
          <p style={{fontSize:15,color:"#8899aa",textAlign:"center",marginBottom:40}}>Three simple steps to your dream home.</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))",gap:24}}>
            {steps.map((s,i)=>(
              <div key={i} style={{animation:`fadeSlide 0.5s ease-out ${i*0.1}s both`}}>
                <div style={{fontSize:36,fontWeight:800,color:B.orange,fontFamily:"'Outfit',sans-serif",lineHeight:1,marginBottom:10}}>{s.n}</div>
                <div style={{fontSize:16,fontWeight:700,color:B.white,marginBottom:6}}>{s.title}</div>
                <div style={{fontSize:13,color:"#8899aa",lineHeight:1.55}}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{textAlign:"center",padding:"56px 24px"}}>
        <h2 style={{fontSize:28,fontWeight:800,color:B.dark,letterSpacing:"-0.03em",marginBottom:12}}>{T.ctaTitle}</h2>
        <p style={{fontSize:15,color:B.gray,marginBottom:20}}>{T.ctaSub}</p>
        <button onClick={onStart} style={{padding:"16px 40px",borderRadius:32,fontSize:16,fontWeight:700,border:"none",cursor:"pointer",fontFamily:"'Outfit',sans-serif",background:`linear-gradient(135deg,${B.blue},${B.blueD})`,color:"#fff",boxShadow:`0 6px 24px rgba(30,150,209,0.25)`,transition:"transform 0.2s"}} onMouseOver={e=>e.target.style.transform="scale(1.04)"} onMouseOut={e=>e.target.style.transform="scale(1)"}>
          {T.ctaBtn}
        </button>
        <p style={{fontSize:14,color:B.gray,marginBottom:16,marginTop:16}}>Or see <span onClick={onPricing} style={{color:B.blue,cursor:"pointer",fontWeight:600}}>{T.ctaPricing}</span> for agencies.</p>
        <p style={{fontSize:12,color:"#b0bec5",marginTop:8}}>homeaimatch.com · <a href="contact.html" style={{color:"#90a4ae",textDecoration:"none"}}>Contact</a> · <a href="legal.html" style={{color:"#90a4ae",textDecoration:"none"}}>Terms</a> · <a href="legal.html#privacy" style={{color:"#90a4ae",textDecoration:"none"}}>Privacy</a></p>
      </section>
    </div>
  );
};


/* ════════════════════════════════════════════════════════════════════
   MAP VIEW — Shows matched properties on an interactive map
   ════════════════════════════════════════════════════════════════════ */
// Stable hash from string → number between 0 and 1 (deterministic, never changes)
function stableHash(str, salt = 0) {
  let h = salt;
  for (let i = 0; i < str.length; i++) { h = ((h << 5) - h + str.charCodeAt(i)) | 0; }
  return ((h & 0x7fffffff) % 10000) / 10000;
}

const MapView = ({ results }) => {
  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [selectedPin, setSelectedPin] = useState(null);
  const mapInstance = useRef(null);

  // Collect coordinates — use real lat/lng, fall back to stable offset from city center
  const pins = results.map((m, i) => {
    const h = m.house;
    const cityCoords = {
      'cork': [51.8985, -8.4756], 'lourinhã': [39.2417, -9.3133], 'london': [51.5074, -0.1278],
      'manchester': [53.4808, -2.2426], 'birmingham': [52.4862, -1.8904], 'leeds': [53.8008, -1.5491],
      'bristol': [51.4545, -2.5879], 'edinburgh': [55.9533, -3.1883], 'cardiff': [51.4816, -3.1791],
      'newcastle': [54.9783, -1.6178], 'cambridge': [52.2053, 0.1218], 'bath': [51.3758, -2.3599],
      'brighton': [50.8225, -0.1372],
    };
    const cityKey = (h.city || '').toLowerCase();
    const base = cityCoords[cityKey] || [51.9, -8.47];
    const id = h.id || `prop-${i}`;
    // Use real coordinates if available, otherwise deterministic offset from property ID
    const lat = h.latitude || (base[0] + (stableHash(id, 1) - 0.5) * 0.04);
    const lng = h.longitude || (base[1] + (stableHash(id, 2) - 0.5) * 0.04);
    return { ...m, lat, lng, rank: i + 1 };
  }).filter(p => p.lat && p.lng);

  useEffect(() => {
    if (!mapRef.current || mapReady) return;
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => setMapReady(true);
      document.head.appendChild(script);
    } else {
      setMapReady(true);
    }
  }, []);

  useEffect(() => {
    if (!mapReady || !window.L || !mapRef.current || pins.length === 0) return;
    // Properly destroy previous map instance
    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }
    const map = window.L.map(mapRef.current, { scrollWheelZoom: true, zoomControl: true });
    mapInstance.current = map;
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap', maxZoom: 18,
    }).addTo(map);

    const markers = [];
    pins.forEach(p => {
      const h = p.house;
      const cur = h.currency === 'EUR' ? '€' : '£';
      const priceStr = h.price >= 1e6 ? `${cur}${(h.price/1e6).toFixed(1)}M` : `${cur}${(h.price/1e3).toFixed(0)}K`;
      const scoreColor = p.pct >= 85 ? '#2E8B57' : p.pct >= 70 ? '#F5921B' : '#6B7D8E';
      const icon = window.L.divIcon({
        className: '',
        html: `<div style="background:${scoreColor};color:#fff;font-family:'Outfit',sans-serif;font-size:11px;font-weight:700;padding:4px 8px;border-radius:16px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.2);border:2px solid #fff;display:flex;align-items:center;gap:3px;cursor:pointer"><span>${p.pct}%</span><span style="font-weight:500;font-size:10px">${priceStr}</span></div>`,
        iconSize: [80, 28], iconAnchor: [40, 14],
      });
      const marker = window.L.marker([p.lat, p.lng], { icon }).addTo(map);
      marker.on('click', () => setSelectedPin(p));
      markers.push(marker);
    });
    if (markers.length > 0) {
      const group = window.L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.15));
    }
    return () => { if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null; } };
  }, [mapReady, pins.length]);

  const cur = selectedPin ? (selectedPin.house.currency === 'EUR' ? '€' : '£') : '';

  return (
    <div style={{borderRadius:14,overflow:"hidden",border:`1px solid ${B.border}`,background:B.white}}>
      <div ref={mapRef} style={{height:400,width:"100%",background:B.grayL}}/>
      {!mapReady && <div style={{textAlign:"center",padding:40,color:B.gray,fontSize:13}}>Loading map...</div>}
      {selectedPin && (
        <div style={{padding:16,borderTop:`1px solid ${B.border}`,animation:"fadeSlide 0.25s ease-out"}}>
          <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
            {selectedPin.house.image_urls?.[0] ? (
              <img src={selectedPin.house.image_urls[0]} style={{width:90,height:65,borderRadius:10,objectFit:"cover",flexShrink:0}} onError={e=>{e.target.style.display='none'}}/>
            ) : (
              <PropertyImage style={selectedPin.house.style || "traditional"} size={90}/>
            )}
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                <div>
                  <div style={{fontSize:14,fontWeight:700,color:B.dark,fontFamily:"'Outfit',sans-serif"}}>{selectedPin.house.name}</div>
                  <div style={{fontSize:12,color:B.gray,fontFamily:"'Outfit',sans-serif"}}>{selectedPin.house.city} · {selectedPin.house.beds} bed · {selectedPin.house.sqm}m²</div>
                </div>
                <div style={{background:selectedPin.pct>=85?'#e8f5e9':selectedPin.pct>=70?'#FFF4E5':B.grayL,color:selectedPin.pct>=85?'#2E8B57':selectedPin.pct>=70?B.orange:B.gray,padding:"4px 10px",borderRadius:12,fontSize:13,fontWeight:700,fontFamily:"'Outfit',sans-serif",whiteSpace:"nowrap"}}>{selectedPin.pct}% match</div>
              </div>
              <div style={{fontSize:16,fontWeight:800,color:B.dark,fontFamily:"'Outfit',sans-serif",marginTop:4}}>{cur}{selectedPin.house.price?.toLocaleString()}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:6}}>
                {(selectedPin.reasons || []).slice(0,3).map((r,i) => (
                  <span key={i} style={{fontSize:10,color:B.dark,background:B.grayL,padding:"2px 8px",borderRadius:12,fontFamily:"'Outfit',sans-serif"}}>{r}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


const ContactModal=({agent,house,answers,lang:cLang,onClose})=>{
  const pt=cLang==="pt";
  const[cn,setCn]=useState("");
  const[ce,setCe]=useState("");
  const[cm,setCm]=useState(pt ? "Olá " + agent.name + ", encontrei " + house.name + " no homeAImatch e gostaria de agendar uma visita." : "Hi " + agent.name + ", I found " + house.name + " on homeAImatch and would love to arrange a viewing.");
  const[sent,setSent]=useState(false);
  const[consent,setConsent]=useState(false);
  const[profileConsent,setProfileConsent]=useState(true);
  const F2 = "'Outfit',sans-serif";
  const canSend = cn && ce.includes("@") && consent;
  if(sent)return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:16,animation:"fadeSlide 0.3s ease-out"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:B.white,borderRadius:18,padding:32,maxWidth:400,width:"100%",textAlign:"center"}}>
        <div style={{width:56,height:56,borderRadius:"50%",background:"#e8f5e9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 14px"}}>✓</div>
        <div style={{fontSize:18,fontWeight:700,color:B.dark,fontFamily:F2,marginBottom:6}}>{pt?"Mensagem Enviada!":"Message Sent!"}</div>
        <div style={{fontSize:13,color:B.gray,fontFamily:F2,lineHeight:1.5,marginBottom:20}}>{pt?`${agent.name} da ${agent.agency} responderá em breve.`:`${agent.name} from ${agent.agency} will reply shortly.`}</div>
        <button onClick={onClose} style={{padding:"10px 28px",borderRadius:10,background:B.blue,color:"#fff",border:"none",fontSize:13,fontWeight:600,fontFamily:F2,cursor:"pointer"}}>{pt?"Feito":"Done"}</button>
      </div>
    </div>);
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:16,animation:"fadeSlide 0.3s ease-out"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:B.white,borderRadius:18,padding:28,maxWidth:440,width:"100%",maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
          <div><div style={{fontSize:16,fontWeight:700,color:B.dark,fontFamily:F2}}>{pt?"Contactar Agente":"Contact Agent"}</div><div style={{fontSize:12,color:B.gray,fontFamily:F2}}>Re: {house.name}</div></div>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:22,color:B.gray,cursor:"pointer",lineHeight:1}}>x</button>
        </div>
        <div style={{display:"flex",gap:12,alignItems:"center",background:B.grayL,borderRadius:12,padding:14,marginBottom:16}}>
          <div style={{width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,"+B.blue+","+B.blueD+")",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:14,fontWeight:700,fontFamily:F2,flexShrink:0}}>{agent.ph}</div>
          <div><div style={{fontSize:14,fontWeight:700,color:B.dark,fontFamily:F2}}>{agent.name}</div><div style={{fontSize:12,color:B.gray,fontFamily:F2}}>{agent.agency}</div>{agent.phone&&<div style={{fontSize:12,color:B.blue,fontFamily:F2,marginTop:2}}>{agent.phone}</div>}</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <input value={cn} onChange={e=>setCn(e.target.value)} placeholder={pt?"O seu nome":"Your name"} style={{padding:"11px 14px",borderRadius:10,border:"1.5px solid "+B.border,fontSize:13.5,fontFamily:F2,outline:"none",color:B.dark}}/>
          <input value={ce} onChange={e=>setCe(e.target.value)} placeholder={pt?"O seu email":"Your email"} type="email" style={{padding:"11px 14px",borderRadius:10,border:"1.5px solid "+B.border,fontSize:13.5,fontFamily:F2,outline:"none",color:B.dark}}/>
          <textarea value={cm} onChange={e=>setCm(e.target.value)} rows={4} style={{padding:"11px 14px",borderRadius:10,border:"1.5px solid "+B.border,fontSize:13.5,fontFamily:F2,outline:"none",color:B.dark,resize:"vertical",lineHeight:1.5}}/>
          <label style={{display:"flex",gap:8,alignItems:"flex-start",cursor:"pointer",fontSize:11.5,color:B.gray,lineHeight:1.5,fontFamily:F2}}>
            <input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} style={{marginTop:2,flexShrink:0,accentColor:B.blue}}/>
            <span>{pt?<>Autorizo a partilha do meu nome, email e mensagem com o agente. Li a <a href="legal.html#privacy" target="_blank" style={{color:B.blue}}>Política de Privacidade</a> e os <a href="legal.html#tos" target="_blank" style={{color:B.blue}}>Termos de Serviço</a>.</>:<>I agree to share my name, email, and message with the agent. I have read the <a href="legal.html#privacy" target="_blank" style={{color:B.blue}}>Privacy Policy</a> and <a href="legal.html#tos" target="_blank" style={{color:B.blue}}>Terms of Service</a>.</>}</span>
          </label>
          <label style={{display:"flex",gap:8,alignItems:"flex-start",cursor:"pointer",fontSize:11.5,color:B.dark,lineHeight:1.5,fontFamily:F2,background:profileConsent?"#e8f5e9":"#fff8e1",padding:"10px 12px",borderRadius:10,border:"1.5px solid "+(profileConsent?"#66bb6a":"#f59e0b"),marginTop:2}}>
            <input type="checkbox" checked={profileConsent} onChange={e=>setProfileConsent(e.target.checked)} style={{marginTop:2,flexShrink:0,accentColor:"#43a047"}}/>
            <span style={{fontWeight:500}}>{pt?<>📋 Autorizo a partilha do meu <strong>perfil de comprador</strong> (respostas ao quiz: orçamento, preferências, estilo de vida) com o agente para um atendimento mais personalizado.</>:<>📋 I agree to share my <strong>buyer profile</strong> (quiz answers: budget, preferences, lifestyle) with the agent for a more personalised service.</>}</span>
          </label>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>{if(canSend){
              apiCall('/api/leads',{buyer_name:cn,buyer_email:ce,buyer_message:cm,property_id:house.id,match_score:null,buyer_profile:profileConsent?answers:null}).then(()=>setSent(true)).catch(()=>{
                // Fallback to Formspree
                fetch("https://formspree.io/f/YOUR_FORM_ID",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"lead",name:cn,email:ce,message:cm,agent:agent.name,agency:agent.agency,property:house.name,date:new Date().toISOString()})}).catch(err=>console.log(err));setSent(true);
              });
            }}} disabled={!canSend} style={{flex:1,padding:"12px",borderRadius:10,fontSize:13.5,fontWeight:700,border:"none",cursor:canSend?"pointer":"not-allowed",fontFamily:F2,background:canSend?"linear-gradient(135deg,"+B.orange+","+B.orangeD+")":"#ddd",color:"#fff"}}>{pt?"Enviar Mensagem":"Send Message"}</button>
            {agent.phone&&<a href={"tel:"+agent.phone.replace(/ /g,"")} style={{padding:"12px 18px",borderRadius:10,fontSize:13.5,fontWeight:600,border:"1.5px solid "+B.blue,color:B.blue,fontFamily:F2,textDecoration:"none",display:"flex",alignItems:"center",gap:5}}>Call</a>}
          </div>
        </div>
      </div>
    </div>);
};


const CountdownTimer=({lang})=>{
  const [now,setNow]=React.useState(new Date());
  React.useEffect(()=>{const t=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(t);},[]);
  const end=new Date('2027-01-01T00:00:00');
  const diff=Math.max(0,end-now);
  const days=Math.floor(diff/(1000*60*60*24));
  const hrs=Math.floor((diff%(1000*60*60*24))/(1000*60*60));
  const mins=Math.floor((diff%(1000*60*60))/(1000*60));
  const secs=Math.floor((diff%(1000*60))/1000);
  const p=lang==="pt";
  const F2="'Outfit',sans-serif";
  const unit=(v,en,pt)=>React.createElement("div",{style:{textAlign:"center"}},
    React.createElement("div",{style:{fontSize:28,fontWeight:800,color:"#fff",fontFamily:F2}},String(v).padStart(2,'0')),
    React.createElement("div",{style:{fontSize:10,color:"#8899aa",textTransform:"uppercase",letterSpacing:"0.08em"}},p?pt:en));
  return React.createElement("div",{style:{display:"flex",gap:20,justifyContent:"center",marginTop:8}},
    unit(days,"days","dias"),unit(hrs,"hours","horas"),unit(mins,"min","min"),unit(secs,"sec","seg"));
};

const PricingPage=({onBack,onStart,lang})=>{
  var T=_T(lang);
  var p=lang==="pt";
  const F2="'Outfit',sans-serif";
  const agentPlans=[
    {name:p?"GRÁTIS":"FREE",price:"€0",per:"",desc:p?"Para sempre · sem cartão":"Forever · no card needed",color:B.gray,pop:false,cta:p?"Começar Grátis":"Get Started Free",link:"agent-dashboard.html",feat:[(p?"Leads ilimitados":"Unlimited leads")+" ("+(p?"básicos":"basic")+")",p?"Imóveis ilimitados":"Unlimited listings",p?"Lead básico: nome, email, mensagem":"Basic lead: name, email, message",p?"-Reivindicar imóveis existentes":"-Claim existing listings",p?"-Perfil de agente premium":"-Premium agent profile",p?"-Perfil completo do comprador":"-Full buyer profile",p?"-Tags de intenção do comprador":"-Buyer intent tags",p?"-Perfil de comprador ideal":"-Ideal buyer profile per listing"]},
    {name:"STARTER",price:"€25",per:p?"/mês":"/month",desc:p?"Até 10 imóveis":"Up to 10 listings",color:B.blue,pop:true,cta:p?"Subscrever":"Subscribe",link:"agent-dashboard.html",feat:[(p?"Leads ilimitados":"Unlimited leads")+" ("+(p?"premium":"premium")+")",p?"Até 10 imóveis":"Up to 10 listings",p?"Reivindicar imóveis existentes":"Claim existing listings",p?"Perfil completo do comprador via quiz":"Full buyer profile from quiz",p?"Tags de intenção: crédito, prazo, urgência":"Intent tags: mortgage, timeline, urgency",p?"Perfil de comprador ideal por imóvel":"Ideal buyer profile per listing",p?"Compradores ativos ao adicionar imóvel":"Active buyers notified on new listing",p?"Perfil de agente premium com foto":"Premium agent profile with photo",p?"Painel de análise":"Analytics dashboard"]},
    {name:"PRO",price:"€49",per:p?"/mês":"/month",desc:p?"Até 30 imóveis":"Up to 30 listings",color:B.blue,pop:false,cta:p?"Subscrever":"Subscribe",link:"agent-dashboard.html",feat:[p?"Tudo do Starter +":"Everything in Starter +",p?"Até 30 imóveis":"Up to 30 listings",p?"Selo de agente destaque":"Featured agent badge",p?"Suporte prioritário":"Priority support"]},
    {name:"BUSINESS",price:"€99",per:p?"/mês":"/month",desc:p?"Até 100 imóveis":"Up to 100 listings",color:B.blue,pop:false,cta:p?"Subscrever":"Subscribe",link:"agent-dashboard.html",feat:[p?"Tudo do Pro +":"Everything in Pro +",p?"Até 100 imóveis":"Up to 100 listings",p?"Gestor de conta dedicado":"Dedicated account manager",p?"Relatórios avançados":"Advanced reporting"]},
    {name:"ENTERPRISE",price:"€199",per:p?"/mês":"/month",desc:p?"Mais de 100 imóveis":"100+ listings",color:B.dark,pop:false,cta:p?"Subscrever":"Subscribe",link:"agent-dashboard.html",feat:[p?"Tudo do Business +":"Everything in Business +",p?"Mais de 100 imóveis":"100+ listings",p?"Integrações personalizadas":"Custom integrations",p?"Suporte dedicado e onboarding":"Dedicated support & onboarding"]}
  ];
  return(
    <div style={{minHeight:"100vh",background:B.white,fontFamily:F2}}>
      <nav style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 24px",maxWidth:1060,margin:"0 auto"}}>
        <div onClick={onBack} style={{cursor:"pointer"}}><LogoFull/></div>
        <button onClick={onStart} style={{background:B.orange,color:"#fff",border:"none",padding:"10px 24px",borderRadius:28,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:F2}}>{T.findHome}</button>
      </nav>
      <section style={{maxWidth:1060,margin:"0 auto",padding:"40px 24px 10px",textAlign:"center"}}>
        <div style={{fontSize:11,fontWeight:700,color:B.orange,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:10}}>{p?"Preços":"Pricing"}</div>
        <h1 style={{fontSize:38,fontWeight:800,color:B.dark,lineHeight:1.15,letterSpacing:"-0.035em",marginBottom:12}}>{p?"Grátis para compradores. Leads ilimitados para agentes.":"Free for buyers. Unlimited leads for agents."}</h1>
        <p style={{fontSize:15,color:B.gray,maxWidth:520,margin:"0 auto"}}>{p?"Encontre a casa perfeita sem custos. Agentes recebem leads qualificados.":"Find your perfect home at no cost. Agents receive qualified leads."}</p>
      </section>

      {/* Free for Buyers banner */}
      <section style={{maxWidth:1060,margin:"0 auto",padding:"20px 24px 10px",textAlign:"center"}}>
        <div style={{background:B.blueXL||"#F2F9FD",borderRadius:16,padding:"28px 32px",maxWidth:600,margin:"0 auto"}}>
          <div style={{fontSize:32,fontWeight:800,color:B.blue,marginBottom:4}}>{p?"Grátis para Compradores":"Free for Buyers"}</div>
          <div style={{fontSize:14,color:B.gray,lineHeight:1.6}}>{p?"O quiz de correspondência com IA é totalmente grátis. Sempre. Sem subscrições, sem pagamentos. Encontre a casa que combina com o seu estilo de vida.":"The AI matching quiz is completely free. Always. No subscriptions, no payments. Find the home that fits your lifestyle."}</div>
          <button onClick={onStart} style={{marginTop:16,background:B.orange,color:"#fff",border:"none",padding:"12px 32px",borderRadius:28,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:F2}}>{p?"Fazer o Quiz Grátis":"Take the Free Quiz"}</button>
        </div>
      </section>

      {/* Early Access Banner for Agents */}
      <section style={{maxWidth:1060,margin:"0 auto",padding:"30px 24px 10px",textAlign:"center"}}>
        <div style={{background:"linear-gradient(135deg,"+B.dark+","+B.blueD+")",borderRadius:16,padding:"28px 32px",maxWidth:700,margin:"0 auto"}}>
          <div style={{fontSize:11,fontWeight:700,color:B.orange,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8}}>{p?"Acesso Antecipado":"Early Access"}</div>
          <div style={{fontSize:24,fontWeight:800,color:"#fff",marginBottom:6}}>{p?"Grátis para agências até final de 2026":"Free for agencies until end of 2026"}</div>
          <div style={{fontSize:13,color:"#b0c4d8",lineHeight:1.6,marginBottom:12}}>{p?"Registe-se agora e experimente todas as funcionalidades premium sem custos. Ajude-nos a construir a melhor plataforma para si.":"Register now and try all premium features at no cost. Help us build the best platform for you."}</div>
          <CountdownTimer lang={lang}/>
        </div>
      </section>

      <section style={{maxWidth:1060,margin:"0 auto",padding:"20px 24px 8px",textAlign:"center"}}>
        <div style={{fontSize:12,fontWeight:700,color:B.orange,letterSpacing:"0.08em",textTransform:"uppercase",marginTop:10,marginBottom:4}}>{p?"Para Agentes Imobiliários":"For Estate Agents"}</div>
        <p style={{fontSize:13,color:B.gray,maxWidth:500,margin:"0 auto 4px"}}>{p?"Leads ilimitados. Sempre. Preços a partir de Janeiro 2027.":"Unlimited leads. Always. Pricing from January 2027."}</p>
      </section>
      <section style={{maxWidth:1060,margin:"0 auto",padding:"0 24px 20px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:16,alignItems:"start"}}>
        {agentPlans.map((pl,i)=>(
          <div key={i} style={{background:B.white,borderRadius:18,border:pl.pop?"2px solid "+B.blue:"1px solid "+B.border,overflow:"hidden",boxShadow:pl.pop?"0 12px 40px rgba(30,150,209,0.12)":"0 2px 8px rgba(0,0,0,0.04)",animation:"fadeSlide 0.5s ease-out "+(0.3+i*0.1)+"s both"}}>
            {pl.pop&&<div style={{background:B.blue,color:"#fff",textAlign:"center",padding:6,fontSize:11,fontWeight:700,letterSpacing:"0.06em"}}>{p?"MAIS POPULAR":"MOST POPULAR"}</div>}
            <div style={{padding:"24px 20px"}}>
              <div style={{fontSize:12,fontWeight:700,color:pl.color,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>{pl.name}</div>
              <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:6}}><span style={{fontSize:36,fontWeight:800,color:B.dark}}>{pl.price}</span><span style={{fontSize:13,color:B.gray}}>{pl.per}</span></div>
              <div style={{fontSize:12.5,color:B.gray,marginBottom:20}}>{pl.desc}</div>
              <a href={pl.link} style={{display:"block",width:"100%",padding:12,borderRadius:12,fontSize:13,fontWeight:700,border:"none",cursor:"pointer",fontFamily:F2,background:pl.pop?"linear-gradient(135deg,"+B.blue+","+B.blueD+")":B.grayL,color:pl.pop?"#fff":B.dark,textAlign:"center",textDecoration:"none",boxSizing:"border-box"}}>{pl.cta}</a>
              <div style={{marginTop:18,display:"flex",flexDirection:"column",gap:8}}>
                {pl.feat.map((f,j)=>{const inc=!f.startsWith("-");const txt=inc?f:f.slice(1);if(!txt)return null;return(
                  <div key={j} style={{display:"flex",gap:8,alignItems:"flex-start"}}><span style={{fontSize:12,flexShrink:0}}>{inc?"✅":"—"}</span><span style={{fontSize:12.5,color:inc?B.dark:"#b0bec5",fontWeight:f.includes("ilimitados")||f.includes("Unlimited")||f.includes("Tudo")||f.includes("Everything")?700:400,lineHeight:1.35}}>{txt}</span></div>);})}
              </div>
            </div>
          </div>))}
      </section>

      {/* API / White-Label teaser */}
      <section style={{maxWidth:680,margin:"0 auto",padding:"0 24px 24px"}}>
        <div style={{background:B.grayL,border:"2px dashed "+B.border,borderRadius:16,padding:"24px 28px",textAlign:"center"}}>
          <div style={{fontSize:12,fontWeight:700,color:B.orange,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>🔌 API / White-Label</div>
          <div style={{fontSize:20,fontWeight:800,color:B.dark,marginBottom:6}}>{p?"Integre o quiz no seu website":"Embed the quiz on your website"}</div>
          <p style={{fontSize:13,color:B.gray,marginBottom:12,lineHeight:1.5}}>{p?"Adicione o quiz de correspondência por IA diretamente ao website da sua agência.":"Add the AI matching quiz directly to your agency's website."}</p>
          <span style={{display:"inline-block",background:B.orangeL||"#FFF5E9",color:B.orange,fontWeight:700,fontSize:12,padding:"7px 18px",borderRadius:18}}>{p?"Brevemente · Contacte-nos":"Coming Soon · Contact us"}</span>
        </div>
      </section>

      <section style={{maxWidth:960,margin:"0 auto",padding:"10px 24px 30px",textAlign:"center"}}>
        <div style={{background:B.blueXL||"#F2F9FD",borderRadius:16,padding:"28px 32px",display:"flex",flexWrap:"wrap",gap:32,justifyContent:"center",alignItems:"center"}}>
          <div style={{flex:"1 1 200px",textAlign:"center"}}><div style={{fontSize:32,fontWeight:800,color:B.blue}}>2 min</div><div style={{fontSize:13,color:B.gray,marginTop:4}}>{p?"Duração do quiz":"Quiz takes"}</div></div>
          <div style={{flex:"1 1 200px",textAlign:"center"}}><div style={{fontSize:32,fontWeight:800,color:B.blue}}>10+</div><div style={{fontSize:13,color:B.gray,marginTop:4}}>{p?"Critérios avaliados":"Lifestyle criteria scored"}</div></div>
          <div style={{flex:"1 1 200px",textAlign:"center"}}><div style={{fontSize:32,fontWeight:800,color:B.orange}}>∞</div><div style={{fontSize:13,color:B.gray,marginTop:4}}>{p?"Leads para agentes":"Leads for agents"}</div></div>
        </div>
      </section>

      <section style={{maxWidth:700,margin:"0 auto",padding:"10px 24px 50px"}}>
        <h2 style={{fontSize:24,fontWeight:800,color:B.dark,textAlign:"center",marginBottom:24}}>{T.faq}</h2>
        {[{q:T.faqQ1,a:T.faqA1},{q:T.faqQ2,a:T.faqA2},{q:T.faqQ3,a:T.faqA3},{q:T.faqQ4,a:T.faqA4},{q:T.faqQ5,a:T.faqA5},{q:T.faqQ6,a:T.faqA6}].map((f,i)=>(
          <div key={i} style={{borderBottom:"1px solid "+B.border,padding:"16px 0"}}><div style={{fontSize:14,fontWeight:700,color:B.dark,marginBottom:6}}>{f.q}</div><div style={{fontSize:13,color:B.gray,lineHeight:1.6}}>{f.a}</div></div>))}
      </section>
      <div style={{textAlign:"center",padding:"20px 0 40px",fontSize:12,color:"#b0bec5"}}>homeaimatch.com</div>
    </div>);
};

/* ════════════════════════════════════════════════════════════════════
   MAIN APP
   ════════════════════════════════════════════════════════════════════ */
function HomeAIMatch() {
  const [page, setPage] = useState("landing"); // landing | quiz
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [qHistory, setQHistory] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [showOpts, setShowOpts] = useState(false);
  const [results, setResults] = useState(null);
  const [pendingResults, setPendingResults] = useState(null);
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [quizEmail, setQuizEmail] = useState("");
  const [expandedCard, setExpandedCard] = useState(null);
  const [multiSel, setMultiSel] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [formData, setFormData] = useState({});
  const [persona, setPersona] = useState(null);
  const [answered, setAnswered] = useState(0);
  const [saved, setSaved] = useState({});
  const [viewMode, setViewMode] = useState("cards");
  const [contactHouse, setContactHouse] = useState(null);
  var [lang, setLangState] = useState(_initLang);
  var [questions, setQuestions] = useState(getQuestions(null, _initLang));
  const scrollRef = useRef(null);
  var T = _T(lang);
  function handleSetLang(l){setLangState(l);setQuestions(getQuestions(null,l));}

  const totQ = questions.filter((q,i)=>i>0&&(!q.showIf||q.showIf(answers))).length;

  function startQuiz() {
    setPage("quiz");
    setIsTyping(true);
    setTimeout(()=>{
      setMessages([{text:questions[0].text,isUser:false}]);
      setIsTyping(false);
      setTimeout(()=>setShowOpts(true),200);
    },800);
  }

  function handleEmailSubmit() {
    if(!email.includes("@"))return;
    // Send to backend API
    apiCall('/api/subscribe', { email: email, source: 'landing_page' }).catch(()=>{
      // Fallback to Formspree
      fetch("https://formspree.io/f/YOUR_FORM_ID", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, source: "landing_page", date: new Date().toISOString() })
      }).catch(err => console.log("Email submit error:", err));
    });
    setEmailSubmitted(true);
  }

  useEffect(()=>{if(scrollRef.current)setTimeout(()=>{scrollRef.current.scrollTop=scrollRef.current.scrollHeight;},50);},[messages,isTyping,showOpts,results,viewMode]);

  function handleAnswer(opt) {
    const q=questions[currentQ];
    if(q.type==="multi"){setMultiSel(p=>p.includes(opt)?p.filter(o=>o!==opt):[...p,opt]);return;}
    proceed(opt);
  }

  async function proceed(ans) {
    const q=questions[currentQ];

    // For "info" type (welcome screen), don't add user message — just advance
    if(q.type==="info"){
      // Set defaults for Silver Coast Portugal
      const nA={...answers, market:"pt", location:"Silver Coast", currency:"EUR", language:lang};
      setAnswers(nA);setQHistory(h=>[...h,currentQ]);
      const nx=currentQ+1;
      setIsTyping(true);
      setTimeout(()=>{setMessages(p=>[...p,{text:questions[nx].text,isUser:false}]);setIsTyping(false);setCurrentQ(nx);setAnswered(p=>p+1);setTimeout(()=>setShowOpts(true),200);},400);
      return;
    }

    // For "form" type, ans is an object of field values
    if(q.type==="form"){
      const summary = Object.entries(ans).map(([k,v])=>v).join(", ");
      setMessages(p=>[...p,{text:summary,isUser:true}]);
    } else {
      const disp=Array.isArray(ans)?ans.join(", "):ans;
      setMessages(p=>[...p,{text:disp,isUser:true}]);
    }

    setShowOpts(false);setMultiSel([]);setSearchText("");setFormData({});
    const nA={...answers};
    if(q.field){
      if(q.type==="form"){
        // Spread form fields into answers
        Object.entries(ans).forEach(([k,v])=>{nA[k]=v;});
      } else {
        nA[q.field]=ans;
      }
    }
    nA.language = lang;

    setAnswers(nA);setAnswered(p=>p+1);setQHistory(h=>[...h,currentQ]);
    let nx=-1;for(let i=currentQ+1;i<questions.length;i++){if(!questions[i].showIf||questions[i].showIf(nA)){nx=i;break;}}

    if(nx!==-1){
      setIsTyping(true);
      setTimeout(()=>{
        setMessages(p=>[...p,{text:questions[nx].text,isUser:false}]);
        setIsTyping(false);setCurrentQ(nx);
        // Pre-fill form defaults
        if(questions[nx].type==="form"){
          const defaults={};
          questions[nx].fields.forEach(f=>{defaults[f.id]=f.dflt||"";});
          setFormData(defaults);
        }
        setTimeout(()=>setShowOpts(true),200);
      },400+Math.random()*200);
    } else {
      setIsTyping(true);
      setMessages(pr=>[...pr,{text:lang==="pt"?"A procurar o seu lar perfeito...":"Searching for your perfect match...",isUser:false}]);
      // Call real backend API
      const apiResult = await apiCall('/api/match', { answers: nA });
      if (apiResult && apiResult.matches && apiResult.matches.length > 0) {
        const p = apiResult.persona || getPersona(nA, lang);
        setPersona(p);
        setMessages(pr=>[...pr,{text:lang==="pt"?`${p.emoji} O seu perfil: "${p.title}" — ${p.desc || p.description}\n\nEncontrei ${apiResult.matches.length} correspondências para si!`:`${p.emoji} You're "${p.title}" — ${p.desc || p.description}\n\nI found ${apiResult.matches.length} matches for you!`,isUser:false}]);
        setIsTyping(false);
        setTimeout(()=>{
          const mapped = apiResult.matches.map(adaptMatch);
          setPendingResults(mapped);
          setShowEmailGate(true);
        },500);
      } else {
        const p=getPersona(nA,lang);setPersona(p);
        setMessages(pr=>[...pr,{text:lang==="pt"?`${p.emoji} O seu perfil: "${p.title}" — ${p.desc}\n\nA procurar imóveis...`:`${p.emoji} You're "${p.title}" — ${p.desc}\n\nSearching properties...`,isUser:false}]);
        setIsTyping(false);
        setTimeout(()=>{
          const mapped = getMatches(nA);
          setPendingResults(mapped);
          setShowEmailGate(true);
        },500);
      }
    }
  }

  function goBack(){
    if(qHistory.length===0)return;
    var prevQ=qHistory[qHistory.length-1];
    setQHistory(h=>h.slice(0,-1));
    // Remove the last bot message and user answer from messages
    setMessages(p=>{var m=[...p];while(m.length>0&&m[m.length-1].isUser)m.pop();if(m.length>0)m.pop();return m;});
    // Undo the answer
    var q=questions[prevQ];
    if(q.field){setAnswers(a=>{var na={...a};delete na[q.field];return na;});}
    setAnswered(p=>Math.max(0,p-1));
    setCurrentQ(prevQ);
    setShowOpts(true);setMultiSel([]);setSearchText("");
  }

  function unlockResults(){
    // Save email if provided and valid
    if(quizEmail&&quizEmail.includes("@")&&quizEmail.includes(".")){
      fetch(API_URL+"/api/subscribe",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:quizEmail,source:"quiz_results",buyer_profile:answers,persona:persona,date:new Date().toISOString()})}).catch(err=>console.log("Email save error:",err));
    }
    // Always show results
    setResults(pendingResults);
    setShowEmailGate(false);
  }

  function reset(){setMessages([]);setCurrentQ(0);setQHistory([]);setAnswers({});setIsTyping(false);setShowOpts(false);setResults(null);setPendingResults(null);setShowEmailGate(false);setQuizEmail("");setExpandedCard(null);setMultiSel([]);setSearchText("");setFormData({});setPersona(null);setAnswered(0);setSaved({});setViewMode("cards");setQuestions(getQuestions(null,lang));setPage("landing");}

  const cQ=questions[currentQ];
  const filtC=cQ?.type==="search"?(cQ.options||[]).filter(c=>c.toLowerCase().includes(searchText.toLowerCase())):[];
  const sCount=Object.values(saved).filter(Boolean).length;

  const CSS_UK = `@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');@keyframes fadeSlide{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}*{box-sizing:border-box;margin:0;padding:0;}body{background:#fff;}`;

  if(page==="pricing") return(
    <div><style>{CSS_UK}</style>
    <PricingPage onBack={()=>setPage("landing")} onStart={startQuiz} lang={lang}/></div>
  );

  if(page==="landing") return(
    <div><style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');@keyframes fadeSlide{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}*{box-sizing:border-box;margin:0;padding:0;}body{background:#fff;}`}</style>
    <LandingPage onStart={startQuiz} onPricing={()=>setPage("pricing")} email={email} setEmail={setEmail} emailSubmitted={emailSubmitted} onEmailSubmit={handleEmailSubmit} lang={lang} setLang={handleSetLang}/></div>
  );

  return(
    <div style={{minHeight:"100vh",background:"#fafbfc",fontFamily:"'Outfit',sans-serif",display:"flex",flexDirection:"column"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');@keyframes fadeSlide{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}@keyframes bounce{0%,80%,100%{transform:translateY(0);}40%{transform:translateY(-6px);}}*{box-sizing:border-box;margin:0;padding:0;}body{background:#fafbfc;}input::placeholder{color:#b0bec5;}::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:#d0d8e0;border-radius:3px;}`}</style>

      {contactHouse&&contactHouse.agent&&<ContactModal agent={contactHouse.agent} house={contactHouse} answers={answers} lang={lang} onClose={()=>setContactHouse(null)}/>}
      {/* Header */}
      <div style={{background:B.white,borderBottom:`1px solid ${B.border}`,padding:"11px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10}}>
        <LogoFull/>
        <div style={{display:"flex",gap:7,alignItems:"center"}}>
          {email&&<span style={{fontSize:10.5,color:B.gray,fontWeight:500,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{email}</span>}
          {sCount>0&&<span style={{fontSize:10.5,fontWeight:600,color:B.orange,background:B.orangeL,padding:"3px 9px",borderRadius:14}}>♥ {sCount}</span>}
          {(results||answered>2)&&<button onClick={reset} style={{background:B.grayL,border:"none",padding:"6px 13px",borderRadius:7,fontSize:11.5,fontWeight:600,color:B.gray,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>Home</button>}
        </div>
      </div>

      {!results&&answered>0&&<Progress cur={answered} tot={totQ} lang={lang}/>}

      <div ref={scrollRef} style={{flex:1,overflowY:"auto",padding:"18px 12px",maxWidth:680,width:"100%",margin:"0 auto"}}>
        {messages.map((m,i)=><Bubble key={i} text={m.text} isUser={m.isUser}/>)}
        {isTyping&&<Bubble isUser={false}><Dots/></Bubble>}

        {showOpts&&!results&&cQ&&(
          <div style={{animation:"fadeSlide 0.35s ease-out",marginTop:5,marginBottom:8,marginLeft:34}}>

            {/* INFO type — welcome screen with CTA button */}
            {cQ.type==="info"&&(
              <button onClick={()=>proceed("start")} style={{background:`linear-gradient(135deg,${B.blue},${B.blueD})`,color:"#fff",border:"none",padding:"12px 28px",borderRadius:24,fontSize:14,fontFamily:"'Outfit',sans-serif",fontWeight:700,cursor:"pointer",marginTop:4,transition:"transform 0.2s",boxShadow:"0 4px 14px rgba(30,150,209,0.3)"}}>{cQ.cta}</button>
            )}

            {/* FORM type — compact multi-field form */}
            {cQ.type==="form"&&(
              <div style={{background:B.white,borderRadius:14,padding:"18px 16px",border:`1.5px solid ${B.border}`,marginBottom:8}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  {cQ.fields.map((f,i)=>(
                    <div key={f.id} style={i===cQ.fields.length-1&&cQ.fields.length%2!==0?{gridColumn:"1 / -1"}:{}}>
                      <label style={{fontSize:12,fontWeight:600,color:B.gray,fontFamily:"'Outfit',sans-serif",display:"block",marginBottom:4}}>{f.label}</label>
                      <select value={formData[f.id]||f.dflt||""} onChange={e=>{setFormData(p=>({...p,[f.id]:e.target.value}));}} style={{width:"100%",padding:"9px 12px",borderRadius:10,border:`1.5px solid ${B.border}`,fontSize:13,fontFamily:"'Outfit',sans-serif",background:"#fff",color:B.dark,outline:"none",cursor:"pointer"}}>
                        {f.options.map(o=><option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <button onClick={()=>{const vals={};cQ.fields.forEach(f=>{vals[f.id]=formData[f.id]||f.dflt||f.options[0];});proceed(vals);}} style={{width:"100%",background:`linear-gradient(135deg,${B.blue},${B.blueD})`,color:"#fff",border:"none",padding:"11px 22px",borderRadius:12,fontSize:13,fontFamily:"'Outfit',sans-serif",fontWeight:700,cursor:"pointer",marginTop:14}}>{T.contBtn}</button>
              </div>
            )}

            {/* SEARCH / FREETEXT types */}
            {(cQ.type==="search"||cQ.type==="freetext")&&<input type="text" value={searchText} onChange={e=>setSearchText(e.target.value.slice(0,cQ.maxLen||200))} placeholder={cQ.placeholder} style={{width:"100%",padding:"10px 14px",borderRadius:10,border:`1.5px solid ${B.border}`,fontSize:13.5,fontFamily:"'Outfit',sans-serif",outline:"none",background:"#fff",color:B.dark,marginBottom:7}} onFocus={e=>e.target.style.borderColor=B.blue} onBlur={e=>e.target.style.borderColor=B.border} onKeyDown={e=>{if(e.key==="Enter"&&cQ.type==="freetext"&&searchText.trim())proceed(searchText.trim());}}/>}
            {cQ.type==="freetext"&&<div style={{display:"flex",gap:6,marginBottom:4}}><button onClick={function(){if(searchText.trim())proceed(searchText.trim());}} style={{background:searchText.trim()?B.blue:"#ccc",color:"#fff",border:"none",padding:"8px 18px",borderRadius:22,fontSize:12.5,fontFamily:"'Outfit',sans-serif",fontWeight:600,cursor:searchText.trim()?"pointer":"default"}}>{(_T(lang)).contBtn}</button><button onClick={function(){proceed("No preference");}} style={{background:"#fff",color:B.gray,border:"1.5px solid "+B.border,padding:"8px 15px",borderRadius:22,fontSize:12.5,fontFamily:"'Outfit',sans-serif",fontWeight:500,cursor:"pointer"}}>{lang==="pt"?"Sem preferência":"No preference"}</button></div>}

            {/* SINGLE / MULTI option buttons */}
            {(cQ.type==="single"||cQ.type==="multi")&&(
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {cQ.options.map((opt,i)=>{
                  const sel=cQ.type==="multi"&&multiSel.includes(opt);
                  return <button key={i} onClick={()=>handleAnswer(opt)} style={{background:sel?B.dark:"#fff",color:sel?"#f0f4f8":B.dark,border:sel?`1.5px solid ${B.dark}`:`1.5px solid ${B.border}`,padding:"8px 15px",borderRadius:22,fontSize:12.5,fontFamily:"'Outfit',sans-serif",fontWeight:500,cursor:"pointer",transition:"all 0.2s"}}>{opt}</button>;
                })}
              </div>
            )}

            {cQ.type==="multi"&&multiSel.length>0&&<button onClick={()=>proceed(multiSel)} style={{background:`linear-gradient(135deg,${B.blue},${B.blueD})`,color:"#fff",border:"none",padding:"9px 22px",borderRadius:22,fontSize:12.5,fontFamily:"'Outfit',sans-serif",fontWeight:600,cursor:"pointer",marginTop:7}}>{T.contBtn}</button>}
            {qHistory.length>0&&cQ.type!=="info"&&<button onClick={goBack} style={{background:"transparent",border:"none",padding:"8px 0",fontSize:12,fontFamily:"'Outfit',sans-serif",fontWeight:500,color:B.gray,cursor:"pointer",marginTop:6,display:"flex",alignItems:"center",gap:4}}>{lang==="pt"?"← Voltar":"← Back"}</button>}
          </div>
        )}

        {showEmailGate&&!results&&(
          <div style={{background:B.white,borderRadius:14,padding:"24px 20px",border:`1.5px solid ${B.blue}`,animation:"fadeSlide 0.5s ease-out",marginTop:12}}>
            <div style={{fontSize:15,fontWeight:700,color:B.dark,marginBottom:4}}>{lang==="pt"?"📬 Os seus resultados estão prontos!":"📬 Your matches are ready!"}</div>
            <div style={{fontSize:12.5,color:B.gray,lineHeight:1.6,marginBottom:14}}>{lang==="pt"?"Introduza o seu email para ver os resultados e receber notificações de novos imóveis que combinem com o seu perfil.":"Enter your email to see your results and get notified when new properties match your profile."}</div>
            <div style={{display:"flex",gap:8}}>
              <input value={quizEmail} onChange={e=>setQuizEmail(e.target.value)} placeholder={lang==="pt"?"O seu email":"Your email"} type="email" onKeyDown={e=>{if(e.key==="Enter")unlockResults()}} style={{flex:1,padding:"10px 14px",borderRadius:10,border:`1.5px solid ${B.border}`,fontSize:13,fontFamily:"'Outfit',sans-serif",outline:"none"}}/>
              <button onClick={unlockResults} style={{padding:"10px 20px",borderRadius:10,background:`linear-gradient(135deg,${B.blue},${B.blueD})`,color:"#fff",border:"none",fontSize:13,fontWeight:700,fontFamily:"'Outfit',sans-serif",cursor:"pointer",whiteSpace:"nowrap"}}>{lang==="pt"?"Ver Resultados →":"See Results →"}</button>
            </div>
            <button onClick={()=>{setResults(pendingResults);setShowEmailGate(false)}} style={{background:"none",border:"none",color:B.gray,fontSize:11,fontFamily:"'Outfit',sans-serif",cursor:"pointer",marginTop:10,opacity:0.6,textDecoration:"underline"}}>{lang==="pt"?"Continuar sem email":"Skip for now"}</button>
          </div>
        )}

        {results&&(
          <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:11}}>
            {persona&&(<div style={{background:`linear-gradient(135deg,${B.dark} 0%,${B.blueD} 100%)`,borderRadius:14,padding:"18px 20px",color:"#f0f4f8",animation:"fadeSlide 0.5s ease-out",marginBottom:2}}><div style={{fontSize:24,marginBottom:3}}>{persona.emoji}</div><div style={{fontSize:16,fontWeight:700,letterSpacing:"-0.02em",marginBottom:2}}>{persona.title}</div><div style={{fontSize:12.5,opacity:0.85,lineHeight:1.5}}>{persona.desc}</div></div>)}
            <div style={{display:"flex",gap:0,background:B.grayL,borderRadius:8,padding:2,alignSelf:"flex-start"}}>
              {["cards","compare","map"].map(m=><button key={m} onClick={()=>setViewMode(m)} style={{padding:"6px 14px",borderRadius:6,fontSize:11.5,fontWeight:600,fontFamily:"'Outfit',sans-serif",cursor:"pointer",border:"none",background:viewMode===m?B.white:"transparent",color:viewMode===m?B.dark:B.gray,boxShadow:viewMode===m?"0 1px 3px rgba(0,0,0,0.08)":"none"}}>{m==="cards"?T.cards:m==="compare"?T.compare:T.mapV}</button>)}
            </div>
            {viewMode==="map"?<MapView results={results}/>:viewMode==="compare"?<CompTable results={results}/>:(
              <>{results.map((m,i)=><Card key={m.house.id} match={m} rank={i} expanded={expandedCard===m.house.id} onToggle={()=>setExpandedCard(expandedCard===m.house.id?null:m.house.id)} saved={!!saved[m.house.id]} onSave={id=>setSaved(p=>({...p,[id]:!p[id]}))} onContact={h=>setContactHouse(h)} lang={lang}/>)}</>
            )}
            <div style={{textAlign:"center",padding:"18px 0 10px",fontSize:11.5,color:"#b0bec5",lineHeight:1.6}}>
              {T.matched}<br/>
              <span style={{fontSize:10.5,opacity:0.7}}>homeaimatch.com</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
