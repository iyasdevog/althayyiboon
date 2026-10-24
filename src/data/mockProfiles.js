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

// Rich Initial Seed Profiles reflecting both Islamic & Academic Separations
export const MOCK_PROFILES = [
  {
    id: "ALTB-1001",
    gender: "male", // Normalized gender field
    basicInfo: {
      fullName: "Muhammed Anas",
      gender: "Groom",
      age: 27,
      dob: "1997-04-12",
      height: "5 ft 9 in (175 cm)",
      weight: "68 kg",
      maritalStatus: "Never Married",
      color: "Fair",
      motherTongue: "Malayalam"
    },
    islamicQualification: ["Wafi"],
    islamicBackground: {
      qualification: "Wafi",
      institution: "CIC Coordination of Islamic Colleges, Valanchery",
      sect: "Sunni",
      subGroup: "General Sunni",
      prayerHabit: "Always punctual in Masjid"
    },
    generalEducation: {
      level: "Master's Degree (MA, MSc, MCom, MTech)",
      degreeName: "M.A. Economics",
      subjectCategory: "Arts & Humanities",
      specialization: "Economics"
    },
    educationOccupation: {
      education: "Wafi & M.A. Economics",
      degree: "M.A. Economics",
      profession: "Teacher / Educator / Lecturer",
      jobTitle: "Assistant Professor in Economics",
      employerName: "Arts & Science College",
      workLocation: "Malappuram, Kerala",
      workCountry: "India (Kerala)",
      annualIncome: "₹ 5.5 - 7 Lakhs"
    },
    locationFamily: {
      homeDistrict: "Malappuram",
      nativePlace: "Manjeri",
      familyType: "Nuclear",
      fatherName: "K. Abdul Kareem (Businessman)",
      motherName: "Suhara (Homemaker)",
      siblings: "1 Brother (Engineer), 1 Sister (Married)"
    },
    contactDetails: {
      guardianPhone: "+91 9847123456",
      whatsappNumber: "+91 9847123456"
    },
    contactPreferences: {
      guardianName: "K. Abdul Kareem (Father)",
      relation: "Father",
      phone: "+91 9847123456",
      whatsapp: "+91 9847123456",
      expectations: "Looking for an educated, religious partner (Wafiyya / PG graduate) from a respectable family."
    },
    security: { editPin: "1234" },
    status: "approved",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: "ALTB-1002",
    gender: "female",
    basicInfo: {
      fullName: "Nadiya Fathima",
      gender: "Bride",
      age: 24,
      dob: "2000-08-19",
      height: "5 ft 4 in (163 cm)",
      weight: "54 kg",
      maritalStatus: "Never Married",
      color: "Fair",
      motherTongue: "Malayalam"
    },
    islamicQualification: ["Wafiyya"],
    islamicBackground: {
      qualification: "Wafiyya",
      institution: "Wafiyya Campus, Kozhikode",
      sect: "Sunni",
      subGroup: "General Sunni",
      prayerHabit: "Regular with Tahajjud"
    },
    generalEducation: {
      level: "Master's Degree (MA, MSc, MCom, MTech)",
      degreeName: "M.Sc. Biotechnology",
      subjectCategory: "Science & Research",
      specialization: "Biotechnology"
    },
    educationOccupation: {
      education: "Wafiyya & M.Sc. Biotechnology",
      degree: "M.Sc. Biotechnology",
      profession: "Student / Pursuing Higher Education",
      jobTitle: "Research Scholar / CSIR NET Aspirant",
      employerName: "University of Calicut",
      workLocation: "Kozhikode, Kerala",
      workCountry: "India (Kerala)",
      annualIncome: "₹ 3 - 4 Lakhs"
    },
    locationFamily: {
      homeDistrict: "Kozhikode",
      nativePlace: "Feroke",
      familyType: "Joint",
      fatherName: "C.H. Musthafa (Govt Employee)",
      motherName: "Khadeeja (Homemaker)",
      siblings: "2 Sisters (Unmarried, Schooling)"
    },
    contactDetails: {
      guardianPhone: "+91 9447654321",
      whatsappNumber: "+91 9447654321"
    },
    contactPreferences: {
      guardianName: "C.H. Musthafa (Father)",
      relation: "Father",
      phone: "+91 9447654321",
      whatsapp: "+91 9447654321",
      expectations: "Seeking a pious, well-mannered Wafi / Hudawi or Professional groom working in Kerala or Gulf."
    },
    security: { editPin: "1234" },
    status: "approved",
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString()
  },
  {
    id: "ALTB-1003",
    gender: "male",
    basicInfo: {
      fullName: "Dr. Sayyid Farhan Thangal",
      gender: "Groom",
      age: 29,
      dob: "1995-11-03",
      height: "5 ft 10 in (178 cm)",
      weight: "72 kg",
      maritalStatus: "Never Married",
      color: "Very Fair",
      motherTongue: "Malayalam"
    },
    islamicQualification: ["Hudawi"],
    islamicBackground: {
      qualification: "Hudawi",
      institution: "Darul Huda Islamic University, Chemmad",
      sect: "Sunni",
      subGroup: "Sayyid / Thangal Family",
      prayerHabit: "Punctual in congregation"
    },
    generalEducation: {
      level: "Doctorate (PhD)",
      degreeName: "Ph.D. Chemistry",
      subjectCategory: "Science & Research",
      specialization: "Chemistry & Nanomaterials"
    },
    educationOccupation: {
      education: "Hudawi & Ph.D. Chemistry",
      degree: "Ph.D. in Chemistry",
      profession: "Teacher / Educator / Lecturer",
      jobTitle: "Senior Post-Doc Researcher / Assistant Professor",
      employerName: "Central University",
      workLocation: "Kannur, Kerala",
      workCountry: "India (Kerala)",
      annualIncome: "₹ 9 - 12 Lakhs"
    },
    locationFamily: {
      homeDistrict: "Kannur",
      nativePlace: "Thalassery",
      familyType: "Reputed Thangal Family",
      fatherName: "Sayyid Alavi Thangal",
      motherName: "Sharifa Fathima",
      siblings: "2 Brothers (Engineers), 1 Sister"
    },
    contactDetails: {
      guardianPhone: "+91 9895112233",
      whatsappNumber: "+91 9895112233"
    },
    contactPreferences: {
      guardianName: "Sayyid Alavi Thangal (Father)",
      relation: "Father",
      phone: "+91 9895112233",
      whatsapp: "+91 9895112233",
      expectations: "Preferring Sayyid / Sharifah bride or pious Graduate / Post-graduate from traditional religious background."
    },
    security: { editPin: "1234" },
    status: "approved",
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: "ALTB-1004",
    gender: "female",
    basicInfo: {
      fullName: "Dr. Aysha Minha",
      gender: "Bride",
      age: 26,
      dob: "1998-02-14",
      height: "5 ft 5 in (165 cm)",
      weight: "57 kg",
      maritalStatus: "Never Married",
      color: "Fair",
      motherTongue: "Malayalam"
    },
    islamicQualification: ["None"],
    islamicBackground: {
      qualification: "None",
      sect: "Sunni",
      subGroup: "General Sunni",
      prayerHabit: "Regular 5 times prayers with Hijab"
    },
    generalEducation: {
      level: "Bachelor's Degree (BA, BSc, BCom, BTech, MBBS, etc.)",
      degreeName: "MBBS",
      subjectCategory: "Medical & Health",
      specialization: "General Medicine / Medical Practitioner"
    },
    educationOccupation: {
      education: "MBBS (Doctor)",
      degree: "MBBS",
      profession: "Doctor / Healthcare",
      jobTitle: "Duty Medical Officer (Preparing for PG NEET)",
      employerName: "Private Multi-Specialty Hospital",
      workLocation: "Palakkad, Kerala",
      workCountry: "India (Kerala)",
      annualIncome: "₹ 8 - 10 Lakhs"
    },
    locationFamily: {
      homeDistrict: "Palakkad",
      nativePlace: "Ottapalam",
      familyType: "Nuclear",
      fatherName: "Dr. P. Usman (Civil Surgeon)",
      motherName: "Sakeena Usman (B.Sc. Bed)",
      siblings: "1 Brother (B.Tech Software Engineer in Bangalore)"
    },
    contactDetails: {
      guardianPhone: "+91 9745889900",
      whatsappNumber: "+91 9745889900"
    },
    contactPreferences: {
      guardianName: "Dr. P. Usman (Father)",
      relation: "Father",
      phone: "+91 9745889900",
      whatsapp: "+91 9745889900",
      expectations: "Seeking a well-educated Doctor (MD/MS) or Engineering/IT professional with moderate religious values."
    },
    security: { editPin: "1234" },
    status: "approved",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    id: "ALTB-1005",
    gender: "male",
    basicInfo: {
      fullName: "Salmanul Faris",
      gender: "Groom",
      age: 28,
      dob: "1996-06-25",
      height: "5 ft 11 in (180 cm)",
      weight: "75 kg",
      maritalStatus: "Never Married",
      color: "Wheatish",
      motherTongue: "Malayalam"
    },
    islamicQualification: ["None"],
    islamicBackground: {
      qualification: "None",
      sect: "Sunni",
      subGroup: "General Sunni",
      prayerHabit: "Regular prayers, active community member"
    },
    generalEducation: {
      level: "Bachelor's Degree (BA, BSc, BCom, BTech, MBBS, etc.)",
      degreeName: "B.Tech Computer Science",
      subjectCategory: "Engineering & Tech",
      specialization: "Computer Science & Cloud Systems"
    },
    educationOccupation: {
      education: "B.Tech in Computer Science",
      degree: "B.Tech CSE",
      profession: "Software Engineer / IT",
      jobTitle: "Senior DevOps / Cloud Engineer",
      employerName: "Tech Multinational, Dubai Internet City",
      workLocation: "Dubai, UAE",
      workCountry: "UAE (Dubai, Abudhabi, etc.)",
      annualIncome: "AED 180,000 (~ ₹40 Lakhs)"
    },
    locationFamily: {
      homeDistrict: "Kasaragod",
      nativePlace: "Kanhangad",
      familyType: "Nuclear",
      fatherName: "Late B.M. Moideen",
      motherName: "Zainaba (Homemaker)",
      siblings: "2 Sisters (Both Married and Settled)"
    },
    contactDetails: {
      guardianPhone: "+971 501234567",
      whatsappNumber: "+971 501234567"
    },
    contactPreferences: {
      guardianName: "Mohammed Shereef (Uncle)",
      relation: "Uncle",
      phone: "+971 501234567",
      whatsapp: "+971 501234567",
      expectations: "Looking for a family-oriented, practicing Muslimah (Degree / PG holder) willing to relocate to Dubai."
    },
    security: { editPin: "1234" },
    status: "approved",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: "ALTB-1006",
    gender: "female",
    basicInfo: {
      fullName: "Rinsha Mariyam",
      gender: "Bride",
      age: 25,
      dob: "1999-09-10",
      height: "5 ft 3 in (160 cm)",
      weight: "52 kg",
      maritalStatus: "Never Married",
      color: "Fair",
      motherTongue: "Malayalam"
    },
    islamicQualification: ["Bathooliyya"],
    islamicBackground: {
      qualification: "Bathooliyya",
      institution: "Bathooliyya Islamic Institute",
      sect: "Sunni",
      subGroup: "General Sunni",
      prayerHabit: "Observant with Quran recitation"
    },
    generalEducation: {
      level: "Master's Degree (MA, MSc, MCom, MTech)",
      degreeName: "M.Com Finance",
      subjectCategory: "Commerce & Business",
      specialization: "Accounting & Finance"
    },
    educationOccupation: {
      education: "Bathooliyya & M.Com Finance",
      degree: "M.Com Finance",
      profession: "Accountant / Finance / CA",
      jobTitle: "Financial Analyst / Auditor",
      employerName: "Financial Consultancy Firm",
      workLocation: "Thrissur, Kerala",
      workCountry: "India (Kerala)",
      annualIncome: "₹ 4 - 5.5 Lakhs"
    },
    locationFamily: {
      homeDistrict: "Thrissur",
      nativePlace: "Chavakkad",
      familyType: "Joint",
      fatherName: "K.V. Hameed (Ex-Gulf)",
      motherName: "Sainaba",
      siblings: "1 Brother (Merchant Navy)"
    },
    contactDetails: {
      guardianPhone: "+91 9495334455",
      whatsappNumber: "+91 9495334455"
    },
    contactPreferences: {
      guardianName: "K.V. Hameed (Father)",
      relation: "Father",
      phone: "+91 9495334455",
      whatsapp: "+91 9495334455",
      expectations: "Seeking a religious, qualified groom (Gulf or Kerala professional) with good character."
    },
    security: { editPin: "1234" },
    status: "approved",
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString()
  },
  {
    id: "ALTB-1007",
    gender: "male",
    basicInfo: {
      fullName: "Adv. Bilal Hassan",
      gender: "Groom",
      age: 30,
      dob: "1994-01-18",
      height: "5 ft 8 in (173 cm)",
      weight: "70 kg",
      maritalStatus: "Never Married",
      color: "Fair",
      motherTongue: "Malayalam"
    },
    islamicQualification: ["Faizy"],
    islamicBackground: {
      qualification: "Faizy",
      institution: "Jamia Nooriya Arabiyya, Pattikkad",
      sect: "Sunni",
      subGroup: "General Sunni",
      prayerHabit: "Strict adherence to Sunnah"
    },
    generalEducation: {
      level: "Bachelor's Degree (BA, BSc, BCom, BTech, MBBS, etc.)",
      degreeName: "LLB (Bachelor of Laws)",
      subjectCategory: "Law & Legal",
      specialization: "Corporate & Constitutional Law"
    },
    educationOccupation: {
      education: "Faizy & LLB",
      degree: "LLB",
      profession: "Government / Civil Services",
      jobTitle: "Advocate, High Court of Kerala",
      employerName: "High Court Bar Association",
      workLocation: "Ernakulam, Kerala",
      workCountry: "India (Kerala)",
      annualIncome: "₹ 7 - 9 Lakhs"
    },
    locationFamily: {
      homeDistrict: "Ernakulam",
      nativePlace: "Aluva",
      familyType: "Nuclear",
      fatherName: "K.M. Hassan (Retd. Teacher)",
      motherName: "Maimoona",
      siblings: "2 Brothers (1 In Qatar, 1 Studying)"
    },
    contactDetails: {
      guardianPhone: "+91 9846001122",
      whatsappNumber: "+91 9846001122"
    },
    contactPreferences: {
      guardianName: "K.M. Hassan (Father)",
      relation: "Father",
      phone: "+91 9846001122",
      whatsapp: "+91 9846001122",
      expectations: "Preferring bride with Islamic morals and Graduation/Post-graduation."
    },
    security: { editPin: "1234" },
    status: "approved",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString()
  },
  {
    id: "ALTB-1008",
    gender: "female",
    basicInfo: {
      fullName: "Hiba Zahravi",
      gender: "Bride",
      age: 23,
      dob: "2001-05-30",
      height: "5 ft 2 in (158 cm)",
      weight: "49 kg",
      maritalStatus: "Never Married",
      color: "Fair",
      motherTongue: "Malayalam"
    },
    islamicQualification: ["Zahravi"],
    islamicBackground: {
      qualification: "Zahravi",
      institution: "Al-Zahra Islamic Academy",
      sect: "Sunni",
      subGroup: "General Sunni",
      prayerHabit: "Very pious, practicing Hijab"
    },
    generalEducation: {
      level: "Bachelor's Degree (BA, BSc, BCom, BTech, MBBS, etc.)",
      degreeName: "B.A. English Literature",
      subjectCategory: "Arts & Humanities",
      specialization: "English Literature"
    },
    educationOccupation: {
      education: "Zahravi & B.A. English",
      degree: "B.A. English",
      profession: "Teacher / Educator / Lecturer",
      jobTitle: "High School English & Moral Teacher",
      employerName: "English Medium Senior Secondary School",
      workLocation: "Wayanad, Kerala",
      workCountry: "India (Kerala)",
      annualIncome: "₹ 3 - 4.2 Lakhs"
    },
    locationFamily: {
      homeDistrict: "Wayanad",
      nativePlace: "Kalpetta",
      familyType: "Nuclear",
      fatherName: "T.A. Moosakutty (Estate Owner)",
      motherName: "Suhara Moosakutty",
      siblings: "1 Brother (B.Com Student)"
    },
    contactDetails: {
      guardianPhone: "+91 9446778899",
      whatsappNumber: "+91 9446778899"
    },
    contactPreferences: {
      guardianName: "T.A. Moosakutty (Father)",
      relation: "Father",
      phone: "+91 9446778899",
      whatsapp: "+91 9446778899",
      expectations: "Seeking a religious Wafi / Hudawi / Graduate groom with good family background."
    },
    security: { editPin: "1234" },
    status: "approved",
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString()
  }
];
