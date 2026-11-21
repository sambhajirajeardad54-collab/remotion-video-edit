import type { Course, CourseModule, Lesson, LessonKind } from '../types';

const l = (id: string, en: string, mr: string, durationMin: number, kind: LessonKind = 'video'): Lesson => ({
  id,
  title: { en, mr },
  durationMin,
  kind,
});

const m = (id: string, en: string, mr: string, lessons: Lesson[]): CourseModule => ({
  id,
  title: { en, mr },
  lessons,
});

export const courses: Course[] = [
  {
    id: 'group-c-prelims-2027',
    examIds: ['mpsc-group-c'],
    title: {
      en: 'Group C Combined Prelims — Complete Batch 2027',
      mr: 'गट-क संयुक्त पूर्व परीक्षा — संपूर्ण बॅच 2027',
    },
    subtitle: {
      en: 'Full syllabus coverage with weekly tests and revision',
      mr: 'साप्ताहिक चाचण्या व उजळणीसह संपूर्ण अभ्यासक्रम',
    },
    description: {
      en: 'A structured 24-week programme covering History, Geography, Polity, Economy, General Science and Reasoning as per the latest MPSC Group C prelims syllabus. Every unit ends with a practice quiz.',
      mr: 'एमपीएससी गट-क पूर्व परीक्षेच्या नवीन अभ्यासक्रमानुसार इतिहास, भूगोल, राज्यव्यवस्था, अर्थव्यवस्था, सामान्य विज्ञान व बुद्धिमत्ता चाचणी यांचा 24 आठवड्यांचा नियोजित अभ्यासक्रम. प्रत्येक घटकाच्या शेवटी सराव प्रश्नमंजुषा.',
    },
    level: 'foundation',
    teachingLanguage: 'mr',
    instructor: {
      name: { en: 'Prof. Sunil Deshmukh', mr: 'प्रा. सुनील देशमुख' },
      credential: { en: '12 years teaching MPSC History & Polity', mr: 'एमपीएससी इतिहास व राज्यव्यवस्था अध्यापनाचा 12 वर्षांचा अनुभव' },
    },
    durationWeeks: 24,
    feeInr: 14999,
    rating: 4.8,
    learners: 2140,
    highlights: [
      { en: '180+ hours of recorded lectures', mr: '180+ तासांची रेकॉर्डेड व्याख्याने' },
      { en: '24 weekly mock tests with analysis', mr: 'विश्लेषणासह 24 साप्ताहिक सराव परीक्षा' },
      { en: 'Printable notes in Marathi', mr: 'मराठीतील छापण्यायोग्य नोट्स' },
      { en: 'Live doubt-clearing every Saturday', mr: 'दर शनिवारी थेट शंका-निरसन सत्र' },
    ],
    modules: [
      m('gcp-history', 'History of Modern India & Maharashtra', 'आधुनिक भारत व महाराष्ट्राचा इतिहास', [
        l('gcp-h1', 'Arrival of Europeans and the East India Company', 'युरोपियनांचे आगमन व ईस्ट इंडिया कंपनी', 42),
        l('gcp-h2', 'Social reformers of Maharashtra', 'महाराष्ट्रातील समाजसुधारक', 55),
        l('gcp-h3', 'Indian National Movement: 1885–1947', 'भारतीय राष्ट्रीय चळवळ : 1885–1947', 61),
        l('gcp-h4', 'Unit quiz: Modern History', 'घटक चाचणी : आधुनिक इतिहास', 20, 'quiz'),
      ]),
      m('gcp-geo', 'Geography of Maharashtra', 'महाराष्ट्राचा भूगोल', [
        l('gcp-g1', 'Physiography and the Sahyadri', 'प्राकृतिक रचना व सह्याद्री', 48),
        l('gcp-g2', 'River systems and dams', 'नदीप्रणाली व धरणे', 44),
        l('gcp-g3', 'Climate, soils and agriculture', 'हवामान, मृदा व शेती', 50),
        l('gcp-g4', 'Map practice notes', 'नकाशा सराव नोट्स', 15, 'notes'),
      ]),
      m('gcp-polity', 'Indian Polity & Panchayat Raj', 'भारतीय राज्यव्यवस्था व पंचायतराज', [
        l('gcp-p1', 'Preamble and salient features', 'सरनामा व वैशिष्ट्ये', 38),
        l('gcp-p2', 'Fundamental Rights and Duties', 'मूलभूत हक्क व कर्तव्ये', 52),
        l('gcp-p3', '73rd & 74th Amendments: local self-government', '73 वी व 74 वी घटनादुरुस्ती : स्थानिक स्वराज्य संस्था', 47),
      ]),
      m('gcp-eco', 'Economy', 'अर्थव्यवस्था', [
        l('gcp-e1', 'Basics of national income', 'राष्ट्रीय उत्पन्नाच्या मूलभूत संकल्पना', 40),
        l('gcp-e2', 'Budget, taxation and GST', 'अर्थसंकल्प, कररचना व जीएसटी', 46),
      ]),
      m('gcp-sci', 'General Science', 'सामान्य विज्ञान', [
        l('gcp-s1', 'Human body and health', 'मानवी शरीर व आरोग्य', 43),
        l('gcp-s2', 'Everyday physics and chemistry', 'दैनंदिन भौतिकशास्त्र व रसायनशास्त्र', 45),
      ]),
    ],
  },
  {
    id: 'group-c-mains-clerk',
    examIds: ['mpsc-group-c'],
    title: {
      en: 'Group C Mains — Clerk-Typist & Tax Assistant',
      mr: 'गट-क मुख्य परीक्षा — लिपिक-टंकलेखक व कर सहायक',
    },
    subtitle: {
      en: 'Language papers, GK and typing test preparation',
      mr: 'भाषा पेपर, सामान्य ज्ञान व टंकलेखन चाचणीची तयारी',
    },
    description: {
      en: 'Post-specific mains preparation with in-depth Marathi and English grammar, general knowledge and guided typing-speed practice for the skill test.',
      mr: 'सखोल मराठी व इंग्रजी व्याकरण, सामान्य ज्ञान आणि कौशल्य चाचणीसाठी मार्गदर्शित टंकलेखन सरावासह पदनिहाय मुख्य परीक्षेची तयारी.',
    },
    level: 'advanced',
    teachingLanguage: 'bilingual',
    instructor: {
      name: { en: 'Smt. Anjali Kulkarni', mr: 'श्रीमती अंजली कुलकर्णी' },
      credential: { en: 'M.A. Marathi, 9 years of mains guidance', mr: 'एम.ए. मराठी, मुख्य परीक्षा मार्गदर्शनाचा 9 वर्षांचा अनुभव' },
    },
    durationWeeks: 16,
    feeInr: 9999,
    rating: 4.7,
    learners: 980,
    highlights: [
      { en: 'Marathi & English grammar in depth', mr: 'मराठी व इंग्रजी व्याकरणाचा सखोल अभ्यास' },
      { en: 'Typing practice plan: 30 → 40 wpm', mr: 'टंकलेखन सराव योजना : 30 → 40 श.प्र.मि.' },
      { en: '12 full-length mains mocks', mr: '12 पूर्ण मुख्य सराव परीक्षा' },
    ],
    modules: [
      m('gcm-marathi', 'Marathi Grammar', 'मराठी व्याकरण', [
        l('gcm-m1', 'Sandhi and Samas', 'संधी व समास', 50),
        l('gcm-m2', 'Prayog and Vibhakti', 'प्रयोग व विभक्ती', 54),
        l('gcm-m3', 'Idioms and proverbs', 'वाक्प्रचार व म्हणी', 35, 'notes'),
      ]),
      m('gcm-english', 'English Grammar', 'इंग्रजी व्याकरण', [
        l('gcm-e1', 'Tenses and voice', 'काळ व प्रयोग (Voice)', 46),
        l('gcm-e2', 'Synonyms, antonyms and one-word substitution', 'समानार्थी, विरुद्धार्थी व एक शब्द', 40),
        l('gcm-e3', 'Error spotting practice', 'चुका ओळखा — सराव', 25, 'quiz'),
      ]),
      m('gcm-typing', 'Typing Skill Test', 'टंकलेखन कौशल्य चाचणी', [
        l('gcm-t1', 'Marathi typing on Unicode (InScript)', 'युनिकोडवर मराठी टंकलेखन (इनस्क्रिप्ट)', 30),
        l('gcm-t2', 'Speed and accuracy drills', 'वेग व अचूकता सराव', 30, 'quiz'),
      ]),
    ],
  },
  {
    id: 'group-d-complete',
    examIds: ['mpsc-group-d'],
    title: { en: 'Group D Recruitment — Complete Preparation', mr: 'गट-ड भरती — संपूर्ण तयारी' },
    subtitle: { en: 'Simple, exam-focused lessons in Marathi', mr: 'सोप्या मराठीत परीक्षाभिमुख अभ्यास' },
    description: {
      en: 'Everything needed for Group D written tests: Marathi, basic English, arithmetic, reasoning and general knowledge — taught step by step from the basics.',
      mr: 'गट-ड लेखी परीक्षेसाठी आवश्यक सर्व — मराठी, मूलभूत इंग्रजी, अंकगणित, बुद्धिमत्ता व सामान्य ज्ञान — अगदी पायापासून टप्प्याटप्प्याने.',
    },
    level: 'foundation',
    teachingLanguage: 'mr',
    instructor: {
      name: { en: 'Shri. Rahul Jadhav', mr: 'श्री. राहुल जाधव' },
      credential: { en: 'Former government employee, 7 years teaching', mr: 'माजी शासकीय कर्मचारी, 7 वर्षांचा अध्यापन अनुभव' },
    },
    durationWeeks: 12,
    feeInr: 4999,
    rating: 4.6,
    learners: 1625,
    highlights: [
      { en: 'Lessons designed for beginners', mr: 'नवशिक्यांसाठी तयार केलेले धडे' },
      { en: 'Daily 20-question practice set', mr: 'रोज 20 प्रश्नांचा सराव संच' },
      { en: 'Department-wise previous papers', mr: 'विभागनिहाय मागील प्रश्नपत्रिका' },
    ],
    modules: [
      m('gd-marathi', 'Marathi', 'मराठी', [
        l('gd-m1', 'Synonyms and antonyms', 'समानार्थी व विरुद्धार्थी शब्द', 30),
        l('gd-m2', 'Sentence correction', 'वाक्य शुद्धी', 28),
      ]),
      m('gd-math', 'Arithmetic', 'अंकगणित', [
        l('gd-a1', 'Percentages made easy', 'शेकडेवारी सोप्या पद्धतीने', 35),
        l('gd-a2', 'Profit and loss', 'नफा-तोटा', 33),
        l('gd-a3', 'Time and work', 'काळ-काम', 31),
      ]),
      m('gd-gk', 'General Knowledge', 'सामान्य ज्ञान', [
        l('gd-g1', 'Maharashtra at a glance', 'महाराष्ट्र एका दृष्टिक्षेपात', 26, 'notes'),
        l('gd-g2', 'Important days and symbols', 'महत्त्वाचे दिवस व प्रतीके', 22),
      ]),
    ],
  },
  {
    id: 'dmer-nursing-technical',
    examIds: ['dmer'],
    title: {
      en: 'DMER Recruitment — Staff Nurse & Technical Posts',
      mr: 'डीएमईआर भरती — अधिपरिचारिका व तांत्रिक पदे',
    },
    subtitle: {
      en: 'Technical subject + general papers in one course',
      mr: 'तांत्रिक विषय + सामान्य पेपर एकाच अभ्यासक्रमात',
    },
    description: {
      en: 'Covers Anatomy & Physiology, Fundamentals of Nursing and Community Health along with the general Marathi, English, GK and reasoning sections of DMER online tests.',
      mr: 'डीएमईआर ऑनलाइन परीक्षेतील मराठी, इंग्रजी, सामान्य ज्ञान व बुद्धिमत्ता या सामान्य विभागांसह शरीररचना व शरीरक्रियाशास्त्र, परिचर्येची मूलतत्त्वे आणि सामुदायिक आरोग्य.',
    },
    level: 'advanced',
    teachingLanguage: 'bilingual',
    instructor: {
      name: { en: 'Dr. Meera Pawar', mr: 'डॉ. मीरा पवार' },
      credential: { en: 'M.Sc. Nursing, former nursing tutor', mr: 'एम.एस्सी. नर्सिंग, माजी नर्सिंग शिक्षिका' },
    },
    durationWeeks: 14,
    feeInr: 8999,
    rating: 4.7,
    learners: 760,
    highlights: [
      { en: 'Post-wise technical syllabus', mr: 'पदनिहाय तांत्रिक अभ्यासक्रम' },
      { en: 'Bilingual medical terminology', mr: 'द्विभाषिक वैद्यकीय परिभाषा' },
      { en: '10 full-length DMER pattern mocks', mr: 'डीएमईआर पद्धतीच्या 10 पूर्ण सराव परीक्षा' },
    ],
    modules: [
      m('dmer-anat', 'Anatomy & Physiology', 'शरीररचना व शरीरक्रियाशास्त्र', [
        l('dmer-a1', 'Cardiovascular system', 'हृदय व रक्ताभिसरण संस्था', 48),
        l('dmer-a2', 'Respiratory system', 'श्वसन संस्था', 44),
      ]),
      m('dmer-fon', 'Fundamentals of Nursing', 'परिचर्येची मूलतत्त्वे', [
        l('dmer-f1', 'Vital signs and their assessment', 'जीवनचिन्हे व त्यांचे मूल्यमापन', 40),
        l('dmer-f2', 'Infection control and hand hygiene', 'संसर्ग नियंत्रण व हातांची स्वच्छता', 36),
        l('dmer-f3', 'Practice quiz: Nursing basics', 'सराव चाचणी : परिचर्या मूलतत्त्वे', 20, 'quiz'),
      ]),
      m('dmer-chn', 'Community Health', 'सामुदायिक आरोग्य', [
        l('dmer-c1', 'National immunisation schedule', 'राष्ट्रीय लसीकरण वेळापत्रक', 34),
        l('dmer-c2', 'National health programmes', 'राष्ट्रीय आरोग्य कार्यक्रम', 38),
      ]),
    ],
  },
  {
    id: 'marathi-vyakaran-crash',
    examIds: ['mpsc-group-c', 'mpsc-group-d', 'dmer'],
    title: { en: 'Marathi Grammar Crash Course', mr: 'मराठी व्याकरण क्रॅश कोर्स' },
    subtitle: { en: 'Score full marks in the Marathi section', mr: 'मराठी विभागात पूर्ण गुण मिळवा' },
    description: {
      en: 'A fast, exam-oriented revision of Marathi grammar for all state recruitment exams, with shortcut tables and 500+ practice questions.',
      mr: 'सर्व राज्यस्तरीय भरती परीक्षांसाठी मराठी व्याकरणाची जलद, परीक्षाभिमुख उजळणी — सूत्र तक्ते व 500+ सराव प्रश्नांसह.',
    },
    level: 'crash',
    teachingLanguage: 'mr',
    instructor: {
      name: { en: 'Smt. Anjali Kulkarni', mr: 'श्रीमती अंजली कुलकर्णी' },
      credential: { en: 'M.A. Marathi, 9 years of mains guidance', mr: 'एम.ए. मराठी, मुख्य परीक्षा मार्गदर्शनाचा 9 वर्षांचा अनुभव' },
    },
    durationWeeks: 6,
    feeInr: 1999,
    rating: 4.9,
    learners: 3310,
    highlights: [
      { en: '500+ practice questions', mr: '500+ सराव प्रश्न' },
      { en: 'One-page revision charts', mr: 'एका पानाचे उजळणी तक्ते' },
    ],
    modules: [
      m('mv-varna', 'Phonology & Parts of Speech', 'वर्णविचार व शब्दांच्या जाती', [
        l('mv-1', 'Varnamala: vowels and consonants', 'वर्णमाला : स्वर व व्यंजने', 25),
        l('mv-2', 'Eight parts of speech', 'शब्दांच्या आठ जाती', 38),
      ]),
      m('mv-sandhi', 'Sandhi & Samas', 'संधी व समास', [
        l('mv-3', 'Swar, vyanjan and visarga sandhi', 'स्वर, व्यंजन व विसर्ग संधी', 34),
        l('mv-4', 'Types of samas with examples', 'समासाचे प्रकार — उदाहरणांसह', 36),
      ]),
      m('mv-vakya', 'Sentences & Tenses', 'वाक्यरचना व काळ', [
        l('mv-5', 'Tenses and their sub-types', 'काळ व उपप्रकार', 30),
        l('mv-6', 'Proverbs and idioms', 'म्हणी व वाक्प्रचार', 28, 'notes'),
        l('mv-7', 'Grand practice test', 'महासराव चाचणी', 30, 'quiz'),
      ]),
    ],
  },
  {
    id: 'reasoning-arithmetic',
    examIds: ['mpsc-group-c', 'mpsc-group-d', 'dmer'],
    title: { en: 'Reasoning & Arithmetic Mastery', mr: 'बुद्धिमत्ता चाचणी व अंकगणित' },
    subtitle: { en: 'Shortcut methods for fast, accurate answers', mr: 'जलद व अचूक उत्तरांसाठी शॉर्टकट पद्धती' },
    description: {
      en: 'Number series, coding-decoding, percentages, ratios, interest, speed-time-distance and more — explained with shortcut methods and timed drills.',
      mr: 'संख्यामालिका, सांकेतिक भाषा, शेकडेवारी, गुणोत्तर, व्याज, वेग-वेळ-अंतर इत्यादी — शॉर्टकट पद्धती व वेळबद्ध सरावासह.',
    },
    level: 'foundation',
    teachingLanguage: 'bilingual',
    instructor: {
      name: { en: 'Shri. Rahul Jadhav', mr: 'श्री. राहुल जाधव' },
      credential: { en: 'Former government employee, 7 years teaching', mr: 'माजी शासकीय कर्मचारी, 7 वर्षांचा अध्यापन अनुभव' },
    },
    durationWeeks: 8,
    feeInr: 2999,
    rating: 4.7,
    learners: 2480,
    highlights: [
      { en: 'Shortcut tricks for every chapter', mr: 'प्रत्येक प्रकरणासाठी शॉर्टकट युक्त्या' },
      { en: 'Timed drills to build speed', mr: 'वेग वाढवण्यासाठी वेळबद्ध सराव' },
    ],
    modules: [
      m('ra-reason', 'Reasoning', 'बुद्धिमत्ता चाचणी', [
        l('ra-1', 'Number and letter series', 'संख्या व अक्षर मालिका', 32),
        l('ra-2', 'Coding–decoding', 'सांकेतिक भाषा', 29),
        l('ra-3', 'Blood relations and directions', 'नातेसंबंध व दिशा', 34),
      ]),
      m('ra-arith', 'Arithmetic', 'अंकगणित', [
        l('ra-4', 'Percentage, ratio and proportion', 'शेकडेवारी, गुणोत्तर व प्रमाण', 41),
        l('ra-5', 'Simple and compound interest', 'सरळव्याज व चक्रवाढव्याज', 37),
        l('ra-6', 'Speed, time and distance', 'वेग, वेळ व अंतर', 39),
        l('ra-7', 'Timed drill: mixed arithmetic', 'वेळबद्ध सराव : मिश्र अंकगणित', 20, 'quiz'),
      ]),
    ],
  },
  {
    id: 'current-affairs-monthly',
    examIds: ['mpsc-group-c', 'mpsc-group-d', 'dmer'],
    title: { en: 'Maharashtra Current Affairs — Monthly', mr: 'चालू घडामोडी — मासिक' },
    subtitle: { en: 'State and national events that matter for exams', mr: 'परीक्षेसाठी महत्त्वाच्या राज्य व राष्ट्रीय घडामोडी' },
    description: {
      en: 'A monthly digest of state schemes, appointments, awards, sports and economy news with a 25-question test every month.',
      mr: 'राज्य योजना, नियुक्त्या, पुरस्कार, क्रीडा व अर्थविषयक बातम्यांचा मासिक आढावा — दर महिन्याला 25 प्रश्नांची चाचणी.',
    },
    level: 'crash',
    teachingLanguage: 'mr',
    instructor: {
      name: { en: 'Prof. Sunil Deshmukh', mr: 'प्रा. सुनील देशमुख' },
      credential: { en: '12 years teaching MPSC History & Polity', mr: 'एमपीएससी इतिहास व राज्यव्यवस्था अध्यापनाचा 12 वर्षांचा अनुभव' },
    },
    durationWeeks: 4,
    feeInr: 499,
    rating: 4.5,
    learners: 4120,
    highlights: [
      { en: 'Updated every month', mr: 'दर महिन्याला अद्ययावत' },
      { en: 'Monthly 25-question test', mr: 'मासिक 25 प्रश्नांची चाचणी' },
    ],
    modules: [
      m('ca-month', 'This month', 'या महिन्यात', [
        l('ca-1', 'State government schemes', 'राज्य शासनाच्या योजना', 24),
        l('ca-2', 'Appointments and awards', 'नियुक्त्या व पुरस्कार', 20),
        l('ca-3', 'Economy and budget updates', 'अर्थव्यवस्था व अर्थसंकल्प', 22),
        l('ca-4', 'Monthly test', 'मासिक चाचणी', 25, 'quiz'),
      ]),
    ],
  },
];

export const getCourse = (id: string): Course | undefined => courses.find((c) => c.id === id);
