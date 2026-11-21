import type { Exam, ExamId, Subject, SubjectId } from '../types';

export const exams: Exam[] = [
  {
    id: 'mpsc-group-c',
    name: { en: 'MPSC Group C', mr: 'एमपीएससी गट-क' },
    shortName: { en: 'Group C', mr: 'गट-क' },
    conductingBody: {
      en: 'Maharashtra Public Service Commission',
      mr: 'महाराष्ट्र लोकसेवा आयोग',
    },
    description: {
      en: 'Combined examination for Group C posts in Maharashtra Government departments.',
      mr: 'महाराष्ट्र शासनाच्या विविध विभागांतील गट-क पदांसाठी संयुक्त परीक्षा.',
    },
    pattern: [
      { en: 'Preliminary exam — objective, 100 questions', mr: 'पूर्व परीक्षा — वस्तुनिष्ठ, 100 प्रश्न' },
      { en: 'Mains exam — objective, post-wise papers', mr: 'मुख्य परीक्षा — वस्तुनिष्ठ, पदनिहाय पेपर' },
      { en: 'Typing / skill test where applicable', mr: 'आवश्यक पदांसाठी टंकलेखन / कौशल्य चाचणी' },
      { en: 'Negative marking: ¼ mark per wrong answer', mr: 'नकारात्मक गुणपद्धती: चुकीच्या उत्तरास ¼ गुण वजा' },
    ],
    samplePosts: [
      { en: 'Clerk-Typist', mr: 'लिपिक-टंकलेखक' },
      { en: 'Tax Assistant', mr: 'कर सहायक' },
      { en: 'Technical Assistant', mr: 'तांत्रिक सहायक' },
      { en: 'Industry Inspector', mr: 'उद्योग निरीक्षक' },
    ],
  },
  {
    id: 'mpsc-group-d',
    name: { en: 'Group D Recruitment', mr: 'गट-ड भरती' },
    shortName: { en: 'Group D', mr: 'गट-ड' },
    conductingBody: {
      en: 'Maharashtra Government departments / district selection committees',
      mr: 'महाराष्ट्र शासनाचे विभाग / जिल्हा निवड समित्या',
    },
    description: {
      en: 'Recruitment for Group D posts across state government offices.',
      mr: 'राज्य शासनाच्या कार्यालयांतील गट-ड पदांसाठी भरती.',
    },
    pattern: [
      { en: 'Single objective written test', mr: 'एकच वस्तुनिष्ठ लेखी परीक्षा' },
      {
        en: 'Marathi, English, General Knowledge, Arithmetic & Reasoning',
        mr: 'मराठी, इंग्रजी, सामान्य ज्ञान, अंकगणित व बुद्धिमत्ता',
      },
    ],
    samplePosts: [
      { en: 'Peon', mr: 'शिपाई' },
      { en: 'Ward Attendant', mr: 'कक्ष सेवक' },
      { en: 'Watchman', mr: 'चौकीदार' },
    ],
  },
  {
    id: 'dmer',
    name: { en: 'DMER Recruitment', mr: 'डीएमईआर भरती' },
    shortName: { en: 'DMER', mr: 'डीएमईआर' },
    conductingBody: {
      en: 'Directorate of Medical Education & Research, Maharashtra',
      mr: 'वैद्यकीय शिक्षण व संशोधन संचालनालय, महाराष्ट्र',
    },
    description: {
      en: 'Group C & D posts in government medical colleges and hospitals.',
      mr: 'शासकीय वैद्यकीय महाविद्यालये व रुग्णालयांतील गट-क व गट-ड पदे.',
    },
    pattern: [
      { en: 'Online objective test', mr: 'ऑनलाइन वस्तुनिष्ठ परीक्षा' },
      {
        en: 'Marathi, English, GK, Reasoning + post-wise technical subject',
        mr: 'मराठी, इंग्रजी, सामान्य ज्ञान, बुद्धिमत्ता + पदनिहाय तांत्रिक विषय',
      },
    ],
    samplePosts: [
      { en: 'Staff Nurse', mr: 'अधिपरिचारिका' },
      { en: 'Lab Technician', mr: 'प्रयोगशाळा तंत्रज्ञ' },
      { en: 'Junior Clerk', mr: 'कनिष्ठ लिपिक' },
    ],
  },
];

export const subjects: Subject[] = [
  { id: 'history', name: { en: 'History', mr: 'इतिहास' } },
  { id: 'geography', name: { en: 'Geography', mr: 'भूगोल' } },
  { id: 'polity', name: { en: 'Polity', mr: 'राज्यव्यवस्था' } },
  { id: 'economy', name: { en: 'Economy', mr: 'अर्थव्यवस्था' } },
  { id: 'science', name: { en: 'General Science', mr: 'सामान्य विज्ञान' } },
  { id: 'marathi', name: { en: 'Marathi', mr: 'मराठी' } },
  { id: 'english', name: { en: 'English', mr: 'इंग्रजी' } },
  { id: 'reasoning', name: { en: 'Reasoning & Arithmetic', mr: 'बुद्धिमत्ता व अंकगणित' } },
  { id: 'current-affairs', name: { en: 'Current Affairs', mr: 'चालू घडामोडी' } },
  { id: 'general-knowledge', name: { en: 'General Knowledge', mr: 'सामान्य ज्ञान' } },
  { id: 'nursing', name: { en: 'Nursing & Health', mr: 'परिचर्या व आरोग्य' } },
];

export const getExam = (id: ExamId): Exam => {
  const exam = exams.find((e) => e.id === id);
  if (!exam) throw new Error(`Unknown exam: ${id}`);
  return exam;
};

export const getSubject = (id: SubjectId): Subject => {
  const subject = subjects.find((s) => s.id === id);
  if (!subject) throw new Error(`Unknown subject: ${id}`);
  return subject;
};
