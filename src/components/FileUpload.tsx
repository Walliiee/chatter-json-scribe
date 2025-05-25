
import React, { useCallback, useState } from 'react';
import { Upload, FileJson, AlertCircle, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface FileUploadProps {
  onFileUpload: (data: any[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setUploadStatus('idle');

    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);
      
      // Validate that it's an array or convert single object to array
      const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];
      
      console.log('Processed JSON data:', dataArray);
      onFileUpload(dataArray);
      setUploadStatus('success');
      toast.success(`Successfully uploaded ${dataArray.length} conversation(s)`);
    } catch (error) {
      console.error('Error processing file:', error);
      setUploadStatus('error');
      toast.error('Invalid JSON file. Please check the format.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const jsonFile = files.find(file => file.type === 'application/json' || file.name.endsWith('.json'));

    if (jsonFile) {
      processFile(jsonFile);
    } else {
      toast.error('Please upload a valid JSON file');
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const getStatusIcon = () => {
    if (isProcessing) return <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" />;
    if (uploadStatus === 'success') return <Check className="w-6 h-6 text-green-500" />;
    if (uploadStatus === 'error') return <AlertCircle className="w-6 h-6 text-red-500" />;
    return <Upload className="w-12 h-12 text-gray-400" />;
  };

  const getStatusText = () => {
    if (isProcessing) return 'Processing file...';
    if (uploadStatus === 'success') return 'File uploaded successfully!';
    if (uploadStatus === 'error') return 'Error uploading file';
    return 'Drag & drop your JSON file here or click to browse';
  };

  return (
    <Card className="w-full">
      <CardContent className="p-8">
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer hover:border-blue-400 ${
            isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          } ${uploadStatus === 'success' ? 'border-green-400 bg-green-50' : ''} ${
            uploadStatus === 'error' ? 'border-red-400 bg-red-50' : ''
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept=".json,application/json"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isProcessing}
          />
          
          <div className="flex flex-col items-center space-y-4">
            {getStatusIcon()}
            
            <div>
              <p className="text-lg font-medium text-gray-700 mb-2">
                {getStatusText()}
              </p>
              <p className="text-sm text-gray-500">
                Supports ChatGPT exports, Claude exports, and custom conversation formats
              </p>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <FileJson className="w-4 h-4" />
              <span>JSON format only</span>
            </div>
          </div>
        </div>

        {/* Updated Format Examples */}
        <div className="mt-6 space-y-4 text-sm">
          <div>
            <p className="font-medium text-gray-700 mb-2">✅ ChatGPT Export Format</p>
            <pre className="bg-gray-100 p-3 rounded overflow-x-auto text-xs">
{`{
  "conversation_id": "abc123",
  "mapping": {
    "node1": {
      "message": {
        "author": {"role": "user"},
        "content": {"parts": ["Hello, how are you?"]}
      }
    },
    "node2": {
      "message": {
        "author": {"role": "assistant"},
        "content": {"parts": ["I'm doing well, thank you!"]}
      }
    }
  }
}`}
            </pre>
          </div>
          
          <div>
            <p className="font-medium text-gray-700 mb-2">✅ Simple Messages Format</p>
            <pre className="bg-gray-100 p-3 rounded overflow-x-auto text-xs">
{`{
  "messages": [
    {"role": "user", "content": "What is React?"},
    {"role": "assistant", "content": "React is a JavaScript library..."}
  ]
}`}
            </pre>
          </div>

          <div>
            <p className="font-medium text-gray-700 mb-2">✅ Array of Conversations</p>
            <pre className="bg-gray-100 p-3 rounded overflow-x-auto text-xs">
{`[
  {
    "conversation": [
      {"role": "user", "content": "Help me with Python"},
      {"role": "assistant", "content": "I'd be happy to help!"}
    ]
  }
]`}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
