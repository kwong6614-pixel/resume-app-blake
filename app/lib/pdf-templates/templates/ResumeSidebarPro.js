import { createResumeTemplate } from '../TemplateBase';

/** Template 12 — Sidebar Pro: navy left stripe, professional split */
export const ResumeSidebarPro = createResumeTemplate({
  fonts: { body: 'Helvetica', title: 'Helvetica-Bold', baseSize: 10.5, nameSize: 22 },
  headerLayout: 'sidebar',
  theme: {
    primary: '#111827',
    secondary: '#374151',
    accent: '#1a2744',
    muted: '#6b7280',
    sidebarWidth: 36,
    sectionStyle: 'underline',
    skillsLayout: 'twoColumn',
  },
});

export default ResumeSidebarPro;
