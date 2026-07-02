import { createResumeTemplate } from '../TemplateBase';

/** Template 19 — International CV: formal split header */
export const ResumeInternationalCv = createResumeTemplate({
  fonts: { body: 'Times-Roman', title: 'Times-Bold', baseSize: 10.5, nameSize: 23 },
  sectionTitles: {
    summary: 'Profile',
    skills: 'Skills',
    experience: 'Professional Experience',
    education: 'Education',
  },
  headerLayout: 'split',
  theme: {
    primary: '#1a2744',
    secondary: '#334155',
    accent: '#1a3a6b',
    muted: '#64748b',
    sectionStyle: 'underline',
    nameUppercase: true,
    nameLetterSpacing: 0.5,
  },
});

export default ResumeInternationalCv;
