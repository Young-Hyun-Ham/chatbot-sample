import { api } from './axios';

export type ChatMessage = {
  id?: number;
  username: string;
  message: string;
  created_at?: string;
};

export const fetchMessages = async (): Promise<ChatMessage[]> => {
  const response = await api.get('/chat');
  return response.data;
};

export const postMessage = async (msg: ChatMessage): Promise<ChatMessage> => {
  const response = await api.post('/chat', msg);
  return response.data;
};
