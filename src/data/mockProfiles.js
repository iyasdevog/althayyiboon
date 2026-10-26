export const KERALA_DISTRICTS = [
  "Malappuram",
  "Kozhikode",
  "Kannur",
  "Wayanad",
  "Kasaragod",
  "Palakkad",
  "Ernakulam",
  "Thrissur",
  "Thiruvananthapuram",
  "Kollam",
  "Kottayam",
  "Alappuzha",
  "Idukki",
  "Pathanamthitta"
];

export const ISLAMIC_QUALIFICATIONS = [
  "Wafi",
  "Wafiyya",
  "Hudawi",
  "Zahravi",
  "Baqavi",
  "Faizy",
  "Saqafi",
  "Sa-adi",
  "Hasani",
  "Adani",
  "Bathooliyya",
  "Falil",
  "Falila",
  "Sidheequi",
  "Anwari",
  "Latheefi",
  "Marjani",
  "Furqani",
  "Hafiz / Hafiza",
  "Afzal-ul-Ulama",
  "Custom / Other",
  "None"
];

// General Academic Qualification Levels
export const EDUCATION_LEVELS = [
  "Doctorate (PhD)",
  "Master's Degree (MA, MSc, MCom, MTech)",
  "Bachelor's Degree (BA, BSc, BCom, BTech, MBBS, etc.)",
  "Diploma / Vocational",
  "High School / Higher Secondary",
  "Other"
];

// Specialized Academic Subject Categories
export const SUBJECT_CATEGORIES = [
  "Arts & Humanities",
  "Science & Research",
  "Commerce & Business",
  "Engineering & Tech",
  "Medical & Health",
  "Islamic Studies & Education",
  "Law & Legal"
];

export const SUBJECT_CATEGORY_EXAMPLES = {
  "Arts & Humanities": ["Economics", "Sociology", "History", "English Literature", "Political Science", "Psychology", "Journalism", "Arabic Language"],
  "Science & Research": ["Physics", "Chemistry", "Biotechnology", "Mathematics", "Microbiology", "Botany", "Zoology", "Data Science"],
  "Commerce & Business": ["Accounting & Finance", "BBA", "MBA", "M.Com", "Chartered Accountancy (CA)", "Banking", "Human Resources"],
  "Engineering & Tech": ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering", "Electronics (ECE)", "Electrical (EEE)", "Artificial Intelligence"],
  "Medical & Health": ["MBBS / General Medicine", "BDS / Dental Surgery", "B.Pharm / Pharmacy", "B.Sc. Nursing", "Physiotherapy", "Medical Lab Tech (MLT)", "Ayurveda / Homeo"],
  "Islamic Studies & Education": ["Usul al-Din", "Sharia & Islamic Jurisprudence", "Hadith Studies", "Quranic Sciences", "Islamic History & Civilization", "Da'wah & Comparative Religion"],
  "Law & Legal": ["LLB (Bachelor of Laws)", "LLM (Master of Laws)", "Corporate Law", "Constitutional Law", "Criminal Law"]
};

export const SECTS = [
  "Sunni",
  "Salafi / Mujahid",
  "Jama-at",
  "Tableeg",
  "Other"
];

export const COMMUNITY_GROUPS = [
  "Sayyid / Thangal Family",
  "Malabari",
  "Keyi Family",
  "General Sunni",
  "Any / Open"
];

export const MARITAL_STATUSES = [
  "Never Married",
  "Divorced",
  "Widowed"
];

export const COMPLEXIONS = [
  "Not Specified",
  "Very Fair",
  "Fair",
  "Wheatish",
  "Wheatish Medium",
  "Dark / Brown"
];

export const WORK_LOCATIONS = [
  "India (Kerala)",
  "India (Outside Kerala)",
  "UAE (Dubai, Abudhabi, etc.)",
  "Saudi Arabia",
  "Qatar",
  "Oman",
  "Kuwait",
  "Bahrain",
  "Other Abroad / Western Countries"
];

export const COMMON_PROFESSIONS = [
  "Software Engineer / IT",
  "Doctor / Healthcare",
  "Nurse / Paramedical",
  "Civil / Mech / Electrical Engineer",
  "Teacher / Educator / Lecturer",
  "Accountant / Finance / CA",
  "Business / Entrepreneur",
  "Banking Professional",
  "Government / Civil Services",
  "Graphic Designer / Media / Content",
  "Architect / Interior Designer",
  "Pharmacist / Medical Rep",
  "HR / Administrative",
  "Islamic Teacher / Usthad",
  "Student / Pursuing Higher Education",
  "Other / Private Employee"
];

// Realistic Sample / Demo Profiles used EXCLUSIVELY for Instant Demo Mode
export const DEMO_PROFILES = [
  {
    id: "DEMO-BRIDE-101",
    isFakeData: true,
    gender: "female",
    status: "approved",
    createdAt: "2026-10-20T10:00:00.000Z",
    registeredDuringCampaign: true,
    whatsappConsent: true,
    whatsappGroupNumber: "+91 98460 00001",
    loginCredentials: {
      username: "DEMO-BRIDE-101",
      password: "demo-password-101"
    },
    basicInfo: {
      fullName: "Fathima Zahra (Demo Sample)",
      gender: "Bride",
      age: 22,
      dob: "2004-05-14",
      maritalStatus: "Never Married",
      height: "5 ft 3 in (160 cm)",
      physicalStatus: "Normal",
      color: "Fair",
      motherTongue: "Malayalam"
    },
    islamicQualification: ["Wafiyya"],
    islamicBackground: {
      qualification: "Wafiyya",
      institution: "Wafiyya College, Malappuram",
      sect: "Sunni",
      subGroup: "General Sunni"
    },
    generalEducation: {
      level: "Bachelor's Degree (BA, BSc, BCom, BTech, MBBS, etc.)",
      degreeName: "B.Sc. Mathematics",
      subjectCategory: "Science & Research",
      specialization: "Applied Mathematics"
    },
    educationOccupation: {
      education: "B.Sc. Mathematics & Wafiyya",
      profession: "Teacher / Educator / Lecturer",
      jobTitle: "High School Mathematics Faculty",
      workLocation: "Malappuram",
      workCountry: "India (Kerala)"
    },
    locationFamily: {
      homeDistrict: "Malappuram",
      nativePlace: "Manjeri",
      fatherName: "K.V. Abdul Latheef",
      motherName: "Suhara Latheef",
      siblings: "1 Brother (Engineer), 1 Sister"
    },
    contactDetails: {
      guardianPhone: "+91 98460 00001",
      whatsappNumber: "+91 98460 00001"
    },
    contactPreferences: {
      guardianName: "K.V. Abdul Latheef",
      relation: "Father",
      phone: "+91 98460 00001",
      whatsapp: "+91 98460 00001",
      contactMethod: "both",
      expectations: "Seeking a well-educated, religious groom (Wafi, Doctor, Engineer or PG graduate) from a respectable Sunni family."
    },
    security: { editPin: "1234" }
  },
  {
    id: "DEMO-BRIDE-102",
    isFakeData: true,
    gender: "female",
    status: "approved",
    createdAt: "2026-10-21T11:30:00.000Z",
    registeredDuringCampaign: true,
    whatsappConsent: true,
    whatsappGroupNumber: "+91 98460 00002",
    loginCredentials: {
      username: "DEMO-BRIDE-102",
      password: "demo-password-102"
    },
    basicInfo: {
      fullName: "Dr. Aysha Mariyam (Demo Sample)",
      gender: "Bride",
      age: 24,
      dob: "2002-08-20",
      maritalStatus: "Never Married",
      height: "5 ft 4 in (163 cm)",
      physicalStatus: "Normal",
      color: "Fair",
      motherTongue: "Malayalam"
    },
    islamicQualification: ["Hafiz / Hafiza", "Afzal-ul-Ulama"],
    islamicBackground: {
      qualification: "Hafiz / Hafiza",
      institution: "Markaz Quran Academy",
      sect: "Sunni",
      subGroup: "General Sunni"
    },
    generalEducation: {
      level: "Bachelor's Degree (BA, BSc, BCom, BTech, MBBS, etc.)",
      degreeName: "MBBS",
      subjectCategory: "Medical & Health",
      specialization: "General Medicine"
    },
    educationOccupation: {
      education: "MBBS & Quran Hafiza",
      profession: "Doctor / Healthcare",
      jobTitle: "Junior Resident Physician",
      workLocation: "Kozhikode",
      workCountry: "India (Kerala)"
    },
    locationFamily: {
      homeDistrict: "Kozhikode",
      nativePlace: "Vadakara",
      fatherName: "Dr. P. Muhammed Ali",
      motherName: "Khadeeja Ali",
      siblings: "2 Sisters"
    },
    contactDetails: {
      guardianPhone: "+91 98460 00002",
      whatsappNumber: "+91 98460 00002"
    },
    contactPreferences: {
      guardianName: "Dr. P. Muhammed Ali",
      relation: "Father",
      phone: "+91 98460 00002",
      whatsapp: "+91 98460 00002",
      contactMethod: "both",
      expectations: "Looking for an educated Doctor, Post Graduate or Scholar with strong religious foundation."
    },
    security: { editPin: "2345" }
  },
  {
    id: "DEMO-BRIDE-103",
    isFakeData: true,
    gender: "female",
    status: "approved",
    createdAt: "2026-10-22T09:15:00.000Z",
    registeredDuringCampaign: true,
    whatsappConsent: true,
    whatsappGroupNumber: "+91 98460 00003",
    loginCredentials: {
      username: "DEMO-BRIDE-103",
      password: "demo-password-103"
    },
    basicInfo: {
      fullName: "Hiba Nasreen (Demo Sample)",
      gender: "Bride",
      age: 23,
      dob: "2003-03-10",
      maritalStatus: "Never Married",
      height: "5 ft 2 in (157 cm)",
      physicalStatus: "Normal",
      color: "Fair",
      motherTongue: "Malayalam"
    },
    islamicQualification: ["Wafiyya"],
    islamicBackground: {
      qualification: "Wafiyya",
      institution: "Wafiyya Academy, Kannur",
      sect: "Sunni",
      subGroup: "General Sunni"
    },
    generalEducation: {
      level: "Bachelor's Degree (BA, BSc, BCom, BTech, MBBS, etc.)",
      degreeName: "B.Tech Computer Science",
      subjectCategory: "Engineering & Tech",
      specialization: "Software Systems"
    },
    educationOccupation: {
      education: "B.Tech CSE & Wafiyya",
      profession: "Software Engineer / IT",
      jobTitle: "Frontend Developer (Remote MNC)",
      workLocation: "Kannur / Remote",
      workCountry: "India (Kerala)"
    },
    locationFamily: {
      homeDistrict: "Kannur",
      nativePlace: "Taliparamba",
      fatherName: "C.K. Musthafa",
      motherName: "Maimoona",
      siblings: "1 Younger Brother"
    },
    contactDetails: {
      guardianPhone: "+91 98460 00003",
      whatsappNumber: "+91 98460 00003"
    },
    contactPreferences: {
      guardianName: "C.K. Musthafa",
      relation: "Father",
      phone: "+91 98460 00003",
      whatsapp: "+91 98460 00003",
      contactMethod: "both",
      expectations: "Seeking a practicing Muslim professional (Software Engineer, Wafi, CA or Doctor) settled in Kerala or Gulf."
    },
    security: { editPin: "3456" }
  },
  {
    id: "DEMO-BRIDE-104",
    isFakeData: true,
    gender: "female",
    status: "approved",
    createdAt: "2026-10-23T14:45:00.000Z",
    registeredDuringCampaign: true,
    whatsappConsent: true,
    whatsappGroupNumber: "+91 98460 00004",
    loginCredentials: {
      username: "DEMO-BRIDE-104",
      password: "demo-password-104"
    },
    basicInfo: {
      fullName: "Lubna Thasneem (Demo Sample)",
      gender: "Bride",
      age: 25,
      dob: "2001-11-28",
      maritalStatus: "Never Married",
      height: "5 ft 5 in (165 cm)",
      physicalStatus: "Normal",
      color: "Wheatish",
      motherTongue: "Malayalam"
    },
    islamicQualification: ["Wafiyya"],
    islamicBackground: {
      qualification: "Wafiyya",
      institution: "Wafiyya Arts College, Thrissur",
      sect: "Sunni",
      subGroup: "General Sunni"
    },
    generalEducation: {
      level: "Master's Degree (MA, MSc, MCom, MTech)",
      degreeName: "M.Com Finance & Taxation",
      subjectCategory: "Commerce & Business",
      specialization: "Corporate Accounting"
    },
    educationOccupation: {
      education: "M.Com & Wafiyya",
      profession: "Accountant / Finance / CA",
      jobTitle: "Financial Analyst",
      workLocation: "Kochi",
      workCountry: "India (Kerala)"
    },
    locationFamily: {
      homeDistrict: "Thrissur",
      nativePlace: "Chavakkad",
      fatherName: "T. Ibrahim",
      motherName: "Sainaba",
      siblings: "2 Brothers"
    },
    contactDetails: {
      guardianPhone: "+91 98460 00004",
      whatsappNumber: "+91 98460 00004"
    },
    contactPreferences: {
      guardianName: "T. Ibrahim",
      relation: "Father",
      phone: "+91 98460 00004",
      whatsapp: "+91 98460 00004",
      contactMethod: "both",
      expectations: "Looking for an upright, morally disciplined groom with stable career in finance, business or scholarship."
    },
    security: { editPin: "4567" }
  },
  {
    id: "DEMO-GROOM-201",
    isFakeData: true,
    gender: "male",
    status: "approved",
    createdAt: "2026-10-20T12:00:00.000Z",
    registeredDuringCampaign: true,
    whatsappConsent: true,
    whatsappGroupNumber: "+91 98460 00005",
    loginCredentials: {
      username: "DEMO-GROOM-201",
      password: "demo-password-201"
    },
    basicInfo: {
      fullName: "Muhammed Rashid (Demo Sample)",
      gender: "Groom",
      age: 26,
      dob: "2000-04-12",
      maritalStatus: "Never Married",
      height: "5 ft 9 in (175 cm)",
      physicalStatus: "Normal",
      color: "Fair",
      motherTongue: "Malayalam"
    },
    islamicQualification: ["Wafi"],
    islamicBackground: {
      qualification: "Wafi",
      institution: "CIC Wafi College, Valanchery",
      sect: "Sunni",
      subGroup: "General Sunni"
    },
    generalEducation: {
      level: "Bachelor's Degree (BA, BSc, BCom, BTech, MBBS, etc.)",
      degreeName: "B.Tech Information Technology",
      subjectCategory: "Engineering & Tech",
      specialization: "Cloud Architecture"
    },
    educationOccupation: {
      education: "B.Tech IT & Wafi Sanad",
      profession: "Software Engineer / IT",
      jobTitle: "Senior Cloud Engineer",
      workLocation: "Dubai",
      workCountry: "UAE (Dubai, Abudhabi, etc.)"
    },
    locationFamily: {
      homeDistrict: "Malappuram",
      nativePlace: "Perinthalmanna",
      fatherName: "Haji K. Usman",
      motherName: "Rabiya",
      siblings: "1 Sister (Married)"
    },
    contactDetails: {
      guardianPhone: "+91 98460 00005",
      whatsappNumber: "+91 98460 00005"
    },
    contactPreferences: {
      guardianName: "Haji K. Usman",
      relation: "Father",
      phone: "+91 98460 00005",
      whatsapp: "+91 98460 00005",
      contactMethod: "both",
      expectations: "Seeking a pious, religious bride (Wafiyya, Graduate or Doctor) with gentle character from a good family."
    },
    security: { editPin: "5678" }
  },
  {
    id: "DEMO-GROOM-202",
    isFakeData: true,
    gender: "male",
    status: "approved",
    createdAt: "2026-10-21T15:20:00.000Z",
    registeredDuringCampaign: true,
    whatsappConsent: true,
    whatsappGroupNumber: "+91 98460 00006",
    loginCredentials: {
      username: "DEMO-GROOM-202",
      password: "demo-password-202"
    },
    basicInfo: {
      fullName: "Dr. Salman Faris (Demo Sample)",
      gender: "Groom",
      age: 27,
      dob: "1999-07-18",
      maritalStatus: "Never Married",
      height: "5 ft 10 in (178 cm)",
      physicalStatus: "Normal",
      color: "Fair",
      motherTongue: "Malayalam"
    },
    islamicQualification: ["Hudawi"],
    islamicBackground: {
      qualification: "Hudawi",
      institution: "Darul Huda Islamic University, Chemmad",
      sect: "Sunni",
      subGroup: "General Sunni"
    },
    generalEducation: {
      level: "Doctorate (PhD)",
      degreeName: "MBBS & MD Resident",
      subjectCategory: "Medical & Health",
      specialization: "Internal Medicine"
    },
    educationOccupation: {
      education: "MBBS & Hudawi",
      profession: "Doctor / Healthcare",
      jobTitle: "Senior Resident Physician",
      workLocation: "Kozhikode",
      workCountry: "India (Kerala)"
    },
    locationFamily: {
      homeDistrict: "Kozhikode",
      nativePlace: "Kottakkal",
      fatherName: "Prof. Shamsudheen",
      motherName: "Amina Shamsudheen",
      siblings: "1 Brother (Doctor), 1 Sister"
    },
    contactDetails: {
      guardianPhone: "+91 98460 00006",
      whatsappNumber: "+91 98460 00006"
    },
    contactPreferences: {
      guardianName: "Prof. Shamsudheen",
      relation: "Father",
      phone: "+91 98460 00006",
      whatsapp: "+91 98460 00006",
      contactMethod: "both",
      expectations: "Seeking a medical professional or Wafiyya scholar from an observant Sunni family."
    },
    security: { editPin: "6789" }
  },
  {
    id: "DEMO-GROOM-203",
    isFakeData: true,
    gender: "male",
    status: "approved",
    createdAt: "2026-10-22T16:10:00.000Z",
    registeredDuringCampaign: true,
    whatsappConsent: true,
    whatsappGroupNumber: "+91 98460 00007",
    loginCredentials: {
      username: "DEMO-GROOM-203",
      password: "demo-password-203"
    },
    basicInfo: {
      fullName: "Bilal Ahammed (Demo Sample)",
      gender: "Groom",
      age: 28,
      dob: "1998-09-05",
      maritalStatus: "Never Married",
      height: "5 ft 8 in (173 cm)",
      physicalStatus: "Normal",
      color: "Wheatish",
      motherTongue: "Malayalam"
    },
    islamicQualification: ["Wafi"],
    islamicBackground: {
      qualification: "Wafi",
      institution: "CIC Wafi College, Kannur",
      sect: "Sunni",
      subGroup: "General Sunni"
    },
    generalEducation: {
      level: "Bachelor's Degree (BA, BSc, BCom, BTech, MBBS, etc.)",
      degreeName: "Chartered Accountant (CA) & B.Com",
      subjectCategory: "Commerce & Business",
      specialization: "Audit & Tax Advisory"
    },
    educationOccupation: {
      education: "Chartered Accountant (ICAI) & Wafi",
      profession: "Accountant / Finance / CA",
      jobTitle: "Senior Internal Auditor",
      workLocation: "Riyadh",
      workCountry: "Saudi Arabia"
    },
    locationFamily: {
      homeDistrict: "Kannur",
      nativePlace: "Payyanur",
      fatherName: "K.V. Abdul Khader",
      motherName: "Suhra Khader",
      siblings: "2 Brothers (Engineers)"
    },
    contactDetails: {
      guardianPhone: "+91 98460 00007",
      whatsappNumber: "+91 98460 00007"
    },
    contactPreferences: {
      guardianName: "K.V. Abdul Khader",
      relation: "Father",
      phone: "+91 98460 00007",
      whatsapp: "+91 98460 00007",
      contactMethod: "both",
      expectations: "Seeking a Wafiyya, graduate or postgraduate bride with traditional Islamic values."
    },
    security: { editPin: "7890" }
  },
  {
    id: "DEMO-GROOM-204",
    isFakeData: true,
    gender: "male",
    status: "approved",
    createdAt: "2026-10-23T11:00:00.000Z",
    registeredDuringCampaign: true,
    whatsappConsent: true,
    whatsappGroupNumber: "+91 98460 00008",
    loginCredentials: {
      username: "DEMO-GROOM-204",
      password: "demo-password-204"
    },
    basicInfo: {
      fullName: "Afsal Rahman (Demo Sample)",
      gender: "Groom",
      age: 25,
      dob: "2001-02-14",
      maritalStatus: "Never Married",
      height: "5 ft 7 in (170 cm)",
      physicalStatus: "Normal",
      color: "Fair",
      motherTongue: "Malayalam"
    },
    islamicQualification: ["Hudawi"],
    islamicBackground: {
      qualification: "Hudawi",
      institution: "Darul Huda Islamic University",
      sect: "Sunni",
      subGroup: "General Sunni"
    },
    generalEducation: {
      level: "Master's Degree (MA, MSc, MCom, MTech)",
      degreeName: "M.A. Arabic & Islamic Studies",
      subjectCategory: "Islamic Studies & Education",
      specialization: "Classical Linguistics"
    },
    educationOccupation: {
      education: "M.A. Arabic & Hudawi",
      profession: "Teacher / Educator / Lecturer",
      jobTitle: "Assistant Professor in Arabic",
      workLocation: "Malappuram",
      workCountry: "India (Kerala)"
    },
    locationFamily: {
      homeDistrict: "Malappuram",
      nativePlace: "Tirur",
      fatherName: "P. Hamza Moulavi",
      motherName: "Khadeeja",
      siblings: "1 Brother, 2 Sisters"
    },
    contactDetails: {
      guardianPhone: "+91 98460 00008",
      whatsappNumber: "+91 98460 00008"
    },
    contactPreferences: {
      guardianName: "P. Hamza Moulavi",
      relation: "Father",
      phone: "+91 98460 00008",
      whatsapp: "+91 98460 00008",
      contactMethod: "both",
      expectations: "Seeking a Wafiyya or religious graduate bride from a scholarly, pious background."
    },
    security: { editPin: "8901" }
  }
];

export const MOCK_PROFILES = DEMO_PROFILES;

