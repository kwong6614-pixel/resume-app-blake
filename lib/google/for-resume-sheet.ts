import { google } from 'googleapis';
import { GOOGLE_SHEETS_CONFIG } from './config';
import { getAuthorizedOAuth2Client } from './oauth';

export interface ForResumeJobRow {
  rowIndex: number;
  company: string;
  jobDescription: string;
}

function normalizeHeader(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[()]/g, '');
}

function findColumnIndex(headers: string[], matchers: string[]): number {
  const normalized = headers.map(normalizeHeader);

  for (const matcher of matchers) {
    const index = normalized.findIndex((header) => header === matcher || header.includes(matcher));
    if (index >= 0) return index;
  }

  return -1;
}

function buildJobDescription(
  responsibilities: string,
  qualificationsRequired: string,
  qualificationsPreferred: string
): string {
  const sections: string[] = [];

  if (responsibilities.trim()) {
    sections.push(`Responsibilities:\n${responsibilities.trim()}`);
  }
  if (qualificationsRequired.trim()) {
    sections.push(`Required Qualifications:\n${qualificationsRequired.trim()}`);
  }
  if (qualificationsPreferred.trim()) {
    sections.push(`Preferred Qualifications:\n${qualificationsPreferred.trim()}`);
  }

  return sections.join('\n\n');
}

export async function fetchForResumeJobs(): Promise<ForResumeJobRow[]> {
  const auth = getAuthorizedOAuth2Client();
  const sheets = google.sheets({ version: 'v4', auth });
  const tab = GOOGLE_SHEETS_CONFIG.forResumeTab;

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: GOOGLE_SHEETS_CONFIG.spreadsheetId,
    range: `${tab}!A:Z`,
  });

  const values = response.data.values ?? [];
  if (values.length < 2) return [];

  const headers = values[0].map((cell) => String(cell ?? '').trim());
  const companyCol = findColumnIndex(headers, ['company name', 'company']);
  const responsibilitiesCol = findColumnIndex(headers, ['responsibilities', 'responsibility']);
  const requiredCol = findColumnIndex(headers, [
    'qualifications required',
    'qualification required',
    'qualificationsrequired',
  ]);
  const preferredCol = findColumnIndex(headers, [
    'qualifications preferred',
    'qualifications prefered',
    'qualification preferred',
    'qualificationspreferred',
    'qualificationsprefered',
  ]);

  if (companyCol < 0) {
    throw new Error(
      `Could not find a Company column in "${tab}". Expected a header like "Company name".`
    );
  }

  if (responsibilitiesCol < 0 && requiredCol < 0 && preferredCol < 0) {
    throw new Error(
      `Could not find JD columns in "${tab}". Expected Responsibilities and/or Qualifications columns.`
    );
  }

  const rows: ForResumeJobRow[] = [];

  for (let i = 1; i < values.length; i++) {
    const row = values[i] ?? [];
    const company = String(row[companyCol] ?? '').trim();
    const responsibilities =
      responsibilitiesCol >= 0 ? String(row[responsibilitiesCol] ?? '').trim() : '';
    const qualificationsRequired = requiredCol >= 0 ? String(row[requiredCol] ?? '').trim() : '';
    const qualificationsPreferred =
      preferredCol >= 0 ? String(row[preferredCol] ?? '').trim() : '';

    const jobDescription = buildJobDescription(
      responsibilities,
      qualificationsRequired,
      qualificationsPreferred
    );

    if (!company || !jobDescription.trim()) continue;

    rows.push({
      rowIndex: i + 1,
      company,
      jobDescription,
    });
  }

  return rows;
}
