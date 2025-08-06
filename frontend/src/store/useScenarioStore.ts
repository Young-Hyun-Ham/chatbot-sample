import { create } from 'zustand';
import { type Node, type Edge } from '@xyflow/react';
import { nanoid } from 'nanoid';
import type { ConditionNode, ScenarioData, ScenarioNode, SlotFillingNode, TextNode } from '../api/scenarioDetailApi';

type NodeType = 'text' | 'slotFilling' | 'condition';

interface ScenarioStore {
  nodes: Node[];
  edges: Edge[];
  scenarioData: ScenarioData;
  setNodes: (nodes: Node[] | ((prev: Node[]) => Node[])) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (type: NodeType) => void;
  deleteNode: (id: string) => void;
  updateNodePosition: (id: string, x: number, y: number) => void;
  updateNodeData: (id: string, data: Partial<Node['data']>) => void;
  addEdgeToScenarioData: (edge: Edge) => void;
}

export const useScenarioStore = create<ScenarioStore>((set, get) => ({
  nodes: [],
  edges: [],
  scenarioData: {
    nodes: [],
    edges: [],
  },

  // setNodes: (updatedNodes) => set({ nodes: [...updatedNodes] }),
  setNodes: (updater) =>
  set((state) => ({
    nodes: typeof updater === 'function' ? updater(state.nodes) : [...updater],
  })),
  setEdges: (edges) => set({ edges }),

  addNode: (type: NodeType) => {
    const id = nanoid();
    const labelMap = {
      text: 'Type: text',
      slotFilling: 'Type: slotFilling',
      condition: 'Type: condition',
    };

    const typeMap = {
      text: 'textNode',
      slotFilling: 'slotFillingNode',
      condition: 'conditionNode',
    };

    let newNode: Node;

    if (type === 'slotFilling') {
      newNode = {
        id,
        type: 'slotFillingNode',
        position: { x: Math.random() * 300, y: Math.random() * 300 },
        data: {
          question: '질문을 입력하세요.',
          slotKey: 'newSlot',
          items: [],
        },
      } as SlotFillingNode;
    } else if (type === 'condition') {
      newNode = {
        id,
        type: 'conditionNode',
        position: { x: Math.random() * 300, y: Math.random() * 300 },
        data: {
          value: '조건을 입력하세요.',
          trueBranch: '',
          falseBranch: '',
        },
      } as ConditionNode;
    } else {
      newNode = {
        id,
        type: typeMap[type],
        position: { x: Math.random() * 300, y: Math.random() * 300 },
        data: {
          label: labelMap[type],
          value: '',
        },
      }as TextNode;
    }

    set({
      nodes: [...get().nodes, newNode],
      scenarioData: {
        ...get().scenarioData,
        nodes: [...get().scenarioData.nodes, newNode as ScenarioNode],
      },
    });
  },

  deleteNode: (id: string) => {
    const originalNodes = get().nodes;
    const updatedNodes = originalNodes.filter((node) => node.id !== id);
    const updatedEdges = get().edges.filter(
      (edge) => edge.source !== id && edge.target !== id
    );
    const updatedScenarioNodes = get().scenarioData.nodes.filter(
      (node) => node.id !== id
    );
    const updatedScenarioEdges = get().scenarioData.edges.filter(
      (edge) => edge.source !== id && edge.target !== id
    );

    // ✅ 확실하게 참조 변경
    set({
      nodes: [...updatedNodes],
      edges: [...updatedEdges],
      scenarioData: {
        ...get().scenarioData,
        nodes: [...updatedScenarioNodes],
        edges: [...updatedScenarioEdges],
      },
    });
  },

  updateNodePosition: (id, x, y) => {
    const updatedNodes = get().nodes.map((node) => {
      if (node.id !== id) return node;

      switch (node.type) {
        case 'textNode':
          return {
            ...node,
            position: { x, y },
          } as TextNode;
        case 'slotFillingNode':
          return {
            ...node,
            position: { x, y },
          } as SlotFillingNode;
        case 'conditionNode':
          return {
            ...node,
            position: { x, y },
          } as ConditionNode;
        default:
          return node;
      }
    });

    set({
      nodes: updatedNodes,
      scenarioData: {
        ...get().scenarioData,
        nodes: updatedNodes as ScenarioNode[],
      },
    });
  },

  updateNodeData: (id, data) => {
    const updatedNodes = get().nodes.map((node) => {
      if (node.id !== id) return node;

      // 타입 좁히기
      switch (node.type) {
        case 'textNode':
          return {
            ...node,
            data: {
              ...(node.data as TextNode['data']),
              ...(data as TextNode['data']),
            },
          };
        case 'slotFillingNode':
          return {
            ...node,
            data: {
              ...(node.data as SlotFillingNode['data']),
              ...(data as SlotFillingNode['data']),
            },
          };
        case 'conditionNode':
          return {
            ...node,
            data: {
              ...(node.data as ConditionNode['data']),
              ...(data as ConditionNode['data']),
            },
          };
        default:
          return node;
      }
    });

    set({
      nodes: updatedNodes,
      scenarioData: {
        ...get().scenarioData,
        nodes: updatedNodes as ScenarioNode[],
      },
    });
  },

  addEdgeToScenarioData: (edge: Edge) => {
    set({
      edges: [...get().edges, edge],
      scenarioData: {
        ...get().scenarioData,
        edges: [...get().scenarioData.edges, edge],
      },
    });
  },
}));
