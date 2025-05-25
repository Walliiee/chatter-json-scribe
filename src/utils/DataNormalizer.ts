
import { Conversation } from '@/types/conversation';

export class DataNormalizer {
  static normalizeData(data: any[]): Conversation[] {
    console.log('=== DataNormalizer: Starting normalization ===');
    console.log('Input data type:', Array.isArray(data) ? 'array' : typeof data);
    console.log('Input data length:', data.length);
    console.log('First item sample:', JSON.stringify(data[0], null, 2).substring(0, 500));
    
    const conversations: Conversation[] = [];
    
    data.forEach((item, index) => {
      console.log(`Processing item ${index}:`, typeof item, Object.keys(item || {}));
      
      let extractedConversation: Conversation | null = null;
      
      // Handle different conversation formats
      if (this.isChatGPTFormat(item)) {
        console.log(`Item ${index}: Detected ChatGPT format`);
        extractedConversation = this.normalizeChatGPTFormat(item, index);
      } else if (this.isClaudeFormat(item)) {
        console.log(`Item ${index}: Detected Claude format`);
        extractedConversation = this.normalizeClaudeFormat(item, index);
      } else if (this.isGenericConversationFormat(item)) {
        console.log(`Item ${index}: Detected generic conversation format`);
        extractedConversation = this.normalizeGenericFormat(item, index);
      } else if (Array.isArray(item)) {
        console.log(`Item ${index}: Detected array of messages`);
        extractedConversation = this.normalizeMessageArray(item, index);
      } else if (typeof item === 'string') {
        console.log(`Item ${index}: Detected string content`);
        extractedConversation = this.normalizeStringContent(item, index);
      } else {
        console.log(`Item ${index}: Attempting fallback normalization`);
        extractedConversation = this.normalizeFallback(item, index);
      }
      
      if (extractedConversation && extractedConversation.turns.length > 0) {
        console.log(`Successfully normalized item ${index}: ${extractedConversation.turns.length} turns`);
        conversations.push(extractedConversation);
      } else {
        console.warn(`Failed to normalize item ${index}`);
      }
    });
    
    console.log(`=== DataNormalizer: Completed normalization ===`);
    console.log(`Input items: ${data.length}, Output conversations: ${conversations.length}`);
    console.log('Sample normalized conversation:', conversations[0]);
    
    return conversations;
  }

  // Format detection methods
  static isChatGPTFormat(item: any): boolean {
    return item && (item.mapping || item.conversation_id || (item.title && item.create_time));
  }

  static isClaudeFormat(item: any): boolean {
    return item && (item.uuid || (item.chat_messages && Array.isArray(item.chat_messages)));
  }

  static isGenericConversationFormat(item: any): boolean {
    return item && (item.messages || item.conversation || item.turns || item.exchanges);
  }

  // Normalization methods for different formats
  static normalizeChatGPTFormat(item: any, index: number): Conversation {
    const turns: any[] = [];
    
    if (item.mapping) {
      // ChatGPT export with mapping structure
      Object.values(item.mapping).forEach((node: any) => {
        if (node.message && node.message.content && node.message.content.parts) {
          const content = node.message.content.parts.join(' ');
          if (content.trim()) {
            turns.push({
              role: node.message.author?.role || 'user',
              content: content.trim()
            });
          }
        }
      });
    } else if (item.messages) {
      // Simple messages array
      turns.push(...item.messages.map((msg: any) => ({
        role: msg.role || msg.author || 'user',
        content: msg.content || msg.text || String(msg)
      })));
    }
    
    return {
      id: item.conversation_id || item.id || `chatgpt_${index}`,
      turns: turns.filter(turn => turn.content && turn.content.trim())
    };
  }

  static normalizeClaudeFormat(item: any, index: number): Conversation {
    const turns: any[] = [];
    
    if (item.chat_messages) {
      turns.push(...item.chat_messages.map((msg: any) => ({
        role: msg.sender || 'user',
        content: msg.text || msg.content || String(msg)
      })));
    } else if (item.messages) {
      turns.push(...item.messages.map((msg: any) => ({
        role: msg.role || 'user',
        content: msg.content || msg.text || String(msg)
      })));
    }
    
    return {
      id: item.uuid || item.id || `claude_${index}`,
      turns: turns.filter(turn => turn.content && turn.content.trim())
    };
  }

  static normalizeGenericFormat(item: any, index: number): Conversation {
    const messagesArray = item.messages || item.conversation || item.turns || item.exchanges;
    
    if (!Array.isArray(messagesArray)) {
      return { id: `generic_${index}`, turns: [] };
    }
    
    const turns = messagesArray.map((msg: any) => ({
      role: msg.role || msg.sender || msg.author || 'user',
      content: msg.content || msg.text || msg.message || String(msg)
    }));
    
    return {
      id: item.id || `generic_${index}`,
      turns: turns.filter(turn => turn.content && turn.content.trim())
    };
  }

  static normalizeMessageArray(item: any[], index: number): Conversation {
    const turns = item.map((msg: any) => ({
      role: msg.role || msg.sender || msg.author || 'user',
      content: msg.content || msg.text || msg.message || String(msg)
    }));
    
    return {
      id: `array_${index}`,
      turns: turns.filter(turn => turn.content && turn.content.trim())
    };
  }

  static normalizeStringContent(item: string, index: number): Conversation {
    return {
      id: `string_${index}`,
      turns: [{
        role: 'user',
        content: item.trim()
      }]
    };
  }

  static normalizeFallback(item: any, index: number): Conversation {
    // Try to extract any text content from the object
    const extractText = (obj: any): string => {
      if (typeof obj === 'string') return obj;
      if (typeof obj === 'object' && obj !== null) {
        // Look for common content fields
        for (const key of ['content', 'text', 'message', 'body', 'data']) {
          if (obj[key]) {
            return typeof obj[key] === 'string' ? obj[key] : extractText(obj[key]);
          }
        }
        // Fallback to first string value found
        for (const value of Object.values(obj)) {
          if (typeof value === 'string' && value.trim()) {
            return value;
          }
        }
      }
      return '';
    };
    
    const content = extractText(item);
    
    return {
      id: `fallback_${index}`,
      turns: content ? [{
        role: 'user',
        content: content.trim()
      }] : []
    };
  }
}
