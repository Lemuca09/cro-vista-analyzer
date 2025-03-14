
import React, { useState } from 'react';
import { HeatmapFile } from '@/utils/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { FileText, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeatmapViewerProps {
  heatmaps: HeatmapFile[];
  selectedHeatmapType?: string;
  onSelectHeatmapType?: (type: string) => void;
}

const HeatmapViewer: React.FC<HeatmapViewerProps> = ({ 
  heatmaps,
  selectedHeatmapType,
  onSelectHeatmapType 
}) => {
  const [activeTab, setActiveTab] = useState(selectedHeatmapType || 'scroll');
  const [viewMode, setViewMode] = useState<'image' | 'analysis'>('image');
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (onSelectHeatmapType) {
      onSelectHeatmapType(value);
    }
  };
  
  // Find the heatmaps that have been uploaded
  const uploadedHeatmaps = heatmaps.filter(h => h.imageUrl);
  
  if (uploadedHeatmaps.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center animate-fade-in">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <h3 className="mt-4 text-lg font-semibold text-slate-900">No heatmaps uploaded</h3>
          <p className="mt-2 text-sm text-slate-500">
            Upload heatmaps to start analyzing your user behavior data.
          </p>
        </div>
      </div>
    );
  }
  
  const activeHeatmap = uploadedHeatmaps.find(h => h.type === activeTab);
  
  return (
    <div className="bg-white rounded-lg border overflow-hidden animate-fade-in">
      <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
        <div className="border-b px-3">
          <TabsList className="h-12">
            {uploadedHeatmaps.map((heatmap) => (
              <TabsTrigger
                key={heatmap.type}
                value={heatmap.type}
                className={cn(
                  "data-[state=active]:bg-white data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-slate-900 rounded-none px-4",
                  "transition-all duration-200"
                )}
              >
                {heatmap.type.charAt(0).toUpperCase() + heatmap.type.slice(1)} Map
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        {uploadedHeatmaps.map((heatmap) => (
          <TabsContent 
            key={heatmap.type}
            value={heatmap.type}
            className="mt-0 focus-visible:outline-none focus-visible:ring-0 focus:outline-none"
          >
            {viewMode === 'image' ? (
              <div className="p-0">
                <img
                  src={heatmap.imageUrl!}
                  alt={`${heatmap.type} heatmap`}
                  className="w-full h-auto max-h-[500px] object-contain"
                />
              </div>
            ) : (
              <div className="p-6 max-h-[500px] overflow-y-auto">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  {heatmap.type.charAt(0).toUpperCase() + heatmap.type.slice(1)} Heatmap Analysis
                </h3>
                <div className="prose prose-slate text-slate-600 max-w-none">
                  {heatmap.analysisText ? (
                    heatmap.analysisText.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 leading-relaxed">{paragraph.trim()}</p>
                    ))
                  ) : (
                    <p className="text-slate-500 italic">No analysis available for this heatmap.</p>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        ))}
        
        {/* View mode toggle buttons moved to bottom */}
        <div className="border-t py-3 px-4 flex justify-center">
          <div className="flex space-x-4">
            <Button
              onClick={() => setViewMode('image')}
              variant={viewMode === 'image' ? "default" : "outline"}
              size="lg"
              className={cn(
                "transition-all duration-200 w-36",
                viewMode === 'image' ? "bg-purple-600 hover:bg-purple-700 text-white" : ""
              )}
            >
              <FileImage className="h-5 w-5 mr-2" />
              Heatmap
            </Button>
            <Button
              onClick={() => setViewMode('analysis')}
              variant={viewMode === 'analysis' ? "default" : "outline"}
              size="lg"
              className={cn(
                "transition-all duration-200 w-36",
                viewMode === 'analysis' ? "bg-purple-600 hover:bg-purple-700 text-white" : ""
              )}
            >
              <FileText className="h-5 w-5 mr-2" />
              Analysis
            </Button>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default HeatmapViewer;
