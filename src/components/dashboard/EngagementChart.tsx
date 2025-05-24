
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { AnalysisResult } from '@/types/conversation';

interface EngagementChartProps {
  analysisResult: AnalysisResult;
}

const EngagementChart: React.FC<EngagementChartProps> = ({ analysisResult }) => {
  const engagementData = [
    { name: 'Very Short (<5K)', value: analysisResult.userEngagement.veryShortResponses },
    { name: 'Short (5K-15K)', value: analysisResult.userEngagement.shortResponses },
    { name: 'Medium (15K-30K)', value: analysisResult.userEngagement.mediumResponses },
    { name: 'Long (30K-50K)', value: analysisResult.userEngagement.longResponses },
    { name: 'Very Long (50K-75K)', value: analysisResult.userEngagement.veryLongResponses },
    { name: 'Extremely Long (75K-100K)', value: analysisResult.userEngagement.extremelyLongResponses },
    { name: 'Massive (>100K)', value: analysisResult.userEngagement.massiveResponses }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Message Length Distribution</span>
          <Info className="w-4 h-4 text-gray-400" />
        </CardTitle>
        <p className="text-sm text-gray-600">
          Distribution of all messages by character count
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={engagementData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#82CA9D" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default EngagementChart;
