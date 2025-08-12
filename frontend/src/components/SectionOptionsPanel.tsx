// components/SectionOptionsPanel.tsx

import { useMemo } from 'react';
import { useScenarioStore } from '../store/useScenarioStore';

type Props = {
  nodeId: string;
  rightOffset: number;
  width?: number;       // 기본 300
  onClose: () => void;
  isResizing?: boolean;  // 선택(있으면 transition 제어)
};

export default function SectionOptionsPanel({ nodeId, rightOffset, width, onClose, isResizing }: Props) {
  const nodes = useScenarioStore((s) => s.nodes);
  const updateNodeData = useScenarioStore((s) => s.updateNodeData);

  const node = useMemo(() => nodes.find(n => n.id === nodeId), [nodes, nodeId]);
  if (!node) return null;

  const data: any = node.data ?? {};
  const type = node.type;

  return (
    <div
      className={`absolute top-0 h-full bg-white border-r shadow-lg z-30 ${
        isResizing ? '' : 'transition-[right] duration-300'
      }`}
      style={{ right: rightOffset, width }}
      onClick={(e) => e.stopPropagation()} // 패널 내부 클릭은 닫힘 방지
    >
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
        <div className="font-semibold">Options · {type}</div>
        <button
          className="w-7 h-7 rounded-full border hover:bg-gray-100"
          onClick={onClose}
          title="닫기"
        >
          ✕
        </button>
      </div>

      {/* ===== 타입별 옵션 UI ===== */}
      <div className="p-4 space-y-4 overflow-auto h-[calc(100%-52px)]">
        {type === 'textNode' && (
          <div className="space-y-3">
            <label className="block text-sm font-medium">메시지 텍스트</label>
            <textarea
              className="w-full border rounded-md p-2 h-28"
              value={data?.value ?? ''}
              onChange={(e) => updateNodeData(node.id, { value: e.target.value })}
              placeholder="봇이 보낼 텍스트"
            />
            <div className="text-xs text-gray-500">예: “안녕하세요! 무엇을 도와드릴까요?”</div>
          </div>
        )}

        {type === 'formNode' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">폼 제목</label>
              <input
                className="w-full border rounded-md p-2"
                value={data?.title ?? ''}
                onChange={(e) => updateNodeData(node.id, { title: e.target.value })}
                placeholder="예: 배송지 입력"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">필드(샘플)</label>
              <div className="space-y-2">
                {/* 샘플: 하나의 필드만 편집 */}
                <input
                  className="w-full border rounded-md p-2"
                  value={data?.fieldLabel ?? ''}
                  onChange={(e) => updateNodeData(node.id, { fieldLabel: e.target.value })}
                  placeholder="필드 라벨 (예: 수령인)"
                />
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={!!data?.required}
                    onChange={(e) => updateNodeData(node.id, { required: e.target.checked })}
                  />
                  필수 입력
                </label>
              </div>
              <div className="text-xs text-gray-500">
                ※ 실제 프로젝트에서는 필드 배열을 구성하세요. 여기선 샘플만 제공합니다.
              </div>
            </div>
          </div>
        )}

        {/* 기본/미구현 타입 안내 */}
        {type !== 'textNode' && type !== 'formNode' && (
          <div className="text-sm text-gray-500">
            이 노드 타입에 대한 옵션 UI는 아직 준비되지 않았어요.
          </div>
        )}
      </div>
    </div>
  );
}
