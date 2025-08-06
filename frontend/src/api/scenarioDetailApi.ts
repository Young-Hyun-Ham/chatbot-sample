import { api } from './axios'; // base axios 인스턴스

export interface BaseNode {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
}

export interface TextNode extends BaseNode {
  type: 'textNode';
  data: {
    label: string;
    value: string;
    quickReplies?: string[];
  };
}

export interface SlotFillingDataItem {
  label: string;
  value: string;
}

export interface SlotFillingNode extends BaseNode {
  type: 'slotFillingNode';
  data: {
    question: string; // 질문 텍스트
    slotKey: string;  // 슬롯 이름
    items: SlotFillingDataItem[]; // 퀵 리플라이
  };
}

export interface ConditionNode extends BaseNode {
  type: 'conditionNode';
  data: {
    value: string; // 조건 질문 텍스트
    trueLabel?: string; // 확인
    falseLabel?: string; // 취소
  };
}

export type ScenarioNode = TextNode | SlotFillingNode | ConditionNode;

export interface ScenarioEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

export interface ScenarioData {
  nodes: ScenarioNode[];
  edges: ScenarioEdge[];
}

export interface ScenarioDetailPayload {
  scenario_id: string;
  data: ScenarioData[];
  create_id: string;
}

// 시나리오 상세 정보 저장 API
export const saveScenarioDetail = async (payload: ScenarioDetailPayload) => {
  const response = await api.post('/scenario-detail', payload);
  return response.data;
};