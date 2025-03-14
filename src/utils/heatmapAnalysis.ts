
import { v4 as uuidv4 } from 'uuid';
import { 
  HeatmapFile, 
  ExperimentRecommendation, 
  AnalysisOverview, 
  UxCategoryType, 
  KpiType 
} from './types';
import { supabase } from "@/integrations/supabase/client";

// Function to generate AI-powered analysis text for a heatmap using GPT-4o-mini
export const generateHeatmapAnalysis = async (heatmap: HeatmapFile): Promise<string> => {
  try {
    // If we're in development or testing mode and no image is provided, use mock data
    if (!heatmap.imageUrl) {
      return getMockAnalysis(heatmap.type);
    }

    // Create a textual description based on the heatmap type for the AI to analyze
    const imageDescription = getImageDescription(heatmap.type);
    
    // Call the Supabase Edge Function to analyze the heatmap
    const { data, error } = await supabase.functions.invoke('analyze-heatmap', {
      body: {
        heatmapType: heatmap.type,
        imageDescription
      }
    });

    if (error) {
      console.error('Error calling analyze-heatmap function:', error);
      throw error;
    }

    if (!data?.analysisText) {
      throw new Error('No analysis text returned from API');
    }

    return data.analysisText;
  } catch (error) {
    console.error('Error generating heatmap analysis:', error);
    // Fallback to mock data if the API call fails
    return getMockAnalysis(heatmap.type);
  }
};

// Helper function to generate descriptions for different heatmap types
const getImageDescription = (type: string): string => {
  if (type === 'scroll') {
    return "A scroll depth heatmap showing high engagement (80-100%) in the top 30% of the page, moderate engagement (40-60%) in the middle section, and very low engagement (0-20%) in the bottom third of the page. There's a significant drop-off point around 65% down the page where user engagement sharply declines.";
  }
  
  if (type === 'click') {
    return "A click heatmap showing concentrated clicking activity in the top navigation bar (35% of clicks), scattered clicks around product images in the center (25% of clicks), some interaction with secondary navigation elements (15% of clicks), minimal engagement with the primary CTA button despite its prominent position (only 8% of clicks), and a noticeable pattern of clicks on non-clickable elements near important content.";
  }
  
  if (type === 'attention') {
    return "An attention heatmap showing intense focus on the hero headline and main image (45% of attention), moderate focus on the first paragraph of text (20% of attention), brief engagement with testimonial avatars but not the text (10% of attention), minimal visual engagement with the feature comparison table (5% of attention), and almost no attention to the bottom third of the page where additional product benefits are displayed.";
  }
  
  return "A heatmap showing user interaction patterns across the webpage with varying levels of engagement in different sections.";
};

// Function to provide mock analysis for fallback or testing
const getMockAnalysis = (type: string): string => {
  if (type === 'scroll') {
    return `The scroll heatmap reveals a significant drop-off in user engagement at approximately 60% down the page. This indicates that a large portion of visitors are not reaching key content in the lower sections, including product features and testimonials. The highest engagement is concentrated in the hero section and navigation area, with a gradual decline as users scroll further.

    Notable engagement patterns show that users who do scroll past the 60% threshold tend to continue to the bottom of the page, suggesting that the mid-page content may be creating a conversion barrier. The footer area shows modest interaction levels, indicating that some users are specifically looking for information typically found there (contact, legal, etc.). The most critical finding is that the product demonstration section in the middle of the page is receiving minimal exposure.`;
  }
  
  if (type === 'click') {
    return `Click pattern analysis reveals that users are primarily interacting with the navigation menu and secondary call-to-action buttons, while the primary conversion buttons are receiving significantly less attention than optimal. The highest concentration of clicks appears in the top navigation bar and on illustrative elements that aren't actually clickable, suggesting potential user confusion or misaligned visual hierarchy.

    The data shows scattered click attempts in blank spaces near important content, indicating that users are searching for interactive elements that may not be clearly signposted. Multiple clicks on the same elements suggest users may be unsure if their initial clicks registered. Particularly concerning is the low click-through rate on the primary CTA despite its prominent size and position, suggesting issues with either the offer's perceived value or the button's visibility against its surrounding elements.`;
  }
  
  if (type === 'attention') {
    return `The attention heatmap indicates that users are spending the majority of their focus time on the headline and hero image, with secondary focus on the first paragraph of descriptive text. There is a noticeable drop in attention for elements below the fold, particularly for the feature comparison section which receives minimal visual engagement despite its importance in the conversion journey.

    Eye movement patterns show users scanning the page in an F-shaped pattern, with particular focus on the left side of content blocks and the beginning of paragraphs. Users appear to be spending significant time on testimonial avatars but minimal time reading the actual testimonial text, suggesting the social proof is being recognized but not fully processed. The pricing section receives brief attention spikes but limited sustained focus, indicating users may be price-checking without deeply engaging with the value propositions that contextualize the pricing.`;
  }
  
  return "No analysis available for this heatmap type.";
};

// Function to analyze a single heatmap and return experiment recommendations
export const analyzeHeatmap = (heatmap: HeatmapFile): ExperimentRecommendation[] => {
  // This is where actual AI logic would go
  // For now, we'll return mock recommendations based on heatmap type
  
  const recommendations: ExperimentRecommendation[] = [];
  
  if (heatmap.type === 'scroll') {
    recommendations.push({
      id: uuidv4(),
      title: 'Improve content hierarchy for scroll depth',
      description: 'Scroll heatmap shows significant drop-off at 60% of the page. Restructure content to place high-value information earlier or add visual cues to encourage continued scrolling.',
      uxCategory: 'orientation',
      kpi: 'engagement',
      priority: 'high',
      heatmapReference: 'scroll'
    });
    recommendations.push({
      id: uuidv4(),
      title: 'Enhance mid-page value proposition',
      description: 'Few users scroll to the middle section where key benefits are highlighted. Consider moving this content up or creating a more compelling visual flow.',
      uxCategory: 'persuasion',
      kpi: 'engagement',
      priority: 'medium',
      heatmapReference: 'scroll'
    });
  }
  
  if (heatmap.type === 'click') {
    recommendations.push({
      id: uuidv4(),
      title: 'Redesign CTA button for better visibility',
      description: 'Click heatmap reveals users are missing the primary CTA. Test a larger button with higher contrast against the surrounding elements.',
      uxCategory: 'clarity',
      kpi: 'primaryCta',
      priority: 'high',
      heatmapReference: 'click'
    });
    recommendations.push({
      id: uuidv4(),
      title: 'Reduce competing clickable elements',
      description: 'Multiple elements near the primary CTA are receiving clicks. Simplify this area to direct attention to the main conversion action.',
      uxCategory: 'usability',
      kpi: 'primaryCta',
      priority: 'medium',
      heatmapReference: 'click'
    });
  }
  
  if (heatmap.type === 'attention') {
    recommendations.push({
      id: uuidv4(),
      title: 'Optimize headline clarity and impact',
      description: 'Attention heatmap shows users focusing on headlines but quickly moving on. Test more compelling, benefit-driven headlines to increase engagement.',
      uxCategory: 'clarity',
      kpi: 'engagement',
      priority: 'medium',
      heatmapReference: 'attention'
    });
    recommendations.push({
      id: uuidv4(),
      title: 'Enhance social proof presentation',
      description: 'Low attention to testimonial section despite position. Redesign with stronger visual elements and more concise quotes to build trust.',
      uxCategory: 'trust',
      kpi: 'secondaryCta',
      priority: 'medium',
      heatmapReference: 'attention'
    });
  }
  
  return recommendations;
};

// Function to analyze all heatmaps and identify patterns/conflicts
export const analyzeAllHeatmaps = async (heatmaps: HeatmapFile[]): Promise<{
  recommendations: ExperimentRecommendation[],
  overview: AnalysisOverview,
  analyzedHeatmaps: HeatmapFile[]
}> => {
  let allRecommendations: ExperimentRecommendation[] = [];
  let analyzedHeatmaps = [...heatmaps];
  
  // Only process heatmaps that have been uploaded
  const heatmapsToAnalyze = heatmaps.filter(h => h.imageUrl);
  
  // Generate analysis text for each heatmap
  for (const heatmap of heatmapsToAnalyze) {
    if (!heatmap.analysisText) {
      const analysisText = await generateHeatmapAnalysis(heatmap);
      
      // Update the heatmap in our local array
      analyzedHeatmaps = analyzedHeatmaps.map(h => 
        h.id === heatmap.id ? { ...h, analyzed: true, analysisText } : h
      );
      
      // Generate recommendations for this heatmap
      const heatmapRecommendations = analyzeHeatmap({...heatmap, analyzed: true, analysisText});
      allRecommendations = [...allRecommendations, ...heatmapRecommendations];
    } else {
      // Heatmap already has analysis, just generate recommendations
      const heatmapRecommendations = analyzeHeatmap(heatmap);
      allRecommendations = [...allRecommendations, ...heatmapRecommendations];
    }
  }
  
  // Identify potential conflicts (in a real implementation this would be more sophisticated)
  const enhancedRecommendations = identifyConflicts(allRecommendations);
  
  // Generate overview metrics
  const overview = generateOverview(enhancedRecommendations);
  
  return {
    recommendations: enhancedRecommendations,
    overview,
    analyzedHeatmaps
  };
};

// Function to identify conflicting recommendations
const identifyConflicts = (recommendations: ExperimentRecommendation[]): ExperimentRecommendation[] => {
  // This is a simplified version. In reality, this would use more complex logic
  // to detect actual conflicts between recommendations.
  
  // For now, we'll just randomly mark one recommendation as having conflicts
  if (recommendations.length > 3) {
    const randomIndex = Math.floor(Math.random() * recommendations.length);
    return recommendations.map((rec, index) => {
      if (index === randomIndex) {
        return { ...rec, conflictingSignals: true };
      }
      return rec;
    });
  }
  
  return recommendations;
};

// Function to generate analysis overview
const generateOverview = (recommendations: ExperimentRecommendation[]): AnalysisOverview => {
  const highPriorityCount = recommendations.filter(r => r.priority === 'high').length;
  const conflictingSignalsCount = recommendations.filter(r => r.conflictingSignals).length;
  
  // Count occurrences of each UX category and KPI
  const uxCategoryCounts: Record<UxCategoryType, number> = {
    clarity: 0,
    orientation: 0,
    usability: 0,
    persuasion: 0,
    trust: 0
  };
  
  const kpiCounts: Record<KpiType, number> = {
    engagement: 0,
    primaryCta: 0,
    secondaryCta: 0,
    contact: 0
  };
  
  recommendations.forEach(rec => {
    uxCategoryCounts[rec.uxCategory]++;
    kpiCounts[rec.kpi]++;
  });
  
  // Find the most common UX category and KPI
  let topUxCategory: UxCategoryType = 'usability';
  let topKpi: KpiType = 'engagement';
  
  let maxUxCount = 0;
  let maxKpiCount = 0;
  
  (Object.entries(uxCategoryCounts) as [UxCategoryType, number][]).forEach(([category, count]) => {
    if (count > maxUxCount) {
      maxUxCount = count;
      topUxCategory = category;
    }
  });
  
  (Object.entries(kpiCounts) as [KpiType, number][]).forEach(([kpi, count]) => {
    if (count > maxKpiCount) {
      maxKpiCount = count;
      topKpi = kpi;
    }
  });
  
  return {
    insightsCount: recommendations.length,
    highPriorityCount,
    topUxCategory,
    topKpi,
    conflictingSignalsCount
  };
};
