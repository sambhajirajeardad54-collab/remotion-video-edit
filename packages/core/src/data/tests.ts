import type { Localized, MockTest, Question } from '../types';

type Pair = [en: string, mr: string];

const q = (id: string, prompt: Pair, options: Pair[], answerIndex: number, explanation: Pair): Question => ({
  id,
  prompt: { en: prompt[0], mr: prompt[1] },
  options: options.map(([en, mr]): Localized => ({ en, mr })),
  answerIndex,
  explanation: { en: explanation[0], mr: explanation[1] },
});

const gsQuestions: Question[] = [
  q(
    'gs-1',
    ['On which date was the State of Maharashtra formed?', 'महाराष्ट्र राज्याची स्थापना कोणत्या दिवशी झाली?'],
    [
      ['1 May 1960', '1 मे 1960'],
      ['15 August 1947', '15 ऑगस्ट 1947'],
      ['26 January 1950', '26 जानेवारी 1950'],
      ['1 November 1956', '1 नोव्हेंबर 1956'],
    ],
    0,
    [
      'Maharashtra was formed on 1 May 1960 under the Bombay Reorganisation Act, 1960. The day is celebrated as Maharashtra Din.',
      'मुंबई पुनर्रचना कायदा 1960 नुसार 1 मे 1960 रोजी महाराष्ट्र राज्याची स्थापना झाली. हा दिवस महाराष्ट्र दिन म्हणून साजरा केला जातो.',
    ],
  ),
  q(
    'gs-2',
    ['Which is the highest peak in Maharashtra?', 'महाराष्ट्रातील सर्वोच्च शिखर कोणते?'],
    [
      ['Mahabaleshwar', 'महाबळेश्वर'],
      ['Kalsubai', 'कळसूबाई'],
      ['Salher', 'साल्हेर'],
      ['Torna', 'तोरणा'],
    ],
    1,
    [
      'Kalsubai (about 1,646 m) in Ahilyanagar district is the highest peak of Maharashtra.',
      'अहिल्यानगर जिल्ह्यातील कळसूबाई (सुमारे 1,646 मी.) हे महाराष्ट्रातील सर्वोच्च शिखर आहे.',
    ],
  ),
  q(
    'gs-3',
    [
      'Which Article of the Constitution provides the Right to Constitutional Remedies?',
      'घटनात्मक उपायांचा हक्क राज्यघटनेच्या कोणत्या कलमात आहे?',
    ],
    [
      ['Article 14', 'कलम 14'],
      ['Article 21', 'कलम 21'],
      ['Article 32', 'कलम 32'],
      ['Article 356', 'कलम 356'],
    ],
    2,
    [
      'Article 32 lets a citizen move the Supreme Court to enforce Fundamental Rights. Dr. Ambedkar called it the "heart and soul" of the Constitution.',
      'कलम 32 नुसार मूलभूत हक्कांच्या संरक्षणासाठी नागरिक थेट सर्वोच्च न्यायालयात जाऊ शकतो. डॉ. आंबेडकरांनी याला राज्यघटनेचा "आत्मा व हृदय" म्हटले.',
    ],
  ),
  q(
    'gs-4',
    ['Who founded the Satyashodhak Samaj in 1873?', '1873 मध्ये सत्यशोधक समाजाची स्थापना कोणी केली?'],
    [
      ['Gopal Krishna Gokhale', 'गोपाळ कृष्ण गोखले'],
      ['Mahatma Jyotiba Phule', 'महात्मा जोतिबा फुले'],
      ['Mahadev Govind Ranade', 'महादेव गोविंद रानडे'],
      ['Lokmanya Tilak', 'लोकमान्य टिळक'],
    ],
    1,
    [
      'Mahatma Jyotiba Phule founded the Satyashodhak Samaj on 24 September 1873 in Pune.',
      'महात्मा जोतिबा फुले यांनी 24 सप्टेंबर 1873 रोजी पुणे येथे सत्यशोधक समाजाची स्थापना केली.',
    ],
  ),
  q(
    'gs-5',
    ['Where does the river Godavari originate?', 'गोदावरी नदीचा उगम कोठे होतो?'],
    [
      ['Mahabaleshwar', 'महाबळेश्वर'],
      ['Bhimashankar', 'भीमाशंकर'],
      ['Trimbakeshwar', 'त्र्यंबकेश्वर'],
      ['Amarkantak', 'अमरकंटक'],
    ],
    2,
    [
      'The Godavari rises at Trimbakeshwar in Nashik district. Krishna rises at Mahabaleshwar and Bhima at Bhimashankar.',
      'गोदावरीचा उगम नाशिक जिल्ह्यातील त्र्यंबकेश्वर येथे होतो. कृष्णेचा उगम महाबळेश्वर येथे तर भीमेचा भीमाशंकर येथे होतो.',
    ],
  ),
  q(
    'gs-6',
    ['How many districts are there in Maharashtra?', 'महाराष्ट्रात एकूण किती जिल्हे आहेत?'],
    [
      ['34', '34'],
      ['35', '35'],
      ['36', '36'],
      ['38', '38'],
    ],
    2,
    [
      'Maharashtra has 36 districts grouped into 6 revenue divisions.',
      'महाराष्ट्रात 36 जिल्हे असून ते 6 महसूल विभागांत विभागलेले आहेत.',
    ],
  ),
  q(
    'gs-7',
    ['What is the chemical formula of common salt?', 'मिठाचे रासायनिक सूत्र कोणते?'],
    [
      ['NaCl', 'NaCl'],
      ['KCl', 'KCl'],
      ['NaHCO₃', 'NaHCO₃'],
      ['CaCO₃', 'CaCO₃'],
    ],
    0,
    ['Common salt is sodium chloride, NaCl.', 'साधे मीठ म्हणजे सोडियम क्लोराइड (NaCl).'],
  ),
  q(
    'gs-8',
    [
      'Which Constitutional Amendment gave constitutional status to Panchayati Raj institutions?',
      'कोणत्या घटनादुरुस्तीने पंचायतराज संस्थांना घटनात्मक दर्जा मिळाला?',
    ],
    [
      ['42nd Amendment', '42 वी घटनादुरुस्ती'],
      ['44th Amendment', '44 वी घटनादुरुस्ती'],
      ['73rd Amendment', '73 वी घटनादुरुस्ती'],
      ['86th Amendment', '86 वी घटनादुरुस्ती'],
    ],
    2,
    [
      'The 73rd Amendment (1992) added Part IX on Panchayats; the 74th did the same for urban local bodies.',
      '73 व्या घटनादुरुस्तीने (1992) पंचायतींसाठी भाग IX जोडला; 74 व्या घटनादुरुस्तीने नागरी स्थानिक संस्थांसाठी तरतूद केली.',
    ],
  ),
  q(
    'gs-9',
    ['Which planet is known as the "Red Planet"?', '"लाल ग्रह" म्हणून कोणता ग्रह ओळखला जातो?'],
    [
      ['Venus', 'शुक्र'],
      ['Mars', 'मंगळ'],
      ['Jupiter', 'गुरू'],
      ['Mercury', 'बुध'],
    ],
    1,
    ['Iron oxide on its surface gives Mars its reddish colour.', 'पृष्ठभागावरील लोह ऑक्साइडमुळे मंगळ लालसर दिसतो.'],
  ),
  q(
    'gs-10',
    ['Who is popularly known as "Lokmanya"?', '"लोकमान्य" या उपाधीने कोणाला ओळखले जाते?'],
    [
      ['Bal Gangadhar Tilak', 'बाळ गंगाधर टिळक'],
      ['Gopal Ganesh Agarkar', 'गोपाळ गणेश आगरकर'],
      ['Vinayak Damodar Savarkar', 'विनायक दामोदर सावरकर'],
      ['Dadabhai Naoroji', 'दादाभाई नौरोजी'],
    ],
    0,
    [
      'Bal Gangadhar Tilak was called "Lokmanya" — accepted by the people as their leader.',
      'बाळ गंगाधर टिळक यांना "लोकमान्य" — म्हणजे लोकांनी मान्य केलेला नेता — असे संबोधले जाते.',
    ],
  ),
];

const languageQuestions: Question[] = [
  q(
    'lang-1',
    ['Choose the synonym of "कमल" (lotus).', '"कमल" या शब्दाचा समानार्थी शब्द निवडा.'],
    [
      ['पंकज', 'पंकज'],
      ['भ्रमर', 'भ्रमर'],
      ['नीर', 'नीर'],
      ['अनल', 'अनल'],
    ],
    0,
    [
      '"पंकज" (born in mud) means lotus. भ्रमर = bee, नीर = water, अनल = fire.',
      '"पंकज" म्हणजे चिखलात जन्मणारे — कमळ. भ्रमर = भुंगा, नीर = पाणी, अनल = अग्नी.',
    ],
  ),
  q(
    'lang-2',
    ['Choose the antonym of "दिवस" (day).', '"दिवस" या शब्दाचा विरुद्धार्थी शब्द निवडा.'],
    [
      ['सकाळ', 'सकाळ'],
      ['रात्र', 'रात्र'],
      ['संध्याकाळ', 'संध्याकाळ'],
      ['दुपार', 'दुपार'],
    ],
    1,
    ['The opposite of दिवस (day) is रात्र (night).', 'दिवस × रात्र.'],
  ),
  q(
    'lang-3',
    ['What does the Marathi idiom "हातपाय गाळणे" mean?', '"हातपाय गाळणे" या वाक्प्रचाराचा अर्थ काय?'],
    [
      ['To lose courage', 'धीर सुटणे'],
      ['To work very hard', 'खूप कष्ट करणे'],
      ['To run away', 'पळून जाणे'],
      ['To be overjoyed', 'खूप आनंद होणे'],
    ],
    0,
    ['"हातपाय गाळणे" means to lose heart or courage.', '"हातपाय गाळणे" म्हणजे धीर सुटणे, अवसान गळणे.'],
  ),
  q(
    'lang-4',
    ['Identify the tense: "राम आंबा खातो."', '"राम आंबा खातो." या वाक्याचा काळ ओळखा.'],
    [
      ['Present tense', 'वर्तमानकाळ'],
      ['Past tense', 'भूतकाळ'],
      ['Future tense', 'भविष्यकाळ'],
      ['Imperative', 'आज्ञार्थ'],
    ],
    0,
    ['"खातो" shows an action in the present — simple present tense.', '"खातो" हे क्रियापद वर्तमानातील क्रिया दाखवते — साधा वर्तमानकाळ.'],
  ),
  q(
    'lang-5',
    ['Choose the synonym of "Abundant".', '"Abundant" या शब्दाचा समानार्थी शब्द निवडा.'],
    [
      ['Scarce', 'Scarce'],
      ['Plentiful', 'Plentiful'],
      ['Tiny', 'Tiny'],
      ['Rare', 'Rare'],
    ],
    1,
    ['Abundant = plentiful, existing in large quantity.', 'Abundant म्हणजे भरपूर — Plentiful.'],
  ),
  q(
    'lang-6',
    ['Choose the antonym of "Ancient".', '"Ancient" या शब्दाचा विरुद्धार्थी शब्द निवडा.'],
    [
      ['Old', 'Old'],
      ['Historic', 'Historic'],
      ['Modern', 'Modern'],
      ['Antique', 'Antique'],
    ],
    2,
    ['Ancient (very old) is the opposite of Modern.', 'Ancient (प्राचीन) × Modern (आधुनिक).'],
  ),
  q(
    'lang-7',
    ['Fill in the blank: "She has been living here ___ 2015."', 'रिकामी जागा भरा : "She has been living here ___ 2015."'],
    [
      ['for', 'for'],
      ['since', 'since'],
      ['from', 'from'],
      ['by', 'by'],
    ],
    1,
    [
      '"Since" is used with a point in time (2015); "for" is used with a period (for five years).',
      'ठराविक वेळबिंदूसाठी (2015) "since" वापरतात; कालावधीसाठी (for five years) "for" वापरतात.',
    ],
  ),
  q(
    'lang-8',
    ['Choose the correctly spelt word.', 'अचूक स्पेलिंग असलेला शब्द निवडा.'],
    [
      ['Acommodation', 'Acommodation'],
      ['Accomodation', 'Accomodation'],
      ['Accommodation', 'Accommodation'],
      ['Acomodation', 'Acomodation'],
    ],
    2,
    ['"Accommodation" has double c and double m.', '"Accommodation" मध्ये c आणि m दोन्ही दोनदा येतात.'],
  ),
];

const reasoningQuestions: Question[] = [
  q(
    'rea-1',
    ['Find the next number: 2, 6, 12, 20, 30, ?', 'पुढील संख्या शोधा : 2, 6, 12, 20, 30, ?'],
    [
      ['36', '36'],
      ['40', '40'],
      ['42', '42'],
      ['48', '48'],
    ],
    2,
    [
      'Differences are 4, 6, 8, 10, so the next difference is 12: 30 + 12 = 42. (Also n × (n+1).)',
      'फरक 4, 6, 8, 10 असा वाढतो, म्हणून पुढील फरक 12 : 30 + 12 = 42. (n × (n+1) असेही.)',
    ],
  ),
  q(
    'rea-2',
    ['What is 25% of 480?', '480 चे 25% किती?'],
    [
      ['96', '96'],
      ['120', '120'],
      ['125', '125'],
      ['140', '140'],
    ],
    1,
    ['25% = ¼, and 480 ÷ 4 = 120.', '25% म्हणजे ¼; 480 ÷ 4 = 120.'],
  ),
  q(
    'rea-3',
    [
      'Find the simple interest on ₹5,000 at 8% per annum for 3 years.',
      '₹5,000 रकमेवर द.सा.द.शे. 8 दराने 3 वर्षांचे सरळव्याज किती?',
    ],
    [
      ['₹1,000', '₹1,000'],
      ['₹1,200', '₹1,200'],
      ['₹1,400', '₹1,400'],
      ['₹2,400', '₹2,400'],
    ],
    1,
    ['SI = P × R × T / 100 = 5000 × 8 × 3 / 100 = ₹1,200.', 'सरळव्याज = P × R × T / 100 = 5000 × 8 × 3 / 100 = ₹1,200.'],
  ),
  q(
    'rea-4',
    [
      'If CAT is coded as 3120 (C=3, A=1, T=20), how is DOG coded?',
      'जर CAT हा शब्द 3120 (C=3, A=1, T=20) असा लिहिला, तर DOG कसा लिहाल?',
    ],
    [
      ['4157', '4157'],
      ['4147', '4147'],
      ['4167', '4167'],
      ['5157', '5157'],
    ],
    0,
    ['Each letter is replaced by its alphabet position: D=4, O=15, G=7 → 4157.', 'प्रत्येक अक्षराऐवजी त्याचा वर्णमालेतील क्रमांक : D=4, O=15, G=7 → 4157.'],
  ),
  q(
    'rea-5',
    ['What is the average of 12, 15, 18, 21 and 24?', '12, 15, 18, 21 व 24 यांची सरासरी किती?'],
    [
      ['17', '17'],
      ['18', '18'],
      ['19', '19'],
      ['20', '20'],
    ],
    1,
    ['Sum = 90, count = 5, average = 90 ÷ 5 = 18.', 'बेरीज = 90, संख्या = 5, सरासरी = 90 ÷ 5 = 18.'],
  ),
  q(
    'rea-6',
    [
      'A 300 m long train runs at 54 km/h. How long does it take to cross a pole?',
      '300 मी. लांबीची आगगाडी ताशी 54 किमी वेगाने जाते. ती एक खांब किती वेळात ओलांडेल?',
    ],
    [
      ['15 seconds', '15 सेकंद'],
      ['18 seconds', '18 सेकंद'],
      ['20 seconds', '20 सेकंद'],
      ['25 seconds', '25 सेकंद'],
    ],
    2,
    ['54 km/h × 5/18 = 15 m/s. Time = 300 ÷ 15 = 20 s.', '54 किमी/तास × 5/18 = 15 मी./से. वेळ = 300 ÷ 15 = 20 सेकंद.'],
  ),
  q(
    'rea-7',
    [
      'Two numbers are in the ratio 3 : 5 and their sum is 64. What is the larger number?',
      'दोन संख्यांचे गुणोत्तर 3 : 5 असून त्यांची बेरीज 64 आहे. मोठी संख्या कोणती?',
    ],
    [
      ['24', '24'],
      ['32', '32'],
      ['40', '40'],
      ['45', '45'],
    ],
    2,
    ['Total parts = 8; one part = 64 ÷ 8 = 8; larger = 5 × 8 = 40.', 'एकूण भाग = 8; एक भाग = 64 ÷ 8 = 8; मोठी संख्या = 5 × 8 = 40.'],
  ),
  q(
    'rea-8',
    ['Find the odd one out: 121, 169, 196, 210', 'वेगळी संख्या ओळखा : 121, 169, 196, 210'],
    [
      ['121', '121'],
      ['169', '169'],
      ['196', '196'],
      ['210', '210'],
    ],
    3,
    ['121 = 11², 169 = 13², 196 = 14²; 210 is not a perfect square.', '121 = 11², 169 = 13², 196 = 14²; 210 ही पूर्ण वर्ग संख्या नाही.'],
  ),
];

const dmerQuestions: Question[] = [
  q(
    'dmer-1',
    ['What is the normal oral body temperature of a healthy adult?', 'निरोगी प्रौढ व्यक्तीचे सामान्य (तोंडातील) शरीर तापमान किती असते?'],
    [
      ['35 °C', '35 °C'],
      ['37 °C', '37 °C'],
      ['39 °C', '39 °C'],
      ['40 °C', '40 °C'],
    ],
    1,
    ['Normal body temperature is about 37 °C (98.6 °F).', 'सामान्य शरीर तापमान सुमारे 37 °C (98.6 °F) असते.'],
  ),
  q(
    'dmer-2',
    ['Deficiency of which vitamin causes scurvy?', 'कोणत्या जीवनसत्त्वाच्या कमतरतेमुळे स्कर्व्ही होतो?'],
    [
      ['Vitamin A', 'जीवनसत्त्व A'],
      ['Vitamin B₁', 'जीवनसत्त्व B₁'],
      ['Vitamin C', 'जीवनसत्त्व C'],
      ['Vitamin D', 'जीवनसत्त्व D'],
    ],
    2,
    ['Scurvy is caused by Vitamin C (ascorbic acid) deficiency.', 'स्कर्व्ही हा जीवनसत्त्व C (अ‍ॅस्कॉर्बिक आम्ल) च्या कमतरतेमुळे होतो.'],
  ),
  q(
    'dmer-3',
    ['What is the normal resting heart rate of an adult?', 'प्रौढ व्यक्तीचे विश्रांती अवस्थेतील सामान्य हृदयस्पंदन किती असते?'],
    [
      ['40–60 per minute', 'दर मिनिटाला 40–60'],
      ['60–100 per minute', 'दर मिनिटाला 60–100'],
      ['100–140 per minute', 'दर मिनिटाला 100–140'],
      ['140–180 per minute', 'दर मिनिटाला 140–180'],
    ],
    1,
    ['A normal adult resting pulse is 60–100 beats per minute.', 'प्रौढांचे सामान्य विश्रांती नाडी-स्पंदन दर मिनिटाला 60–100 असते.'],
  ),
  q(
    'dmer-4',
    ['Which blood group is known as the universal donor?', 'कोणता रक्तगट "सार्वत्रिक दाता" म्हणून ओळखला जातो?'],
    [
      ['AB positive', 'AB पॉझिटिव्ह'],
      ['A negative', 'A निगेटिव्ह'],
      ['B positive', 'B पॉझिटिव्ह'],
      ['O negative', 'O निगेटिव्ह'],
    ],
    3,
    ['O negative red cells lack A, B and Rh antigens, so they can be given to anyone in an emergency.', 'O निगेटिव्ह लाल रक्तपेशींवर A, B व Rh प्रतिजन नसतात, त्यामुळे आपत्कालीन स्थितीत त्या कोणालाही देता येतात.'],
  ),
  q(
    'dmer-5',
    ['Which is the largest organ of the human body?', 'मानवी शरीरातील सर्वात मोठा अवयव कोणता?'],
    [
      ['Liver', 'यकृत'],
      ['Skin', 'त्वचा'],
      ['Lungs', 'फुफ्फुसे'],
      ['Brain', 'मेंदू'],
    ],
    1,
    ['The skin is the largest organ; the liver is the largest internal organ.', 'त्वचा हा सर्वात मोठा अवयव आहे; यकृत हा सर्वात मोठा अंतर्गत अवयव आहे.'],
  ),
  q(
    'dmer-6',
    ['The BCG vaccine protects against which disease?', 'बीसीजी लस कोणत्या आजारापासून संरक्षण देते?'],
    [
      ['Polio', 'पोलिओ'],
      ['Measles', 'गोवर'],
      ['Tuberculosis', 'क्षयरोग'],
      ['Tetanus', 'धनुर्वात'],
    ],
    2,
    ['BCG (Bacillus Calmette–Guérin) is given at birth to protect against tuberculosis.', 'बीसीजी (बॅसिलस कॅल्मेट-गेरिन) लस जन्मतः क्षयरोगापासून संरक्षणासाठी दिली जाते.'],
  ),
];

export const mockTests: MockTest[] = [
  {
    id: 'gs-practice-1',
    examIds: ['mpsc-group-c', 'mpsc-group-d'],
    subjectId: 'general-knowledge',
    title: { en: 'General Studies — Practice Set 1', mr: 'सामान्य अध्ययन — सराव संच 1' },
    description: {
      en: 'Maharashtra, History, Polity and Science in MPSC prelims style.',
      mr: 'एमपीएससी पूर्व परीक्षा पद्धतीने महाराष्ट्र, इतिहास, राज्यव्यवस्था व विज्ञान.',
    },
    status: 'available',
    durationMin: 10,
    marksPerQuestion: 2,
    negativeMarks: 0.5,
    totalQuestions: gsQuestions.length,
    questions: gsQuestions,
  },
  {
    id: 'language-practice-1',
    examIds: ['mpsc-group-c', 'mpsc-group-d', 'dmer'],
    subjectId: 'marathi',
    title: { en: 'Marathi & English Grammar — Set 1', mr: 'मराठी व इंग्रजी व्याकरण — संच 1' },
    description: {
      en: 'Synonyms, antonyms, idioms, tenses and spelling.',
      mr: 'समानार्थी, विरुद्धार्थी शब्द, वाक्प्रचार, काळ व स्पेलिंग.',
    },
    status: 'available',
    durationMin: 8,
    marksPerQuestion: 2,
    negativeMarks: 0.5,
    totalQuestions: languageQuestions.length,
    questions: languageQuestions,
  },
  {
    id: 'reasoning-practice-1',
    examIds: ['mpsc-group-c', 'mpsc-group-d', 'dmer'],
    subjectId: 'reasoning',
    title: { en: 'Reasoning & Arithmetic — Speed Test', mr: 'बुद्धिमत्ता व अंकगणित — वेग चाचणी' },
    description: {
      en: 'Series, percentages, interest, coding and speed–distance.',
      mr: 'मालिका, शेकडेवारी, व्याज, सांकेतिक भाषा व वेग-अंतर.',
    },
    status: 'available',
    durationMin: 10,
    marksPerQuestion: 2,
    negativeMarks: 0.5,
    totalQuestions: reasoningQuestions.length,
    questions: reasoningQuestions,
  },
  {
    id: 'dmer-practice-1',
    examIds: ['dmer'],
    subjectId: 'nursing',
    title: { en: 'DMER Health Sciences — Set 1', mr: 'डीएमईआर आरोग्य विज्ञान — संच 1' },
    description: {
      en: 'Vital signs, nutrition, blood groups and immunisation.',
      mr: 'जीवनचिन्हे, पोषण, रक्तगट व लसीकरण.',
    },
    status: 'available',
    durationMin: 6,
    marksPerQuestion: 1,
    negativeMarks: 0,
    totalQuestions: dmerQuestions.length,
    questions: dmerQuestions,
  },
  {
    id: 'group-c-full-mock-12',
    examIds: ['mpsc-group-c'],
    subjectId: 'general-knowledge',
    title: { en: 'Group C Prelims — Full Mock #12', mr: 'गट-क पूर्व — पूर्ण सराव परीक्षा #12' },
    description: {
      en: 'Full-length, all-Maharashtra ranking test.',
      mr: 'संपूर्ण महाराष्ट्र स्तरावरील गुणानुक्रम चाचणी.',
    },
    status: 'scheduled',
    scheduleOffsetDays: 2,
    startTime: '10:00',
    durationMin: 60,
    marksPerQuestion: 1,
    negativeMarks: 0.25,
    totalQuestions: 100,
    questions: [],
  },
  {
    id: 'dmer-full-mock-4',
    examIds: ['dmer'],
    subjectId: 'nursing',
    title: { en: 'DMER Staff Nurse — Full Mock #4', mr: 'डीएमईआर अधिपरिचारिका — पूर्ण सराव परीक्षा #4' },
    description: {
      en: 'Technical + general sections in the online DMER pattern.',
      mr: 'ऑनलाइन डीएमईआर पद्धतीने तांत्रिक + सामान्य विभाग.',
    },
    status: 'scheduled',
    scheduleOffsetDays: 5,
    startTime: '11:00',
    durationMin: 90,
    marksPerQuestion: 2,
    negativeMarks: 0,
    totalQuestions: 100,
    questions: [],
  },
  {
    id: 'group-d-weekly-7',
    examIds: ['mpsc-group-d'],
    subjectId: 'general-knowledge',
    title: { en: 'Group D Weekly Test #7', mr: 'गट-ड साप्ताहिक चाचणी #7' },
    description: { en: 'Marathi, GK and arithmetic — 50 questions.', mr: 'मराठी, सामान्य ज्ञान व अंकगणित — 50 प्रश्न.' },
    status: 'scheduled',
    scheduleOffsetDays: 3,
    startTime: '09:00',
    durationMin: 45,
    marksPerQuestion: 2,
    negativeMarks: 0,
    totalQuestions: 50,
    questions: [],
  },
];

export const getMockTest = (id: string): MockTest | undefined => mockTests.find((t) => t.id === id);
