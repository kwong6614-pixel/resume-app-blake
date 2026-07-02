import { createResumeTemplate } from '../TemplateBase';

/** Template 15 — Healthcare Clinical: calm blue filled section labels */
export const ResumeHealthcareClinical = createResumeTemplate({
  fonts: { body: 'Helvetica', title: 'Helvetica-Bold', baseSize: 10.5, nameSize: 24 },
  headerLayout: 'center',
  theme: {
    primary: '#1e3a5f',
    secondary: '#334155',
    accent: '#2e74b5',
    muted: '#64748b',
    sectionStyle: 'filled',
    skillsLayout: 'twoColumn',
  },
});

export default ResumeHealthcareClinical;
