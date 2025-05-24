
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { AnalysisResult } from '@/types/conversation';

interface LongestMessagesProps {
  analysisResult: AnalysisResult;
}

const LongestMessages: React.FC<LongestMessagesProps> = ({ analysisResult }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Longest Messages</span>
          <Info className="w-4 h-4 text-gray-400" />
        </CardTitle>
        <p className="text-sm text-gray-600">
          The five longest individual messages in your dataset
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {analysisResult.userEngagement.topFiveLongest.length > 0 ? (
            analysisResult.userEngagement.topFiveLongest.map((response, index) => (
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
            ))
          ) : (
            <div className="text-gray-500 text-center py-8">
              No message data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LongestMessages;
