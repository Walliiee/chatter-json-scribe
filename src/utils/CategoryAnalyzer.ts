
import { Conversation } from '@/types/conversation';

export class CategoryAnalyzer {
  static categorizeConversations(conversations: Conversation[]) {
    console.log('Starting categorization for', conversations.length, 'conversations');
    
    const mainCategories: { [key: string]: number } = {};
    const subCategories: { [key: string]: { [key: string]: number } } = {};

    const categoryKeywords = {
      'Technical': {
        'Web Development': [
          'html', 'css', 'javascript', 'js', 'react', 'vue', 'angular', 'svelte',
          'frontend', 'backend', 'fullstack', 'node.js', 'express', 'next.js',
          'webpack', 'vite', 'npm', 'yarn', 'typescript', 'tsx', 'jsx',
          'dom', 'browser', 'web', 'website', 'webapp', 'component'
        ],
        'Mobile Development': [
          'ios', 'android', 'swift', 'kotlin', 'react native', 'flutter',
          'mobile app', 'xamarin', 'ionic', 'cordova', 'phonegap'
        ],
        'AI/ML Development': [
          'machine learning', 'artificial intelligence', 'neural network',
          'deep learning', 'tensorflow', 'pytorch', 'ai', 'ml', 'llm',
          'model', 'training', 'algorithm', 'data science'
        ],
        'Database Engineering': [
          'sql', 'database', 'mysql', 'postgresql', 'mongodb', 'nosql',
          'query', 'sqlite', 'redis', 'elasticsearch', 'orm', 'prisma'
        ],
        'DevOps': [
          'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'deployment',
          'ci/cd', 'jenkins', 'github actions', 'terraform', 'ansible'
        ],
        'System Design': [
          'architecture', 'scalability', 'microservices', 'api design',
          'load balancing', 'distributed', 'system', 'performance'
        ],
        'Programming Languages': [
          'python', 'java', 'c++', 'c#', 'go', 'rust', 'php', 'ruby',
          'scala', 'kotlin', 'dart', 'programming', 'code', 'coding'
        ]
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

    conversations.forEach((conv, index) => {
      const allText = conv.turns.map(turn => turn.content).join(' ').toLowerCase();
      console.log(`Analyzing conversation ${index}:`, allText.substring(0, 100) + '...');
      
      let categorized = false;
      
      for (const [mainCat, subCats] of Object.entries(categoryKeywords)) {
        for (const [subCat, keywords] of Object.entries(subCats)) {
          const foundKeyword = keywords.find(keyword => {
            const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'i');
            return regex.test(allText);
          });
          
          if (foundKeyword) {
            console.log(`Found keyword "${foundKeyword}" - categorizing as ${mainCat} > ${subCat}`);
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
        console.log(`No category found for conversation ${index} - marking as General`);
        mainCategories['General'] = (mainCategories['General'] || 0) + 1;
        if (!subCategories['General']) {
          subCategories['General'] = {};
        }
        subCategories['General']['Miscellaneous'] = (subCategories['General']['Miscellaneous'] || 0) + 1;
      }
    });

    console.log('Final categorization results:', { main: mainCategories, sub: subCategories });
    return {
      main: mainCategories,
      sub: subCategories
    };
  }
}
