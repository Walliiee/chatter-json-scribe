
import { Conversation, AnalysisResult, ConversationTurn } from '@/types/conversation';

export class ConversationAnalyzer {
  static analyzeConversations(data: any[]): AnalysisResult {
    console.log('Starting conversation analysis...', data);
    
    const conversations = this.normalizeData(data);
    console.log('Normalized conversations:', conversations);
    
    const totalConversations = conversations.length;
    const totalTurns = conversations.reduce((sum, conv) => sum + conv.turns.length, 0);
    const averageTurnsPerConversation = totalConversations > 0 ? totalTurns / totalConversations : 0;
    
    const categories = this.categorizeConversations(conversations);
    const topTopics = this.extractTopics(conversations);
    const userEngagement = this.analyzeUserEngagement(conversations);
    
    return {
      totalConversations,
      totalTurns,
      averageTurnsPerConversation,
      categories,
      sentimentDistribution: { positive: 0, negative: 0, neutral: 0 }, // Placeholder
      topTopics,
      userEngagement
    };
  }

  private static normalizeData(data: any[]): Conversation[] {
    const conversations: Conversation[] = [];
    
    data.forEach((item, index) => {
      if (Array.isArray(item)) {
        // Handle array of messages
        conversations.push({
          id: `conv_${index}`,
          turns: item.map(msg => ({
            role: msg.role || 'user',
            content: msg.content || msg.message || String(msg)
          }))
        });
      } else if (item.messages || item.conversation) {
        // Handle object with messages/conversation array
        const messages = item.messages || item.conversation;
        conversations.push({
          id: item.id || `conv_${index}`,
          turns: Array.isArray(messages) ? messages.map(msg => ({
            role: msg.role || 'user',
            content: msg.content || msg.message || String(msg)
          })) : []
        });
      } else if (item.turns) {
        // Handle normalized conversation format
        conversations.push(item);
      } else {
        // Handle single message object
        conversations.push({
          id: `conv_${index}`,
          turns: [{
            role: 'user',
            content: item.content || item.message || String(item)
          }]
        });
      }
    });
    
    return conversations;
  }

  private static categorizeConversations(conversations: Conversation[]) {
    const mainCategories: { [key: string]: number } = {};
    const subCategories: { [key: string]: { [key: string]: number } } = {};

    const categoryKeywords = {
      'Technical': {
        'Web Development': ['html', 'css', 'javascript', 'react', 'vue', 'angular', 'frontend', 'backend', 'node.js', 'express'],
        'Mobile Development': ['ios', 'android', 'swift', 'kotlin', 'react native', 'flutter', 'mobile app'],
        'AI/ML Development': ['machine learning', 'artificial intelligence', 'neural network', 'deep learning', 'tensorflow', 'pytorch'],
        'Database Engineering': ['sql', 'database', 'mysql', 'postgresql', 'mongodb', 'nosql', 'query'],
        'DevOps': ['docker', 'kubernetes', 'aws', 'azure', 'deployment', 'ci/cd', 'jenkins'],
        'System Design': ['architecture', 'scalability', 'microservices', 'api design', 'load balancing'],
        'Programming Languages': ['python', 'java', 'c++', 'c#', 'go', 'rust', 'php', 'ruby']
      },
      'Business': {
        'Strategy': ['business strategy', 'market analysis', 'competitive advantage', 'growth'],
        'Marketing': ['marketing', 'advertising', 'branding', 'social media', 'seo'],
        'Finance': ['finance', 'accounting', 'budget', 'investment', 'revenue'],
        'Operations': ['operations', 'process', 'efficiency', 'workflow', 'management']
      },
      'Creative': {
        'Design': ['design', 'ui', 'ux', 'graphic', 'visual', 'branding', 'logo'],
        'Writing': ['writing', 'content', 'copywriting', 'blog', 'article'],
        'Media': ['video', 'audio', 'photography', 'editing', 'production']
      },
      'Educational': {
        'Learning': ['learn', 'study', 'education', 'tutorial', 'course'],
        'Research': ['research', 'analysis', 'data', 'study', 'investigation'],
        'Teaching': ['teach', 'explain', 'instruction', 'guide', 'help']
      },
      'Personal': {
        'Lifestyle': ['lifestyle', 'health', 'fitness', 'wellness', 'personal'],
        'Productivity': ['productivity', 'time management', 'organization', 'planning'],
        'Career': ['career', 'job', 'interview', 'resume', 'professional']
      }
    };

    conversations.forEach(conv => {
      const allText = conv.turns.map(turn => turn.content).join(' ').toLowerCase();
      
      let categorized = false;
      
      for (const [mainCat, subCats] of Object.entries(categoryKeywords)) {
        for (const [subCat, keywords] of Object.entries(subCats)) {
          if (keywords.some(keyword => allText.includes(keyword.toLowerCase()))) {
            mainCategories[mainCat] = (mainCategories[mainCat] || 0) + 1;
            
            if (!subCategories[mainCat]) {
              subCategories[mainCat] = {};
            }
            subCategories[mainCat][subCat] = (subCategories[mainCat][subCat] || 0) + 1;
            
            categorized = true;
            break;
          }
        }
        if (categorized) break;
      }
      
      if (!categorized) {
        mainCategories['General'] = (mainCategories['General'] || 0) + 1;
        if (!subCategories['General']) {
          subCategories['General'] = {};
        }
        subCategories['General']['Miscellaneous'] = (subCategories['General']['Miscellaneous'] || 0) + 1;
      }
    });

    return {
      main: mainCategories,
      sub: subCategories
    };
  }

  private static extractTopics(conversations: Conversation[]) {
    const topicCounts: { [key: string]: number } = {};
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'this', 'that', 'these', 'those', 'ai', 'data', 'content']);

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

    return Object.entries(topicCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([topic, frequency]) => ({ topic, frequency }));
  }

  private static analyzeUserEngagement(conversations: Conversation[]) {
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
        if (turn.role === 'assistant' && turn.content) {
          const length = turn.content.length;
          const excerpt = turn.content.substring(0, 100) + (turn.content.length > 100 ? '...' : '');
          
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
        }
      });
    });

    // Get top 5 longest responses
    engagement.topFiveLongest = allResponses
      .sort((a, b) => b.length - a.length)
      .slice(0, 5);

    return engagement;
  }
}
