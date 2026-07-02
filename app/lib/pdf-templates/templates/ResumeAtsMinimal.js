import { createResumeTemplate } from '../TemplateBase';

/** Template 11 — ATS Minimal: black & white, no decoration */
export const ResumeAtsMinimal = createResumeTemplate({
  fonts: { body: 'Helvetica', title: 'Helvetica-Bold', baseSize: 10, nameSize: 22, sectionSize: 10 },
  headerLayout: 'minimal',
  theme: {
    primary: '#000000',
    secondary: '#1f2937',
    accent: '#000000',
    muted: '#4b5563',
    sectionStyle: 'minimal',
    headerBorderWidth: 0,
  },
});

export default ResumeAtsMinimal;
