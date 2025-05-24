import { Conversation, AnalysisResult } from '@/types/conversation';
import { DataNormalizer } from './DataNormalizer';
import { CategoryAnalyzer } from './CategoryAnalyzer';
import { TopicExtractor } from './TopicExtractor';
import { EngagementAnalyzer } from './EngagementAnalyzer';

export class ConversationAnalyzer {
  static analyzeConversations(data: any[]): AnalysisResult {
    console.log('Starting conversation analysis...', data);
    
    const conversations = DataNormalizer.normalizeData(data);
    console.log('Normalized conversations:', conversations);
    
    const totalConversations = conversations.length;
    const totalTurns = conversations.reduce((sum, conv) => sum + conv.turns.length, 0);
    const averageTurnsPerConversation = totalConversations > 0 ? totalTurns / totalConversations : 0;
    
    const categories = CategoryAnalyzer.categorizeConversations(conversations);
    const topTopics = TopicExtractor.extractTopics(conversations);
    const userEngagement = EngagementAnalyzer.analyzeUserEngagement(conversations);
    
    const result = {
      totalConversations,
      totalTurns,
      averageTurnsPerConversation,
      categories,
      sentimentDistribution: { positive: 0, negative: 0, neutral: 0 }, // Placeholder for now
      topTopics,
      userEngagement
    };

    console.log('Final analysis result:', result);
    return result;
  }
}
