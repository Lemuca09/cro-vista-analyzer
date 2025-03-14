
// Heatmap types
export type HeatmapType = 'scroll' | 'click' | 'attention';

export interface HeatmapFile {
  id: string;
  type: HeatmapType;
  file: File | null;
  imageUrl: string | null;
  analyzed: boolean;
  analysisText?: string;
}

// KPI types
export type KpiType = 
  | 'engagement' 
  | 'primaryCta' 
  | 'secondaryCta' 
  | 'contact';

export const KpiLabels: Record<KpiType, string> = {
  engagement: 'Engagement Rate',
  primaryCta: 'Primary CTA Button Click',
  secondaryCta: 'Secondary CTA Button Click',
  contact: 'Contact Rate'
};

// UX Optimization Category types
export type UxCategoryType = 
  | 'clarity' 
  | 'orientation' 
  | 'usability' 
  | 'persuasion' 
  | 'trust';

export const UxCategoryLabels: Record<UxCategoryType, string> = {
  clarity: 'Clarity',
  orientation: 'Orientation',
  usability: 'Usability',
  persuasion: 'Persuasion',
  trust: 'Trust & Credibility'
};

export const UxCategoryDescriptions: Record<UxCategoryType, string> = {
  clarity: 'Improving content comprehension, reducing ambiguity',
  orientation: 'Enhancing navigation and guidance',
  usability: 'Fixing friction points to streamline user actions',
  persuasion: 'Strengthening value propositions and nudges',
  trust: 'Reinforcing confidence through design and content'
};

// Priority levels
export type PriorityLevel = 'high' | 'medium' | 'low';

// Experiment recommendation interface
export interface ExperimentRecommendation {
  id: string;
  title: string;
  description: string;
  uxCategory: UxCategoryType;
  kpi: KpiType;
  priority: PriorityLevel;
  heatmapReference: HeatmapType;
  conflictingSignals?: boolean;
}

// Analysis overview interface
export interface AnalysisOverview {
  insightsCount: number;
  highPriorityCount: number;
  topUxCategory: UxCategoryType;
  topKpi: KpiType;
  conflictingSignalsCount: number;
}
