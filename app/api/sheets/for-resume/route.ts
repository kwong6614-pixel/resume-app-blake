import { NextResponse } from 'next/server';
import { assertGoogleSheetsConfig } from '@/lib/google/config';
import { fetchForResumeJobs } from '@/lib/google/for-resume-sheet';

export async function GET() {
  try {
    assertGoogleSheetsConfig();
    const jobs = await fetchForResumeJobs();

    return NextResponse.json({
      ok: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to read Google Sheet';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
