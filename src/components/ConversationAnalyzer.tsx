import { Conversation, AnalysisResult } from '@/types/conversation';

export class ConversationAnalyzer {
  static analyzeConversations(data: any[]): AnalysisResult {
    console.log('Analyzing conversations:', data);
    
    // Transform raw data to conversation format
    const conversations = this.transformToConversations(data);
    
    const totalConversations = conversations.length;
    const totalTurns = conversations.reduce((sum, conv) => sum + conv.turns.length, 0);
    const averageTurnsPerConversation = totalConversations > 0 ? totalTurns / totalConversations : 0;

    // Hierarchical categorization
    const categories = this.categorizeConversationsHierarchical(conversations);
    
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

  private static categorizeConversationsHierarchical(conversations: Conversation[]) {
    const mainCategories: { [key: string]: number } = {
      'Technical': 0,
      'Creative': 0,
      'Educational': 0,
      'Support': 0,
      'Business': 0,
      'General': 0
    };

    const subCategories: { [key: string]: { [subCategory: string]: number } } = {
      'Technical': {
        'Web Development': 0,
        'Mobile Development': 0,
        'AI/ML Development': 0,
        'Database Engineering': 0,
        'DevOps': 0,
        'System Design': 0,
        'Frontend Development': 0,
        'Backend Development': 0,
        'Full Stack Development': 0,
        'Code Review': 0,
        'Debugging': 0
      },
      'Creative': {
        'Writing': 0,
        'Content Creation': 0,
        'Design': 0,
        'Marketing Copy': 0,
        'Fiction': 0,
        'Poetry': 0
      },
      'Educational': {
        'Programming Concepts': 0,
        'Technology Explanations': 0,
        'Tutorials': 0,
        'Best Practices': 0,
        'Career Advice': 0
      },
      'Support': {
        'Technical Support': 0,
        'Troubleshooting': 0,
        'Bug Reports': 0,
        'Feature Requests': 0
      },
      'Business': {
        'Strategy': 0,
        'Product Management': 0,
        'Analytics': 0,
        'Process Optimization': 0
      },
      'General': {
        'Q&A': 0,
        'Discussion': 0,
        'Brainstorming': 0,
        'Other': 0
      }
    };

    conversations.forEach(conv => {
      const content = conv.turns.map(t => t.content.toLowerCase()).join(' ');
      let categorized = false;

      // Technical categorization with subcategories
      if (content.includes('react') || content.includes('javascript') || content.includes('html') || content.includes('css')) {
        mainCategories['Technical']++;
        if (content.includes('frontend') || content.includes('ui') || content.includes('react')) {
          subCategories['Technical']['Frontend Development']++;
        } else if (content.includes('fullstack') || content.includes('full stack')) {
          subCategories['Technical']['Full Stack Development']++;
        } else {
          subCategories['Technical']['Web Development']++;
        }
        categorized = true;
      } else if (content.includes('mobile') || content.includes('ios') || content.includes('android') || content.includes('flutter')) {
        mainCategories['Technical']++;
        subCategories['Technical']['Mobile Development']++;
        categorized = true;
      } else if (content.includes('ai') || content.includes('machine learning') || content.includes('neural') || content.includes('llm')) {
        mainCategories['Technical']++;
        subCategories['Technical']['AI/ML Development']++;
        categorized = true;
      } else if (content.includes('database') || content.includes('sql') || content.includes('mongodb')) {
        mainCategories['Technical']++;
        subCategories['Technical']['Database Engineering']++;
        categorized = true;
      } else if (content.includes('devops') || content.includes('deployment') || content.includes('docker') || content.includes('kubernetes')) {
        mainCategories['Technical']++;
        subCategories['Technical']['DevOps']++;
        categorized = true;
      } else if (content.includes('architecture') || content.includes('system design') || content.includes('scalability')) {
        mainCategories['Technical']++;
        subCategories['Technical']['System Design']++;
        categorized = true;
      } else if (content.includes('backend') || content.includes('api') || content.includes('server')) {
        mainCategories['Technical']++;
        subCategories['Technical']['Backend Development']++;
        categorized = true;
      } else if (content.includes('debug') || content.includes('error') || content.includes('bug')) {
        mainCategories['Technical']++;
        subCategories['Technical']['Debugging']++;
        categorized = true;
      } else if (content.includes('code review') || content.includes('refactor')) {
        mainCategories['Technical']++;
        subCategories['Technical']['Code Review']++;
        categorized = true;
      } else if (content.includes('code') || content.includes('programming') || content.includes('function')) {
        mainCategories['Technical']++;
        subCategories['Technical']['Web Development']++;
        categorized = true;
      }

      // Creative categorization
      if (!categorized && (content.includes('write') || content.includes('story') || content.includes('creative'))) {
        mainCategories['Creative']++;
        if (content.includes('fiction') || content.includes('novel') || content.includes('character')) {
          subCategories['Creative']['Fiction']++;
        } else if (content.includes('poem') || content.includes('poetry')) {
          subCategories['Creative']['Poetry']++;
        } else if (content.includes('marketing') || content.includes('copy')) {
          subCategories['Creative']['Marketing Copy']++;
        } else if (content.includes('content') || content.includes('blog')) {
          subCategories['Creative']['Content Creation']++;
        } else {
          subCategories['Creative']['Writing']++;
        }
        categorized = true;
      }

      // Educational categorization
      if (!categorized && (content.includes('learn') || content.includes('explain') || content.includes('how to') || content.includes('what is'))) {
        mainCategories['Educational']++;
        if (content.includes('programming') || content.includes('code')) {
          subCategories['Educational']['Programming Concepts']++;
        } else if (content.includes('tutorial') || content.includes('guide')) {
          subCategories['Educational']['Tutorials']++;
        } else if (content.includes('best practice') || content.includes('pattern')) {
          subCategories['Educational']['Best Practices']++;
        } else if (content.includes('career') || content.includes('job')) {
          subCategories['Educational']['Career Advice']++;
        } else {
          subCategories['Educational']['Technology Explanations']++;
        }
        categorized = true;
      }

      // Support categorization
      if (!categorized && (content.includes('problem') || content.includes('issue') || content.includes('help'))) {
        mainCategories['Support']++;
        if (content.includes('bug') || content.includes('error')) {
          subCategories['Support']['Bug Reports']++;
        } else if (content.includes('feature') || content.includes('request')) {
          subCategories['Support']['Feature Requests']++;
        } else if (content.includes('troubleshoot')) {
          subCategories['Support']['Troubleshooting']++;
        } else {
          subCategories['Support']['Technical Support']++;
        }
        categorized = true;
      }

      // Business categorization
      if (!categorized && (content.includes('business') || content.includes('strategy') || content.includes('product'))) {
        mainCategories['Business']++;
        if (content.includes('product') || content.includes('management')) {
          subCategories['Business']['Product Management']++;
        } else if (content.includes('analytics') || content.includes('data')) {
          subCategories['Business']['Analytics']++;
        } else if (content.includes('process') || content.includes('optimization')) {
          subCategories['Business']['Process Optimization']++;
        } else {
          subCategories['Business']['Strategy']++;
        }
        categorized = true;
      }

      // General fallback
      if (!categorized) {
        mainCategories['General']++;
        if (content.includes('?')) {
          subCategories['General']['Q&A']++;
        } else if (content.includes('discuss') || content.includes('think')) {
          subCategories['General']['Discussion']++;
        } else if (content.includes('idea') || content.includes('brainstorm')) {
          subCategories['General']['Brainstorming']++;
        } else {
          subCategories['General']['Other']++;
        }
      }
    });

    return { main: mainCategories, sub: subCategories };
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
      // Specific technologies (filtered)
      'typescript', 'python', 'java', 'c++', 'rust', 'go', 'swift', 'kotlin', 'ruby', 'php',
      'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch',
      
      // Frameworks & Libraries
      'nextjs', 'vue', 'angular', 'svelte', 'express', 'django', 'flask', 'spring',
      'tailwind', 'bootstrap', 'material-ui', 'chakra-ui',
      
      // Development concepts
      'microservices', 'serverless', 'containerization', 'testing', 'deployment',
      'authentication', 'authorization', 'performance optimization', 'security',
      
      // Specific domains
      'ecommerce', 'fintech', 'healthcare', 'gaming', 'social media',
      'blockchain', 'cryptocurrency', 'iot', 'cloud computing',
      
      // Tools & Platforms
      'github', 'gitlab', 'jenkins', 'terraform', 'aws', 'azure', 'gcp',
      'figma', 'adobe', 'photoshop', 'sketch'
    ];

    conversations.forEach(conv => {
      const content = conv.turns.map(t => t.content.toLowerCase()).join(' ');
      
      commonTopics.forEach(topic => {
        // Use word boundary detection for more accurate matching
        const regex = new RegExp(`\\b${topic}\\b`, 'gi');
        if (regex.test(content)) {
          topicCounts[topic] = (topicCounts[topic] || 0) + 1;
        }
      });
    });

    return Object.entries(topicCounts)
      .map(([topic, frequency]) => ({ topic, frequency }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 15);
  }

  private static analyzeUserEngagement(conversations: Conversation[]) {
    let veryShortResponses = 0;      // <5,000 chars
    let shortResponses = 0;          // 5,000-15,000 chars
    let mediumResponses = 0;         // 15,000-30,000 chars
    let longResponses = 0;           // 30,000-50,000 chars
    let veryLongResponses = 0;       // 50,000-75,000 chars
    let extremelyLongResponses = 0;  // 75,000-100,000 chars
    let massiveResponses = 0;        // >100,000 chars

    const allResponses: Array<{ length: number; excerpt: string; conversationId: string }> = [];

    conversations.forEach(conv => {
      conv.turns.forEach(turn => {
        const length = turn.content.length;
        const excerpt = turn.content.substring(0, 50) + (turn.content.length > 50 ? '...' : '');
        
        allResponses.push({
          length,
          excerpt,
          conversationId: conv.id
        });

        if (length < 5000) {
          veryShortResponses++;
        } else if (length < 15000) {
          shortResponses++;
        } else if (length < 30000) {
          mediumResponses++;
        } else if (length < 50000) {
          longResponses++;
        } else if (length < 75000) {
          veryLongResponses++;
        } else if (length < 100000) {
          extremelyLongResponses++;
        } else {
          massiveResponses++;
        }
      });
    });

    // Get top 5 longest responses
    const topFiveLongest = allResponses
      .sort((a, b) => b.length - a.length)
      .slice(0, 5);

    return { 
      veryShortResponses,
      shortResponses, 
      mediumResponses, 
      longResponses, 
      veryLongResponses, 
      extremelyLongResponses,
      massiveResponses,
      topFiveLongest
    };
  }
}
