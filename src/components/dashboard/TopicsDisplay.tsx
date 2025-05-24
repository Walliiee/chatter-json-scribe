
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { AnalysisResult } from '@/types/conversation';

interface TopicsDisplayProps {
  analysisResult: AnalysisResult;
}

const TopicsDisplay: React.FC<TopicsDisplayProps> = ({ analysisResult }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Most Frequent Topics</span>
          <Info className="w-4 h-4 text-gray-400" />
        </CardTitle>
        <p className="text-sm text-gray-600">
          Keywords and terms that appear most frequently across all conversations
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
          {analysisResult.topTopics.length > 0 ? (
            analysisResult.topTopics.slice(0, 15).map((topic, index) => (
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
            ))
          ) : (
            <div className="text-gray-500 text-center py-8">
              No topics extracted yet. Upload conversation data to see topics.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopicsDisplay;
