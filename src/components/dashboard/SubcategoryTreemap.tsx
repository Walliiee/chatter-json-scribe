
import React from 'react';
import { Treemap, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { AnalysisResult } from '@/types/conversation';

interface SubcategoryTreemapProps {
  analysisResult: AnalysisResult;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

const SubcategoryTreemap: React.FC<SubcategoryTreemapProps> = ({ analysisResult }) => {
  const treemapData = Object.entries(analysisResult.categories.sub).flatMap(([mainCategory, subCats]) =>
    Object.entries(subCats)
      .filter(([_, count]) => count > 0)
      .map(([subCategory, count]) => ({
        name: `${mainCategory}: ${subCategory}`,
        value: count,
        mainCategory
      }))
  ).sort((a, b) => b.value - a.value);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p className="text-blue-600">{`Count: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Detailed Topic Breakdown</span>
          <Info className="w-4 h-4 text-gray-400" />
        </CardTitle>
        <p className="text-sm text-gray-600">
          Granular view of conversation topics with relative sizing by frequency
        </p>
      </CardHeader>
      <CardContent>
        {treemapData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <Treemap
              data={treemapData}
              dataKey="value"
              aspectRatio={4/3}
              stroke="#fff"
              fill="#8884d8"
            >
              {treemapData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
              <Tooltip content={<CustomTooltip />} />
            </Treemap>
          </ResponsiveContainer>
        ) : (
          <div className="h-[400px] flex items-center justify-center text-gray-500">
            No detailed categories available. Upload more data to see breakdown.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubcategoryTreemap;
