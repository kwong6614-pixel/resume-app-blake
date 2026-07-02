import { createResumeTemplate } from '../TemplateBase';

/** Template 17 — Compact Dense: tight spacing for one-page resumes */
export const ResumeCompactDense = createResumeTemplate({
  fonts: { body: 'Helvetica', title: 'Helvetica-Bold', baseSize: 9.5, nameSize: 20, sectionSize: 9.5 },
  headerLayout: 'minimal',
  theme: {
    primary: '#1f2937',
    secondary: '#4b5563',
    accent: '#4b5563',
    muted: '#6b7280',
    sectionStyle: 'minimal',
    pagePadding: '10mm',
    skillsLayout: 'twoColumn',
  },
});

export default ResumeCompactDense;
