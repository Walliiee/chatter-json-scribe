
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { AnalysisResult } from '@/types/conversation';

interface CategoryChartProps {
  analysisResult: AnalysisResult;
}

const CategoryChart: React.FC<CategoryChartProps> = ({ analysisResult }) => {
  // Add safety checks and better error handling
  const mainCategories = analysisResult?.categories?.main ?? {};
  const mainCategoryData = Object.entries(mainCategories).map(([name, value]) => ({
    name,
    value: Number(value) || 0
  }));

  console.log('CategoryChart - Main categories:', mainCategories);
  console.log('CategoryChart - Chart data:', mainCategoryData);

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
            <div className="text-center">
              <p className="text-lg font-medium mb-2">No categories found</p>
              <p className="text-sm">The uploaded data may not contain categorizable content.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryChart;
