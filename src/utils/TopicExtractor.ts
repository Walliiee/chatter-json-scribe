
import { Conversation } from '@/types/conversation';

export class TopicExtractor {
  static extractTopics(conversations: Conversation[]) {
    console.log('Extracting topics from conversations...');
    
    const topicCounts: { [key: string]: number } = {};
    const commonWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 
      'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 
      'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 
      'may', 'might', 'can', 'must', 'i', 'you', 'he', 'she', 'it', 'we', 
      'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 
      'its', 'our', 'their', 'this', 'that', 'these', 'those', 'ai', 'data', 
      'content', 'how', 'what', 'when', 'where', 'why', 'who', 'which'
    ]);

    conversations.forEach(conv => {
      conv.turns.forEach(turn => {
        if (turn.content) {
          const words = turn.content.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 2 && !commonWords.has(word));
          
          words.forEach(word => {
            topicCounts[word] = (topicCounts[word] || 0) + 1;
          });
        }
      });
    });

    const topics = Object.entries(topicCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([topic, frequency]) => ({ topic, frequency }));

    console.log('Extracted topics:', topics);
    return topics;
  }
}
