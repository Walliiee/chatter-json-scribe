
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalysisResult } from '@/types/conversation';

interface SummaryCardsProps {
  analysisResult: AnalysisResult;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ analysisResult }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total Conversations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{analysisResult.totalConversations}</div>
          <p className="text-xs text-gray-500 mt-1">Number of conversation threads analyzed</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total Turns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{analysisResult.totalTurns}</div>
          <p className="text-xs text-gray-500 mt-1">Total back-and-forth exchanges</p>
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
          <p className="text-xs text-gray-500 mt-1">Average conversation length</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
