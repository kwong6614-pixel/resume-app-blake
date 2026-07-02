import { createResumeTemplate } from '../TemplateBase';

/** Template 13 — Startup Modern: coral banner, left-bar sections */
export const ResumeStartupModern = createResumeTemplate({
  fonts: { body: 'Helvetica', title: 'Helvetica-Bold', baseSize: 10.5, nameSize: 26 },
  headerLayout: 'banner',
  theme: {
    primary: '#1f2937',
    secondary: '#4b5563',
    accent: '#ee5a52',
    headerBg: '#ee5a52',
    headerText: '#ffffff',
    headerSubtext: '#ffe4e1',
    sectionStyle: 'leftBar',
    skillsLayout: 'list',
  },
});

export default ResumeStartupModern;
