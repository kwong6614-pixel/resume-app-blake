import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { getBaseResumeByName } from '@/app/data/db';
import { buildPrompt } from '@/app/utils/promptBuilder';
import { generateResumePdf } from '@/app/lib/generateResumePdf';

export const maxDuration = 120;

// Retry helper for OpenAI API calls
async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 5,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.log(`OpenAI API attempt ${attempt}/${maxAttempts} failed: ${lastError.message}`);
      
      if (attempt < maxAttempts) {
        // Wait before retrying, with exponential backoff
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
      }
    }
  }
  
  throw lastError;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Parse form data
    const formData = await req.formData();
    const jobDescription = formData.get('job_description') as string;
    const company = formData.get('company') as string;
    const baseResumeProfile = formData.get('base_resume_profile') as string | null;

    // Validate required fields
    if (!jobDescription || !company) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing required fields: job_description, company' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return new NextResponse(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Load base resume based on selected profile, fallback to default embedded
    const profile = await getBaseResumeByName(baseResumeProfile);
    const baseResume: string = profile?.resumeText || ``;
    const customPrompt = profile?.customPrompt;
    const pdfTemplate = profile?.pdfTemplate || 1;
    
    // 3. Tailor resume with OpenAI (with retry logic for reliability)
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = buildPrompt(baseResume, jobDescription, customPrompt);

    const tailoredResume = await withRetry(async () => {
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_VERSION || 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a helpful assistant for creating professional resume content.' },
          { role: 'user', content: prompt }
        ],
        max_completion_tokens: 7000
      });

      const content = completion.choices[0]?.message?.content;
      
      // Throw error if content is empty so retry logic kicks in
      if (!content || content.trim().length === 0) {
        throw new Error('OpenAI returned empty response content');
      }
      
      return content;
    }, 5, 2000); // Retry up to 5 times with 2s initial delay (exponential backoff)

    // 4. Generate PDF with template
    const pdfBytes = await generateResumePdf(tailoredResume, pdfTemplate);

    // 5. Return PDF as response
    const profileBase = (baseResumeProfile && baseResumeProfile.replace(/[^a-zA-Z0-9_]/g, '_')) || 'resume';
    const fileBase = `${profileBase}_${company.replace(/[^a-zA-Z0-9_]/g, '_')}`;
    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileBase}.pdf"`
      }
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
