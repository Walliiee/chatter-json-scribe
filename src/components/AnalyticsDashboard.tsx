
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalysisResult } from '@/types/conversation';

interface AnalyticsDashboardProps {
  analysisResult: AnalysisResult;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ analysisResult }) => {
  const categoryData = Object.entries(analysisResult.categories).map(([name, value]) => ({
    name,
    value
  }));

  const engagementData = [
    { name: 'Short (≤1K)', value: analysisResult.userEngagement.shortResponses },
    { name: 'Medium (1K-10K)', value: analysisResult.userEngagement.mediumResponses },
    { name: 'Long (10K-25K)', value: analysisResult.userEngagement.longResponses },
    { name: 'Very Long (25K-40K)', value: analysisResult.userEngagement.veryLongResponses },
    { name: 'Extremely Long (>40K)', value: analysisResult.userEngagement.extremelyLongResponses }
  ];

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

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6">
        {/* Categories Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Conversation Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts */}
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
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#82CA9D" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

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
    </div>
  );
};

export default AnalyticsDashboard;
