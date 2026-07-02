import { rgb } from 'pdf-lib';
import type { PdfThemeConfig } from './templateBase';

/** Template 11 — ATS Minimal */
export const THEME_11: PdfThemeConfig = {
  header: 'minimal',
  sectionStyle: 'minimal-caps',
  margins: { left: 52, right: 52, top: 50, bottom: 48 },
  typography: { nameSize: 22, bodySize: 10, sectionSize: 10.5 },
  colors: { name: rgb(0, 0, 0), text: rgb(0, 0, 0), muted: rgb(0.35, 0.35, 0.35), accent: rgb(0, 0, 0) },
};

/** Template 12 — Sidebar Pro */
export const THEME_12: PdfThemeConfig = {
  header: 'sidebar-block',
  sectionStyle: 'underline',
  sidebarWidth: 128,
  margins: { left: 20, right: 48, top: 50, bottom: 48 },
  typography: { nameSize: 20, contactSize: 8.5, sectionSize: 11 },
  colors: {
    accent: rgb(0.1, 0.16, 0.28),
    headerText: rgb(1, 1, 1),
    name: rgb(0.1, 0.1, 0.1),
    text: rgb(0.15, 0.15, 0.15),
    muted: rgb(0.45, 0.45, 0.45),
  },
};

/** Template 13 — Startup Modern */
export const THEME_13: PdfThemeConfig = {
  header: 'banner',
  sectionStyle: 'left-bar',
  typography: { nameSize: 26, sectionSize: 11.5 },
  colors: {
    accent: rgb(0.93, 0.35, 0.32),
    headerBg: rgb(0.93, 0.35, 0.32),
    headerText: rgb(1, 1, 1),
    name: rgb(0.1, 0.1, 0.1),
    text: rgb(0.2, 0.2, 0.2),
    muted: rgb(0.45, 0.45, 0.45),
  },
};

/** Template 14 — Finance Conservative */
export const THEME_14: PdfThemeConfig = {
  header: 'centered',
  sectionStyle: 'double-rule',
  margins: { left: 58, right: 58, top: 52, bottom: 50 },
  typography: { nameSize: 22, sectionSize: 11 },
  colors: {
    accent: rgb(0.45, 0.12, 0.14),
    name: rgb(0.15, 0.12, 0.12),
    text: rgb(0.2, 0.18, 0.18),
    muted: rgb(0.42, 0.4, 0.4),
  },
};

/** Template 15 — Healthcare Clinical */
export const THEME_15: PdfThemeConfig = {
  header: 'bold-rule',
  sectionStyle: 'filled',
  typography: { nameSize: 24, sectionSize: 10.5 },
  colors: {
    accent: rgb(0.18, 0.45, 0.72),
    name: rgb(0.12, 0.2, 0.35),
    text: rgb(0.2, 0.25, 0.3),
    muted: rgb(0.45, 0.5, 0.55),
  },
};

/** Template 16 — Designer Clean */
export const THEME_16: PdfThemeConfig = {
  header: 'minimal',
  sectionStyle: 'accent-line',
  margins: { left: 56, right: 56, top: 58, bottom: 52 },
  typography: { nameSize: 32, contactSize: 9.5, bodySize: 10.5, sectionSize: 10 },
  colors: {
    accent: rgb(0.1, 0.1, 0.1),
    name: rgb(0.05, 0.05, 0.05),
    text: rgb(0.2, 0.2, 0.2),
    muted: rgb(0.5, 0.5, 0.5),
  },
};

/** Template 17 — Compact Dense */
export const THEME_17: PdfThemeConfig = {
  header: 'compact',
  sectionStyle: 'minimal-caps',
  margins: { left: 42, right: 42, top: 40, bottom: 40 },
  typography: { nameSize: 21, contactSize: 9, sectionSize: 10, jobTitleSize: 10, bodySize: 9.5, lineHeightMult: 1.55 },
  spacing: { SECTION_GAP: 14, AFTER_SECTION_HEADER: 10, JOB_GAP: 11, AFTER_JOB_HEADER: 8, BEFORE_FIRST_BULLET: 4, BULLET_GAP: 3, EDUCATION_GAP: 8 },
  colors: { name: rgb(0.15, 0.15, 0.15), text: rgb(0.22, 0.22, 0.22), muted: rgb(0.45, 0.45, 0.45), accent: rgb(0.3, 0.3, 0.3) },
};

/** Template 18 — Timeline Pro */
export const THEME_18: PdfThemeConfig = {
  header: 'split-right-contact',
  sectionStyle: 'underline',
  timelineJobs: true,
  typography: { nameSize: 25, sectionSize: 11.5 },
  colors: {
    accent: rgb(0.35, 0.42, 0.5),
    name: rgb(0.12, 0.2, 0.32),
    text: rgb(0.2, 0.22, 0.25),
    muted: rgb(0.48, 0.5, 0.52),
  },
};

/** Template 19 — International CV */
export const THEME_19: PdfThemeConfig = {
  header: 'split-right-contact',
  sectionStyle: 'uppercase-bold',
  margins: { left: 54, right: 54, top: 48, bottom: 48 },
  typography: { nameSize: 24, sectionSize: 11, bodySize: 10.5 },
  colors: {
    accent: rgb(0.1, 0.22, 0.45),
    name: rgb(0.1, 0.15, 0.3),
    text: rgb(0.15, 0.18, 0.22),
    muted: rgb(0.4, 0.42, 0.45),
  },
};

/** Template 20 — Federal Structured */
export const THEME_20: PdfThemeConfig = {
  header: 'minimal',
  sectionStyle: 'uppercase-bold',
  margins: { left: 54, right: 54, top: 48, bottom: 48 },
  typography: { nameSize: 20, contactSize: 9.5, sectionSize: 10.5, bodySize: 10 },
  colors: {
    accent: rgb(0, 0, 0),
    name: rgb(0, 0, 0),
    text: rgb(0, 0, 0),
    muted: rgb(0.3, 0.3, 0.3),
  },
};
