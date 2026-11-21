import type { Announcement, StudentProfile, StudentState } from '../types';

export const announcements: Announcement[] = [
  {
    id: 'new-batch',
    title: { en: 'New Group C Prelims batch', mr: 'गट-क पूर्व परीक्षेची नवीन बॅच' },
    body: {
      en: 'Morning and evening batches start next week at the Pune centre and online.',
      mr: 'पुणे केंद्र व ऑनलाइन — सकाळ आणि संध्याकाळच्या बॅचेस पुढील आठवड्यात सुरू.',
    },
    offsetDays: 7,
    tone: 'accent',
  },
  {
    id: 'sunday-mock',
    title: { en: 'Free Sunday mock test', mr: 'रविवारी मोफत सराव परीक्षा' },
    body: {
      en: 'All-Maharashtra ranking test every Sunday at 10 AM.',
      mr: 'दर रविवारी सकाळी 10 वाजता संपूर्ण महाराष्ट्र स्तरावरील गुणानुक्रम चाचणी.',
    },
    offsetDays: 2,
    tone: 'info',
  },
  {
    id: 'doubt-session',
    title: { en: 'Live doubt session: Marathi grammar', mr: 'थेट शंका-निरसन : मराठी व्याकरण' },
    body: {
      en: 'Bring your questions on samas and prayog — Saturday, 6 PM.',
      mr: 'समास व प्रयोगावरील आपल्या शंका घेऊन या — शनिवार, सायं. 6 वाजता.',
    },
    offsetDays: 1,
    tone: 'info',
  },
];

/** Sample logged-in student. Replaced by real auth in a later milestone. */
export const sampleStudent: StudentProfile = {
  id: 'stu-1001',
  name: { en: 'Pooja Patil', mr: 'पूजा पाटील' },
  district: { en: 'Satara', mr: 'सातारा' },
  memberSince: '2026-06-15',
};

/** Starting state for a fresh install, seeded so the dashboard has something to show. */
export const initialStudentState: StudentState = {
  version: 1,
  locale: 'mr',
  targetExam: 'mpsc-group-c',
  enrolledCourseIds: ['group-c-prelims-2027', 'marathi-vyakaran-crash', 'reasoning-arithmetic'],
  completedLessons: {
    'group-c-prelims-2027': ['gcp-h1', 'gcp-h2', 'gcp-h3', 'gcp-h4', 'gcp-g1', 'gcp-g2'],
    'marathi-vyakaran-crash': ['mv-1', 'mv-2', 'mv-3'],
    'reasoning-arithmetic': ['ra-1'],
  },
  attempts: [],
  activeDays: [],
};
