
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
    main: { [category: string]: number };
    sub: { [category: string]: { [subCategory: string]: number } };
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
    veryShortResponses: number;    // <5,000 chars
    shortResponses: number;        // 5,000-15,000 chars
    mediumResponses: number;       // 15,000-30,000 chars
    longResponses: number;         // 30,000-50,000 chars
    veryLongResponses: number;     // 50,000-75,000 chars
    extremelyLongResponses: number; // 75,000-100,000 chars
    massiveResponses: number;      // >100,000 chars
    topFiveLongest: Array<{
      length: number;
      excerpt: string;
      conversationId: string;
    }>;
  };
}
