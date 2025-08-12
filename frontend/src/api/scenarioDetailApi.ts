import type { ScenarioDetailPayload } from '../types/scenario';
import { api } from './axios'; // base axios 인스턴스

// 시나리오 상세 정보 저장 API
export const saveScenarioDetail = async (payload: ScenarioDetailPayload) => {
  const response = await api.post('/scenario-detail', payload);
  return response.data;
};