import ResumeTemplate from './ResumeTemplate';
import { ResumeTechTeal } from './templates/ResumeTechTeal';
import { ResumeModernGreen } from './templates/ResumeModernGreen';
import { ResumeCreativeBurgundy } from './templates/ResumeCreativeBurgundy';
import { ResumeBoldEmerald } from './templates/ResumeBoldEmerald';
import { ResumeCorporateSlate } from './templates/ResumeCorporateSlate';
import { ResumeExecutiveNavy } from './templates/ResumeExecutiveNavy';
import { ResumeClassicCharcoal } from './templates/ResumeClassicCharcoal';
import { ResumeConsultantSteel } from './templates/ResumeConsultantSteel';
import { ResumeAcademicPurple } from './templates/ResumeAcademicPurple';
import { ResumeAtsMinimal } from './templates/ResumeAtsMinimal';
import { ResumeSidebarPro } from './templates/ResumeSidebarPro';
import { ResumeStartupModern } from './templates/ResumeStartupModern';
import { ResumeFinanceConservative } from './templates/ResumeFinanceConservative';
import { ResumeHealthcareClinical } from './templates/ResumeHealthcareClinical';
import { ResumeDesignerClean } from './templates/ResumeDesignerClean';
import { ResumeCompactDense } from './templates/ResumeCompactDense';
import { ResumeTimelinePro } from './templates/ResumeTimelinePro';
import { ResumeInternationalCv } from './templates/ResumeInternationalCv';
import { ResumeFederalStructured } from './templates/ResumeFederalStructured';

const templates = {
  Resume: ResumeTemplate,
  'Resume-Tech-Teal': ResumeTechTeal,
  'Resume-Modern-Green': ResumeModernGreen,
  'Resume-Creative-Burgundy': ResumeCreativeBurgundy,
  'Resume-Bold-Emerald': ResumeBoldEmerald,
  'Resume-Corporate-Slate': ResumeCorporateSlate,
  'Resume-Executive-Navy': ResumeExecutiveNavy,
  'Resume-Classic-Charcoal': ResumeClassicCharcoal,
  'Resume-Consultant-Steel': ResumeConsultantSteel,
  'Resume-Academic-Purple': ResumeAcademicPurple,
  'Resume-ATS-Minimal': ResumeAtsMinimal,
  'Resume-Sidebar-Pro': ResumeSidebarPro,
  'Resume-Startup-Modern': ResumeStartupModern,
  'Resume-Finance-Conservative': ResumeFinanceConservative,
  'Resume-Healthcare-Clinical': ResumeHealthcareClinical,
  'Resume-Designer-Clean': ResumeDesignerClean,
  'Resume-Compact-Dense': ResumeCompactDense,
  'Resume-Timeline-Pro': ResumeTimelinePro,
  'Resume-International-CV': ResumeInternationalCv,
  'Resume-Federal-Structured': ResumeFederalStructured,
};

export const getTemplate = (templateId) => {
  const templateName = templateId || 'Resume';
  return templates[templateName] || templates.Resume;
};

export default templates;
