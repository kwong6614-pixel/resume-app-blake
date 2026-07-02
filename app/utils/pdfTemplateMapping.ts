/** Maps pdfTemplate number (1-20) to React-PDF template IDs for Without API mode. */
export const WITHOUT_API_TEMPLATE_MAP: Record<number, string> = {
  1: 'Resume',
  2: 'Resume-Tech-Teal',
  3: 'Resume-Modern-Green',
  4: 'Resume-Creative-Burgundy',
  5: 'Resume-Bold-Emerald',
  6: 'Resume-Corporate-Slate',
  7: 'Resume-Executive-Navy',
  8: 'Resume-Classic-Charcoal',
  9: 'Resume-Consultant-Steel',
  10: 'Resume-Academic-Purple',
  11: 'Resume-ATS-Minimal',
  12: 'Resume-Sidebar-Pro',
  13: 'Resume-Startup-Modern',
  14: 'Resume-Finance-Conservative',
  15: 'Resume-Healthcare-Clinical',
  16: 'Resume-Designer-Clean',
  17: 'Resume-Compact-Dense',
  18: 'Resume-Timeline-Pro',
  19: 'Resume-International-CV',
  20: 'Resume-Federal-Structured',
};

export const WITHOUT_API_TEMPLATE_LABELS: Record<number, string> = {
  1: 'Classic Professional — centered black header',
  2: 'Teal Banner — full-width teal header band',
  3: 'Modern Green — green sidebar stripe',
  4: 'Creative Burgundy — burgundy filled section labels',
  5: 'Bold Emerald — large name, emerald left-bar sections',
  6: 'Corporate Slate — split header, gray boxed sections',
  7: 'Executive Navy — navy banner, gold double-rule sections',
  8: 'Classic Charcoal — serif, charcoal accent-line sections',
  9: 'Consultant Steel — steel-blue split header, 2-col skills',
  10: 'Academic Purple — purple filled labels, formal serif',
  11: 'ATS Minimal — plain black & white, ATS-friendly',
  12: 'Sidebar Pro — navy sidebar panel, underline sections',
  13: 'Startup Modern — coral banner, left-bar sections',
  14: 'Finance Conservative — serif centered, burgundy rules',
  15: 'Healthcare Clinical — blue filled section labels',
  16: 'Designer Clean — large name, accent-line sections',
  17: 'Compact Dense — tight one-page layout',
  18: 'Timeline Pro — split header, timeline job markers',
  19: 'International CV — formal split, profile section',
  20: 'Federal Structured — plain structured government style',
};

export const PDF_TEMPLATE_COUNT = 20;

export function getWithoutApiTemplateId(pdfTemplate: number): string {
  return WITHOUT_API_TEMPLATE_MAP[pdfTemplate] || WITHOUT_API_TEMPLATE_MAP[1];
}

export function getWithoutApiTemplateLabel(pdfTemplate: number): string {
  return WITHOUT_API_TEMPLATE_LABELS[pdfTemplate] || WITHOUT_API_TEMPLATE_LABELS[1];
}
