
import { Conversation } from '@/types/conversation';

export class EngagementAnalyzer {
  static analyzeUserEngagement(conversations: Conversation[]) {
    console.log('Analyzing user engagement...');
    
    const engagement = {
      veryShortResponses: 0,    // <5,000 chars
      shortResponses: 0,        // 5,000-15,000 chars
      mediumResponses: 0,       // 15,000-30,000 chars
      longResponses: 0,         // 30,000-50,000 chars
      veryLongResponses: 0,     // 50,000-75,000 chars
      extremelyLongResponses: 0, // 75,000-100,000 chars
      massiveResponses: 0,      // >100,000 chars
      topFiveLongest: [] as Array<{
        length: number;
        excerpt: string;
        conversationId: string;
      }>
    };

    const allResponses: Array<{
      length: number;
      excerpt: string;
      conversationId: string;
    }> = [];

    conversations.forEach(conv => {
      conv.turns.forEach(turn => {
        const length = turn.content.length;
        const excerpt = turn.content.substring(0, 100) + (turn.content.length > 100 ? '...' : '');
        
        console.log(`Turn in ${conv.id}: ${length} chars, role: ${turn.role}`);
        
        allResponses.push({
          length,
          excerpt,
          conversationId: conv.id
        });

        if (length < 5000) {
          engagement.veryShortResponses++;
        } else if (length < 15000) {
          engagement.shortResponses++;
        } else if (length < 30000) {
          engagement.mediumResponses++;
        } else if (length < 50000) {
          engagement.longResponses++;
        } else if (length < 75000) {
          engagement.veryLongResponses++;
        } else if (length < 100000) {
          engagement.extremelyLongResponses++;
        } else {
          engagement.massiveResponses++;
        }
      });
    });

    // Get top 5 longest responses
    engagement.topFiveLongest = allResponses
      .sort((a, b) => b.length - a.length)
      .slice(0, 5);

    console.log('Engagement analysis result:', engagement);
    return engagement;
  }
}
