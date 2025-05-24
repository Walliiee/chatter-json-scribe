
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Treemap, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalysisResult } from '@/types/conversation';

interface AnalyticsDashboardProps {
  analysisResult: AnalysisResult;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ analysisResult }) => {
  const mainCategoryData = Object.entries(analysisResult.categories.main).map(([name, value]) => ({
    name,
    value
  }));

  const engagementData = [
    { name: 'Very Short (<5K)', value: analysisResult.userEngagement.veryShortResponses },
    { name: 'Short (5K-15K)', value: analysisResult.userEngagement.shortResponses },
    { name: 'Medium (15K-30K)', value: analysisResult.userEngagement.mediumResponses },
    { name: 'Long (30K-50K)', value: analysisResult.userEngagement.longResponses },
    { name: 'Very Long (50K-75K)', value: analysisResult.userEngagement.veryLongResponses },
    { name: 'Extremely Long (75K-100K)', value: analysisResult.userEngagement.extremelyLongResponses },
    { name: 'Massive (>100K)', value: analysisResult.userEngagement.massiveResponses }
  ];

  // Prepare treemap data for subcategories
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
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{analysisResult.totalConversations}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Turns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{analysisResult.totalTurns}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Turns/Conversation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {analysisResult.averageTurnsPerConversation.toFixed(1)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Main Conversation Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mainCategoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Subcategories Treemap */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Length Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Response Length Distribution</CardTitle>
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

        {/* Top 5 Longest Responses */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Longest Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {analysisResult.userEngagement.topFiveLongest.map((response, index) => (
                <div key={index} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                    <span className="text-sm text-gray-600 font-mono">
                      {response.length.toLocaleString()} chars
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 mb-1">
                    Conversation: {response.conversationId}
                  </p>
                  <p className="text-sm text-gray-800 italic">
                    "{response.excerpt}"
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Topics */}
      <Card>
        <CardHeader>
          <CardTitle>Top Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {analysisResult.topTopics.slice(0, 15).map((topic, index) => (
              <div key={topic.topic} className="flex items-center justify-between">
                <span className="text-sm font-medium capitalize">{topic.topic}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ 
                        width: `${Math.min((topic.frequency / Math.max(...analysisResult.topTopics.map(t => t.frequency))) * 100, 100)}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">{topic.frequency}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
