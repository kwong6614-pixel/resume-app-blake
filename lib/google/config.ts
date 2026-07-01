export const GOOGLE_SHEETS_CONFIG = {
  spreadsheetId:
    process.env.GOOGLE_SHEETS_ID ?? '1vxjd4pzxYtqpFqX3YzFQDkzfyA9zszNh0WnsHuLUzuk',
  forResumeTab: process.env.GOOGLE_SHEETS_FOR_RESUME_TAB ?? 'For Resume',
} as const;

export function assertGoogleSheetsConfig(): void {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are required');
  }
  if (!process.env.GOOGLE_REFRESH_TOKEN) {
    throw new Error('GOOGLE_REFRESH_TOKEN is required');
  }
  if (!GOOGLE_SHEETS_CONFIG.spreadsheetId) {
    throw new Error('GOOGLE_SHEETS_ID is required');
  }
}
