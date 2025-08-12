import { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useScenarioStore } from '../../store/useScenarioStore';

const SlotFillingNode = memo(({ id, data }: any) => {
  const deleteNode = useScenarioStore((s) => s.deleteNode);
  const updateNodeData = useScenarioStore((s) => s.updateNodeData);

  const [_replies, _setReplies] = useState(data.quickReplies || []);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeData(id, { value: e.target.value });
  };

  const handleSlotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(id, { slotKey: e.target.value });
  };

  const addReply = () => {
    const newReplies = [...(data.quickReplies || []), { label: '', value: '' }];
    updateNodeData(id, { quickReplies: newReplies });
  };

  const updateReply = (index: number, field: 'label' | 'value', value: string) => {
    const updated = [...(data.quickReplies || [])];
    updated[index] = { ...updated[index], [field]: value };
    updateNodeData(id, { quickReplies: updated });
  };

  const removeReply = (index: number) => {
    const updated = [...(data.quickReplies || [])];
    updated.splice(index, 1);
    updateNodeData(id, { quickReplies: updated });
  };

  return (
    <div className="bg-white border-2 border-blue-500 rounded shadow-md p-2 w-64 relative">
      {/* 핸들 */}
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />

      {/* 헤더 */}
      <div className="flex justify-between items-center bg-blue-500 text-white text-sm font-semibold px-2 py-1 rounded-t">
        <span>slotFilling</span>
        <button onClick={() => deleteNode(id)}>🗑️</button>
      </div>

      {/* 본문 */}
      <div className="mt-2 space-y-2 text-sm">
        <div>
          <div className="font-semibold">Question</div>
          <textarea
            className="w-full border rounded px-1 py-1 text-sm"
            value={data.value || ''}
            onChange={handleQuestionChange}
            placeholder="질문을 입력하세요."
          />
        </div>

        <div>
          <div className="font-semibold">Slot:</div>
          <input
            type="text"
            className="w-full border rounded px-1 py-1 text-sm"
            value={data.slotKey || ''}
            onChange={handleSlotChange}
            placeholder="newSlot"
          />
        </div>

        <div>
          <div className="font-semibold mb-1">Quick Replies:</div>
          {Array.isArray(data.quickReplies) &&
            data.quickReplies.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center mb-1 space-x-1">
                <input
                  className="w-1/3 border rounded px-1 py-0.5 text-xs"
                  placeholder="Label"
                  value={item.label || ''}
                  onChange={(e) => updateReply(idx, 'label', e.target.value)}
                />
                <input
                  className="flex-1 border rounded px-1 py-0.5 text-xs"
                  placeholder="Value"
                  value={item.value || ''}
                  onChange={(e) => updateReply(idx, 'value', e.target.value)}
                />
                <button
                  onClick={() => removeReply(idx)}
                  className="text-red-500 text-xs"
                >
                  ✖
                </button>
              </div>
            ))}
          <button
            onClick={addReply}
            className="mt-1 w-full border rounded px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200"
          >
            Add Reply
          </button>
        </div>
      </div>
    </div>
  );
});

export default SlotFillingNode;
