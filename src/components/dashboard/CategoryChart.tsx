
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { AnalysisResult } from '@/types/conversation';

interface CategoryChartProps {
  analysisResult: AnalysisResult;
}

const CategoryChart: React.FC<CategoryChartProps> = ({ analysisResult }) => {
  const mainCategoryData = Object.entries(analysisResult.categories.main).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Primary Topic Categories</span>
          <Info className="w-4 h-4 text-gray-400" />
        </CardTitle>
        <p className="text-sm text-gray-600">
          High-level categorization of conversations by primary subject matter
        </p>
      </CardHeader>
      <CardContent>
        {mainCategoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mainCategoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No conversations have been categorized yet. Upload data to see categories.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryChart;
