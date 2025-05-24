
import React from 'react';
import { AnalysisResult } from '@/types/conversation';
import SummaryCards from './dashboard/SummaryCards';
import CategoryChart from './dashboard/CategoryChart';
import SubcategoryTreemap from './dashboard/SubcategoryTreemap';
import EngagementChart from './dashboard/EngagementChart';
import LongestMessages from './dashboard/LongestMessages';
import TopicsDisplay from './dashboard/TopicsDisplay';

interface AnalyticsDashboardProps {
  analysisResult: AnalysisResult;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ analysisResult }) => {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <SummaryCards analysisResult={analysisResult} />

      {/* Main Categories */}
      <CategoryChart analysisResult={analysisResult} />

      {/* Subcategories Treemap */}
      <SubcategoryTreemap analysisResult={analysisResult} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Length Distribution */}
        <EngagementChart analysisResult={analysisResult} />

        {/* Top 5 Longest Responses */}
        <LongestMessages analysisResult={analysisResult} />
      </div>

      {/* Top Topics */}
      <TopicsDisplay analysisResult={analysisResult} />
    </div>
  );
};

export default AnalyticsDashboard;
