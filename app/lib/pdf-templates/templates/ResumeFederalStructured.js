import { createResumeTemplate } from '../TemplateBase';

/** Template 20 — Federal Structured: plain black, minimal styling */
export const ResumeFederalStructured = createResumeTemplate({
  fonts: { body: 'Helvetica', title: 'Helvetica-Bold', baseSize: 10, nameSize: 20, sectionSize: 10 },
  sectionTitles: {
    summary: 'Objective',
    skills: 'Core Competencies',
    experience: 'Professional Experience',
    education: 'Education & Training',
  },
  headerLayout: 'minimal',
  theme: {
    primary: '#000000',
    secondary: '#1f2937',
    accent: '#000000',
    muted: '#4b5563',
    sectionStyle: 'minimal',
    bulletStyle: 'dash',
    companyItalic: false,
  },
});

export default ResumeFederalStructured;
