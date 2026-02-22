const { useState, useEffect, useRef } = React;

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
      commuteMins: { cityCenter: p.commute_city_center || 20, techHub: (p.commute_city_center || 20) + 5, airport: 40 },
      schools: p.schools_quality || 'good',
      walkability: p.walkability || 5,
      condition: p.condition || 'move-in',
      parking: p.parking || [],
      petFriendly: p.pet_friendly || false,
      nearbyDogPark: p.nearby_dog_park || false,
      neighborhoodVibe: p.neighborhood_vibe || [],
      amenities: {
        groceries: p.amenity_groceries_km || 0.5,
        gyms: p.amenity_gyms_km || 1,
        parks: p.amenity_parks_km || 0.3,
        hospitals: p.amenity_hospitals_km || 3,
      },
      features: p.features || [],
      img: '🏡',
      tagline: p.tagline || `${p.property_type || 'Property'} in ${p.city}`,
      desc: p.description || '',
      source_url: p.source_url,
      image_urls: p.image_urls || [],
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
  <img src="logo-full.png" alt="homeAImatch" height={90} style={{display:"block",maxWidth:260}}/>
);

/* ════════════════════════════════════════════════════════════════════
   MARKETS & HOUSE DATABASE
   ════════════════════════════════════════════════════════════════════ */
const MARKETS = {
  uk: {
    flag: "🇬🇧", label: "United Kingdom",
    cities: ["London","Manchester","Birmingham","Leeds","Bristol","Liverpool","Edinburgh","Glasgow","Cardiff","Newcastle","Sheffield","Nottingham","Cambridge","Oxford","Bath","Brighton","York"]
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
function getQuestions(market) {
  const cities = market ? MARKETS[market].cities : [];
  return [
    { id:"greeting",field:null,type:"single",text:"Welcome to homeAImatch! I'll learn what matters to you and find properties that truly fit your life. Which region?",options:["Cork, Ireland","Lourinhã, Portugal"]},
    { id:"location",field:"location",type:"search",text:`Which city or area interests you?`,options:cities,placeholder:"Type a city..."},
    { id:"radius",field:"radius",type:"single",text:"How far from the city centre would you consider?",options:["Within 10 km","Within 25 km","Within 50 km","Anywhere in the region"]},
    { id:"workFromHome",field:"workFromHome",type:"single",text:"What's your work setup?",options:["Fully remote","Hybrid (2-3 days office)","Full-time in office","Retired / not working"]},
    { id:"commuteTo",field:"commuteTo",type:"single",text:"Where's your commute destination?",options:["City centre","Tech hub / business park","Airport area","Multiple locations"],showIf:a=>a.workFromHome==="Hybrid (2-3 days office)"||a.workFromHome==="Full-time in office"},
    { id:"commuteMax",field:"commuteMax",type:"single",text:"Maximum one-way commute?",options:["Under 15 min","Under 30 min","Under 45 min","Don't mind"],showIf:a=>a.workFromHome==="Hybrid (2-3 days office)"||a.workFromHome==="Full-time in office"},
    { id:"lifestyle",field:"lifestyle",type:"single",text:"What setting feels right?",options:["City buzz — walkable & alive","Suburban — space with access","Countryside — nature & peace","Flexible — wherever suits"]},
    { id:"family",field:"family",type:"single",text:"Who's moving in?",options:["Just me","Me and a partner","Small family (1-2 kids)","Larger family (3+ kids)","Housemates"]},
    { id:"budget",field:"budget",type:"single",text:"Budget ceiling?",options:["Under €200K","€200K – €400K","€400K – €600K","€600K – €800K","€800K+"]},
    { id:"condition",field:"condition",type:"single",text:"How about renovation?",options:["Move-in ready only","Light cosmetic work ok","Big project — bring it on!","Don't care"]},
    { id:"neighborhoodVibe",field:"neighborhoodVibe",type:"multi",text:"What neighbourhood personality? Pick all that fit.",options:["Family-friendly","Nightlife & dining","Artsy & creative","Quiet & peaceful","Close to nature","Upscale"]},
    { id:"pets",field:"pets",type:"single",text:"Any furry companions?",options:["Dog(s) — need garden!","Dog(s) — parks work","Cat(s) only","No pets","Getting one soon"]},
    { id:"parking",field:"parking",type:"multi",text:"Parking needs?",options:["Garage must-have","Driveway fine","Street ok","EV charging","No car"]},
    { id:"priorities",field:"priorities",type:"multi",text:"Nearly done! Top 3 priorities?",options:["Short commute","Great schools","Outdoor space","Modern finishes","Walkable area","Home office","Energy efficient","Great views"]},
    { id:"vibe",field:"vibe",type:"single",text:"Last one — dream style?",options:["Cosy & warm","Sleek & modern","Rustic & charming","Luxurious & refined","Simple & practical"]},
  ];
}

/* ════════════════════════════════════════════════════════════════════
   SCORING ALGORITHM
   ════════════════════════════════════════════════════════════════════ */
function scoreHouse(h, a) {
  let s=0,mx=0,r=[],ci=null;
  mx+=25;if(a.location){const l=a.location.toLowerCase();if(h.city.toLowerCase()===l||h.region?.toLowerCase().includes(l)){s+=25;r.push(`In ${h.region||h.city}`);}}
  mx+=25;const bM={"Under €200K":[0,2e5],"€200K – €400K":[2e5,4e5],"€400K – €600K":[4e5,6e5],"€600K – €800K":[6e5,8e5],"€800K+":[8e5,Infinity],"Under £200K":[0,2e5],"£200K – £400K":[2e5,4e5],"£400K – £600K":[4e5,6e5],"£600K – £800K":[6e5,8e5],"£800K+":[8e5,Infinity]};const[bN,bX]=bM[a.budget]||[0,Infinity];if(h.price>=bN&&h.price<=bX){s+=25;r.push("Within budget");}else if(h.price>=bN*.85&&h.price<=bX*1.15){s+=12;r.push("Near budget range");}
  mx+=20;const nc=a.workFromHome==="Hybrid (2-3 days office)"||a.workFromHome==="Full-time in office";if(nc&&a.commuteTo){const ck={"City centre":"cityCenter","Tech hub / business park":"techHub","Airport area":"airport","Multiple locations":"cityCenter"}[a.commuteTo]||"cityCenter";const m=h.commuteMins[ck]||40;ci={mins:m,to:a.commuteTo};const mm={"Under 15 min":15,"Under 30 min":30,"Under 45 min":45,"Don't mind":90}[a.commuteMax]||45;if(m<=mm){s+=20;r.push(`${m} min commute`);}else if(m<=mm*1.3){s+=10;r.push(`${m} min (slightly over)`);};}else if(a.workFromHome==="Fully remote"){if(h.features.some(f=>f.includes("office")||f.includes("coworking"))){s+=20;r.push("Workspace included");}else if(h.sqm>=140){s+=12;r.push("Room for office");}else s+=6;}else s+=10;
  mx+=15;const fb={"Just me":1,"Me and a partner":1,"Small family (1-2 kids)":3,"Larger family (3+ kids)":4,"Housemates":3};const mb=fb[a.family]||1;if(h.beds>=mb){s+=15;r.push(`${h.beds} bedrooms`);}else if(h.beds>=mb-1)s+=7;
  mx+=15;const cp={"Move-in ready only":["move-in"],"Light cosmetic work ok":["move-in","renovation-light"],"Big project — bring it on!":["renovation-major","renovation-light"],"Don't care":["move-in","renovation-light","renovation-major"]};if((cp[a.condition]||[]).includes(h.condition)){s+=15;r.push({"move-in":"Move-in ready","renovation-light":"Light reno","renovation-major":"Reno project"}[h.condition]);}
  mx+=12;const lM={"City buzz — walkable & alive":"urban","Suburban — space with access":"suburban","Countryside — nature & peace":"rural","Flexible — wherever suits":null};const lp=lM[a.lifestyle];if(lp===null)s+=8;else if(h.neighborhood===lp){s+=12;r.push(`${lp.charAt(0).toUpperCase()+lp.slice(1)} area`);}
  mx+=10;const vM={"Family-friendly":"family-friendly","Nightlife & dining":"nightlife","Artsy & creative":"artsy","Quiet & peaceful":"quiet","Close to nature":"nature-lovers","Upscale":"luxury"};let vh=0;(a.neighborhoodVibe||[]).forEach(v=>{if(vM[v]&&h.neighborhoodVibe.includes(vM[v]))vh++;});if(vh>0){s+=Math.min(vh*5,10);r.push("Vibe match");}
  mx+=10;if(a.pets==="Dog(s) — need garden!"){if(h.petFriendly&&h.yard!=="none"&&h.yard!=="small"){s+=10;r.push("Garden for dogs");}else if(h.petFriendly)s+=4;}else if(a.pets==="Dog(s) — parks work"||a.pets==="Getting one soon"){if(h.petFriendly&&h.nearbyDogPark){s+=10;r.push("Dog parks nearby");}else if(h.petFriendly)s+=5;}else if(a.pets==="Cat(s) only")s+=7;else s+=6;
  mx+=8;let ph=0;(a.parking||[]).forEach(p=>{if(p==="Garage must-have"&&h.parking.some(pk=>pk.includes("garage")))ph++;if(p==="EV charging"&&h.parking.includes("ev-charging"))ph++;if(p==="Driveway fine"&&h.parking.some(pk=>pk.includes("driveway")||pk.includes("garage")))ph++;if(p==="Street ok"||p==="No car")ph++;});if(ph>0){s+=Math.min(ph*4,8);r.push("Parking ✓");}
  mx+=15;const pC={"Short commute":()=>Object.values(h.commuteMins).some(m=>m<=15),"Great schools":()=>h.schools==="excellent","Outdoor space":()=>h.yard!=="none","Modern finishes":()=>["modern","contemporary","luxury","industrial"].includes(h.style),"Walkable area":()=>h.walkability>=8,"Home office":()=>h.features.some(f=>f.includes("office")),"Energy efficient":()=>h.features.some(f=>f.includes("solar")||f.includes("heat-pump"))||(h.epc&&h.epc.startsWith("A"))||(h.epc==="A"),"Great views":()=>h.features.some(f=>f.includes("view")||f.includes("sea")||f.includes("river")||f.includes("ocean"))};(a.priorities||[]).forEach(p=>{if(pC[p]?.()){s+=5;r.push(`✓ ${p}`);}});
  mx+=8;const sM={"Cosy & warm":["cottage","craftsman","traditional","georgian"],"Sleek & modern":["modern","contemporary","industrial"],"Rustic & charming":["cottage","historic","traditional","victorian","mediterranean"],"Luxurious & refined":["luxury","modern","contemporary"],"Simple & practical":["traditional","modern"]};if((sM[a.vibe]||[]).includes(h.style)){s+=8;r.push("Style match");}
  return{house:h,score:s,maxScore:mx,pct:Math.min(Math.round((s/mx)*100),99),reasons:[...new Set(r)],commuteInfo:ci};
}

function getMatches(a){return HOUSES_UK.map(h=>scoreHouse(h,a)).sort((a,b)=>b.pct-a.pct).slice(0,5);}

function getPersona(a){
  if(a.condition?.includes("project"))return{title:"The Visionary Renovator",emoji:"🔨",desc:"You see diamonds in the rough and have the vision to transform them."};
  if(a.workFromHome==="Fully remote"&&a.lifestyle?.includes("Countryside"))return{title:"The Digital Nomad",emoji:"🌍",desc:"Freedom to live wherever inspires you."};
  if(a.family?.includes("family"))return{title:"The Nesting Pro",emoji:"🐣",desc:"Schools, space, and safety — building a home for your crew."};
  if(a.lifestyle?.includes("City"))return{title:"The Urban Explorer",emoji:"🌃",desc:"Walkability, culture, and being in the thick of it."};
  if(a.vibe==="Luxurious & refined")return{title:"The Refined Seeker",emoji:"✨",desc:"You appreciate quality, design, and the finer details."};
  return{title:"The Smart Buyer",emoji:"🏡",desc:"Methodical, informed, and ready to find the perfect fit."};
}

/* ════════════════════════════════════════════════════════════════════
   UI COMPONENTS
   ════════════════════════════════════════════════════════════════════ */
const Dots = () => <div style={{display:"flex",gap:5,padding:"8px 0"}}>{[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:"#a8b5c4",animation:`bounce 1.2s infinite ${i*.15}s`}}/>)}</div>;

const Progress = ({cur,tot}) => {const p=Math.round((cur/tot)*100);return(<div style={{position:"sticky",top:61,zIndex:9,background:B.white,padding:"10px 24px 7px",borderBottom:`1px solid ${B.border}`}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:10,fontWeight:600,color:B.gray,letterSpacing:"0.08em",fontFamily:"'Outfit',sans-serif"}}>STEP {cur} / {tot}</span><span style={{fontSize:10,fontWeight:700,color:B.dark,fontFamily:"'Outfit',sans-serif"}}>{p}%</span></div><div style={{height:3,background:B.grayL,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",background:`linear-gradient(90deg,${B.blue},${B.orange})`,borderRadius:3,width:`${p}%`,transition:"width 0.5s cubic-bezier(0.4,0,0.2,1)"}}/></div></div>);};

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
const Card = ({match,rank,expanded,onToggle,saved,onSave,onContact}) => {
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
              <div style={{fontSize:9.5,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:top?B.blue:"#a8b5c4",fontFamily:"'Outfit',sans-serif"}}>{top?"★ Best Match":`#${rank+1} Match`}</div>
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
        <span style={{fontSize:11,fontWeight:600,fontFamily:"'Outfit',sans-serif",padding:"3px 10px",borderRadius:16,background:h.condition==="move-in"?"#e8f5e9":h.condition==="renovation-light"?"#fff8e1":"#fbe9e7",color:h.condition==="move-in"?B.green:h.condition==="renovation-light"?B.amepc:B.red}}>{h.condition==="move-in"?"✅ Move-in Ready":h.condition==="renovation-light"?"🔧 Light Reno":"🔨 Major Reno"}</span>
        {(h.epc||h.epc)&&<span style={{fontSize:11,fontWeight:600,fontFamily:"'Outfit',sans-serif",padding:"3px 10px",borderRadius:16,background:B.blueL,color:B.blue}}>⚡ {h.epc?`EPC ${h.epc}`:`EPC ${h.epc}`}</span>}
      </div>
      <div style={{padding:"0 18px 12px",display:"flex",gap:14,flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:130}}>
          <div style={{fontSize:9.5,fontWeight:700,color:"#a8b5c4",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:5,fontFamily:"'Outfit',sans-serif"}}>Neighbourhood</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:3}}>{h.neighborhoodVibe.map((v,i)=><span key={i} style={{fontSize:10.5,color:B.blue,background:B.blueL,padding:"2px 8px",borderRadius:14,fontFamily:"'Outfit',sans-serif",fontWeight:500}}>{v}</span>)}</div>
        </div>
        <div style={{flex:1,minWidth:130}}>
          <div style={{fontSize:9.5,fontWeight:700,color:"#a8b5c4",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:5,fontFamily:"'Outfit',sans-serif"}}>Amenities</div>
          <div style={{display:"flex",flexDirection:"column",gap:2}}>
            <AmStat icon="🛒" label="Groceries" dist={h.amenities.groceries}/><AmStat icon="💪" label="Gym" dist={h.amenities.gyms}/><AmStat icon="🌳" label="Parks" dist={h.amenities.parks}/><AmStat icon="🏥" label="Hospital" dist={h.amenities.hospitals}/>
          </div>
        </div>
      </div>
      <div style={{padding:"0 18px 12px",display:"flex",gap:14,flexWrap:"wrap"}}>
        <div><div style={{fontSize:9.5,fontWeight:700,color:"#a8b5c4",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4,fontFamily:"'Outfit',sans-serif"}}>Parking</div><div style={{display:"flex",flexWrap:"wrap",gap:3}}>{h.parking.map((p,i)=><span key={i} style={{fontSize:10.5,color:B.gray,background:B.grayL,padding:"2px 8px",borderRadius:14,fontFamily:"'Outfit',sans-serif"}}>🅿️ {p.replace(/-/g," ")}</span>)}</div></div>
        <div><div style={{fontSize:9.5,fontWeight:700,color:"#a8b5c4",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4,fontFamily:"'Outfit',sans-serif"}}>Pets</div><span style={{fontSize:10.5,fontFamily:"'Outfit',sans-serif",color:h.petFriendly?B.green:B.red}}>{h.petFriendly?"🐾 Pet-friendly":"🚫 No pets"}{h.nearbyDogPark?" · 🐕 Dog park nearby":""}</span></div>
      </div>
      <div style={{padding:"0 18px 12px",borderTop:`1px solid ${B.border}`,paddingTop:10}}>
        <div style={{fontSize:9.5,fontWeight:700,color:"#a8b5c4",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:5,fontFamily:"'Outfit',sans-serif"}}>Why we matched you</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:4}}>{reasons.map((r,i)=><span key={i} style={{fontSize:11,color:B.dark,background:B.grayL,padding:"3px 9px",borderRadius:14,fontFamily:"'Outfit',sans-serif",fontWeight:500}}>{r}</span>)}</div>
      </div>
      {h.agent&&<div style={{padding:"0 18px 12px",borderTop:`1px solid ${B.border}`,paddingTop:10}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
          <div style={{width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${B.blue},${B.blueD})`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:13,fontWeight:700,fontFamily:"'Outfit',sans-serif"}}>{h.agent.ph}</div>
          <div><div style={{fontSize:13,fontWeight:700,color:B.dark,fontFamily:"'Outfit',sans-serif"}}>{h.agent.name}</div><div style={{fontSize:11,color:B.gray,fontFamily:"'Outfit',sans-serif"}}>{h.agent.agency}</div></div>
        </div>
      </div>}
      <div style={{padding:"0 18px 14px",display:"flex",gap:8}}>
        {h.agent&&<button onClick={e=>{e.stopPropagation();onContact(h);}} style={{flex:2,padding:"9px",borderRadius:10,fontSize:12.5,fontWeight:700,fontFamily:"'Outfit',sans-serif",cursor:"pointer",background:`linear-gradient(135deg,${B.orange},${B.orangeD})`,color:"#fff",border:"none"}}>✉ Contact Agent</button>}
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
const LandingPage = ({onStart, onPricing, email, setEmail, emailSubmitted, onEmailSubmit}) => {
  const features = [
    {icon:"🧠",title:"AI-Powered Matching",desc:"Our algorithm scores properties across 10+ criteria tailored to your unique lifestyle."},
    {icon:"🎯",title:"Lifestyle-First Approach",desc:"We don't just match bedrooms and budget — we match your commute, pets, neighbourhood vibe, and more."},
    {icon:"🇮🇪🇵🇹",title:"Cork & West Portugal",desc:"Live now in Cork, Ireland and the Lourinhã coast of Portugal. More regions coming soon."},
    {icon:"⚡",title:"2-Minute Quiz",desc:"Answer a few conversational questions and get your personalised top matches instantly."},
  ];
  const steps = [
    {n:"01",title:"Tell us about you",desc:"Quick chat about your lifestyle, family, budget, and preferences."},
    {n:"02",title:"Our AI does the work",desc:"We score every listing across 10 weighted criteria unique to you."},
    {n:"03",title:"Get your matches",desc:"Receive your top 5 with detailed comparisons, save & share."},
  ];
  return(
    <div style={{minHeight:"100vh",background:B.white,fontFamily:"'Outfit',sans-serif"}}>
      {/* Nav */}
      <nav style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 24px",maxWidth:1000,margin:"0 auto"}}>
        <LogoFull/>
        <div style={{display:"flex",gap:20,alignItems:"center"}}>
          <span onClick={onPricing} style={{fontSize:13.5,color:B.dark,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>Pricing</span>
          <a href="for-agents.html" style={{fontSize:13.5,color:B.blue,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif",textDecoration:"none"}}>For Agents</a>
        </div>
        <button onClick={onStart} style={{background:B.orange,color:"#fff",border:"none",padding:"10px 24px",borderRadius:28,fontSize:13.5,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif",transition:"transform 0.2s",letterSpacing:"0.01em"}} onMouseOver={e=>e.target.style.transform="scale(1.04)"} onMouseOut={e=>e.target.style.transform="scale(1)"}>Find My Home →</button>
      </nav>

      {/* Hero */}
      <section style={{maxWidth:1000,margin:"0 auto",padding:"60px 24px 40px",display:"flex",alignItems:"center",gap:50,flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:280}}>
          <div style={{fontSize:11,fontWeight:700,color:B.orange,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>AI-Powered Property Matching</div>
          <h1 style={{fontSize:42,fontWeight:800,color:B.dark,lineHeight:1.12,letterSpacing:"-0.035em",marginBottom:16}}>
            Find the home that<br/>fits <span style={{color:B.blue}}>your life</span>
          </h1>
          <p style={{fontSize:16,color:B.gray,lineHeight:1.65,marginBottom:28,maxWidth:420}}>
            Stop scrolling through hundreds of listings. Answer a few questions about how you actually live, and our AI will match you with properties that truly fit — now live in Cork, Ireland and West Portugal.
          </p>
          {/* Email Capture */}
          {!emailSubmitted ? (
            <div style={{display:"flex",gap:8,maxWidth:420,flexWrap:"wrap"}}>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Enter your email to get started"
                style={{flex:1,minWidth:200,padding:"14px 18px",borderRadius:12,border:`1.5px solid ${B.border}`,fontSize:14,fontFamily:"'Outfit',sans-serif",outline:"none",color:B.dark,transition:"border-color 0.2s"}}
                onFocus={e=>e.target.style.borderColor=B.blue} onBlur={e=>e.target.style.borderColor=B.border}
                onKeyDown={e=>{if(e.key==="Enter"&&email.includes("@"))onEmailSubmit();}}
              />
              <button onClick={onEmailSubmit} disabled={!email.includes("@")} style={{padding:"14px 28px",borderRadius:12,fontSize:14,fontWeight:700,border:"none",cursor:email.includes("@")?"pointer":"not-allowed",fontFamily:"'Outfit',sans-serif",background:email.includes("@")?`linear-gradient(135deg,${B.blue},${B.blueD})`:"#ccc",color:"#fff",transition:"all 0.2s",opacity:email.includes("@")?1:0.6}}>
                Start Matching
              </button>
            </div>
          ) : (
            <div style={{animation:"fadeSlide 0.4s ease-out"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:"#e8f5e9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>✓</div>
                <span style={{fontSize:14,color:B.green,fontWeight:600}}>You're in! Let's find your home.</span>
              </div>
              <button onClick={onStart} style={{padding:"14px 32px",borderRadius:12,fontSize:15,fontWeight:700,border:"none",cursor:"pointer",fontFamily:"'Outfit',sans-serif",background:`linear-gradient(135deg,${B.orange},${B.orangeD})`,color:"#fff"}}>
                Start the Quiz →
              </button>
            </div>
          )}
          <p style={{fontSize:11.5,color:"#b0bec5",marginTop:12}}>Free forever · No spam · 2 min quiz</p>
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
          <h2 style={{fontSize:28,fontWeight:800,color:B.dark,letterSpacing:"-0.03em",marginBottom:8}}>Not your average property search</h2>
          <p style={{fontSize:15,color:B.gray}}>We match your lifestyle, not just your filter criteria.</p>
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
          <h2 style={{fontSize:28,fontWeight:800,color:B.white,letterSpacing:"-0.03em",marginBottom:8,textAlign:"center"}}>How it works</h2>
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
        <h2 style={{fontSize:28,fontWeight:800,color:B.dark,letterSpacing:"-0.03em",marginBottom:12}}>Ready to find your perfect home?</h2>
        <p style={{fontSize:15,color:B.gray,marginBottom:20}}>Live now in Cork, Ireland & Lourinhã coast, Portugal.</p>
        <button onClick={onStart} style={{padding:"16px 40px",borderRadius:32,fontSize:16,fontWeight:700,border:"none",cursor:"pointer",fontFamily:"'Outfit',sans-serif",background:`linear-gradient(135deg,${B.blue},${B.blueD})`,color:"#fff",boxShadow:`0 6px 24px rgba(30,150,209,0.25)`,transition:"transform 0.2s"}} onMouseOver={e=>e.target.style.transform="scale(1.04)"} onMouseOut={e=>e.target.style.transform="scale(1)"}>
          Take the 2-Minute Quiz →
        </button>
        <p style={{fontSize:14,color:B.gray,marginBottom:16,marginTop:16}}>Or see <span onClick={onPricing} style={{color:B.blue,cursor:"pointer",fontWeight:600}}>pricing</span> for agencies.</p>
        <p style={{fontSize:12,color:"#b0bec5",marginTop:8}}>homeaimatch.com</p>
      </section>
    </div>
  );
};


const ContactModal=({agent,house,onClose})=>{
  const[cn,setCn]=useState("");
  const[ce,setCe]=useState("");
  const[cm,setCm]=useState("Hi " + agent.name + ", I found " + house.name + " on homeAImatch and would love to arrange a viewing.");
  const[sent,setSent]=useState(false);
  const F2 = "'Outfit',sans-serif";
  if(sent)return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:16,animation:"fadeSlide 0.3s ease-out"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:B.white,borderRadius:18,padding:32,maxWidth:400,width:"100%",textAlign:"center"}}>
        <div style={{width:56,height:56,borderRadius:"50%",background:"#e8f5e9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 14px"}}>✓</div>
        <div style={{fontSize:18,fontWeight:700,color:B.dark,fontFamily:F2,marginBottom:6}}>Message Sent!</div>
        <div style={{fontSize:13,color:B.gray,fontFamily:F2,lineHeight:1.5,marginBottom:20}}>{agent.name} from {agent.agency} will reply shortly.</div>
        <button onClick={onClose} style={{padding:"10px 28px",borderRadius:10,background:B.blue,color:"#fff",border:"none",fontSize:13,fontWeight:600,fontFamily:F2,cursor:"pointer"}}>Done</button>
      </div>
    </div>);
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:16,animation:"fadeSlide 0.3s ease-out"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:B.white,borderRadius:18,padding:28,maxWidth:440,width:"100%",maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
          <div><div style={{fontSize:16,fontWeight:700,color:B.dark,fontFamily:F2}}>Contact Agent</div><div style={{fontSize:12,color:B.gray,fontFamily:F2}}>Re: {house.name}</div></div>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:22,color:B.gray,cursor:"pointer",lineHeight:1}}>x</button>
        </div>
        <div style={{display:"flex",gap:12,alignItems:"center",background:B.grayL,borderRadius:12,padding:14,marginBottom:16}}>
          <div style={{width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,"+B.blue+","+B.blueD+")",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:14,fontWeight:700,fontFamily:F2,flexShrink:0}}>{agent.ph}</div>
          <div><div style={{fontSize:14,fontWeight:700,color:B.dark,fontFamily:F2}}>{agent.name}</div><div style={{fontSize:12,color:B.gray,fontFamily:F2}}>{agent.agency}</div><div style={{fontSize:12,color:B.blue,fontFamily:F2,marginTop:2}}>{agent.phone}</div></div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <input value={cn} onChange={e=>setCn(e.target.value)} placeholder="Your name" style={{padding:"11px 14px",borderRadius:10,border:"1.5px solid "+B.border,fontSize:13.5,fontFamily:F2,outline:"none",color:B.dark}}/>
          <input value={ce} onChange={e=>setCe(e.target.value)} placeholder="Your email" type="email" style={{padding:"11px 14px",borderRadius:10,border:"1.5px solid "+B.border,fontSize:13.5,fontFamily:F2,outline:"none",color:B.dark}}/>
          <textarea value={cm} onChange={e=>setCm(e.target.value)} rows={4} style={{padding:"11px 14px",borderRadius:10,border:"1.5px solid "+B.border,fontSize:13.5,fontFamily:F2,outline:"none",color:B.dark,resize:"vertical",lineHeight:1.5}}/>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>{if(cn&&ce.includes("@")){
              apiCall('/api/leads',{buyer_name:cn,buyer_email:ce,buyer_message:cm,property_id:house.id,match_score:null}).then(()=>setSent(true)).catch(()=>{
                // Fallback to Formspree
                fetch("https://formspree.io/f/YOUR_FORM_ID",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"lead",name:cn,email:ce,message:cm,agent:agent.name,agency:agent.agency,property:house.name,date:new Date().toISOString()})}).catch(err=>console.log(err));setSent(true);
              });
            }}} disabled={!cn||!ce.includes("@")} style={{flex:1,padding:"12px",borderRadius:10,fontSize:13.5,fontWeight:700,border:"none",cursor:cn&&ce.includes("@")?"pointer":"not-allowed",fontFamily:F2,background:cn&&ce.includes("@")?"linear-gradient(135deg,"+B.orange+","+B.orangeD+")":"#ddd",color:"#fff"}}>Send Message</button>
            <a href={"tel:"+agent.phone.replace(/ /g,"")} style={{padding:"12px 18px",borderRadius:10,fontSize:13.5,fontWeight:600,border:"1.5px solid "+B.blue,color:B.blue,fontFamily:F2,textDecoration:"none",display:"flex",alignItems:"center",gap:5}}>Call</a>
          </div>
        </div>
      </div>
    </div>);
};


const PricingPage=({onBack,onStart})=>{
  const F2="'Outfit',sans-serif";
  const buyerPlans=[
    {name:"Free Search",price:"Free",per:"",desc:"See if homeAImatch is right for you",color:B.gray,pop:false,cta:"Try Free",feat:["AI lifestyle quiz","Top 3 matches (basic info)","Match score percentage","Buyer persona","-Full property details","-AI reasoning & insights","-Neighbourhood data","-Agent contact"]},
    {name:"Full Report",price:"€4.99",per:"/search",desc:"Everything you need to decide",color:B.blue,pop:true,cta:"Get Full Report",feat:["Everything in Free +","ALL matching properties scored","Full AI reasoning per match","Walkability & commute data","School ratings & EPC energy","Price history & area trends","Comparison table","Direct agent contact"]},
    {name:"3-Pack",price:"€9.99",per:"3 searches",desc:"Refine as you go — save 33%",color:B.blueD||B.blue,pop:false,cta:"Buy 3-Pack",feat:["3 Full Reports","Same features as Full Report","Use anytime, no expiry","Perfect for refining","Share reports with partner","Priority support","-","-"]}
  ];
  const agentPlans=[
    {name:"Free",price:"€0",per:"",desc:"Try it — 3 listings, 3 leads, no card",color:B.gray,pop:false,cta:"Get Started",link:"agent-dashboard.html",feat:["Up to 3 listings","3 free leads included","Full buyer profiles","Claim existing listings","Agent profile","-Priority placement","-Featured badge"]},
    {name:"10 Lead Pack",price:"€99",per:"one-time",desc:"€9.90 per lead",color:B.blue,pop:false,cta:"Buy Pack",link:"agent-dashboard.html",feat:["10 leads — use anytime","Up to 10 listings","Full buyer profiles","Lead management tools","Analytics dashboard","-Priority placement","-Featured badge"]},
    {name:"25 Lead Pack",price:"€199",per:"one-time",desc:"€7.96 per lead — save 20%",color:B.blue,pop:false,cta:"Buy Pack",link:"agent-dashboard.html",feat:["25 leads — use anytime","Unlimited listings","Full buyer profiles","Lead management tools","Priority listing placement","Featured agent badge","-White-label quiz"]},
    {name:"Unlimited",price:"€99",per:"/month",desc:"6-month min · unlimited leads",color:B.orange,pop:true,cta:"Go Unlimited",link:"agent-dashboard.html",feat:["Unlimited leads","Unlimited listings","Full buyer profiles & personas","Priority listing placement","Featured agent badge","Advanced analytics","Priority support"]}
  ];
  return(
    <div style={{minHeight:"100vh",background:B.white,fontFamily:F2}}>
      <nav style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 24px",maxWidth:1060,margin:"0 auto"}}>
        <div onClick={onBack} style={{cursor:"pointer"}}><LogoFull/></div>
        <button onClick={onStart} style={{background:B.orange,color:"#fff",border:"none",padding:"10px 24px",borderRadius:28,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:F2}}>Find My Home</button>
      </nav>
      <section style={{maxWidth:1060,margin:"0 auto",padding:"40px 24px 10px",textAlign:"center"}}>
        <div style={{fontSize:11,fontWeight:700,color:B.orange,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:10}}>Pricing</div>
        <h1 style={{fontSize:38,fontWeight:800,color:B.dark,lineHeight:1.15,letterSpacing:"-0.035em",marginBottom:12}}>Pay per search, not per month</h1>
        <p style={{fontSize:15,color:B.gray,maxWidth:520,margin:"0 auto"}}>No subscriptions for buyers. Agents only pay for results.</p>
      </section>

      <section style={{maxWidth:1060,margin:"0 auto",padding:"10px 24px 8px",textAlign:"center"}}>
        <div style={{fontSize:12,fontWeight:700,color:B.blue,letterSpacing:"0.08em",textTransform:"uppercase",marginTop:30,marginBottom:16}}>For Home Buyers</div>
      </section>
      <section style={{maxWidth:1060,margin:"0 auto",padding:"0 24px 30px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:20,alignItems:"start"}}>
        {buyerPlans.map((pl,i)=>(
          <div key={i} style={{background:B.white,borderRadius:18,border:pl.pop?"2px solid "+B.blue:"1px solid "+B.border,overflow:"hidden",boxShadow:pl.pop?"0 12px 40px rgba(30,150,209,0.12)":"0 2px 8px rgba(0,0,0,0.04)",animation:"fadeSlide 0.5s ease-out "+i*0.1+"s both"}}>
            {pl.pop&&<div style={{background:B.blue,color:"#fff",textAlign:"center",padding:6,fontSize:11,fontWeight:700,letterSpacing:"0.06em"}}>BEST VALUE</div>}
            <div style={{padding:"28px 24px"}}>
              <div style={{fontSize:13,fontWeight:700,color:pl.color,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>{pl.name}</div>
              <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:6}}><span style={{fontSize:40,fontWeight:800,color:B.dark}}>{pl.price}</span><span style={{fontSize:14,color:B.gray}}>{pl.per}</span></div>
              <div style={{fontSize:13,color:B.gray,marginBottom:22}}>{pl.desc}</div>
              <button onClick={onStart} style={{width:"100%",padding:13,borderRadius:12,fontSize:14,fontWeight:700,border:"none",cursor:"pointer",fontFamily:F2,background:pl.pop?"linear-gradient(135deg,"+B.blue+","+B.blueD+")":B.grayL,color:pl.pop?"#fff":B.dark}}>{pl.cta}</button>
              <div style={{marginTop:22,display:"flex",flexDirection:"column",gap:10}}>
                {pl.feat.map((f,j)=>{const inc=!f.startsWith("-");const txt=inc?f:f.slice(1);if(!txt)return null;return(
                  <div key={j} style={{display:"flex",gap:9,alignItems:"flex-start"}}><span style={{fontSize:13,flexShrink:0}}>{inc?"✅":"—"}</span><span style={{fontSize:13,color:inc?B.dark:"#b0bec5",fontWeight:f.includes("Everything")?700:400,lineHeight:1.35}}>{txt}</span></div>);})}
              </div>
            </div>
          </div>))}
      </section>

      <section style={{maxWidth:1060,margin:"0 auto",padding:"10px 24px 8px",textAlign:"center"}}>
        <div style={{fontSize:12,fontWeight:700,color:B.orange,letterSpacing:"0.08em",textTransform:"uppercase",marginTop:10,marginBottom:16}}>For Estate Agents</div>
        <p style={{fontSize:13,color:B.gray,maxWidth:500,margin:"0 auto 8px"}}>Only pay when it works. Start free with 3 leads.</p>
      </section>
      <section style={{maxWidth:1060,margin:"0 auto",padding:"0 24px 30px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:16,alignItems:"start"}}>
        {agentPlans.map((pl,i)=>(
          <div key={i} style={{background:B.white,borderRadius:18,border:pl.pop?"2px solid "+B.orange:"1px solid "+B.border,overflow:"hidden",boxShadow:pl.pop?"0 12px 40px rgba(245,146,27,0.1)":"0 2px 8px rgba(0,0,0,0.04)",animation:"fadeSlide 0.5s ease-out "+(0.3+i*0.1)+"s both"}}>
            {pl.pop&&<div style={{background:"linear-gradient(135deg,"+B.orange+","+B.orangeD+")",color:"#fff",textAlign:"center",padding:6,fontSize:11,fontWeight:700,letterSpacing:"0.06em"}}>BEST VALUE</div>}
            <div style={{padding:"24px 20px"}}>
              <div style={{fontSize:12,fontWeight:700,color:pl.color,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>{pl.name}</div>
              <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:6}}><span style={{fontSize:36,fontWeight:800,color:B.dark}}>{pl.price}</span><span style={{fontSize:13,color:B.gray}}>{pl.per}</span></div>
              <div style={{fontSize:12.5,color:B.gray,marginBottom:20}}>{pl.desc}</div>
              <a href={pl.link} style={{display:"block",width:"100%",padding:12,borderRadius:12,fontSize:13,fontWeight:700,border:"none",cursor:"pointer",fontFamily:F2,background:pl.pop?"linear-gradient(135deg,"+B.orange+","+B.orangeD+")":B.grayL,color:pl.pop?"#fff":B.dark,textAlign:"center",textDecoration:"none",boxSizing:"border-box"}}>{pl.cta}</a>
              <div style={{marginTop:18,display:"flex",flexDirection:"column",gap:8}}>
                {pl.feat.map((f,j)=>{const inc=!f.startsWith("-");const txt=inc?f:f.slice(1);if(!txt)return null;return(
                  <div key={j} style={{display:"flex",gap:8,alignItems:"flex-start"}}><span style={{fontSize:12,flexShrink:0}}>{inc?"✅":"—"}</span><span style={{fontSize:12.5,color:inc?B.dark:"#b0bec5",fontWeight:f.includes("Unlimited leads")||f.includes("Everything")?700:400,lineHeight:1.35}}>{txt}</span></div>);})}
              </div>
            </div>
          </div>))}
      </section>

      <section style={{maxWidth:960,margin:"0 auto",padding:"10px 24px 30px",textAlign:"center"}}>
        <div style={{background:B.blueXL||"#F2F9FD",borderRadius:16,padding:"28px 32px",display:"flex",flexWrap:"wrap",gap:32,justifyContent:"center",alignItems:"center"}}>
          <div style={{flex:"1 1 200px",textAlign:"center"}}><div style={{fontSize:32,fontWeight:800,color:B.blue}}>2 min</div><div style={{fontSize:13,color:B.gray,marginTop:4}}>Quiz takes</div></div>
          <div style={{flex:"1 1 200px",textAlign:"center"}}><div style={{fontSize:32,fontWeight:800,color:B.blue}}>10</div><div style={{fontSize:13,color:B.gray,marginTop:4}}>Lifestyle criteria scored</div></div>
          <div style={{flex:"1 1 200px",textAlign:"center"}}><div style={{fontSize:32,fontWeight:800,color:B.orange}}>0</div><div style={{fontSize:13,color:B.gray,marginTop:4}}>Subscriptions needed</div></div>
        </div>
      </section>

      <section style={{maxWidth:700,margin:"0 auto",padding:"10px 24px 50px"}}>
        <h2 style={{fontSize:24,fontWeight:800,color:B.dark,textAlign:"center",marginBottom:24}}>FAQs</h2>
        {[{q:"Is the free search really free?",a:"Yes. Take the quiz and see your top 3 matches with basic info, completely free. No card required."},{q:"What do I get in a Full Report?",a:"Every property in our database scored against your lifestyle. AI-powered reasoning, neighbourhood data, commute times, school ratings, energy costs, price trends, and direct agent contact."},{q:"Do searches expire?",a:"No. Buy a search or a 3-pack and use them whenever you like."},{q:"How does agent pricing work?",a:"Agents start free with 3 listings and 3 leads. After that, buy lead packs (10 for €99, 25 for €199) or go unlimited at €99/month. You only pay for qualified buyer enquiries — never for listings."},{q:"What happens when an agent runs out of lead credits?",a:"You'll still see that a new lead came in, but the buyer's contact details are hidden until you top up. No leads are ever lost — upgrade anytime to unlock them."},{q:"What areas do you cover?",a:"Currently Cork, Ireland and the Silver Coast / Lourinhã region of Portugal. More European markets coming in 2026."}].map((f,i)=>(
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
  const [answers, setAnswers] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [showOpts, setShowOpts] = useState(false);
  const [results, setResults] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [multiSel, setMultiSel] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [persona, setPersona] = useState(null);
  const [answered, setAnswered] = useState(0);
  const [saved, setSaved] = useState({});
  const [viewMode, setViewMode] = useState("cards");
  const [contactHouse, setContactHouse] = useState(null);
  const [questions, setQuestions] = useState(getQuestions(null));
  const scrollRef = useRef(null);

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
    const disp=Array.isArray(ans)?ans.join(", "):ans;
    setMessages(p=>[...p,{text:disp,isUser:true}]);
    setShowOpts(false);setMultiSel([]);setSearchText("");
    const nA={...answers};if(q.field)nA[q.field]=ans;

    if(q.id==="greeting"){
      const isIreland = ans.toLowerCase().includes("cork") || ans.toLowerCase().includes("ireland");
      const isPortugal = ans.toLowerCase().includes("lourinh") || ans.toLowerCase().includes("portugal");
      nA.market = isIreland ? "ie" : isPortugal ? "pt" : "uk";
      // Extract just the city name for the location field
      nA.location = isIreland ? "Cork" : isPortugal ? "Lourinhã" : ans;
      nA.currency = (isIreland || isPortugal) ? "EUR" : "GBP";
      setAnswers(nA);setAnswered(p=>p+1);
      // Dynamically update budget question based on currency
      setQuestions(prev => prev.map(qq => {
        if (qq.id === "budget") {
          return (isIreland || isPortugal)
            ? {...qq, options: ["Under €200K","€200K – €400K","€400K – €600K","€600K – €800K","€800K+"]}
            : {...qq, options: ["Under €200K","€200K – €400K","€400K – €600K","€600K – €800K","€800K+"]};
        }
        return qq;
      }));
      setIsTyping(true);
      setTimeout(()=>{setMessages(p=>[...p,{text:questions[2].text,isUser:false}]);setIsTyping(false);setCurrentQ(2);setTimeout(()=>setShowOpts(true),200);},600);
      return;
    }

    setAnswers(nA);setAnswered(p=>p+1);
    let nx=-1;for(let i=currentQ+1;i<questions.length;i++){if(!questions[i].showIf||questions[i].showIf(nA)){nx=i;break;}}

    if(nx!==-1){
      setIsTyping(true);
      setTimeout(()=>{setMessages(p=>[...p,{text:questions[nx].text,isUser:false}]);setIsTyping(false);setCurrentQ(nx);setTimeout(()=>setShowOpts(true),200);},500+Math.random()*300);
    } else {
      setIsTyping(true);
      setMessages(pr=>[...pr,{text:"Searching for your perfect match...",isUser:false}]);
      // Call real backend API
      const apiResult = await apiCall('/api/match', { answers: nA });
      if (apiResult && apiResult.matches && apiResult.matches.length > 0) {
        const p = apiResult.persona || getPersona(nA);
        setPersona(p);
        setMessages(pr=>[...pr,{text:`${p.emoji} You're "${p.title}" — ${p.desc || p.description}\n\nI found ${apiResult.matches.length} matches for you!`,isUser:false}]);
        setIsTyping(false);
        setTimeout(()=>setResults(apiResult.matches.map(adaptMatch)),500);
      } else {
        // Fallback to local scoring if API fails or returns no results
        const p=getPersona(nA);setPersona(p);
        setMessages(pr=>[...pr,{text:`${p.emoji} You're "${p.title}" — ${p.desc}\n\nSearching properties...`,isUser:false}]);
        setIsTyping(false);
        setTimeout(()=>setResults(getMatches(nA)),500);
      }
    }
  }

  function reset(){setMessages([]);setCurrentQ(0);setAnswers({});setIsTyping(false);setShowOpts(false);setResults(null);setExpandedCard(null);setMultiSel([]);setSearchText("");setPersona(null);setAnswered(0);setSaved({});setViewMode("cards");setQuestions(getQuestions(null));setPage("landing");}

  const cQ=questions[currentQ];
  const filtC=cQ?.type==="search"?(cQ.options||[]).filter(c=>c.toLowerCase().includes(searchText.toLowerCase())):[];
  const sCount=Object.values(saved).filter(Boolean).length;

  const CSS_UK = `@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');@keyframes fadeSlide{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}*{box-sizing:border-box;margin:0;padding:0;}body{background:#fff;}`;

  if(page==="pricing") return(
    <div><style>{CSS_UK}</style>
    <PricingPage onBack={()=>setPage("landing")} onStart={startQuiz}/></div>
  );

  if(page==="landing") return(
    <div><style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');@keyframes fadeSlide{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}*{box-sizing:border-box;margin:0;padding:0;}body{background:#fff;}`}</style>
    <LandingPage onStart={startQuiz} onPricing={()=>setPage("pricing")} email={email} setEmail={setEmail} emailSubmitted={emailSubmitted} onEmailSubmit={handleEmailSubmit}/></div>
  );

  return(
    <div style={{minHeight:"100vh",background:"#fafbfc",fontFamily:"'Outfit',sans-serif",display:"flex",flexDirection:"column"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');@keyframes fadeSlide{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}@keyframes bounce{0%,80%,100%{transform:translateY(0);}40%{transform:translateY(-6px);}}*{box-sizing:border-box;margin:0;padding:0;}body{background:#fafbfc;}input::placeholder{color:#b0bec5;}::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:#d0d8e0;border-radius:3px;}`}</style>

      {contactHouse&&contactHouse.agent&&<ContactModal agent={contactHouse.agent} house={contactHouse} onClose={()=>setContactHouse(null)}/>}
      {/* Header */}
      <div style={{background:B.white,borderBottom:`1px solid ${B.border}`,padding:"11px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10}}>
        <LogoFull/>
        <div style={{display:"flex",gap:7,alignItems:"center"}}>
          {email&&<span style={{fontSize:10.5,color:B.gray,fontWeight:500,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{email}</span>}
          {sCount>0&&<span style={{fontSize:10.5,fontWeight:600,color:B.orange,background:B.orangeL,padding:"3px 9px",borderRadius:14}}>♥ {sCount}</span>}
          {(results||answered>2)&&<button onClick={reset} style={{background:B.grayL,border:"none",padding:"6px 13px",borderRadius:7,fontSize:11.5,fontWeight:600,color:B.gray,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>Home</button>}
        </div>
      </div>

      {!results&&answered>0&&<Progress cur={answered} tot={totQ}/>}

      <div ref={scrollRef} style={{flex:1,overflowY:"auto",padding:"18px 12px",maxWidth:680,width:"100%",margin:"0 auto"}}>
        {messages.map((m,i)=><Bubble key={i} text={m.text} isUser={m.isUser}/>)}
        {isTyping&&<Bubble isUser={false}><Dots/></Bubble>}

        {showOpts&&!results&&cQ&&(
          <div style={{animation:"fadeSlide 0.35s ease-out",marginTop:5,marginBottom:8,marginLeft:34}}>
            {cQ.type==="search"&&<input type="text" value={searchText} onChange={e=>setSearchText(e.target.value)} placeholder={cQ.placeholder} style={{width:"100%",padding:"10px 14px",borderRadius:10,border:`1.5px solid ${B.border}`,fontSize:13.5,fontFamily:"'Outfit',sans-serif",outline:"none",background:"#fff",color:B.dark,marginBottom:7}} onFocus={e=>e.target.style.borderColor=B.blue} onBlur={e=>e.target.style.borderColor=B.border}/>}
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {(cQ.type==="search"?filtC:cQ.options).map((opt,i)=>{
                const sel=cQ.type==="multi"&&multiSel.includes(opt);
                return <button key={i} onClick={()=>cQ.type==="search"?proceed(opt):handleAnswer(opt)} style={{background:sel?B.dark:"#fff",color:sel?"#f0f4f8":B.dark,border:sel?`1.5px solid ${B.dark}`:`1.5px solid ${B.border}`,padding:"8px 15px",borderRadius:22,fontSize:12.5,fontFamily:"'Outfit',sans-serif",fontWeight:500,cursor:"pointer",transition:"all 0.2s"}}>{opt}</button>;
              })}
            </div>
            {cQ.type==="multi"&&multiSel.length>0&&<button onClick={()=>proceed(multiSel)} style={{background:`linear-gradient(135deg,${B.blue},${B.blueD})`,color:"#fff",border:"none",padding:"9px 22px",borderRadius:22,fontSize:12.5,fontFamily:"'Outfit',sans-serif",fontWeight:600,cursor:"pointer",marginTop:7}}>Continue →</button>}
          </div>
        )}

        {results&&(
          <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:11}}>
            {persona&&(<div style={{background:`linear-gradient(135deg,${B.dark} 0%,${B.blueD} 100%)`,borderRadius:14,padding:"18px 20px",color:"#f0f4f8",animation:"fadeSlide 0.5s ease-out",marginBottom:2}}><div style={{fontSize:24,marginBottom:3}}>{persona.emoji}</div><div style={{fontSize:16,fontWeight:700,letterSpacing:"-0.02em",marginBottom:2}}>{persona.title}</div><div style={{fontSize:12.5,opacity:0.85,lineHeight:1.5}}>{persona.desc}</div></div>)}
            <div style={{display:"flex",gap:0,background:B.grayL,borderRadius:8,padding:2,alignSelf:"flex-start"}}>
              {["cards","compare"].map(m=><button key={m} onClick={()=>setViewMode(m)} style={{padding:"6px 14px",borderRadius:6,fontSize:11.5,fontWeight:600,fontFamily:"'Outfit',sans-serif",cursor:"pointer",border:"none",background:viewMode===m?B.white:"transparent",color:viewMode===m?B.dark:B.gray,boxShadow:viewMode===m?"0 1px 3px rgba(0,0,0,0.08)":"none"}}>{m==="cards"?"📋 Cards":"📊 Compare"}</button>)}
            </div>
            {viewMode==="compare"?<CompTable results={results}/>:(
              <>{results.map((m,i)=><Card key={m.house.id} match={m} rank={i} expanded={expandedCard===m.house.id} onToggle={()=>setExpandedCard(expandedCard===m.house.id?null:m.house.id)} saved={!!saved[m.house.id]} onSave={id=>setSaved(p=>({...p,[id]:!p[id]}))} onContact={h=>setContactHouse(h)}/>)}</>
            )}
            <div style={{textAlign:"center",padding:"18px 0 10px",fontSize:11.5,color:"#b0bec5",lineHeight:1.6}}>
              Matched from real listings · AI-powered scoring<br/>
              <span style={{fontSize:10.5,opacity:0.7}}>homeaimatch.com</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
