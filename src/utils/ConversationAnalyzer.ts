
import { Conversation, AnalysisResult } from '@/types/conversation';
import { DataNormalizer } from './DataNormalizer';
import { CategoryAnalyzer } from './CategoryAnalyzer';
import { TopicExtractor } from './TopicExtractor';
import { EngagementAnalyzer } from './EngagementAnalyzer';

export class ConversationAnalyzer {
  static analyzeConversations(data: any[]): AnalysisResult {
    console.log('=== Starting Conversation Analysis ===');
    console.log('Input data:', data);
    console.log('Data length:', data.length);
    console.log('First item sample:', data[0]);
    
    try {
      // Step 1: Normalize data
      console.log('Step 1: Normalizing data...');
      const conversations = DataNormalizer.normalizeData(data);
      console.log('Normalized conversations:', conversations.length);
      console.log('Sample conversation:', conversations[0]);
      
      if (conversations.length === 0) {
        console.warn('No conversations found after normalization');
        throw new Error('No valid conversations found in the uploaded data');
      }
      
      // Step 2: Basic metrics
      console.log('Step 2: Calculating basic metrics...');
      const totalConversations = conversations.length;
      const totalTurns = conversations.reduce((sum, conv) => sum + conv.turns.length, 0);
      const averageTurnsPerConversation = totalConversations > 0 ? totalTurns / totalConversations : 0;
      
      console.log('Basic metrics:', { totalConversations, totalTurns, averageTurnsPerConversation });
      
      // Step 3: Categorization (with error handling)
      console.log('Step 3: Analyzing categories...');
      let categories = { main: {}, sub: {} };
      try {
        categories = CategoryAnalyzer.categorizeConversations(conversations);
        console.log('Categories result:', categories);
      } catch (error) {
        console.error('Category analysis failed:', error);
        categories = { main: { 'General': totalConversations }, sub: { 'General': { 'Uncategorized': totalConversations } } };
      }
      
      // Step 4: Topic extraction (with error handling)
      console.log('Step 4: Extracting topics...');
      let topTopics: Array<{ topic: string; frequency: number }> = [];
      try {
        topTopics = TopicExtractor.extractTopics(conversations);
        console.log('Topics result:', topTopics);
      } catch (error) {
        console.error('Topic extraction failed:', error);
        topTopics = [];
      }
      
      // Step 5: Engagement analysis (with error handling)
      console.log('Step 5: Analyzing engagement...');
      let userEngagement = {
        veryShortResponses: 0,
        shortResponses: 0,
        mediumResponses: 0,
        longResponses: 0,
        veryLongResponses: 0,
        extremelyLongResponses: 0,
        massiveResponses: 0,
        topFiveLongest: []
      };
      try {
        userEngagement = EngagementAnalyzer.analyzeUserEngagement(conversations);
        console.log('Engagement result:', userEngagement);
      } catch (error) {
        console.error('Engagement analysis failed:', error);
      }
      
      const result: AnalysisResult = {
        totalConversations,
        totalTurns,
        averageTurnsPerConversation,
        categories,
        sentimentDistribution: { positive: 0, negative: 0, neutral: 0 }, // Placeholder for now
        topTopics,
        userEngagement
      };

      console.log('=== Analysis Complete ===');
      console.log('Final result:', result);
      return result;
      
    } catch (error) {
      console.error('=== Analysis Failed ===');
      console.error('Error details:', error);
      throw error;
    }
  }
}
