import { create } from 'zustand';
import type { ScenarioNode, ScenarioEdge } from '../types/scenario';

interface ChatStore {
  nodes: ScenarioNode[];
  edges: ScenarioEdge[];
  currentNodeId: string | null;
  slotValues: Record<string, string>;
  setScenario: (nodes: ScenarioNode[], edges: ScenarioEdge[]) => void;
  goToNextNode: (currentId: string) => void;
  setSlotValue: (key: string, value: string) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  nodes: [],
  edges: [],
  currentNodeId: null,
  slotValues: {},
  setScenario: (nodes, edges) => {
    const startNode = nodes.find(n => !edges.some(e => e.target === n.id));
    set({ nodes, edges, currentNodeId: startNode?.id ?? null });
  },
  goToNextNode: (currentId) => {
    const edge = get().edges.find(e => e.source === currentId);
    if (edge) set({ currentNodeId: edge.target });
    else set({ currentNodeId: null });
  },
  setSlotValue: (key, value) => {
    set((state) => ({
      slotValues: { ...state.slotValues, [key]: value },
    }));
  }
}));
