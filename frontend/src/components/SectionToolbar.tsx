import { useScenarioStore } from '../store/useScenarioStore';

type Props = {
  onList: () => void;
  onSave: () => void;
  saving?: boolean;
  onToggleChat: () => void;
  isChatVisible: boolean;
};

const SectionToolbar = ({ onList, onSave, saving, onToggleChat, isChatVisible }: Props) => {
  const addNode = useScenarioStore((state) => state.addNode);

  const baseButtonStyle =
    'w-full h-10 px-4 text-left text-white rounded hover:brightness-110';
  const textStyle =
    'text-left leading-none whitespace-nowrap overflow-hidden text-ellipsis w-full';

  const getTextSizeClass = (label: string) => {
    if (label.length > 24) return 'text-[0.50rem]';
    if (label.length > 22) return 'text-[0.55rem]';
    if (label.length > 20) return 'text-[0.60rem]';
    if (label.length > 18) return 'text-[0.65rem]';
    if (label.length > 16) return 'text-[0.70rem]';
    if (label.length > 14) return 'text-[0.75rem]';
    if (label.length > 12) return 'text-[0.80rem]';
    if (label.length > 10) return 'text-[0.85rem]';
    return 'text-[1rem]';
  };

  return (
    <div className="h-full flex flex-col">
      {/* 상단: 섹션 카드 추가 버튼들 */}
      <div className="space-y-3">
        <button
          className={`${baseButtonStyle} bg-orange-400 hover:bg-orange-500`}
          onClick={() => addNode('text')}
        >
          <span className={`${textStyle} ${getTextSizeClass('+ Text')}`}>+ Text</span>
        </button>
        <button
          className={`${baseButtonStyle} bg-blue-400 hover:bg-blue-500`}
          onClick={() => addNode('slotFilling')}
        >
          <span className={`${textStyle} ${getTextSizeClass('+ Slot Filling')}`}>+ Slot Filling</span>
        </button>
        <button
          className={`${baseButtonStyle} bg-green-500 hover:bg-green-600`}
          onClick={() => addNode('condition')}
        >
          <span className={`${textStyle} ${getTextSizeClass('+ Condition')}`}>+ Condition</span>
        </button>
        <button
          className={`${baseButtonStyle} bg-purple-500 hover:bg-purple-600`}
          onClick={() => addNode('condition')}
        >
          <span className={`${textStyle} ${getTextSizeClass('+ Form')}`}>+ Form</span>
        </button>
      </div>

      {/* 하단: 목록 / 저장 */}
      <div className="mt-auto pt-4 space-y-2 border-t">
        <button
          onClick={onToggleChat}
          className="w-full h-10 rounded bg-gray-300 text-white hover:bg-gray-600"
        >
          {isChatVisible ? 'Hide Chat' : 'Show Chat'}
        </button>
        <button
          onClick={onList}
          className="w-full h-10 rounded bg-gray-600 text-white hover:bg-gray-700"
        >
          Go To List
        </button>
        <button
          onClick={onSave}
          disabled={!!saving}
          className="w-full h-10 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save Scenario'}
        </button>
      </div>
    </div>
  );
};

export default SectionToolbar;
