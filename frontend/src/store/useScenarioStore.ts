import { create } from 'zustand';
import { type Node, type Edge } from '@xyflow/react';
import { nanoid } from 'nanoid';
import type { ScenarioData, ScenarioNode } from '../api/scenarioDetailApi';
import { immer } from 'zustand/middleware/immer';

type NodeType = 'text' | 'slotFilling' | 'condition';

interface ScenarioStore {
  nodes: Node[];
  edges: Edge[];
  scenarioData: ScenarioData; // 시나리오 데이터 구조에 맞게 타입 정의
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (type: NodeType) => void;
  deleteNode: (id: string) => void;
  /** 노드 위치 업데이트 */
  updateNodePosition: (id: string, x: number, y: number) => void;
  updateNodeData: (id: string, data: Partial<Node['data']>) => void;
  addEdgeToScenarioData: (edge: Edge) => void;
}

export const useScenarioStore = create<ScenarioStore>()(
  immer((set, get) => ({
    nodes: [],
    edges: [],
    scenarioData: {
      nodes: [],
      edges: [],
    },

    setNodes: (updatedNodes) => set({ nodes: updatedNodes }),
    setEdges: (edges) => set({ edges }),

    /** 노드 추가 */
    addNode: (type: NodeType) => {
      alert(type === 'text' ? 'textNode' : 'default');
      const id = nanoid();
      const labelMap = {
        text: 'Type: text',
        slotFilling: 'Type: slotFilling',
        condition: 'Type: condition',
      };

      const newNode: Node = {
        id,
        type: type === 'text' ? 'textNode' : 'default',
        position: { x: Math.random() * 300, y: Math.random() * 300 },
        data: {
          label: labelMap[type],
          value: '',
        },
      };

      const updatedNodes = [...get().nodes, newNode];
      set((state) => {
        state.nodes = updatedNodes as any;
        state.scenarioData.nodes.push(newNode as any);
      });
    },

    /** 노드 삭제 */
    deleteNode: (id: string) => {
      set((state) => {
        state.nodes = state.nodes.filter((node) => node.id !== id);
        state.edges = state.edges.filter(
          (edge) => edge.source !== id && edge.target !== id
        );
        state.scenarioData.nodes = state.scenarioData.nodes.filter(
          (node) => node.id !== id
        );
        state.scenarioData.edges = state.scenarioData.edges.filter(
          (edge) => edge.source !== id && edge.target !== id
        );
      });
    },

    /** 노드 위치 변경 */
    updateNodePosition: (id, x, y) =>
      set((state) => {
        const node = state.scenarioData.nodes.find((n) => n.id === id);
        if (node) {
          node.position = { x, y };
        }
      }),

    /** 노드 데이터 변경 */
    updateNodeData: (id, data) =>
      set((state) => {
        const node = state.scenarioData.nodes.find((n) => n.id === id);
        if (node) {
          node.data = {
            ...node.data,
            ...data,
          };
        }
      }),

    /** edge 추가 */
    addEdgeToScenarioData: (edge: Edge) =>
      set((state) => {
        state.edges.push(edge);
        state.scenarioData.edges.push(edge);
      }),
  }))
);