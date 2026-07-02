import { createResumeTemplate } from '../TemplateBase';

/** Template 16 — Designer Clean: large name, accent-line sections */
export const ResumeDesignerClean = createResumeTemplate({
  fonts: { body: 'Helvetica', title: 'Helvetica-Bold', baseSize: 10.5, nameSize: 30 },
  headerLayout: 'minimal',
  theme: {
    primary: '#111827',
    secondary: '#374151',
    accent: '#111827',
    muted: '#6b7280',
    sectionStyle: 'accentLine',
    pagePadding: '16mm',
  },
});

export default ResumeDesignerClean;
