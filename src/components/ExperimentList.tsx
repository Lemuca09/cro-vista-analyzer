
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ExperimentRecommendation,
  UxCategoryType,
  KpiType,
  UxCategoryLabels,
  KpiLabels,
  HeatmapType
} from '@/utils/types';
import PriorityBadge from './PriorityBadge';
import { 
  BarChart3, 
  MousePointer, 
  Eye, 
  AlertCircle, 
  SlidersHorizontal,
  ArrowRight
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';

interface ExperimentListProps {
  experiments: ExperimentRecommendation[];
  onSelectHeatmapType?: (type: HeatmapType) => void;
}

const ExperimentList: React.FC<ExperimentListProps> = ({ 
  experiments,
  onSelectHeatmapType
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterKpi, setFilterKpi] = useState<string>('all');
  
  const handleCategoryChange = (value: string) => {
    setFilterCategory(value);
  };
  
  const handleKpiChange = (value: string) => {
    setFilterKpi(value);
  };
  
  const filteredExperiments = experiments.filter(exp => {
    const categoryMatch = filterCategory === 'all' || exp.uxCategory === filterCategory;
    const kpiMatch = filterKpi === 'all' || exp.kpi === filterKpi;
    return categoryMatch && kpiMatch;
  });
  
  const heatmapIcons: Record<HeatmapType, React.ReactNode> = {
    scroll: <BarChart3 className="h-4 w-4" />,
    click: <MousePointer className="h-4 w-4" />,
    attention: <Eye className="h-4 w-4" />
  };
  
  const handleExperimentClick = (heatmapType: HeatmapType) => {
    if (onSelectHeatmapType) {
      onSelectHeatmapType(heatmapType);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-slate-900">
          Recommended Experiments
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Select value={filterCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {(Object.entries(UxCategoryLabels) as [UxCategoryType, string][]).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filterKpi} onValueChange={handleKpiChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by KPI" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All KPIs</SelectItem>
              {(Object.entries(KpiLabels) as [KpiType, string][]).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredExperiments.length === 0 ? (
        <div className="bg-white rounded-lg border p-6 text-center">
          <SlidersHorizontal className="h-12 w-12 mx-auto text-slate-300" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">No matching experiments</h3>
          <p className="mt-2 text-sm text-slate-500">
            Try adjusting your filters to see more results.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredExperiments.map((experiment, index) => (
            <motion.div 
              key={experiment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={cn(
                "bg-white rounded-lg border shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md",
                experiment.conflictingSignals ? "border-amber-200" : "border-slate-200"
              )}
            >
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {UxCategoryLabels[experiment.uxCategory]}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {KpiLabels[experiment.kpi]}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg text-slate-900">{experiment.title}</h3>
                  </div>
                  <PriorityBadge priority={experiment.priority} />
                </div>
                
                <p className="mt-3 text-slate-600 text-sm">{experiment.description}</p>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <button
                      onClick={() => handleExperimentClick(experiment.heatmapReference)}
                      className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      <span className="flex items-center text-slate-500 mr-1.5">
                        {heatmapIcons[experiment.heatmapReference]}
                      </span>
                      Based on {experiment.heatmapReference} data
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </button>
                  </div>
                  
                  {experiment.conflictingSignals && (
                    <div className="flex items-center text-amber-600 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span>Conflicting signals detected</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperimentList;
