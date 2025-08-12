
export interface BaseNode {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
}

export interface QuickReply {
  label: string;
  value: string;
}

export interface TextNode extends BaseNode {
  type: 'textNode';
  data: {
    label: string;
    value: string;
    quickReplies?: QuickReply[];
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

export interface ScenarioEdge extends Edge {
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