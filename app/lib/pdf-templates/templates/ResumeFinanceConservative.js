import { createResumeTemplate } from '../TemplateBase';

/** Template 14 — Finance Conservative: serif, burgundy double-rule */
export const ResumeFinanceConservative = createResumeTemplate({
  fonts: { body: 'Times-Roman', title: 'Times-Bold', baseSize: 10.5, nameSize: 22 },
  headerLayout: 'center',
  theme: {
    primary: '#1c1917',
    secondary: '#44403c',
    accent: '#7f1d1d',
    muted: '#78716c',
    sectionStyle: 'doubleRule',
    skillsLayout: 'list',
  },
});

export default ResumeFinanceConservative;
