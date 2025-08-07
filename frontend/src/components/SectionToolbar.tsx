import { useScenarioStore } from '../store/useScenarioStore';

const SectionToolbar = () => {
  const addNode = useScenarioStore((state) => state.addNode);

  const baseButtonStyle =
    'w-full h-10 px-4 text-left text-white rounded hover:brightness-110';

  const textStyle =
    'text-left text-[1rem] leading-none whitespace-nowrap overflow-hidden text-ellipsis w-full';

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
    <div className="flex flex-col space-y-3">
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
  );
};

export default SectionToolbar;
