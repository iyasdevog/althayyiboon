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
// Heavily enriched for Malabar region (Malappuram, Kozhikode, Kannur, Kasaragod, Wayanad, Palakkad)
export const KERALA_TOWNS = [
  // ==========================================
  // MALAPPURAM DISTRICT (Heart of Malabar)
  // ==========================================
  { name: "Manjeri", district: "Malappuram", lat: 11.1202, lng: 76.1206, aliases: ["manjery", "manjeri town", "payyanad", "elankur"] },
  { name: "Malappuram", district: "Malappuram", lat: 11.0732, lng: 76.0740, aliases: ["malapuram", "mallapuram", "malappuram town", "kottappadi", "melmuri", "downhill", "uphill"] },
  { name: "Tirur", district: "Malappuram", lat: 10.9146, lng: 75.9228, aliases: ["tiroor", "thiroor", "tirur town", "thirur", "thazhepalam", "pookayil"] },
  { name: "Perinthalmanna", district: "Malappuram", lat: 10.9760, lng: 76.2254, aliases: ["perinthalmana", "perinthamanna", "perinthalman", "angadippuram", "angadipuram"] },
  { name: "Kottakkal", district: "Malappuram", lat: 11.0006, lng: 75.9961, aliases: ["kottakal", "kottakkal arya vaidyasala", "changuvetty", "changuvetti", "edirikode", "edarikkode"] },
  { name: "Ponnani", district: "Malappuram", lat: 10.7674, lng: 75.9252, aliases: ["ponani", "ponnani town", "chamakadavu", "ponnani port"] },
  { name: "Nilambur", district: "Malappuram", lat: 11.2778, lng: 76.2264, aliases: ["nilamboor", "chandakkunnu", "canoly plot"] },
  { name: "Kondotty", district: "Malappuram", lat: 11.1449, lng: 75.9622, aliases: ["kondotti", "kondoty", "calicut airport town", "karippur", "karipur", "nediyiruppu"] },
  { name: "Parappanangadi", district: "Malappuram", lat: 11.0506, lng: 75.8617, aliases: ["parappangadi", "parappanangadi town", "palathingal", "chettippadi"] },
  { name: "Tanur", district: "Malappuram", lat: 10.9744, lng: 75.8681, aliases: ["thanoor", "tanoor", "rayirimangalam"] },
  { name: "Valanchery", district: "Malappuram", lat: 10.8872, lng: 76.0744, aliases: ["valancheri", "vettichira", "puthanathani", "karthala", "moodal"] },
  { name: "Edappal", district: "Malappuram", lat: 10.7641, lng: 76.0028, aliases: ["edappall", "edapal", "edappal hospital town"] },
  { name: "Wandoor", district: "Malappuram", lat: 11.1952, lng: 76.2361, aliases: ["wandur", "vandur", "vadapuram"] },
  { name: "Tirurangadi", district: "Malappuram", lat: 11.0371, lng: 75.9287, aliases: ["thirurangadi", "chemmad", "kakkad", "psmo college area"] },
  { name: "Chemmad", district: "Malappuram", lat: 11.0440, lng: 75.9220, aliases: ["chemamad", "chemmad town", "dharul huda", "darul huda town"] },
  { name: "Vengara", district: "Malappuram", lat: 11.0667, lng: 75.9833, aliases: ["vengara town", "kooriyad", "parambilangadi", "oorakam", "valakkulam"] },
  { name: "Kuttippuram", district: "Malappuram", lat: 10.8468, lng: 76.0270, aliases: ["kuttipuram", "kuttippuram bridge", "kuttipuram railway station"] },
  { name: "Puthanathani", district: "Malappuram", lat: 10.9231, lng: 76.0125, aliases: ["puthanathany", "punnathala", "kuruka"] },
  { name: "Edarikode", district: "Malappuram", lat: 11.0089, lng: 75.9756, aliases: ["edarikkode", "edrikode", "klari"] },
  { name: "Changaramkulam", district: "Malappuram", lat: 10.7067, lng: 76.0353, aliases: ["changaramkulam town", "alamkod", "maranchery border"] },
  { name: "Areacode", district: "Malappuram", lat: 11.2372, lng: 76.0543, aliases: ["arikkode", "areekode", "arikode", "areacode town"] },
  { name: "Edavanna", district: "Malappuram", lat: 11.2167, lng: 76.1333, aliases: ["edavanna town", "jamia nadviyya", "pathappiriyam"] },
  { name: "Mampad", district: "Malappuram", lat: 11.2333, lng: 76.1833, aliases: ["mampad college", "mampad town", "pullippadam"] },
  { name: "Edakkara", district: "Malappuram", lat: 11.3667, lng: 76.3000, aliases: ["edakara", "vazhikkadavu", "muppini"] },
  { name: "Chungathara", district: "Malappuram", lat: 11.3167, lng: 76.2667, aliases: ["chungathara town", "pookkottumpadam"] },
  { name: "Kalikavu", district: "Malappuram", lat: 11.1667, lng: 76.3333, aliases: ["kalikavu town", "adakkakundu", "chokkad"] },
  { name: "Karuvarakundu", district: "Malappuram", lat: 11.1167, lng: 76.3500, aliases: ["karuvarakkundu", "darunnajath", "tuvvur"] },
  { name: "Pandikkad", district: "Malappuram", lat: 11.1167, lng: 76.2333, aliases: ["pandikad", "vettikkattiri", "chembrasseri"] },
  { name: "Melattur", district: "Malappuram", lat: 11.0583, lng: 76.2694, aliases: ["melattur town", "edappatta"] },
  { name: "Pattikkad", district: "Malappuram", lat: 11.0250, lng: 76.2417, aliases: ["pattikkad town", "jami'a nooriya", "jamia nooriya"] },
  { name: "Mankada", district: "Malappuram", lat: 11.0189, lng: 76.1822, aliases: ["mankada town", "tirurkad", "koottil"] },
  { name: "Makkaraparamba", district: "Malappuram", lat: 11.0250, lng: 76.1333, aliases: ["makkaraparambu", "vadakkangara", "kuruva"] },
  { name: "Angadipuram", district: "Malappuram", lat: 10.9833, lng: 76.2000, aliases: ["angadippuram", "thirumandhamkunnu", "puthanangadi"] },
  { name: "Koottilangadi", district: "Malappuram", lat: 11.0417, lng: 76.0833, aliases: ["kottilangadi", "vallikkapatta", "kadungookkundu"] },
  { name: "Kadampuzha", district: "Malappuram", lat: 10.9833, lng: 76.0500, aliases: ["kadampuzha temple town", "marakkara"] },
  { name: "Thirunavaya", district: "Malappuram", lat: 10.8667, lng: 75.9833, aliases: ["thirunnavaya", "mamankam", "navamukunda"] },
  { name: "Kalpakanchery", district: "Malappuram", lat: 10.9500, lng: 75.9833, aliases: ["kalpakancheri", "kadungathukundu", "kallingal"] },
  { name: "Randathani", district: "Malappuram", lat: 10.9667, lng: 76.0000, aliases: ["randathany", "cheloor"] },
  { name: "Maranchery", district: "Malappuram", lat: 10.7333, lng: 75.9667, aliases: ["marancheri", "kundukadavu"] },
  { name: "Veliyankode", district: "Malappuram", lat: 10.7167, lng: 75.9500, aliases: ["veliyancode", "veliyancode umar qazi town"] },
  { name: "Vallikkunnu", district: "Malappuram", lat: 11.1167, lng: 75.8333, aliases: ["vallikunnu", "kadungalloor", "ariyamkode"] },
  { name: "Karippur", district: "Malappuram", lat: 11.1367, lng: 75.9553, aliases: ["karipur", "calicut international airport", "airport junction"] },
  { name: "Pulikkal", district: "Malappuram", lat: 11.1833, lng: 75.9333, aliases: ["pulikkal town", "anthiyoorkunnu", "arimbra"] },
  { name: "Morayur", district: "Malappuram", lat: 11.1333, lng: 76.0167, aliases: ["morayoor", "arimbra mini ooty"] },
  { name: "Vazhakkad", district: "Malappuram", lat: 11.2333, lng: 75.9500, aliases: ["vazhakkad town", "darul uloom vazhakkad", "edavannappara"] },
  { name: "Kizhisseri", district: "Malappuram", lat: 11.2000, lng: 76.0167, aliases: ["kuzhimanna", "kizhissery", "mundakkulam"] },
  { name: "Oorakam", district: "Malappuram", lat: 11.0500, lng: 76.0000, aliases: ["oorakam hill", "oorakam melmuri"] },
  { name: "Changuvetty", district: "Malappuram", lat: 11.0028, lng: 75.9972, aliases: ["changuvetti", "kottakkal changuvetty"] },
  { name: "Alathiyur", district: "Malappuram", lat: 10.8833, lng: 75.9333, aliases: ["alathiyoor", "triprangode"] },
  { name: "Chamravattom", district: "Malappuram", lat: 10.8333, lng: 75.9333, aliases: ["chamravattam", "chamravattom regulator"] },
  { name: "Tavanur", district: "Malappuram", lat: 10.8500, lng: 75.9833, aliases: ["thavanur", "kelappaji college area"] },
  { name: "Edayur", district: "Malappuram", lat: 10.9000, lng: 76.0667, aliases: ["edayoor", "athavanad"] },
  { name: "Anakkayam", district: "Malappuram", lat: 11.0833, lng: 76.1167, aliases: ["anakkayam town", "irumbuzhi"] },
  { name: "Kooriyad", district: "Malappuram", lat: 11.0500, lng: 75.9667, aliases: ["kooriyad town", "kakkad kooriyad"] },
  { name: "Vettichira", district: "Malappuram", lat: 10.9167, lng: 76.0333, aliases: ["vettichira town", "punnathala vettichira"] },
  { name: "Moonniyur", district: "Malappuram", lat: 11.0667, lng: 75.9000, aliases: ["mooniyur", "thalappara", "chelari"] },
  { name: "Cheekode", district: "Malappuram", lat: 11.2333, lng: 76.0000, aliases: ["cheekkode", "parannur"] },
  { name: "Edavannappara", district: "Malappuram", lat: 11.2272, lng: 75.9650, aliases: ["edavannapara", "chaliyar edavannappara", "elamaram bridge area"] },
  { name: "Vazhayur", district: "Malappuram", lat: 11.2167, lng: 75.9000, aliases: ["vazhayoor", "kakkov", "sa-afi college"] },

  // ==========================================
  // KOZHIKODE DISTRICT (Calicut / Malabar)
  // ==========================================
  { name: "Kozhikode", district: "Kozhikode", lat: 11.2588, lng: 75.7804, aliases: ["calicut", "kozhikodu", "calicut city", "mananchira", "mavoor road", "palayam", "nadakkavu", "beach"] },
  { name: "Vadakara", district: "Kozhikode", lat: 11.6033, lng: 75.5898, aliases: ["badagara", "vatakara", "badgara", "vadakara town", "chombala", "madappally"] },
  { name: "Koyilandy", district: "Kozhikode", lat: 11.4428, lng: 75.6984, aliases: ["quilandy", "koyilandi", "quilandi", "kollam koyilandy"] },
  { name: "Feroke", district: "Kozhikode", lat: 11.1963, lng: 75.8368, aliases: ["farook", "farooke", "farook college", "cheruvannur", "nallalam", "meenchanda"] },
  { name: "Koduvally", district: "Kozhikode", lat: 11.3570, lng: 75.9120, aliases: ["koduvalley", "koduvalli", "gold city", "koduvally town", "manippuram"] },
  { name: "Thamarassery", district: "Kozhikode", lat: 11.4167, lng: 75.9333, aliases: ["thamarasseri", "tamarassery", "thamarasery", "karadi", "thamarassery town"] },
  { name: "Ramanattukara", district: "Kozhikode", lat: 11.1764, lng: 75.8647, aliases: ["ramanatukara", "vaidyarangadi", "calicut bypass junction"] },
  { name: "Kunnamangalam", district: "Kozhikode", lat: 11.3090, lng: 75.8752, aliases: ["kunnamangalam town", "iim kozhikode", "nit calicut area", "markaz", "karanthur"] },
  { name: "Balussery", district: "Kozhikode", lat: 11.4475, lng: 75.8239, aliases: ["balusseri", "balussery town", "vattoli"] },
  { name: "Nadapuram", district: "Kozhikode", lat: 11.6917, lng: 75.6528, aliases: ["nadapuram town", "kallachi", "purameri", "edacheri"] },
  { name: "Mavoor", district: "Kozhikode", lat: 11.2619, lng: 75.9525, aliases: ["mavour", "mavoor gwalior rayons", "cheruppa"] },
  { name: "Mukkam", district: "Kozhikode", lat: 11.3167, lng: 75.9833, aliases: ["mookkam", "manassery", "kmct medical college", "agastianmuzhi"] },
  { name: "Kuttiady", district: "Kozhikode", lat: 11.6500, lng: 75.7500, aliases: ["kuttiadi", "kuttiyadi", "kuttiady town", "thottilpalam junction"] },
  { name: "Perambra", district: "Kozhikode", lat: 11.5333, lng: 75.7500, aliases: ["perampra", "perambra town", "kayanna"] },
  { name: "Payyoli", district: "Kozhikode", lat: 11.5167, lng: 75.6500, aliases: ["payyoli town", "thikkodi", "pt usha town"] },
  { name: "Beypore", district: "Kozhikode", lat: 11.1814, lng: 75.8056, aliases: ["beypur", "chaliyam", "beypore port"] },
  { name: "Cheruvannur", district: "Kozhikode", lat: 11.2000, lng: 75.8167, aliases: ["cheruvannoor", "nallalam", "meenchanda", "kallayi"] },
  { name: "Pantheeramkavu", district: "Kozhikode", lat: 11.2333, lng: 75.8333, aliases: ["pantheerankavu", "palazhi", "hilite mall area"] },
  { name: "Olavanna", district: "Kozhikode", lat: 11.2333, lng: 75.8167, aliases: ["olavanna town", "kodal nadakkavu"] },
  { name: "Kadalundi", district: "Kozhikode", lat: 11.1333, lng: 75.8167, aliases: ["kadalundy", "kadalundi bird sanctuary", "vallikkunnu border"] },
  { name: "Chathamangalam", district: "Kozhikode", lat: 11.3167, lng: 75.9333, aliases: ["nit calicut", "kettangal", "chathamangalam town"] },
  { name: "Omassery", district: "Kozhikode", lat: 11.3500, lng: 75.9667, aliases: ["omasseri", "omassery junction", "koduvally-mukkam road"] },
  { name: "Thiruvambady", district: "Kozhikode", lat: 11.3833, lng: 76.0167, aliases: ["thiruvambadi", "pulloorampara", "anakkampoyil"] },
  { name: "Adivaram", district: "Kozhikode", lat: 11.5000, lng: 76.0333, aliases: ["engapuzha", "thamarassery churam foot", "kaithapoyil"] },
  { name: "Atholi", district: "Kozhikode", lat: 11.3833, lng: 75.7667, aliases: ["atholi town", "kolathur", "modakkallur"] },
  { name: "Ulliyeri", district: "Kozhikode", lat: 11.4333, lng: 75.7667, aliases: ["ulliyeri 19", "ulliyeri town"] },
  { name: "Narikkuni", district: "Kozhikode", lat: 11.3667, lng: 75.8667, aliases: ["narikkuni town", "padanilam", "punnoor"] },
  { name: "Kallachi", district: "Kozhikode", lat: 11.6833, lng: 75.6667, aliases: ["kallachi town", "nadapuram kallachi"] },
  { name: "Thottilpalam", district: "Kozhikode", lat: 11.6833, lng: 75.8167, aliases: ["thottilpaalam", "vilangad", "pasukkadavu"] },
  { name: "Meppayur", district: "Kozhikode", lat: 11.5167, lng: 75.7000, aliases: ["meppayur town", "cheruvannur meppayur"] },
  { name: "Kakkodi", district: "Kozhikode", lat: 11.3000, lng: 75.7833, aliases: ["chelannur", "kakkoor", "makkada"] },
  { name: "Elathur", district: "Kozhikode", lat: 11.3333, lng: 75.7333, aliases: ["elathoor", "puthiyangadi", "korapuzha"] },
  { name: "Chombala", district: "Kozhikode", lat: 11.6500, lng: 75.5500, aliases: ["azhiyur", "mahe border", "kunhippally"] },
  { name: "Edacheri", district: "Kozhikode", lat: 11.6500, lng: 75.6167, aliases: ["edacherry", "purameri"] },
  { name: "Kakkattil", district: "Kozhikode", lat: 11.6667, lng: 75.7167, aliases: ["kakkattil town", "kunnummal"] },
  { name: "Nanminda", district: "Kozhikode", lat: 11.4000, lng: 75.8000, aliases: ["nanminda 14", "nanminda 13"] },
  { name: "Karassery", district: "Kozhikode", lat: 11.3333, lng: 76.0000, aliases: ["karasseri", "karassery bank junction"] },
  { name: "Kodenchery", district: "Kozhikode", lat: 11.4500, lng: 76.0167, aliases: ["kodencheri", "thusharagiri"] },
  { name: "Villiappally", district: "Kozhikode", lat: 11.6167, lng: 75.6333, aliases: ["villiappalli", "villiappally town"] },
  { name: "Onchiam", district: "Kozhikode", lat: 11.6333, lng: 75.5833, aliases: ["onchiyam", "vallikkad"] },
  { name: "Koolimadu", district: "Kozhikode", lat: 11.2675, lng: 75.9610, aliases: ["koolimad", "koolimadu bridge", "chaliyar koolimadu", "koolimadu town"] },
  { name: "Cheruppa", district: "Kozhikode", lat: 11.2720, lng: 75.9280, aliases: ["cherupa", "cheruppa hospital town"] },
  { name: "Pazhoor", district: "Kozhikode", lat: 11.2850, lng: 75.9620, aliases: ["pazhur", "pazhoor mahallu"] },

  // ==========================================
  // KANNUR DISTRICT (North Malabar)
  // ==========================================
  { name: "Kannur", district: "Kannur", lat: 11.8745, lng: 75.3704, aliases: ["cannanore", "kannur town", "kannur city", "caltex", "thana", "south bazar", "camp bazar", "plazas"] },
  { name: "Thalassery", district: "Kannur", lat: 11.7480, lng: 75.4894, aliases: ["tellicherry", "thalasseri", "talassery", "thalassery town", "dhaarmadam", "gundumala"] },
  { name: "Taliparamba", district: "Kannur", lat: 12.0437, lng: 75.3587, aliases: ["taliparambu", "thaliparamba", "thalipparamba", "syed nagar", "plazha"] },
  { name: "Payyanur", district: "Kannur", lat: 12.1009, lng: 75.2017, aliases: ["payyannur", "payannur", "payyanur town", "perumba", "annur"] },
  { name: "Mattannur", district: "Kannur", lat: 11.9333, lng: 75.5667, aliases: ["mattanoor", "kannur airport town", "mattannur junction"] },
  { name: "Iritty", district: "Kannur", lat: 11.9806, lng: 75.6667, aliases: ["iritti", "iritty town", "neruva", "vallithode"] },
  { name: "Koothuparamba", district: "Kannur", lat: 11.8317, lng: 75.5683, aliases: ["kuthuparamba", "kuthuparambu", "thokkilangadi"] },
  { name: "Panoor", district: "Kannur", lat: 11.7611, lng: 75.5878, aliases: ["panur", "panoor town", "champad"] },
  { name: "Valapattanam", district: "Kannur", lat: 11.9167, lng: 75.3667, aliases: ["valapatanam", "puzhathi", "valapattanam bridge", "kalarivathukkal"] },
  { name: "Pappinisseri", district: "Kannur", lat: 11.9500, lng: 75.3500, aliases: ["pappinissery", "aroli", "keechery"] },
  { name: "Chakkarakkal", district: "Kannur", lat: 11.8500, lng: 75.4667, aliases: ["anjarakkandy", "mowanchery"] },
  { name: "Dharmasala", district: "Kannur", lat: 11.9667, lng: 75.3667, aliases: ["dharmashala kannur", "nift kannur area", "mangattuparamba"] },
  { name: "Sreekandapuram", district: "Kannur", lat: 12.0333, lng: 75.5167, aliases: ["sreekandapuram town", "chemperi junction"] },
  { name: "Irikkur", district: "Kannur", lat: 11.9833, lng: 75.5667, aliases: ["irikkoor", "irikkur town"] },
  { name: "Mayyil", district: "Kannur", lat: 11.9833, lng: 75.4500, aliases: ["mayyil town", "kannadiparamba", "kolacherry"] },
  { name: "Mattool", district: "Kannur", lat: 11.9833, lng: 75.3000, aliases: ["mattul", "mattool north", "mattool south"] },
  { name: "Madayi", district: "Kannur", lat: 12.0333, lng: 75.2500, aliases: ["pazhayangadi", "madayippara", "eripuram"] },
  { name: "Pilathara", district: "Kannur", lat: 12.0833, lng: 75.2500, aliases: ["cheruthazham", "pilathara junction"] },
  { name: "Cherukunnu", district: "Kannur", lat: 12.0167, lng: 75.2833, aliases: ["kannapuram", "cherukunnu thara"] },
  { name: "Peravoor", district: "Kannur", lat: 11.9000, lng: 75.7500, aliases: ["peravur", "kakkayangad"] },
  { name: "Ulikkal", district: "Kannur", lat: 12.0167, lng: 75.6500, aliases: ["vayanakkavu", "ulikkal town"] },
  { name: "Chokli", district: "Kannur", lat: 11.7167, lng: 75.5667, aliases: ["chokly", "menapram", "olavilam"] },
  { name: "Pinarayi", district: "Kannur", lat: 11.7833, lng: 75.5167, aliases: ["dharmadam", "pinarayi town"] },
  { name: "City", district: "Kannur", lat: 11.8667, lng: 75.3667, aliases: ["kannur city", "ayikkara", "arakkal palace area"] },
  { name: "Kadirur", district: "Kannur", lat: 11.7667, lng: 75.5333, aliases: ["kadirur town", "kathirur"] },
  { name: "Cherupuzha", district: "Kannur", lat: 12.2833, lng: 75.3667, aliases: ["cherupuzha town", "prapoyil"] },
  { name: "Alakode", district: "Kannur", lat: 12.1833, lng: 75.4833, aliases: ["alakkode", "ottathai"] },

  // ==========================================
  // KASARAGOD DISTRICT (North Malabar Coast)
  // ==========================================
  { name: "Kasaragod", district: "Kasaragod", lat: 12.5102, lng: 74.9852, aliases: ["kasargod", "kasargode", "kasaragod town", "karanakkod", "vidyanagar"] },
  { name: "Kanhangad", district: "Kasaragod", lat: 12.3082, lng: 75.0898, aliases: ["kanhangadu", "hosdurg", "kanhangad town", "kotikulam"] },
  { name: "Nileshwar", district: "Kasaragod", lat: 12.2536, lng: 75.1322, aliases: ["neeleswaram", "nileshwaram", "nileshwar town"] },
  { name: "Uppala", district: "Kasaragod", lat: 12.6842, lng: 74.9392, aliases: ["uppala town", "uppala gate", "mangalpady"] },
  { name: "Cheruvathur", district: "Kasaragod", lat: 12.2167, lng: 75.1667, aliases: ["cheruvathoor", "kaikottukadavu"] },
  { name: "Thrikkaripur", district: "Kasaragod", lat: 12.1500, lng: 75.1667, aliases: ["trikaripur", "elambachi", "thrikkarpur"] },
  { name: "Padne", district: "Kasaragod", lat: 12.1833, lng: 75.1500, aliases: ["padanna", "udinoor", "edachakkai"] },
  { name: "Chandera", district: "Kasaragod", lat: 12.1667, lng: 75.1833, aliases: ["maniyat", "chandera town"] },
  { name: "Bekal", district: "Kasaragod", lat: 12.3833, lng: 75.0333, aliases: ["bekal fort", "pallikkere", "udma bekal"] },
  { name: "Chattanchal", district: "Kasaragod", lat: 12.4500, lng: 75.0333, aliases: ["thekkil", "chattanchal town"] },
  { name: "Cherkala", district: "Kasaragod", lat: 12.5000, lng: 75.0500, aliases: ["chengala", "cherkala junction"] },
  { name: "Bovikanam", district: "Kasaragod", lat: 12.5000, lng: 75.1000, aliases: ["bovikana", "muliyar"] },
  { name: "Kumbla", district: "Kasaragod", lat: 12.5833, lng: 74.9500, aliases: ["kumble", "kanipura", "shiriya"] },
  { name: "Mogral", district: "Kasaragod", lat: 12.5500, lng: 74.9667, aliases: ["mogral puthur", "kombanadka"] },
  { name: "Manjeshwar", district: "Kasaragod", lat: 12.7000, lng: 74.8833, aliases: ["manjeshwaram", "hosangadi", "thalangara border"] },
  { name: "Badiyadka", district: "Kasaragod", lat: 12.5833, lng: 75.0833, aliases: ["badiadka", "perdala"] },
  { name: "Mulleria", district: "Kasaragod", lat: 12.5500, lng: 75.1667, aliases: ["karadka", "adhoor"] },
  { name: "Thalangara", district: "Kasaragod", lat: 12.4833, lng: 74.9833, aliases: ["malik deenar", "thalangara town"] },
  { name: "Udma", district: "Kasaragod", lat: 12.4000, lng: 75.0333, aliases: ["uduma", "bare", "mangad"] },

  // ==========================================
  // WAYANAD DISTRICT (Highlands of Malabar)
  // ==========================================
  { name: "Kalpetta", district: "Wayanad", lat: 11.6103, lng: 76.0827, aliases: ["kalpatta", "wayanad headquarters", "muttil"] },
  { name: "Sultan Bathery", district: "Wayanad", lat: 11.6667, lng: 76.2833, aliases: ["sulthan bathery", "sulthan batheri", "battery", "cupping"] },
  { name: "Mananthavady", district: "Wayanad", lat: 11.8000, lng: 76.0000, aliases: ["mananthawadi", "manantoddy", "dwaraka wayanad"] },
  { name: "Meenangadi", district: "Wayanad", lat: 11.6611, lng: 76.1772, aliases: ["meenangadi town", "purakkadi"] },
  { name: "Panamaram", district: "Wayanad", lat: 11.7500, lng: 76.0667, aliases: ["panamaram town", "nadavayal"] },
  { name: "Pulpally", district: "Wayanad", lat: 11.7833, lng: 76.1667, aliases: ["pulpalli", "mullankolly"] },
  { name: "Vythiri", district: "Wayanad", lat: 11.5500, lng: 76.0333, aliases: ["lakkidi", "churam top", "poonoor wayanad border"] },
  { name: "Meppadi", district: "Wayanad", lat: 11.5500, lng: 76.1167, aliases: ["meppady", "chooralmala", "vaduvanchal"] },
  { name: "Ambalavayal", district: "Wayanad", lat: 11.6167, lng: 76.2167, aliases: ["ambalavayal town", "phantom rock area"] },
  { name: "Padinjarathara", district: "Wayanad", lat: 11.6667, lng: 75.9500, aliases: ["banasura dam town", "kavumannam"] },
  { name: "Kenichira", district: "Wayanad", lat: 11.7167, lng: 76.1667, aliases: ["poothadi", "nadavayal kenichira"] },

  // ==========================================
  // PALAKKAD DISTRICT (Valluvanad / South Malabar)
  // ==========================================
  { name: "Palakkad", district: "Palakkad", lat: 10.7867, lng: 76.6548, aliases: ["palghat", "palakkad town", "fort maidan", "olavakode"] },
  { name: "Ottapalam", district: "Palakkad", lat: 10.7719, lng: 76.3794, aliases: ["ottappalam", "mayannur", "varode"] },
  { name: "Pattambi", district: "Palakkad", lat: 10.8064, lng: 76.1969, aliases: ["pattambi town", "sanskrit college town", "mele pattambi"] },
  { name: "Mannarkkad", district: "Palakkad", lat: 10.9892, lng: 76.4597, aliases: ["mannarkad", "mannarkkadu", "attappadi junction", "kumaramputhur"] },
  { name: "Shornur", district: "Palakkad", lat: 10.7622, lng: 76.2750, aliases: ["shoranur", "shoranur junction", "cheruthuruthy border"] },
  { name: "Cherpulassery", district: "Palakkad", lat: 10.8803, lng: 76.3125, aliases: ["cherpulasseri", "thuthapuzha"] },
  { name: "Koppam", district: "Palakkad", lat: 10.8667, lng: 76.1833, aliases: ["koppam town", "pulasseri"] },
  { name: "Thrithala", district: "Palakkad", lat: 10.8000, lng: 76.1333, aliases: ["trithala", "kumbidi", "mezhathur"] },
  { name: "Chalissery", district: "Palakkad", lat: 10.7500, lng: 76.1000, aliases: ["chalisseri", "kattakampal border"] },
  { name: "Ongallur", district: "Palakkad", lat: 10.7833, lng: 76.2333, aliases: ["maruthur", "ongalloor"] },
  { name: "Alanallur", district: "Palakkad", lat: 11.0500, lng: 76.3667, aliases: ["alanellur", "edathanattukara border"] },
  { name: "Kumaramputhur", district: "Palakkad", lat: 10.9667, lng: 76.4333, aliases: ["edathanattukara", "kombam"] },
  { name: "Alathur", district: "Palakkad", lat: 10.6500, lng: 76.5500, aliases: ["alathoor", "swathi junction"] },
  { name: "Chittur", district: "Palakkad", lat: 10.7000, lng: 76.7167, aliases: ["thathamangalam", "chittur college"] },
  { name: "Kuzhalmannam", district: "Palakkad", lat: 10.7167, lng: 76.5833, aliases: ["kuzhalmannam town", "kottayi"] },
  { name: "Kollengode", district: "Palakkad", lat: 10.6167, lng: 76.7000, aliases: ["kollengodu", "seetharkundu"] },
  { name: "Vadakkencherry", district: "Palakkad", lat: 10.5833, lng: 76.5000, aliases: ["vadakanchery palakkad", "mangalam dam area"] },
  { name: "Kongad", district: "Palakkad", lat: 10.8833, lng: 76.5333, aliases: ["keralassery", "kongad town"] },

  // ==========================================
  // CENTRAL & SOUTH KERALA MAJOR CENTERS
  // ==========================================
  // Thrissur District
  { name: "Thrissur", district: "Thrissur", lat: 10.5276, lng: 76.2144, aliases: ["trichur", "thrissur town", "trissur", "swaraj round", "west fort"] },
  { name: "Chavakkad", district: "Thrissur", lat: 10.5898, lng: 76.0244, aliases: ["chavakad", "chavakkad beach", "blangad"] },
  { name: "Guruvayur", district: "Thrissur", lat: 10.5946, lng: 76.0407, aliases: ["guruvayoor", "east nada"] },
  { name: "Kunnamkulam", district: "Thrissur", lat: 10.6500, lng: 76.0700, aliases: ["kunnamkulam town", "kizhoor"] },
  { name: "Kodungallur", district: "Thrissur", lat: 10.2312, lng: 76.1947, aliases: ["cranganore", "kodungalloor", "cheraman juma masjid area"] },
  { name: "Chalakudy", district: "Thrissur", lat: 10.3070, lng: 76.3335, aliases: ["chalakkudy", "chalakudi", "potta"] },
  { name: "Irinjalakuda", district: "Thrissur", lat: 10.3422, lng: 76.2081, aliases: ["irinjalakkuda", "koodalmanikyam"] },
  { name: "Vadakkekad", district: "Thrissur", lat: 10.6333, lng: 76.0000, aliases: ["punnayurkulam", "andathode"] },
  { name: "Vadanappally", district: "Thrissur", lat: 10.4833, lng: 76.0833, aliases: ["vadanapally", "thali"] },
  { name: "Thriprayar", district: "Thrissur", lat: 10.4167, lng: 76.1167, aliases: ["triprayar", "valapad"] },

  // Ernakulam District
  { name: "Kochi", district: "Ernakulam", lat: 9.9312, lng: 76.2673, aliases: ["cochin", "ernakulam", "kochi city", "marine drive", "edapally", "kaloor", "kakkanad", "infopark", "alwaye"] },
  { name: "Aluva", district: "Ernakulam", lat: 10.1076, lng: 76.3516, aliases: ["alwaye", "aluva town", "bank junction", "manappuram"] },
  { name: "Perumbavoor", district: "Ernakulam", lat: 10.1147, lng: 76.4789, aliases: ["perumbavur", "perumbavoor town", "marampally"] },
  { name: "Angamaly", district: "Ernakulam", lat: 10.1960, lng: 76.3860, aliases: ["angamali", "cochin airport area", "nedumbassery", "cial"] },
  { name: "Muvattupuzha", district: "Ernakulam", lat: 9.9833, lng: 76.5833, aliases: ["muvattupuzha town", "arakkunnam"] },
  { name: "Kothamangalam", district: "Ernakulam", lat: 10.0631, lng: 76.6268, aliases: ["kothamangalam town", "nellimattom"] },
  { name: "Kalamassery", district: "Ernakulam", lat: 10.0558, lng: 76.3214, aliases: ["kalamassery", "cusat", "premier junction"] },

  // Kottayam District
  { name: "Kottayam", district: "Kottayam", lat: 9.5916, lng: 76.5222, aliases: ["kottayam town", "thirunakkara"] },
  { name: "Changanassery", district: "Kottayam", lat: 9.4447, lng: 76.5378, aliases: ["changanacherry", "perunna"] },
  { name: "Pala", district: "Kottayam", lat: 9.7125, lng: 76.6833, aliases: ["palai", "pala town"] },
  { name: "Kanjirappally", district: "Kottayam", lat: 9.5556, lng: 76.7861, aliases: ["kanjirapally", "erumely"] },
  { name: "Erattupetta", district: "Kottayam", lat: 9.6833, lng: 76.7833, aliases: ["eerattupetta", "erattupetta town", "theekoy"] },

  // Alappuzha District
  { name: "Alappuzha", district: "Alappuzha", lat: 9.4981, lng: 76.3388, aliases: ["alleppey", "alappuzha town", "punnamada"] },
  { name: "Kayamkulam", district: "Alappuzha", lat: 9.1723, lng: 76.5013, aliases: ["kayamkulam town", "krishnapuram"] },
  { name: "Cherthala", district: "Alappuzha", lat: 9.6847, lng: 76.3314, aliases: ["shertallai", "cherthala town", "arookkutty"] },

  // Kollam District
  { name: "Kollam", district: "Kollam", lat: 8.8932, lng: 76.6141, aliases: ["quilon", "kollam town", "kollam city", "chinnakada"] },
  { name: "Karunagappally", district: "Kollam", lat: 9.0543, lng: 76.5366, aliases: ["karunagappalli", "ochira", "vavvakkavu"] },
  { name: "Kottarakkara", district: "Kollam", lat: 8.9986, lng: 76.7725, aliases: ["kottarakara", "punalur"] },

  // Thiruvananthapuram District
  { name: "Thiruvananthapuram", district: "Thiruvananthapuram", lat: 8.5241, lng: 76.9366, aliases: ["trivandrum", "tvm", "thiruvananthapuram city", "technopark", "kazhakkoottam", "east fort"] },
  { name: "Attingal", district: "Thiruvananthapuram", lat: 8.6961, lng: 76.8142, aliases: ["attingal town", "chirayinkeezhu"] },
  { name: "Varkala", district: "Thiruvananthapuram", lat: 8.7379, lng: 76.7163, aliases: ["varkkala", "varkala cliff", "mahe"] },
  { name: "Neyyattinkara", district: "Thiruvananthapuram", lat: 8.4000, lng: 77.0833, aliases: ["neyyattinkara town", "balaramapuram"] },

  // Pathanamthitta & Idukki
  { name: "Pathanamthitta", district: "Pathanamthitta", lat: 9.2648, lng: 76.7870, aliases: ["pathanamthitta town", "adoor", "thiruvalla"] },
  { name: "Thodupuzha", district: "Idukki", lat: 9.8959, lng: 76.7184, aliases: ["thodupuzha town", "muttom"] }
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

  // 2. Fuzzy match nearestTown or nativePlace + homeDistrict
  const nearestTown = profile.locationFamily?.nearestTown || '';
  const nativePlace = profile.locationFamily?.nativePlace || '';
  const homeDistrict = profile.locationFamily?.homeDistrict || '';
  
  // Prioritize nearestTown for GPS accuracy, fallback to nativePlace, fallback to district
  const matched = (nearestTown ? fuzzyMatchPlace(nearestTown, homeDistrict) : null) || fuzzyMatchPlace(nativePlace, homeDistrict);
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

