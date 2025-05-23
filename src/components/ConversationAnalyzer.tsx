
import { Conversation, AnalysisResult } from '@/types/conversation';

export class ConversationAnalyzer {
  static analyzeConversations(data: any[]): AnalysisResult {
    console.log('Analyzing conversations:', data);
    
    // Transform raw data to conversation format
    const conversations = this.transformToConversations(data);
    
    const totalConversations = conversations.length;
    const totalTurns = conversations.reduce((sum, conv) => sum + conv.turns.length, 0);
    const averageTurnsPerConversation = totalConversations > 0 ? totalTurns / totalConversations : 0;

    // Categorize conversations based on content patterns
    const categories = this.categorizeConversations(conversations);
    
    // Analyze sentiment (simplified)
    const sentimentDistribution = this.analyzeSentiment(conversations);
    
    // Extract topics with enhanced analysis
    const topTopics = this.extractTopics(conversations);
    
    // Analyze user engagement with new length categories
    const userEngagement = this.analyzeUserEngagement(conversations);

    return {
      totalConversations,
      totalTurns,
      averageTurnsPerConversation,
      categories,
      sentimentDistribution,
      topTopics,
      userEngagement
    };
  }

  private static transformToConversations(data: any[]): Conversation[] {
    return data.map((item, index) => {
      // Handle different JSON structures
      if (item.messages || item.turns) {
        return {
          id: item.id || `conv_${index}`,
          turns: (item.messages || item.turns).map((turn: any) => ({
            role: turn.role || turn.sender || 'user',
            content: turn.content || turn.message || turn.text || '',
            timestamp: turn.timestamp || turn.created_at
          })),
          metadata: item.metadata || {}
        };
      } else if (item.conversation) {
        return {
          id: item.id || `conv_${index}`,
          turns: item.conversation.map((turn: any) => ({
            role: turn.role || 'user',
            content: turn.content || turn.message || '',
            timestamp: turn.timestamp
          })),
          metadata: item.metadata || {}
        };
      } else {
        // Assume the item itself is a conversation turn
        return {
          id: `conv_${index}`,
          turns: [{
            role: item.role || 'user',
            content: item.content || item.message || item.text || JSON.stringify(item),
            timestamp: item.timestamp
          }],
          metadata: {}
        };
      }
    });
  }

  private static categorizeConversations(conversations: Conversation[]) {
    const categories: { [key: string]: number } = {
      'Technical Support': 0,
      'General Inquiry': 0,
      'Creative Writing': 0,
      'Code Assistance': 0,
      'Educational': 0,
      'Other': 0
    };

    conversations.forEach(conv => {
      const content = conv.turns.map(t => t.content.toLowerCase()).join(' ');
      
      if (content.includes('error') || content.includes('bug') || content.includes('fix') || content.includes('problem')) {
        categories['Technical Support']++;
      } else if (content.includes('code') || content.includes('function') || content.includes('programming') || content.includes('javascript')) {
        categories['Code Assistance']++;
      } else if (content.includes('write') || content.includes('story') || content.includes('creative') || content.includes('poem')) {
        categories['Creative Writing']++;
      } else if (content.includes('learn') || content.includes('explain') || content.includes('how to') || content.includes('what is')) {
        categories['Educational']++;
      } else if (content.includes('?') || content.includes('help')) {
        categories['General Inquiry']++;
      } else {
        categories['Other']++;
      }
    });

    return categories;
  }

  private static analyzeSentiment(conversations: Conversation[]) {
    let positive = 0;
    let negative = 0;
    let neutral = 0;

    conversations.forEach(conv => {
      const content = conv.turns.map(t => t.content.toLowerCase()).join(' ');
      
      const positiveWords = ['good', 'great', 'excellent', 'amazing', 'perfect', 'love', 'awesome', 'fantastic'];
      const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'horrible', 'wrong', 'error', 'problem'];
      
      const positiveCount = positiveWords.filter(word => content.includes(word)).length;
      const negativeCount = negativeWords.filter(word => content.includes(word)).length;
      
      if (positiveCount > negativeCount) {
        positive++;
      } else if (negativeCount > positiveCount) {
        negative++;
      } else {
        neutral++;
      }
    });

    return { positive, negative, neutral };
  }

  private static extractTopics(conversations: Conversation[]) {
    const topicCounts: { [key: string]: number } = {};
    
    const commonTopics = [
      // Programming languages & technologies
      'javascript', 'python', 'react', 'typescript', 'java', 'c++', 'rust', 'go', 
      'swift', 'kotlin', 'ruby', 'php', 'html', 'css', 'sql', 'nosql', 'mongodb',
      
      // Development areas
      'programming', 'code', 'development', 'frontend', 'backend', 'fullstack', 'database',
      'api', 'sdk', 'framework', 'library', 'devops', 'architecture', 'design pattern',
      
      // AI & ML
      'ai', 'machine learning', 'neural network', 'deep learning', 'nlp', 'transformer',
      'llm', 'gpt', 'claude', 'bert', 'embedding', 'vector', 'prompt engineering',
      
      // Creative content
      'writing', 'story', 'creative', 'blog', 'article', 'fiction', 'novel',
      'poem', 'lyrics', 'content', 'marketing', 'copywriting',
      
      // Help & Support
      'help', 'support', 'question', 'answer', 'explain', 'explanation', 'guide',
      'tutorial', 'issue', 'error', 'bug', 'fix', 'debug', 'problem', 'solution',
      
      // Education
      'learn', 'education', 'course', 'training', 'teach', 'study', 'school', 'university',
      
      // Business 
      'business', 'startup', 'entrepreneur', 'marketing', 'strategy', 'product',
      'service', 'customer', 'revenue', 'growth', 'analytics', 'data'
    ];

    conversations.forEach(conv => {
      const content = conv.turns.map(t => t.content.toLowerCase()).join(' ');
      
      commonTopics.forEach(topic => {
        if (content.includes(topic)) {
          topicCounts[topic] = (topicCounts[topic] || 0) + 1;
        }
      });
    });

    return Object.entries(topicCounts)
      .map(([topic, frequency]) => ({ topic, frequency }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 15); // Increase the number of topics we show
  }

  private static analyzeUserEngagement(conversations: Conversation[]) {
    let shortResponses = 0;      // 1-1,000 chars
    let mediumResponses = 0;     // 1,000-10,000 chars
    let longResponses = 0;       // 10,000-25,000 chars
    let veryLongResponses = 0;   // 25,000-40,000 chars
    let extremelyLongResponses = 0; // >40,000 chars

    conversations.forEach(conv => {
      conv.turns.forEach(turn => {
        const length = turn.content.length;
        if (length <= 1000) {
          shortResponses++;
        } else if (length <= 10000) {
          mediumResponses++;
        } else if (length <= 25000) {
          longResponses++;
        } else if (length <= 40000) {
          veryLongResponses++;
        } else {
          extremelyLongResponses++;
        }
      });
    });

    return { 
      shortResponses, 
      mediumResponses, 
      longResponses, 
      veryLongResponses, 
      extremelyLongResponses 
    };
  }
}
