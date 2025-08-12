import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
  useReactFlow,
  type Node,
  type Edge,
  type Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

let id = 0;
const getId = () => `${++id}`;

const initialNodes: Node[] = [
  {
    id: getId(),
    position: { x: 100, y: 100 },
    data: { label: '시작 노드' },
    type: 'default',
  },
];

const initialEdges: Edge[] = [];

const FlowCanvas = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { flowInstance } = useReactFlow() as any; // ✅ [x, y, zoom]
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // 🆕 드래그해서 새 노드 추가
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const bounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!bounds) return;

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;
      
      const transform = flowInstance?.transform ?? { x: 0, y: 0, zoom: 1 };
      const { x: xTransform, y: yTransform, zoom } = transform;

      const position = {
        x: (event.clientX - bounds.left - xTransform) / zoom,
        y: (event.clientY - bounds.top - yTransform) / zoom,
      };

      const newNode: Node = {
        id: getId(),
        type: 'default',
        position,
        data: { label: '🆕 새 노드' },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        setNodes((nds) => nds.filter((node) => !node.selected));
        setEdges((eds) => eds.filter((edge) => !edge.selected));
      }
    },
    [setNodes, setEdges]
  );

  const onNodeDoubleClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      const newLabel = prompt('노드 내용을 수정하세요:', String(node.data.label));
      if (newLabel && newLabel.trim() !== '') {
        setNodes((nds) =>
          nds.map((n) =>
            n.id === node.id ? { ...n, data: { ...n.data, label: newLabel } } : n
          )
        );
      }
    },
    [setNodes]
  );

  return (
    <div
      ref={reactFlowWrapper}
      style={{ width: '100%', height: '100%' }}
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      {/* 드래그용 패널 */}
      <div
        style={{
          position: 'absolute',
          zIndex: 10,
          left: 10,
          top: 80,
          background: '#fff',
          padding: '10px',
          borderRadius: 5,
          boxShadow: '0 0 5px rgba(0,0,0,0.2)',
        }}
      >
        <div
          onDragStart={(event) =>
            event.dataTransfer.setData('application/reactflow', 'default')
          }
          draggable
          style={{
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: 4,
            cursor: 'grab',
            background: '#f7f7f7',
            fontSize: 14,
          }}
        >
          ➕ 새 노드 드래그
        </div>
        <p style={{ fontSize: 12, marginTop: 10, color: '#555' }}>
          ⌨ Delete 키로 삭제<br />
          🖱 더블클릭 → 수정
        </p>
      </div>

      {/* React Flow 캔버스 */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={(params: Connection) =>
          setEdges((eds) =>
            addEdge({ ...params, markerEnd: { type: MarkerType.ArrowClosed } }, eds)
          )
        }
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeDoubleClick={onNodeDoubleClick}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

const FlowEditor = () => (
  <ReactFlowProvider>
    <FlowCanvas />
  </ReactFlowProvider>
);

export default FlowEditor;
