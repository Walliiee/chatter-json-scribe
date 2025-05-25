
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FileUpload from '@/components/FileUpload';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import DataTable from '@/components/DataTable';
import { ConversationAnalyzer } from '@/utils/ConversationAnalyzer';
import { AnalysisResult } from '@/types/conversation';
import { BarChart3, FileJson, Upload, AlertCircle } from 'lucide-react';

const Index = () => {
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleFileUpload = async (data: any[]) => {
    console.log('File uploaded:', data);
    setUploadedData(data);
    setIsAnalyzing(true);
    setAnalysisError(null);
    
    // Analyze the data with better error handling
    try {
      console.log('Starting analysis of', data.length, 'items...');
      const result = ConversationAnalyzer.analyzeConversations(data);
      console.log('Analysis completed successfully:', result);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error analyzing conversations:', error);
      setAnalysisError(error instanceof Error ? error.message : 'Unknown analysis error');
      // Still show dashboard with empty results for debugging
      setAnalysisResult({
        totalConversations: 0,
        totalTurns: 0,
        averageTurnsPerConversation: 0,
        categories: { main: {}, sub: {} },
        sentimentDistribution: { positive: 0, negative: 0, neutral: 0 },
        topTopics: [],
        userEngagement: {
          veryShortResponses: 0,
          shortResponses: 0,
          mediumResponses: 0,
          longResponses: 0,
          veryLongResponses: 0,
          extremelyLongResponses: 0,
          massiveResponses: 0,
          topFiveLongest: []
        }
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Show dashboard if we have uploaded data, regardless of analysis success
  const showDashboard = uploadedData.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Conversation Analyzer
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Upload and analyze your JSON conversational AI data with powerful insights and categorization
          </p>
        </div>

        {/* Upload Section */}
        {!uploadedData.length && (
          <div className="max-w-2xl mx-auto mb-8">
            <FileUpload onFileUpload={handleFileUpload} />
            
            {/* Format Examples */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileJson className="w-5 h-5" />
                  <span>Supported JSON Formats</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700 mb-2">Format 1: Array of conversations</p>
                    <pre className="bg-gray-100 p-3 rounded overflow-x-auto">
{`[
  {
    "id": "conv_1",
    "messages": [
      {"role": "user", "content": "Hello!"},
      {"role": "assistant", "content": "Hi there!"}
    ]
  }
]`}
                    </pre>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 mb-2">Format 2: Single conversation object</p>
                    <pre className="bg-gray-100 p-3 rounded overflow-x-auto">
{`{
  "conversation": [
    {"role": "user", "content": "How are you?"},
    {"role": "assistant", "content": "I'm doing well!"}
  ]
}`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analysis Status */}
        {isAnalyzing && (
          <div className="max-w-2xl mx-auto mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" />
                  <span className="text-lg">Analyzing {uploadedData.length} items...</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analysis Error */}
        {analysisError && (
          <div className="max-w-2xl mx-auto mb-6">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                  <div>
                    <p className="text-red-800 font-medium">Analysis Error</p>
                    <p className="text-red-700 text-sm">{analysisError}</p>
                    <p className="text-red-600 text-xs mt-1">Dashboard will show with limited data for debugging.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Debug Information */}
        {uploadedData.length > 0 && (
          <div className="max-w-2xl mx-auto mb-6">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <h3 className="font-medium text-blue-800 mb-2">Debug Information</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>• Uploaded items: {uploadedData.length}</p>
                  <p>• Analysis result: {analysisResult ? 'Available' : 'Not available'}</p>
                  {analysisResult && (
                    <>
                      <p>• Conversations found: {analysisResult.totalConversations}</p>
                      <p>• Total turns: {analysisResult.totalTurns}</p>
                      <p>• Categories: {Object.keys(analysisResult.categories.main).length}</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analysis Results */}
        {showDashboard && (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setUploadedData([]);
                    setAnalysisResult(null);
                    setAnalysisError(null);
                  }}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload New File</span>
                </button>
              </div>
            </div>

            {/* Tabs for different views */}
            <Tabs defaultValue="analytics" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="analytics" className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Analytics Dashboard</span>
                </TabsTrigger>
                <TabsTrigger value="data" className="flex items-center space-x-2">
                  <FileJson className="w-4 h-4" />
                  <span>Raw Data</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="analytics" className="mt-6">
                {analysisResult ? (
                  <AnalyticsDashboard analysisResult={analysisResult} />
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Analysis Failed</h3>
                      <p className="text-gray-600">
                        Unable to process the uploaded data. Please check the format and try again.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="data" className="mt-6">
                <DataTable data={uploadedData} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
