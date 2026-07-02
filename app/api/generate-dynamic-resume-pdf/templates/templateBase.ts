import { PDFPage, RGB, rgb } from 'pdf-lib';
import {
  TemplateContext,
  wrapText,
  wrapBulletText,
  formatDate,
  drawTextWithBold,
  COLORS,
  SPACING,
  BULLET_INDENT,
  BULLET_CHAR,
  SKILL_CONTINUATION_INDENT,
  parseEducationLine,
  isEducationSection,
  splitIntoBulletLines,
} from '../utils';

export type HeaderLayout =
  | 'bold-rule'
  | 'accent-bar'
  | 'banner'
  | 'centered'
  | 'split-right-contact'
  | 'minimal'
  | 'sidebar-block'
  | 'compact';

export type SectionHeaderStyle =
  | 'uppercase-bold'
  | 'underline'
  | 'filled'
  | 'left-bar'
  | 'minimal-caps'
  | 'double-rule'
  | 'accent-line';

export interface PdfThemeConfig {
  margins?: { left: number; right: number; top: number; bottom: number };
  typography?: {
    nameSize?: number;
    contactSize?: number;
    sectionSize?: number;
    jobTitleSize?: number;
    bodySize?: number;
    lineHeightMult?: number;
  };
  colors?: {
    name?: RGB;
    text?: RGB;
    muted?: RGB;
    accent?: RGB;
    headerBg?: RGB;
    headerText?: RGB;
    sectionBg?: RGB;
  };
  header: HeaderLayout;
  sectionStyle: SectionHeaderStyle;
  spacing?: Partial<typeof SPACING>;
  sidebarWidth?: number;
  timelineJobs?: boolean;
}

const DEFAULT_MARGINS = { left: 50, right: 50, top: 55, bottom: 50 };

function drawSectionHeader(
  page: PDFPage,
  sectionName: string,
  x: number,
  y: number,
  font: TemplateContext['font'],
  fontBold: TemplateContext['fontBold'],
  sectionSize: number,
  style: SectionHeaderStyle,
  colors: Required<NonNullable<PdfThemeConfig['colors']>>
): number {
  const label = sectionName.toUpperCase();

  if (style === 'filled') {
    const textWidth = fontBold.widthOfTextAtSize(label, sectionSize - 1);
    const padH = 8;
    const padV = 4;
    page.drawRectangle({
      x,
      y: y - padV,
      width: textWidth + padH * 2,
      height: sectionSize + padV * 2,
      color: colors.accent,
    });
    page.drawText(label, {
      x: x + padH,
      y,
      size: sectionSize - 1,
      font: fontBold,
      color: rgb(1, 1, 1),
    });
    return y - sectionSize - padV * 2 - 8;
  }

  if (style === 'left-bar') {
    page.drawRectangle({ x: x - 10, y: y - 4, width: 4, height: sectionSize + 8, color: colors.accent });
    page.drawText(label, { x, y, size: sectionSize, font: fontBold, color: colors.accent });
    return y - sectionSize - 10;
  }

  if (style === 'minimal-caps') {
    page.drawText(label, { x, y, size: sectionSize, font: fontBold, color: colors.muted });
    return y - sectionSize - 8;
  }

  if (style === 'double-rule') {
    page.drawText(label, { x, y, size: sectionSize, font: fontBold, color: colors.text });
    const lineY = y - 5;
    page.drawLine({
      start: { x, y: lineY },
      end: { x: x + 200, y: lineY },
      thickness: 2,
      color: colors.accent,
    });
    return lineY - 10;
  }

  if (style === 'accent-line') {
    page.drawRectangle({ x, y: y + 2, width: 36, height: 3, color: colors.accent });
    page.drawText(label, { x, y: y - 6, size: sectionSize, font: fontBold, color: colors.text });
    return y - sectionSize - 12;
  }

  if (style === 'underline') {
    page.drawText(label, { x, y, size: sectionSize, font: fontBold, color: colors.accent });
    const textWidth = fontBold.widthOfTextAtSize(label, sectionSize);
    page.drawLine({
      start: { x, y: y - 4 },
      end: { x: x + textWidth, y: y - 4 },
      thickness: 1,
      color: colors.accent,
    });
    return y - sectionSize - 10;
  }

  page.drawText(label, { x, y, size: sectionSize, font: fontBold, color: colors.text });
  return y - sectionSize - 8;
}

function drawHeader(
  context: TemplateContext,
  config: PdfThemeConfig,
  layout: {
    marginLeft: number;
    marginRight: number;
    marginTop: number;
    nameSize: number;
    contactSize: number;
    colors: Required<NonNullable<PdfThemeConfig['colors']>>;
  }
): number {
  const { page, font, fontBold, name, email, phone, location, linkedin, PAGE_WIDTH, PAGE_HEIGHT } =
    context;
  const { marginLeft, marginRight, marginTop, nameSize, contactSize, colors } = layout;
  let y = PAGE_HEIGHT - marginTop;

  if (config.header === 'sidebar-block') {
    const sidebarW = config.sidebarWidth ?? 130;
    page.drawRectangle({ x: 0, y: 0, width: sidebarW, height: PAGE_HEIGHT, color: colors.accent });
    const pad = 14;
    let sy = PAGE_HEIGHT - marginTop;
    if (name) {
      const wrapped = wrapText(name, fontBold, nameSize - 4, sidebarW - pad * 2);
      for (const line of wrapped) {
        page.drawText(line, { x: pad, y: sy, size: nameSize - 4, font: fontBold, color: colors.headerText });
        sy -= nameSize - 2;
      }
      sy -= 6;
    }
    const contactParts = [email, phone, location, linkedin].filter(Boolean);
    for (const part of contactParts) {
      const wrapped = wrapText(part, font, contactSize - 1, sidebarW - pad * 2);
      for (const line of wrapped) {
        page.drawText(line, { x: pad, y: sy, size: contactSize - 1, font, color: rgb(0.9, 0.9, 0.9) });
        sy -= contactSize;
      }
    }
    return y;
  }

  if (config.header === 'banner') {
    const bannerH = nameSize + contactSize + 36;
    page.drawRectangle({
      x: 0,
      y: y - bannerH + nameSize,
      width: PAGE_WIDTH,
      height: bannerH,
      color: colors.headerBg ?? colors.accent,
    });
    if (name) {
      page.drawText(name, {
        x: marginLeft,
        y,
        size: nameSize,
        font: fontBold,
        color: colors.headerText,
      });
      y -= nameSize + 6;
    }
    const contactParts = [email, phone, location, linkedin].filter(Boolean);
    if (contactParts.length > 0) {
      page.drawText(contactParts.join('   |   '), {
        x: marginLeft,
        y,
        size: contactSize,
        font,
        color: rgb(0.92, 0.92, 0.92),
      });
      y -= contactSize + 14;
    }
    return y;
  }

  if (config.header === 'centered') {
    if (name) {
      const nameWidth = fontBold.widthOfTextAtSize(name, nameSize);
      page.drawText(name, {
        x: (PAGE_WIDTH - nameWidth) / 2,
        y,
        size: nameSize,
        font: fontBold,
        color: colors.name,
      });
      y -= nameSize + 6;
    }
    const contactParts = [location, phone, email, linkedin].filter(Boolean);
    if (contactParts.length > 0) {
      const contactText = contactParts.join('   |   ');
      const contactWidth = font.widthOfTextAtSize(contactText, contactSize);
      page.drawText(contactText, {
        x: (PAGE_WIDTH - contactWidth) / 2,
        y,
        size: contactSize,
        font,
        color: colors.muted,
      });
      y -= contactSize + 10;
    }
    const lineWidth = 180;
    page.drawLine({
      start: { x: (PAGE_WIDTH - lineWidth) / 2, y },
      end: { x: (PAGE_WIDTH + lineWidth) / 2, y },
      thickness: 1,
      color: colors.accent,
    });
    return y - 18;
  }

  if (config.header === 'split-right-contact') {
    if (name) {
      page.drawText(name, { x: marginLeft, y, size: nameSize, font: fontBold, color: colors.name });
      y -= nameSize + 4;
    }
    const contactLines = [email, phone, location, linkedin].filter(Boolean);
    for (const contactLine of contactLines) {
      const lineWidth = font.widthOfTextAtSize(contactLine, contactSize);
      page.drawText(contactLine, {
        x: PAGE_WIDTH - marginRight - lineWidth,
        y,
        size: contactSize,
        font,
        color: colors.muted,
      });
      y -= contactSize + 3;
    }
    y -= 10;
    page.drawLine({
      start: { x: marginLeft, y },
      end: { x: PAGE_WIDTH - marginRight, y },
      thickness: 0.75,
      color: colors.accent,
    });
    return y - 18;
  }

  if (config.header === 'minimal' || config.header === 'compact') {
    if (name) {
      page.drawText(name, { x: marginLeft, y, size: nameSize, font: fontBold, color: colors.name });
      y -= nameSize + 4;
    }
    const contactParts = [email, phone, location, linkedin].filter(Boolean);
    if (contactParts.length > 0) {
      page.drawText(contactParts.join('   |   '), {
        x: marginLeft,
        y,
        size: contactSize,
        font,
        color: colors.muted,
      });
      y -= contactSize + (config.header === 'compact' ? 8 : 14);
    }
    return y;
  }

  if (name) {
    page.drawText(name, { x: marginLeft, y, size: nameSize, font: fontBold, color: colors.name });
    y -= nameSize + 6;
  }
  const contactParts = [email, phone, location, linkedin].filter(Boolean);
  if (contactParts.length > 0) {
    page.drawText(contactParts.join('   |   '), {
      x: marginLeft,
      y,
      size: contactSize,
      font,
      color: colors.muted,
    });
    y -= contactSize + 8;
  }
  if (config.header === 'bold-rule') {
    page.drawLine({
      start: { x: marginLeft, y },
      end: { x: PAGE_WIDTH - marginRight, y },
      thickness: 2,
      color: colors.text,
    });
    y -= 22;
  }
  return y;
}

export function createPdfLibTemplate(config: PdfThemeConfig) {
  return async function renderThemedTemplate(context: TemplateContext): Promise<Uint8Array> {
    const { pdfDoc, font, fontBold, body, PAGE_WIDTH, PAGE_HEIGHT } = context;
    let { page } = context;

    const margins = { ...DEFAULT_MARGINS, ...config.margins };
    const typo = {
      nameSize: 27,
      contactSize: 10,
      sectionSize: 12,
      jobTitleSize: 11,
      bodySize: 10.5,
      lineHeightMult: SPACING.BULLET_LINE_HEIGHT,
      ...config.typography,
    };
    const colors = {
      name: COLORS.BLACK,
      text: COLORS.DARK_GRAY,
      muted: COLORS.MEDIUM_GRAY,
      accent: rgb(0.15, 0.22, 0.35),
      headerBg: config.colors?.accent ?? rgb(0.15, 0.22, 0.35),
      headerText: rgb(1, 1, 1),
      sectionBg: rgb(0.95, 0.95, 0.95),
      ...config.colors,
    };
    const spacing = { ...SPACING, ...config.spacing };

    const sidebarOffset =
      config.header === 'sidebar-block' ? (config.sidebarWidth ?? 130) + 20 : 0;
    const MARGIN_LEFT = margins.left + sidebarOffset;
    const MARGIN_RIGHT = margins.right;
    const MARGIN_BOTTOM = margins.bottom;
    const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
    const LINE_HEIGHT = typo.bodySize * typo.lineHeightMult;
    const TIMELINE_X = MARGIN_LEFT - 14;

    const decoratePage = (p: PDFPage) => {
      if (config.header === 'accent-bar') {
        p.drawRectangle({ x: 0, y: 0, width: 5, height: PAGE_HEIGHT, color: colors.accent });
      }
      if (config.header === 'sidebar-block') {
        const sidebarW = config.sidebarWidth ?? 130;
        p.drawRectangle({ x: 0, y: 0, width: sidebarW, height: PAGE_HEIGHT, color: colors.accent });
      }
    };

    decoratePage(page);
    let y = drawHeader(context, config, {
      marginLeft: MARGIN_LEFT,
      marginRight: MARGIN_RIGHT,
      marginTop: margins.top,
      nameSize: typo.nameSize,
      contactSize: typo.contactSize,
      colors,
    });

    const bodyLines = body.split('\n');
    let isFirstJob = true;
    let isFirstBulletAfterJob = false;
    let currentSection = '';
    let isFirstEducation = true;
    const spaceWidthForSkills = font.widthOfTextAtSize(' ', typo.bodySize);

    const wrapSkillsLine = (text: string, maxWidth: number): string[] => {
      const skillMatch = text.match(/^[\-\·•]\s*(\*\*[^*]+\*\*:?|[^:]+:)\s*(.*)$/);
      if (!skillMatch) return wrapText(text, font, typo.bodySize, maxWidth);
      const category = skillMatch[1];
      const content = skillMatch[2];
      const categoryDisplayText = category.replace(/\*\*/g, '');
      const bulletWidth = font.widthOfTextAtSize(BULLET_CHAR + '   ', typo.bodySize);
      const categoryWidth = fontBold.widthOfTextAtSize(categoryDisplayText + ' ', typo.bodySize);
      const wrappedContent = wrapText(content, font, typo.bodySize, maxWidth - categoryWidth - bulletWidth);
      const lines: string[] = [];
      const continuationSpaces = ' '.repeat(
        Math.max(0, Math.ceil(SKILL_CONTINUATION_INDENT / spaceWidthForSkills))
      );
      for (let i = 0; i < wrappedContent.length; i++) {
        lines.push(
          i === 0
            ? BULLET_CHAR + '   ' + category + ' ' + wrappedContent[i]
            : continuationSpaces + wrappedContent[i]
        );
      }
      return lines;
    };

    const ensureSpace = (needed: number) => {
      if (y >= MARGIN_BOTTOM + needed) return;
      page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      context.page = page;
      decoratePage(page);
      y = PAGE_HEIGHT - margins.top;
    };

    for (let i = 0; i < bodyLines.length; i++) {
      const line = bodyLines[i].trim();
      if (!line) {
        y -= 4;
        continue;
      }

      if (line.endsWith(':')) {
        y -= spacing.SECTION_GAP;
        ensureSpace(50);
        currentSection = line.slice(0, -1).toLowerCase();
        y = drawSectionHeader(
          page,
          line.slice(0, -1),
          MARGIN_LEFT,
          y,
          font,
          fontBold,
          typo.sectionSize,
          config.sectionStyle,
          colors
        );
        isFirstJob = true;
        isFirstBulletAfterJob = false;
        isFirstEducation = true;
        continue;
      }

      if (isEducationSection(currentSection)) {
        const eduParsed = parseEducationLine(line);
        if (eduParsed) {
          if (!isFirstEducation) y -= spacing.EDUCATION_GAP;
          isFirstEducation = false;
          ensureSpace(40);
          page.drawText(eduParsed.degree, {
            x: MARGIN_LEFT,
            y,
            size: typo.jobTitleSize,
            font: fontBold,
            color: colors.name,
          });
          y -= typo.jobTitleSize + 4;
          page.drawText(`${eduParsed.institution}  |  ${eduParsed.year}`, {
            x: MARGIN_LEFT,
            y,
            size: typo.bodySize,
            font,
            color: colors.muted,
          });
          y -= typo.bodySize + 8;
          continue;
        }
      }

      const jobMatch = line.match(/^(.+?) at (.+?):\s*(.+)$/);
      if (jobMatch) {
        const [, jobTitle, company, period] = jobMatch;
        if (!isFirstJob) y -= spacing.JOB_GAP;
        isFirstJob = false;
        ensureSpace(60);

        if (config.timelineJobs) {
          page.drawCircle({ x: TIMELINE_X, y: y - 3, size: 3, color: colors.accent });
          if (!isFirstBulletAfterJob) {
            page.drawLine({
              start: { x: TIMELINE_X, y: y - 8 },
              end: { x: TIMELINE_X, y: y - 40 },
              thickness: 1,
              color: colors.muted,
            });
          }
        }

        page.drawText(jobTitle.trim(), {
          x: MARGIN_LEFT,
          y,
          size: typo.jobTitleSize,
          font: fontBold,
          color: colors.name,
        });
        y -= typo.jobTitleSize + 4;
        page.drawText(`${company.trim()}  |  ${formatDate(period.trim())}`, {
          x: MARGIN_LEFT,
          y,
          size: typo.bodySize,
          font,
          color: colors.muted,
        });
        y -= spacing.AFTER_JOB_HEADER;
        isFirstBulletAfterJob = true;
        continue;
      }

      const isSkillsSection =
        currentSection.includes('skill') || currentSection.includes('technologies');
      const isSkillLine = line.match(/^[\-\·•]\s*(\*\*[^*]+\*\*:?|[A-Za-z &\/]+:)\s*.+$/);

      if (isSkillsSection && isSkillLine) {
        const wrappedLines = wrapSkillsLine(line, CONTENT_WIDTH - BULLET_INDENT);
        for (const wline of wrappedLines) {
          ensureSpace(0);
          drawTextWithBold(page, wline, MARGIN_LEFT + BULLET_INDENT, y, font, fontBold, typo.bodySize, colors.name);
          y -= LINE_HEIGHT;
        }
        y -= spacing.BULLET_GAP;
        continue;
      }

      const isExperienceSection =
        currentSection.includes('experience') || currentSection.includes('professional');
      let linesToRender = [line];
      if (isExperienceSection && !/^[\-\·•]\s/.test(line)) {
        const bulletLines = splitIntoBulletLines(line);
        if (bulletLines.length > 1) linesToRender = bulletLines;
      }

      for (const singleLine of linesToRender) {
        const wrapped = wrapBulletText(singleLine, font, typo.bodySize, CONTENT_WIDTH - BULLET_INDENT);
        if (wrapped.hasBullet && isFirstBulletAfterJob) {
          y -= spacing.BEFORE_FIRST_BULLET;
          isFirstBulletAfterJob = false;
        }
        for (const wline of wrapped.lines) {
          ensureSpace(0);
          const xPos = wrapped.hasBullet ? MARGIN_LEFT + BULLET_INDENT : MARGIN_LEFT;
          drawTextWithBold(page, wline, xPos, y, font, fontBold, typo.bodySize, colors.name);
          y -= LINE_HEIGHT;
        }
        if (wrapped.hasBullet) y -= spacing.BULLET_GAP;
      }
    }

    return await pdfDoc.save();
  };
}
