import { PDFDocument, StandardFonts } from 'pdf-lib';
import { parseResume, TemplateContext } from '@/app/api/generate-dynamic-resume-pdf/utils';
import { renderTemplate1 } from '@/app/api/generate-dynamic-resume-pdf/templates/template1';
import { renderTemplate2 } from '@/app/api/generate-dynamic-resume-pdf/templates/template2';
import { renderTemplate3 } from '@/app/api/generate-dynamic-resume-pdf/templates/template3';
import { renderTemplate4 } from '@/app/api/generate-dynamic-resume-pdf/templates/template4';
import { renderTemplate5 } from '@/app/api/generate-dynamic-resume-pdf/templates/template5';
import { renderTemplate6 } from '@/app/api/generate-dynamic-resume-pdf/templates/template6';
import { renderTemplate7 } from '@/app/api/generate-dynamic-resume-pdf/templates/template7';
import { renderTemplate8 } from '@/app/api/generate-dynamic-resume-pdf/templates/template8';
import { renderTemplate9 } from '@/app/api/generate-dynamic-resume-pdf/templates/template9';
import { renderTemplate10 } from '@/app/api/generate-dynamic-resume-pdf/templates/template10';
import { renderTemplate11 } from '@/app/api/generate-dynamic-resume-pdf/templates/template11';
import { renderTemplate12 } from '@/app/api/generate-dynamic-resume-pdf/templates/template12';
import { renderTemplate13 } from '@/app/api/generate-dynamic-resume-pdf/templates/template13';
import { renderTemplate14 } from '@/app/api/generate-dynamic-resume-pdf/templates/template14';
import { renderTemplate15 } from '@/app/api/generate-dynamic-resume-pdf/templates/template15';
import { renderTemplate16 } from '@/app/api/generate-dynamic-resume-pdf/templates/template16';
import { renderTemplate17 } from '@/app/api/generate-dynamic-resume-pdf/templates/template17';
import { renderTemplate18 } from '@/app/api/generate-dynamic-resume-pdf/templates/template18';
import { renderTemplate19 } from '@/app/api/generate-dynamic-resume-pdf/templates/template19';
import { renderTemplate20 } from '@/app/api/generate-dynamic-resume-pdf/templates/template20';

const TEMPLATE_RENDERERS: Record<number, (context: TemplateContext) => Promise<Uint8Array>> = {
  1: renderTemplate1,
  2: renderTemplate2,
  3: renderTemplate3,
  4: renderTemplate4,
  5: renderTemplate5,
  6: renderTemplate6,
  7: renderTemplate7,
  8: renderTemplate8,
  9: renderTemplate9,
  10: renderTemplate10,
  11: renderTemplate11,
  12: renderTemplate12,
  13: renderTemplate13,
  14: renderTemplate14,
  15: renderTemplate15,
  16: renderTemplate16,
  17: renderTemplate17,
  18: renderTemplate18,
  19: renderTemplate19,
  20: renderTemplate20,
};

export async function generateResumePdf(resumeText: string, template: number = 1): Promise<Uint8Array> {
  const parsed = parseResume(resumeText);
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const context: TemplateContext = {
    pdfDoc,
    page,
    font,
    fontBold,
    name: parsed.name,
    email: parsed.email,
    phone: parsed.phone,
    location: parsed.location,
    linkedin: parsed.linkedin ?? '',
    body: parsed.body,
    PAGE_WIDTH: 595,
    PAGE_HEIGHT: 842,
  };

  const renderer = TEMPLATE_RENDERERS[template] ?? renderTemplate1;
  return renderer(context);
}
