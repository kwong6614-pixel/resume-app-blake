import { NextRequest, NextResponse } from 'next/server';
import { generateResumePdf } from '@/app/lib/generateResumePdf';
import { getWithoutApiTemplateId, PDF_TEMPLATE_COUNT } from '@/app/utils/pdfTemplateMapping';
import {
  SAMPLE_API_RESUME_TEXT,
  SAMPLE_WITHOUT_API_PDF_DATA,
} from '@/app/utils/templatePreviewSample';
import { renderPdfBuffer } from '@/app/utils/pdfRender';
import { getTemplate } from '@/app/lib/pdf-templates';

function isAuthenticated(req: NextRequest): boolean {
  return Boolean(req.cookies.get('admin_session'));
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const pdfTemplate = Number(body?.pdfTemplate) || 1;
    const mode = body?.mode === 'without-api' ? 'without-api' : 'api';
    const resumeText =
      typeof body?.resumeText === 'string' && body.resumeText.trim()
        ? body.resumeText.trim()
        : SAMPLE_API_RESUME_TEXT;

    if (pdfTemplate < 1 || pdfTemplate > PDF_TEMPLATE_COUNT) {
      return NextResponse.json(
        { error: `pdfTemplate must be between 1 and ${PDF_TEMPLATE_COUNT}` },
        { status: 400 }
      );
    }

    let pdfBytes: Uint8Array | Buffer;

    if (mode === 'without-api') {
      const templateId = getWithoutApiTemplateId(pdfTemplate);
      const TemplateComponent = getTemplate(templateId);
      if (!TemplateComponent) {
        return NextResponse.json({ error: `Template "${templateId}" not found` }, { status: 404 });
      }
      pdfBytes = await renderPdfBuffer(TemplateComponent, SAMPLE_WITHOUT_API_PDF_DATA);
    } else {
      pdfBytes = await generateResumePdf(resumeText, pdfTemplate);
    }

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="template-${pdfTemplate}-preview.pdf"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Preview generation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
