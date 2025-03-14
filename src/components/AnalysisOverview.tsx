
import React from 'react';
import { 
  AnalysisOverview as AnalysisOverviewType,
  UxCategoryLabels,
  KpiLabels
} from '@/utils/types';
import { 
  Lightbulb,
  TrendingUp,
  AlertCircle,
  BarChart
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface AnalysisOverviewProps {
  overview: AnalysisOverviewType | null;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, description, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay }}
    className="bg-white rounded-lg border p-6 flex flex-col"
  >
    <div className="flex items-center mb-3">
      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mr-3">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-slate-700">{title}</h3>
    </div>
    <div className="text-3xl font-bold text-slate-900 mb-1">{value}</div>
    {description && (
      <p className="text-sm text-slate-500 mt-auto">{description}</p>
    )}
  </motion.div>
);

const AnalysisOverview: React.FC<AnalysisOverviewProps> = ({ overview }) => {
  if (!overview) {
    return null;
  }

  return (
    <AnimatePresence>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-900 mb-5">Analysis Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Insights"
            value={overview.insightsCount}
            icon={<Lightbulb className="h-5 w-5 text-amber-500" />}
            description="Actionable recommendations found"
            delay={0.1}
          />
          <StatCard
            title="High Priority"
            value={overview.highPriorityCount}
            icon={<TrendingUp className="h-5 w-5 text-red-500" />}
            description="Items needing immediate attention"
            delay={0.2}
          />
          <StatCard
            title="Top UX Category"
            value={UxCategoryLabels[overview.topUxCategory]}
            icon={<BarChart className="h-5 w-5 text-indigo-500" />}
            description="Most frequent improvement area"
            delay={0.3}
          />
          <StatCard
            title="Top KPI Impact"
            value={KpiLabels[overview.topKpi]}
            icon={<AlertCircle className="h-5 w-5 text-blue-500" />}
            description="Primary metric affected"
            delay={0.4}
          />
        </div>
      </div>
    </AnimatePresence>
  );
};

export default AnalysisOverview;
