import { api } from './axios'; // base axios 인스턴스

interface BaseNode {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
}

interface TextNode extends BaseNode {
  type: 'text';
  data: {
    label: string;
    value: string;
    quickReplies?: string[];
  };
}

interface SlotFillingDataItem {
  label: string;
  value: string;
  slotKey?: string;
  required?: boolean;
}

interface SlotFillingNode extends BaseNode {
  type: 'slotFilling';
  data: SlotFillingDataItem[];
}

interface ConditionNode extends BaseNode {
  type: 'condition';
  data: {
    condition: string;
    trueBranch: string; // 다음 노드 ID
    falseBranch: string; // 다음 노드 ID
  };
}

interface ScenarioEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

export interface ScenarioData {
  nodes: ScenarioNode[];
  edges: ScenarioEdge[];
}

interface ScenarioDetailPayload {
  scenario_id: string;
  data: ScenarioData[];
  create_id: string;
}

export type ScenarioNode = TextNode | SlotFillingNode | ConditionNode; // 시나리오 노드 타입

// 시나리오 상세 정보 저장 API
export const saveScenarioDetail = async (payload: ScenarioDetailPayload) => {
  const response = await api.post('/scenario-detail', payload);
  return response.data;
};