
import { Conversation } from '@/types/conversation';

export class CategoryAnalyzer {
  static categorizeConversations(conversations: Conversation[]) {
    console.log('=== CategoryAnalyzer: Starting categorization ===');
    console.log('Input conversations:', conversations.length);
    
    const mainCategories: { [key: string]: number } = {};
    const subCategories: { [key: string]: { [key: string]: number } } = {};

    // Improved keyword lists with safer matching
    const categoryKeywords = {
      'Technical': {
        'Web Development': [
          'html', 'css', 'javascript', 'react', 'vue', 'angular', 'svelte',
          'frontend', 'backend', 'fullstack', 'nodejs', 'express', 'nextjs',
          'webpack', 'vite', 'npm', 'yarn', 'typescript', 'component',
          'dom', 'browser', 'web', 'website', 'webapp'
        ],
        'Mobile Development': [
          'ios', 'android', 'swift', 'kotlin', 'react native', 'flutter',
          'mobile app', 'xamarin', 'ionic', 'app store', 'play store'
        ],
        'AI/ML Development': [
          'machine learning', 'artificial intelligence', 'neural network',
          'deep learning', 'tensorflow', 'pytorch', 'model', 'training',
          'algorithm', 'data science', 'nlp', 'computer vision'
        ],
        'Database Engineering': [
          'database', 'mysql', 'postgresql', 'mongodb', 'nosql',
          'query', 'sqlite', 'redis', 'elasticsearch', 'orm', 'prisma'
        ],
        'Programming Languages': [
          'python', 'java', 'golang', 'rust', 'php', 'ruby',
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
        'Design': ['design', 'user interface', 'user experience', 'graphic', 'visual', 'branding'],
        'Writing': ['writing', 'content', 'copywriting', 'blog', 'article'],
        'Media': ['video', 'audio', 'photography', 'editing', 'production']
      },
      'Educational': {
        'Learning': ['learn', 'study', 'education', 'tutorial', 'course'],
        'Research': ['research', 'analysis', 'investigation', 'academic'],
        'Teaching': ['teach', 'explain', 'instruction', 'guide', 'help']
      }
    };

    conversations.forEach((conv, index) => {
      const allText = conv.turns
        .map(turn => turn.content)
        .join(' ')
        .toLowerCase();
      
      console.log(`Analyzing conversation ${index} (${conv.id}):`, allText.substring(0, 100) + '...');
      
      let categorized = false;
      
      // Use safer keyword matching
      for (const [mainCat, subCats] of Object.entries(categoryKeywords)) {
        for (const [subCat, keywords] of Object.entries(subCats)) {
          const foundKeyword = keywords.find(keyword => {
            // Use simple includes for better reliability
            return allText.includes(keyword.toLowerCase());
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

    console.log('=== CategoryAnalyzer: Completed categorization ===');
    console.log('Main categories:', mainCategories);
    console.log('Sub categories:', subCategories);
    
    return {
      main: mainCategories,
      sub: subCategories
    };
  }
}
