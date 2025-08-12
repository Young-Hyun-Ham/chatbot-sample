import { Handle, Position } from '@xyflow/react';
import { useScenarioStore } from '../../store/useScenarioStore';
import { useEffect, useState } from 'react';

const TextNode = ({ id, data }: any) => {
  const updateNodeData = useScenarioStore((s) => s.updateNodeData);
  const deleteNode = useScenarioStore((state) => state.deleteNode);

  const [_label, setLabel] = useState(data.label);
  
  useEffect(() => {
    setLabel(data.label);
  }, [data.label]);

  // 상태 관리에서 data를 가져옵니다.
  const [value, setValue] = useState(data.value || '');

  const handleValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeData(id, { value: e.target.value });
    setValue(value);
  };
  
  // data가 없으면 렌더링하지 않음
  if (!data) return null;

  return (
    <div className="bg-orange-300 text-white rounded shadow-md w-64 border-2 border-orange-500">
      {/* Header */}
      <div className="flex justify-between items-center px-3 py-2 bg-orange-500 rounded-t">
        <span className="font-bold text-sm">{data.label}</span>
        <button 
            className="text-white hover:text-red-200"
            onClick={() => deleteNode(id)}
        >🗑️</button>
      </div>

      {/* Text input */}
      <div className="bg-white text-black px-3 py-2 space-y-2">
        <label className="text-xs font-medium block">new_text</label>
        <textarea
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          rows={2}
          value={data.value || ''}
          onChange={handleValueChange}
        />

        <label className="text-xs font-medium block">Quick Replies</label>
        <button className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-gray-100">
          Add Reply
        </button>
      </div>

      {/* Edge handles */}
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default TextNode;
