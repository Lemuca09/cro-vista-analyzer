
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { motion } from 'framer-motion';
import { HeatmapFile, ExperimentRecommendation, AnalysisOverview, HeatmapType } from '@/utils/types';
import { initialHeatmaps } from '@/lib/mockData';
import HeatmapUploader from '@/components/HeatmapUploader';
import HeatmapViewer from '@/components/HeatmapViewer';
import ExperimentList from '@/components/ExperimentList';
import AnalysisOverviewComponent from '@/components/AnalysisOverview';
import { analyzeAllHeatmaps } from '@/utils/heatmapAnalysis';
import { Button } from '@/components/ui/button';
import {  ChevronRight, ArrowRight, BrainCircuit, BarChart3, LineChart, PieChart, Table  } from 'lucide-react';

const Index = () => {
  const [heatmaps, setHeatmaps] = useState<HeatmapFile[]>(initialHeatmaps);
  const [recommendations, setRecommendations] = useState<ExperimentRecommendation[]>([]);
  const [overview, setOverview] = useState<AnalysisOverview | null>(null);
  const [activeHeatmapType, setActiveHeatmapType] = useState<HeatmapType>('scroll');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  
  const handleHeatmapUpdate = (updatedHeatmap: HeatmapFile) => {
    setHeatmaps(prevHeatmaps => 
      prevHeatmaps.map(heatmap => 
        heatmap.id === updatedHeatmap.id ? updatedHeatmap : heatmap
      )
    );
    
    // If a new heatmap is uploaded, set it as active
    if (updatedHeatmap.imageUrl) {
      setActiveHeatmapType(updatedHeatmap.type);
    }
    
    // Reset analysis results when heatmaps change
    if (hasAnalyzed) {
      setRecommendations([]);
      setOverview(null);
      setHasAnalyzed(false);
    }
  };
  
  const handleAnalyze = async () => {
    const uploadedHeatmaps = heatmaps.filter(h => h.imageUrl);
    
    if (uploadedHeatmaps.length === 0) {
      toast.error("Please upload at least one heatmap before analyzing");
      return;
    }
    
    setIsAnalyzing(true);
    toast.info("Analyzing heatmaps with GPT-4o-mini...", { duration: 2000 });
    
    try {
      // Since analyzeAllHeatmaps is now async, we need to await it
      const { recommendations, overview, analyzedHeatmaps } = await analyzeAllHeatmaps(heatmaps);
      setRecommendations(recommendations);
      setOverview(overview);
      setHeatmaps(analyzedHeatmaps); // Update heatmaps with analysis text
      setHasAnalyzed(true);
      toast.success(`Analysis complete: ${recommendations.length} recommendations found`);
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("An error occurred during analysis");
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleHeatmapSelect = (type: HeatmapType) => {
    setActiveHeatmapType(type);
  };
  
  // Ensure we show heatmaps that have been uploaded
  const uploadedHeatmaps = heatmaps.filter(h => h.imageUrl);
  const hasUploadedHeatmaps = uploadedHeatmaps.length > 0;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      {/* <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">CRO Vista Analyzer</h1>
              <p className="text-slate-500 mt-1">Turn heatmap data into actionable CRO experiments</p>
            </div>
          </div>
        </div>
      </div> */}
      <div className="container mx-auto px-4 py-12">
          <header className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <span>CRO Analytics</span>
              <ChevronRight className="h-4 w-4" />
              <span>Data-Driven Insights</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              CRO Data Analysis Tool
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload your analytics data and get actionable insights to improve your conversion rates.
            </p>
          </header>

        <div className="max-w-screen-lg mx-auto mb-16 grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-up">
          {[
            { icon: <BarChart3 className="h-6 w-6" />, label: "Traffic Analysis" },
            { icon: <LineChart className="h-6 w-6" />, label: "Event Tracking" },
            { icon: <PieChart className="h-6 w-6" />, label: "Conversion Insights" },
            { icon: <Table className="h-6 w-6" />, label: "User Journeys" },
          ].map((feature, index) => (
            <div 
              key={index}
              className="glass-panel rounded-xl p-4 text-center flex flex-col items-center justify-center shadow-lg"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-3 bg-primary/10 text-primary rounded-full mb-3">
                {feature.icon}
              </div>
              <span className="text-sm font-medium">{feature.label}</span>
            </div>
          ))}
        </div>

        {/* <section className="mb-20">
          <Dashboard />
        </section>
         */}

         
        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="space-y-8">
            <h2 className='mt-3 flex justify-right text-1xl md:text-1xl lg:text-4xl font-bold tracking-tight mb-1'>Input your data</h2>
            {/* Heatmap uploaders */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {heatmaps.map((heatmap) => (
                  <motion.div
                    key={heatmap.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className='shadow-lg rounded-xl bg-white'
                  >
                    <HeatmapUploader 
                      heatmap={heatmap}
                      onUpdate={handleHeatmapUpdate}
                    />
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-center">
                <Button
                  size="lg"
                  onClick={handleAnalyze}
                  disabled={!hasUploadedHeatmaps || isAnalyzing}
                  className="transition-all duration-300 group"
                >
                  {isAnalyzing ? (
                    <>
                      <BrainCircuit className="mr-2 h-5 w-5 animate-pulse" />
                      Analyzing Heatmaps with AI...
                    </>
                  ) : (
                    <>
                      <BrainCircuit className="mr-2 h-5 w-5" />
                      Analyze Heatmaps
                      <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {/* Analysis results */}
            {hasAnalyzed && (
              <>
                {/* Overview */}
                <AnalysisOverviewComponent overview={overview} />
                
                {/* Heatmap viewer and experiments */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <HeatmapViewer 
                      heatmaps={heatmaps}
                      selectedHeatmapType={activeHeatmapType}
                      onSelectHeatmapType={handleHeatmapSelect}
                    />
                  </div>
                  
                  <div className="lg:col-span-3">
                    <ExperimentList 
                      experiments={recommendations}
                      onSelectHeatmapType={handleHeatmapSelect}
                    />
                  </div>
                </div>
              </>
            )}
            
            <footer className="text-center text-sm text-muted-foreground pt-8 pb-12 border-t animate-fade-in">
              <div className="max-w-md mx-auto">
                <p>
                  Upload and analyze your CRO data from Google Analytics to uncover insights and improve conversion rates.
                </p>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
