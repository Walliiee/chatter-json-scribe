
export interface ConversationTurn {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
  metadata?: Record<string, any>;
}

export interface Conversation {
  id: string;
  turns: ConversationTurn[];
  metadata?: {
    session_id?: string;
    user_id?: string;
    created_at?: string;
    tags?: string[];
    [key: string]: any;
  };
}

export interface AnalysisResult {
  totalConversations: number;
  totalTurns: number;
  averageTurnsPerConversation: number;
  categories: {
    [category: string]: number;
  };
  sentimentDistribution: {
    positive: number;
    negative: number;
    neutral: number;
  };
  topTopics: Array<{
    topic: string;
    frequency: number;
  }>;
  userEngagement: {
    shortResponses: number;
    mediumResponses: number;
    longResponses: number;
    veryLongResponses: number;
    extremelyLongResponses: number;
  };
}
