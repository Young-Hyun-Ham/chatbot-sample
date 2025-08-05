import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  applyNodeChanges,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useEffect } from 'react';
import { useScenarioStore } from '../store/useScenarioStore'; // 상태 저장용 zustand store
import TextNode from './node/TextNode';

const FlowEditor = () => {
  const {
    nodes,
    setNodes,
    edges,
    setEdges,
    addNode,
    updateNodePosition,
    updateNodeData,
    addEdgeToScenarioData,
  } = useScenarioStore();
  const updateNodes = useScenarioStore((state) => state.setNodes);

  const [rfNodes, setRfNodes, onNodesChange] = useNodesState(nodes);
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState(edges);

  const nodeTypes = {
    textNode: TextNode,
  };

  const handleNodesChange = useCallback(
    (changes: any) => {
      const updated = applyNodeChanges(changes, rfNodes);
      setRfNodes(updated);
      updateNodes(updated); // 상태 동기화!
    },
    [rfNodes, updateNodes]
  );

  // 노드/엣지 zustand에서 가져오도록 동기화
  useEffect(() => {
    setRfNodes(nodes);
    setRfEdges(edges);
  }, [nodes, edges]);

  const onConnect = (connection: Edge | Connection) => {
    const newEdges = addEdge(connection, rfEdges);

    // 기존 엣지 목록에서 source-target 쌍 추출
    const existingPairs = new Set(rfEdges.map(edge => `${edge.source}-${edge.target}`));

    // 새로 추가된 엣지만 필터링하여 store에 추가
    newEdges.forEach((edge) => {
      const key = `${edge.source}-${edge.target}`;
      if (!existingPairs.has(key)) {
        addEdgeToScenarioData(edge);
      }
    });

    setEdges(newEdges); // Zustand 업데이트
    setRfEdges(newEdges);
  };

  return (
    <div className="flex-1 h-full">
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultViewport={{ x: 0, y: 0, zoom: 0.9 }}
        // fitView
        onNodeDragStop={(event, node) => {
          updateNodePosition(node.id, node.position.x, node.position.y);
        }}
        onNodeDoubleClick={(event, node) => {
          const newLabel = prompt('새 라벨 입력:', node.data?.label as string);
          if (newLabel !== null) {
            updateNodeData(node.id, { label: newLabel });
          }
        }}
      >
        <MiniMap />
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
      </ReactFlow>
    </div>
  );
};

export default FlowEditor;
