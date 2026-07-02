import { createResumeTemplate } from '../TemplateBase';

/** Template 18 — Timeline Pro: steel split header */
export const ResumeTimelinePro = createResumeTemplate({
  fonts: { body: 'Helvetica', title: 'Helvetica-Bold', baseSize: 10.5, nameSize: 24 },
  headerLayout: 'split',
  theme: {
    primary: '#1e293b',
    secondary: '#475569',
    accent: '#5a6b7d',
    muted: '#64748b',
    sectionStyle: 'underline',
    skillsLayout: 'twoColumn',
  },
});

export default ResumeTimelinePro;
