
import { ExperimentRecommendation, AnalysisOverview, HeatmapFile } from '@/utils/types';

export const initialHeatmaps: HeatmapFile[] = [
  {
    id: 'scroll-map',
    type: 'scroll',
    file: null,
    imageUrl: null,
    analyzed: false
  },
  {
    id: 'click-map',
    type: 'click',
    file: null,
    imageUrl: null,
    analyzed: false
  },
  {
    id: 'attention-map',
    type: 'attention',
    file: null,
    imageUrl: null,
    analyzed: false
  }
];

export const mockExperiments: ExperimentRecommendation[] = [
  {
    id: '1',
    title: 'Simplify above-fold messaging',
    description: 'Users are not scrolling past the hero section. Consider making the value proposition more compelling and clearer to encourage further exploration.',
    uxCategory: 'clarity',
    kpi: 'engagement',
    priority: 'high',
    heatmapReference: 'scroll'
  },
  {
    id: '2',
    title: 'Reposition primary CTA button',
    description: 'Click heatmap shows low interaction with the primary CTA. Consider moving it to a more prominent position within the area of highest attention focus.',
    uxCategory: 'usability',
    kpi: 'primaryCta',
    priority: 'high',
    heatmapReference: 'click'
  },
  {
    id: '3',
    title: 'Enhance social proof section',
    description: "Attention map indicates users briefly scan but don't engage with testimonials. Consider adding visual elements or reformatting to increase credibility.",
    uxCategory: 'trust',
    kpi: 'engagement',
    priority: 'medium',
    heatmapReference: 'attention'
  },
  {
    id: '4',
    title: 'Improve navigation contrast',
    description: "Click patterns suggest navigation menu items aren't receiving expected engagement. Test increased contrast and size to improve discoverability.",
    uxCategory: 'orientation',
    kpi: 'engagement',
    priority: 'medium',
    heatmapReference: 'click'
  },
  {
    id: '5',
    title: 'Add directional cues',
    description: 'Scroll depth drops significantly at mid-page. Add visual indicators or directional cues to guide users to continue scrolling to key content below.',
    uxCategory: 'orientation',
    kpi: 'engagement',
    priority: 'medium',
    heatmapReference: 'scroll',
    conflictingSignals: true
  },
  {
    id: '6',
    title: 'Streamline form fields',
    description: 'Attention map shows focus dropping off during form completion. Consider reducing the number of fields or breaking the form into steps.',
    uxCategory: 'usability',
    kpi: 'contact',
    priority: 'high',
    heatmapReference: 'attention'
  }
];

export const mockAnalysisOverview: AnalysisOverview = {
  insightsCount: 6,
  highPriorityCount: 3,
  topUxCategory: 'usability',
  topKpi: 'engagement',
  conflictingSignalsCount: 1
};
