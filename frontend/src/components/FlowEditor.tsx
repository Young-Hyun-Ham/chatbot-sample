import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Connection,
  type Edge,
  type NodeChange,
  type EdgeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useEffect, useMemo } from 'react';
import { useScenarioStore } from '../store/useScenarioStore';
import TextNode from './node/TextNode';
import SlotFillingNode from './node/SlotFillingNode';
import ConditionNode from './node/ConditionNode';

const FlowEditor = ({ onClickList, onClickSave }: any) => {
  const nodes = useScenarioStore((s) => s.nodes);
  const edges = useScenarioStore((s) => s.edges);
  const setNodes = useScenarioStore((s) => s.setNodes);
  const setEdges = useScenarioStore((s) => s.setEdges);
  const updateNodePosition = useScenarioStore((s) => s.updateNodePosition);
  const updateNodeData = useScenarioStore((s) => s.updateNodeData);
  const addEdgeToScenarioData = useScenarioStore((s) => s.addEdgeToScenarioData);

  const nodeTypes = useMemo(() => ({
    textNode: TextNode,
    slotFillingNode: SlotFillingNode,
    conditionNode: ConditionNode,
  }), []);

  // 이걸로 실제 노드 리스트 추적
  // useEffect(() => {
  //   console.log('📦 FlowEditor 렌더링됨');
  //   console.log('▶ nodes.length:', nodes.length);
  //   console.log('▶ node ids:', nodes.map((n) => n.id));
  //   console.log('▶ node types:', nodes.map((n) => n.type));
  // }, [nodes]);

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((prev) => applyNodeChanges(changes, prev));
    },
    [setNodes] // nodes는 더 이상 의존성에 넣지 않음
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const updated = applyEdgeChanges(changes, edges);
      setEdges(updated);
    },
    [edges, setEdges]
  );

  const onConnect = useCallback(
    (connection: Connection | Edge) => {
      const newEdges = addEdge(connection, edges);
      const existingPairs = new Set(edges.map((e) => `${e.source}-${e.target}`));
      newEdges.forEach((edge) => {
        const key = `${edge.source}-${edge.target}`;
        if (!existingPairs.has(key)) {
          addEdgeToScenarioData(edge);
        }
      });
      setEdges(newEdges);
    },
    [edges, setEdges, addEdgeToScenarioData]
  );

  return (
    <div className="relative w-full h-full">
      {/* 우측 상단 고정 버튼 */}
      <div className="absolute top-0 right-0 z-10 px-6 py-4">
        <button
          onClick={onClickList}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 mr-2"
        >
          List
        </button>
        <button
          onClick={onClickSave}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Scenario
        </button>
      </div>
      {/* 플로우 에디터 */}
      <div className="flex-1 h-full">
        <ReactFlow
          key={nodes.map((n) => n.id).join('-')}
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          defaultViewport={{ x: 0, y: 0, zoom: 0.9 }}
          onNodeDragStop={(event, node) => {
            updateNodePosition(node.id, node.position.x, node.position.y);
          }}
          onNodeDoubleClick={(event, node) => {
            const newLabel = prompt('새 라벨 입력:', node.data?.label as string);
            if (newLabel !== null) {
              updateNodeData(node.id, { label: newLabel });
            }
          }}
          elementsSelectable
          nodesConnectable
        >
          <MiniMap />
          <Controls />
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
};

export default FlowEditor;
