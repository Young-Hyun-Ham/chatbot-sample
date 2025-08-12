import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useScenarioStore } from '../../store/useScenarioStore';

const ConditionNode = memo(({ id, data }: any) => {
  const deleteNode = useScenarioStore((s) => s.deleteNode);
  const updateNodeData = useScenarioStore((s) => s.updateNodeData);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeData(id, { value: e.target.value });
  };

  return (
    <div className="bg-white border-2 border-green-500 rounded shadow-md p-2 w-64 relative">
      {/* 핸들 */}
      <Handle type="target" position={Position.Left} />

      {/* True 핸들 */}
      <Handle
        type="source"
        id="true"
        position={Position.Right}
        style={{ top: 90 }}
      />
      {/* False 핸들 */}
      <Handle
        type="source"
        id="false"
        position={Position.Right}
        style={{ top: 120 }}
      />

      {/* 헤더 */}
      <div className="flex justify-between items-center bg-green-500 text-white text-sm font-semibold px-2 py-1 rounded-t">
        <span>confirmation</span>
        <button onClick={() => deleteNode(id)}>🗑️</button>
      </div>

      {/* 본문 */}
      <div className="mt-2 text-sm space-y-2">
        <div>
          <div className="font-semibold">Confirmation Text</div>
          <textarea
            className="w-full border rounded px-1 py-1 text-sm"
            value={data.value || ''}
            onChange={handleTextChange}
            placeholder="확인 질문을 입력하세요."
          />
        </div>

        <div>
          <div className="font-semibold mb-1">Replies:</div>
          <div className="w-full border rounded px-2 py-1 bg-gray-100 text-center text-sm mb-1">
            {data.trueLabel || '확인'}
          </div>
          <div className="w-full border rounded px-2 py-1 bg-gray-100 text-center text-sm">
            {data.falseLabel || '취소'}
          </div>
        </div>
      </div>
    </div>
  );
});

export default ConditionNode;
