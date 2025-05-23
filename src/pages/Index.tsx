
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FileUpload from '@/components/FileUpload';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import DataTable from '@/components/DataTable';
import { ConversationAnalyzer } from '@/components/ConversationAnalyzer';
import { AnalysisResult } from '@/types/conversation';
import { BarChart3, FileJson, Upload } from 'lucide-react';

const Index = () => {
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleFileUpload = (data: any[]) => {
    console.log('File uploaded:', data);
    setUploadedData(data);
    
    // Analyze the data
    const result = ConversationAnalyzer.analyzeConversations(data);
    console.log('Analysis result:', result);
    setAnalysisResult(result);
  };

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

        {/* Analysis Results */}
        {uploadedData.length > 0 && analysisResult && (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setUploadedData([]);
                    setAnalysisResult(null);
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
                <AnalyticsDashboard analysisResult={analysisResult} />
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
