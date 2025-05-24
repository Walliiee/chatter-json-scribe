
import { Conversation } from '@/types/conversation';

export class DataNormalizer {
  static normalizeData(data: any[]): Conversation[] {
    console.log('Normalizing data:', data);
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
    
    console.log('Normalized conversations:', conversations);
    return conversations;
  }
}
