// Kerala Districts and Major Towns Geocoding Directory with Fuzzy Spelling Matcher
// Provides Haversine distance calculations and phonetic/Levenshtein tolerance

export const KERALA_DISTRICT_COORDINATES = {
  "Malappuram": { lat: 11.0732, lng: 76.0740 },
  "Kozhikode": { lat: 11.2588, lng: 75.7804 },
  "Kannur": { lat: 11.8745, lng: 75.3704 },
  "Wayanad": { lat: 11.6103, lng: 76.0827 },
  "Kasaragod": { lat: 12.5102, lng: 74.9852 },
  "Palakkad": { lat: 10.7867, lng: 76.6548 },
  "Thrissur": { lat: 10.5276, lng: 76.2144 },
  "Ernakulam": { lat: 9.9816, lng: 76.2999 },
  "Kottayam": { lat: 9.5916, lng: 76.5222 },
  "Alappuzha": { lat: 9.4981, lng: 76.3388 },
  "Idukki": { lat: 9.8500, lng: 76.9700 },
  "Pathanamthitta": { lat: 9.2648, lng: 76.7870 },
  "Kollam": { lat: 8.8932, lng: 76.6141 },
  "Thiruvananthapuram": { lat: 8.5241, lng: 76.9366 }
};

// Comprehensive Kerala Towns database with coordinates and common spelling variations / aliases
export const KERALA_TOWNS = [
  // Malappuram District
  { name: "Manjeri", district: "Malappuram", lat: 11.1202, lng: 76.1206, aliases: ["manjery", "manjeri town"] },
  { name: "Malappuram", district: "Malappuram", lat: 11.0732, lng: 76.0740, aliases: ["malapuram", "mallapuram", "malappuram town", "kottappadi"] },
  { name: "Tirur", district: "Malappuram", lat: 10.9146, lng: 75.9228, aliases: ["tiroor", "thiroor", "tirur town", "thirur"] },
  { name: "Perinthalmanna", district: "Malappuram", lat: 10.9760, lng: 76.2254, aliases: ["perinthalmana", "perinthamanna", "perinthalman", "angadippuram"] },
  { name: "Kottakkal", district: "Malappuram", lat: 11.0006, lng: 75.9961, aliases: ["kottakal", "kottakkal arya vaidyasala", "changuvetty"] },
  { name: "Ponnani", district: "Malappuram", lat: 10.7674, lng: 75.9252, aliases: ["ponani", "ponnani town", "edappal area"] },
  { name: "Nilambur", district: "Malappuram", lat: 11.2778, lng: 76.2264, aliases: ["nilamboor", "chandakkunnu"] },
  { name: "Kondotty", district: "Malappuram", lat: 11.1449, lng: 75.9622, aliases: ["kondotti", "kondoty", "calicut airport town", "karippur"] },
  { name: "Parappanangadi", district: "Malappuram", lat: 11.0506, lng: 75.8617, aliases: ["parappangadi", "parappanangadi town"] },
  { name: "Tanur", district: "Malappuram", lat: 10.9744, lng: 75.8681, aliases: ["thanoor", "tanoor"] },
  { name: "Valanchery", district: "Malappuram", lat: 10.8872, lng: 76.0744, aliases: ["valancheri", "vettichira", "puthanathani"] },
  { name: "Edappal", district: "Malappuram", lat: 10.7641, lng: 76.0028, aliases: ["edappall", "edapal"] },
  { name: "Wandoor", district: "Malappuram", lat: 11.1952, lng: 76.2361, aliases: ["wandur", "vandur"] },
  { name: "Tirurangadi", district: "Malappuram", lat: 11.0371, lng: 75.9287, aliases: ["thirurangadi", "chemmad", "kakkad"] },
  { name: "Areacode", district: "Malappuram", lat: 11.2372, lng: 76.0543, aliases: ["arikkode", "areekode", "arikode"] },
  { name: "Melattur", district: "Malappuram", lat: 11.0583, lng: 76.2694, aliases: ["melattur", "pattikkad"] },
  { name: "Mankada", district: "Malappuram", lat: 11.0189, lng: 76.1822, aliases: ["mankada", "makkaraparamba"] },

  // Kozhikode District
  { name: "Kozhikode", district: "Kozhikode", lat: 11.2588, lng: 75.7804, aliases: ["calicut", "kozhikodu", "calicut city", "mananchira", "mavoor road"] },
  { name: "Vadakara", district: "Kozhikode", lat: 11.6033, lng: 75.5898, aliases: ["badagara", "vatakara", "badgara", "vadakara town"] },
  { name: "Koyilandy", district: "Kozhikode", lat: 11.4428, lng: 75.6984, aliases: ["quilandy", "koyilandi", "quilandi"] },
  { name: "Feroke", district: "Kozhikode", lat: 11.1963, lng: 75.8368, aliases: ["farook", "farooke", "cheruvannur", "nallalam"] },
  { name: "Koduvally", district: "Kozhikode", lat: 11.3570, lng: 75.9120, aliases: ["koduvalley", "koduvalli", "gold city"] },
  { name: "Thamarassery", district: "Kozhikode", lat: 11.4167, lng: 75.9333, aliases: ["thamarasseri", "tamarassery", "thamarasery"] },
  { name: "Ramanattukara", district: "Kozhikode", lat: 11.1764, lng: 75.8647, aliases: ["ramanattukara", "ramanatukara"] },
  { name: "Kunnamangalam", district: "Kozhikode", lat: 11.3090, lng: 75.8752, aliases: ["kunnamangalam", "iim", "nit calicut area"] },
  { name: "Balussery", district: "Kozhikode", lat: 11.4475, lng: 75.8239, aliases: ["balusseri", "balussery town"] },
  { name: "Nadapuram", district: "Kozhikode", lat: 11.6917, lng: 75.6528, aliases: ["nadapuram", "kallachi"] },
  { name: "Mavoor", district: "Kozhikode", lat: 11.2619, lng: 75.9525, aliases: ["mavoor", "mavour"] },

  // Kannur District
  { name: "Kannur", district: "Kannur", lat: 11.8745, lng: 75.3704, aliases: ["cannanore", "kannur town", "kannur city", "caltex"] },
  { name: "Thalassery", district: "Kannur", lat: 11.7480, lng: 75.4894, aliases: ["tellicherry", "thalasseri", "talassery", "thalassery town"] },
  { name: "Taliparamba", district: "Kannur", lat: 12.0437, lng: 75.3587, aliases: ["taliparambu", "thaliparamba", "thalipparamba"] },
  { name: "Payyanur", district: "Kannur", lat: 12.1009, lng: 75.2017, aliases: ["payyannur", "payannur", "payyanur town"] },
  { name: "Mattannur", district: "Kannur", lat: 11.9333, lng: 75.5667, aliases: ["mattanoor", "kannur airport town"] },
  { name: "Iritty", district: "Kannur", lat: 11.9806, lng: 75.6667, aliases: ["iritty", "iritti"] },
  { name: "Koothuparamba", district: "Kannur", lat: 11.8317, lng: 75.5683, aliases: ["kuthuparamba", "kuthuparambu"] },
  { name: "Panoor", district: "Kannur", lat: 11.7611, lng: 75.5878, aliases: ["panoor", "panur"] },

  // Wayanad District
  { name: "Kalpetta", district: "Wayanad", lat: 11.6103, lng: 76.0827, aliases: ["kalpatta", "wayanad headquarters"] },
  { name: "Sultan Bathery", district: "Wayanad", lat: 11.6667, lng: 76.2833, aliases: ["sulthan bathery", "sulthan batheri", "battery"] },
  { name: "Mananthavady", district: "Wayanad", lat: 11.8000, lng: 76.0000, aliases: ["mananthawadi", "manantoddy"] },
  { name: "Meenangadi", district: "Wayanad", lat: 11.6611, lng: 76.1772, aliases: ["meenangadi"] },

  // Kasaragod District
  { name: "Kasaragod", district: "Kasaragod", lat: 12.5102, lng: 74.9852, aliases: ["kasargod", "kasargode", "kasaragod town"] },
  { name: "Kanhangad", district: "Kasaragod", lat: 12.3082, lng: 75.0898, aliases: ["kanhangadu", "hosdurg"] },
  { name: "Nileshwar", district: "Kasaragod", lat: 12.2536, lng: 75.1322, aliases: ["neeleswaram", "nileshwaram"] },
  { name: "Uppala", district: "Kasaragod", lat: 12.6842, lng: 74.9392, aliases: ["uppala", "manjeshwar"] },
  { name: "Cheruvathur", district: "Kasaragod", lat: 12.2167, lng: 75.1667, aliases: ["cheruvathoor"] },

  // Palakkad District
  { name: "Palakkad", district: "Palakkad", lat: 10.7867, lng: 76.6548, aliases: ["palghat", "palakkad town"] },
  { name: "Ottapalam", district: "Palakkad", lat: 10.7719, lng: 76.3794, aliases: ["ottappalam"] },
  { name: "Pattambi", district: "Palakkad", lat: 10.8064, lng: 76.1969, aliases: ["pattambi town"] },
  { name: "Mannarkkad", district: "Palakkad", lat: 10.9892, lng: 76.4597, aliases: ["mannarkad", "mannarkkadu"] },
  { name: "Shornur", district: "Palakkad", lat: 10.7622, lng: 76.2750, aliases: ["shoranur", "shoranur junction"] },
  { name: "Cherpulassery", district: "Palakkad", lat: 10.8803, lng: 76.3125, aliases: ["cherpulasseri"] },

  // Thrissur District
  { name: "Thrissur", district: "Thrissur", lat: 10.5276, lng: 76.2144, aliases: ["trichur", "thrissur town", "trissur", "swaraj round"] },
  { name: "Chavakkad", district: "Thrissur", lat: 10.5898, lng: 76.0244, aliases: ["chavakad", "chavakkad beach"] },
  { name: "Guruvayur", district: "Thrissur", lat: 10.5946, lng: 76.0407, aliases: ["guruvayoor"] },
  { name: "Kunnamkulam", district: "Thrissur", lat: 10.6500, lng: 76.0700, aliases: ["kunnamkulam town"] },
  { name: "Kodungallur", district: "Thrissur", lat: 10.2312, lng: 76.1947, aliases: ["cranganore", "kodungalloor"] },
  { name: "Chalakudy", district: "Thrissur", lat: 10.3070, lng: 76.3335, aliases: ["chalakkudy", "chalakudi"] },
  { name: "Irinjalakuda", district: "Thrissur", lat: 10.3422, lng: 76.2081, aliases: ["irinjalakkuda"] },

  // Ernakulam District
  { name: "Kochi", district: "Ernakulam", lat: 9.9312, lng: 76.2673, aliases: ["cochin", "ernakulam", "kochi city", "marine drive", "edapally", "kaloor"] },
  { name: "Aluva", district: "Ernakulam", lat: 10.1076, lng: 76.3516, aliases: ["alwaye", "aluva town"] },
  { name: "Perumbavoor", district: "Ernakulam", lat: 10.1147, lng: 76.4789, aliases: ["perumbavur", "perumbavoor town"] },
  { name: "Angamaly", district: "Ernakulam", lat: 10.1960, lng: 76.3860, aliases: ["angamali", "cochin airport area"] },
  { name: "Muvattupuzha", district: "Ernakulam", lat: 9.9833, lng: 76.5833, aliases: ["muvattupuzha town"] },
  { name: "Kothamangalam", district: "Ernakulam", lat: 10.0631, lng: 76.6268, aliases: ["kothamangalam town"] },
  { name: "Kalamassery", district: "Ernakulam", lat: 10.0558, lng: 76.3214, aliases: ["kalamassery", "cusat"] },

  // Kottayam District
  { name: "Kottayam", district: "Kottayam", lat: 9.5916, lng: 76.5222, aliases: ["kottayam town"] },
  { name: "Changanassery", district: "Kottayam", lat: 9.4447, lng: 76.5378, aliases: ["changanacherry"] },
  { name: "Pala", district: "Kottayam", lat: 9.7125, lng: 76.6833, aliases: ["palai"] },
  { name: "Kanjirappally", district: "Kottayam", lat: 9.5556, lng: 76.7861, aliases: ["kanjirapally"] },

  // Alappuzha District
  { name: "Alappuzha", district: "Alappuzha", lat: 9.4981, lng: 76.3388, aliases: ["alleppey", "alappuzha town"] },
  { name: "Kayamkulam", district: "Alappuzha", lat: 9.1723, lng: 76.5013, aliases: ["kayamkulam town"] },
  { name: "Cherthala", district: "Alappuzha", lat: 9.6847, lng: 76.3314, aliases: ["shertallai", "cherthala town"] },

  // Kollam District
  { name: "Kollam", district: "Kollam", lat: 8.8932, lng: 76.6141, aliases: ["quilon", "kollam town", "kollam city"] },
  { name: "Karunagappally", district: "Kollam", lat: 9.0543, lng: 76.5366, aliases: ["karunagappalli"] },
  { name: "Kottarakkara", district: "Kollam", lat: 8.9986, lng: 76.7725, aliases: ["kottarakara"] },

  // Thiruvananthapuram District
  { name: "Thiruvananthapuram", district: "Thiruvananthapuram", lat: 8.5241, lng: 76.9366, aliases: ["trivandrum", "tvm", "thiruvananthapuram city", "technopark"] },
  { name: "Attingal", district: "Thiruvananthapuram", lat: 8.6961, lng: 76.8142, aliases: ["attingal town"] },
  { name: "Varkala", district: "Thiruvananthapuram", lat: 8.7379, lng: 76.7163, aliases: ["varkkala", "varkala cliff"] },
  { name: "Neyyattinkara", district: "Thiruvananthapuram", lat: 8.4000, lng: 77.0833, aliases: ["neyyattinkara"] }
];

/**
 * Phonetic & Typographic Normalizer:
 * Handles typical Malayalam-to-English variations:
 * - 'oo' <-> 'u', 'ee' <-> 'i', 'y' <-> 'i'
 * - 'th' <-> 't', 'dh' <-> 'd', 'zh' <-> 'l'
 * - Collapses consecutive duplicate letters (e.g. 'pp' -> 'p', 'tt' -> 't', 'll' -> 'l')
 */
export function normalizePlaceString(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '')
    .replace(/oo/g, 'u')
    .replace(/ee/g, 'i')
    .replace(/y$/g, 'i') // manjery -> manjeri
    .replace(/th/g, 't')
    .replace(/dh/g, 'd')
    .replace(/zh/g, 'l') // Kozhikode -> Kolikode
    .replace(/(.)\1+/g, '$1'); // Collapse duplicate letters (Malappuram -> Malapuram)
}

/**
 * Levenshtein distance between two strings
 */
export function levenshteinDistance(s1, s2) {
  if (!s1 || !s2) return (s1 || '').length + (s2 || '').length;
  const a = s1.toLowerCase().trim();
  const b = s2.toLowerCase().trim();
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

/**
 * Fuzzy matches any user entered place name (with typos, transliterations, or aliases)
 * against our curated Kerala Towns database.
 * Returns { name, district, lat, lng, confidence } or falls back to district coordinates.
 */
export function fuzzyMatchPlace(rawPlaceName, fallbackDistrict = '') {
  if (!rawPlaceName && !fallbackDistrict) return null;

  const raw = (rawPlaceName || '').trim();
  const normalizedRaw = normalizePlaceString(raw);

  if (raw) {
    // 1. Direct exact or alias match (case insensitive)
    for (const town of KERALA_TOWNS) {
      if (town.name.toLowerCase() === raw.toLowerCase()) {
        return { ...town, matchType: 'exact', confidence: 1 };
      }
      if (town.aliases?.some(a => a.toLowerCase() === raw.toLowerCase())) {
        return { ...town, matchType: 'alias', confidence: 0.98 };
      }
    }

    // 2. Normalized phonetic exact match
    for (const town of KERALA_TOWNS) {
      if (normalizePlaceString(town.name) === normalizedRaw) {
        return { ...town, matchType: 'phonetic', confidence: 0.95 };
      }
      if (town.aliases?.some(a => normalizePlaceString(a) === normalizedRaw)) {
        return { ...town, matchType: 'phonetic_alias', confidence: 0.92 };
      }
    }

    // 3. Substring / Prefix match
    if (raw.length >= 3) {
      for (const town of KERALA_TOWNS) {
        const tLower = town.name.toLowerCase();
        const rLower = raw.toLowerCase();
        if (tLower.startsWith(rLower) || rLower.startsWith(tLower) || tLower.includes(rLower)) {
          return { ...town, matchType: 'prefix', confidence: 0.88 };
        }
        if (town.aliases?.some(a => a.toLowerCase().startsWith(rLower) || rLower.startsWith(a.toLowerCase()))) {
          return { ...town, matchType: 'alias_prefix', confidence: 0.85 };
        }
      }
    }

    // 4. Levenshtein edit-distance match with spelling tolerance
    let bestTown = null;
    let minDistance = 999;
    const maxAllowedDist = raw.length <= 4 ? 1 : raw.length <= 8 ? 2 : 3;

    for (const town of KERALA_TOWNS) {
      const dist = levenshteinDistance(raw, town.name);
      if (dist < minDistance && dist <= maxAllowedDist) {
        minDistance = dist;
        bestTown = town;
      }
      // Check aliases as well
      for (const alias of town.aliases || []) {
        const aDist = levenshteinDistance(raw, alias);
        if (aDist < minDistance && aDist <= maxAllowedDist) {
          minDistance = aDist;
          bestTown = town;
        }
      }
    }

    if (bestTown) {
      return {
        ...bestTown,
        matchType: 'fuzzy_levenshtein',
        confidence: Math.max(0.6, 1 - (minDistance / raw.length))
      };
    }
  }

  // 5. Fallback to District headquarters coordinates if district is known
  const distKey = Object.keys(KERALA_DISTRICT_COORDINATES).find(d => 
    d.toLowerCase() === (fallbackDistrict || raw).toLowerCase()
  );

  if (distKey) {
    const coords = KERALA_DISTRICT_COORDINATES[distKey];
    return {
      name: `${distKey} District Center`,
      district: distKey,
      lat: coords.lat,
      lng: coords.lng,
      matchType: 'district_fallback',
      confidence: 0.6
    };
  }

  return null;
}

/**
 * Haversine formula to compute distance in kilometers between two GPS coordinates
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const numLat1 = Number(lat1);
  const numLon1 = Number(lon1);
  const numLat2 = Number(lat2);
  const numLon2 = Number(lon2);

  if (isNaN(numLat1) || isNaN(numLon1) || isNaN(numLat2) || isNaN(numLon2)) return null;

  const R = 6371; // Earth radius in km
  const dLat = (numLat2 - numLat1) * (Math.PI / 180);
  const dLon = (numLon2 - numLon1) * (Math.PI / 180);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(numLat1 * (Math.PI / 180)) * Math.cos(numLat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place (e.g. 14.2 km)
}

/**
 * Resolves coordinates for any proposal/profile
 * Checks explicit coordinates -> locationFamily coordinates -> fuzzy matches nativePlace & homeDistrict
 */
export function resolveProfileCoordinates(profile) {
  if (!profile) return null;

  // 1. Explicit coordinates attached to profile root or locationFamily
  if (profile.coordinates?.lat && profile.coordinates?.lng) {
    return { lat: Number(profile.coordinates.lat), lng: Number(profile.coordinates.lng) };
  }
  if (profile.locationFamily?.coordinates?.lat && profile.locationFamily?.coordinates?.lng) {
    return { lat: Number(profile.locationFamily.coordinates.lat), lng: Number(profile.locationFamily.coordinates.lng) };
  }

  // 2. Fuzzy match nativePlace + homeDistrict
  const nativePlace = profile.locationFamily?.nativePlace || '';
  const homeDistrict = profile.locationFamily?.homeDistrict || '';
  
  const matched = fuzzyMatchPlace(nativePlace, homeDistrict);
  if (matched?.lat && matched?.lng) {
    return { lat: matched.lat, lng: matched.lng, matchedPlaceName: matched.name, district: matched.district };
  }

  return null;
}

/**
 * Request user's current GPS location via HTML5 Geolocation
 */
export function getUserCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator?.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          name: "Current GPS Location",
          isGPS: true
        });
      },
      (error) => {
        let msg = "Could not fetch GPS location.";
        if (error.code === 1) {
          msg = "Location permission denied. Please allow location access or choose your town manually.";
        } else if (error.code === 2) {
          msg = "GPS position unavailable. Please choose your town manually.";
        } else if (error.code === 3) {
          msg = "Location request timed out. Please choose your town manually.";
        }
        reject(new Error(msg));
      },
      { timeout: 10000, enableHighAccuracy: true, maximumAge: 60000 }
    );
  });
}

/**
 * Autocomplete helper for Kerala Towns search input
 */
export function searchKeralaTowns(query, limit = 8) {
  if (!query || !query.trim()) return KERALA_TOWNS.slice(0, limit);
  const q = query.toLowerCase().trim();
  const normalizedQ = normalizePlaceString(q);

  const scoredTowns = KERALA_TOWNS.map(town => {
    const tName = town.name.toLowerCase();
    const tDist = town.district.toLowerCase();
    const normalizedName = normalizePlaceString(town.name);
    let score = 0;

    // Exact matches
    if (tName === q) score += 100;
    else if (normalizedName === normalizedQ) score += 90;
    else if (tName.startsWith(q)) score += 80;
    else if (tName.includes(q)) score += 60;
    else if (tDist.startsWith(q)) score += 50;

    // Aliases
    if (town.aliases) {
      for (const a of town.aliases) {
        const aLower = a.toLowerCase();
        if (aLower === q) score += 95;
        else if (normalizePlaceString(a) === normalizedQ) score += 85;
        else if (aLower.startsWith(q)) score += 75;
        else if (aLower.includes(q)) score += 55;
      }
    }

    // Levenshtein closeness for typos
    if (score === 0 && q.length >= 3) {
      const dist = levenshteinDistance(q, town.name);
      if (dist <= 2) score += (40 - dist * 10);
    }

    return { ...town, score };
  });

  return scoredTowns
    .filter(t => t.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

